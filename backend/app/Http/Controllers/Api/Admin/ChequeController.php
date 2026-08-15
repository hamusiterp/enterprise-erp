<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChequeRequest;
use App\Http\Requests\UpdateChequeRequest;
use App\Http\Resources\ChequeResource;
use App\Models\Cheque;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChequeController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'bank_id',
        'branch',
        'cheque_no',
        'signature_status',
        'status',
        'date_registered',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'bank_id' => [
                'nullable',
                'integer',
            ],

            'signature_status' => [
                'nullable',
                'in:fully,partially',
            ],

            'status' => [
                'nullable',
                'in:active,void',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
                'nullable',
                'in:asc,desc',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $sortBy = $this->resolveSortColumn(
            $validated['sort_by'] ?? null
        );

        $sortDirection =
            $validated['sort_direction']
            ?? 'desc';

        $cheques = $this
            ->buildFilteredQuery($validated)
            ->with('bank')
            ->orderBy($sortBy, $sortDirection)
            ->paginate(
                $validated['per_page'] ?? 10
            );

        $pagination = [
            'current_page' =>
                $cheques->currentPage(),

            'last_page' =>
                $cheques->lastPage(),

            'per_page' =>
                $cheques->perPage(),

            'total' =>
                $cheques->total(),

            'from' =>
                $cheques->firstItem(),

            'to' =>
                $cheques->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' =>
                'Cheques loaded successfully.',

            'data' =>
                ChequeResource::collection(
                    $cheques->items()
                ),

            'pagination' => $pagination,

            'meta' => $pagination,
        ]);
    }

    public function store(
        StoreChequeRequest $request
    ): JsonResponse {
        $cheque = DB::transaction(
            function () use ($request): Cheque {
                $data = $request->validated();

                $user = $request->user();

                $data['status'] =
                    $data['status']
                    ?? 'active';

                $data['registered_by'] =
                    $user?->name
                    ?? $user?->email
                    ?? 'System';

                $data['registered_by_user_id'] =
                    $user?->id;

                $data['date_registered'] =
                    now()->toDateString();

                return Cheque::create($data);
            }
        );

        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque created successfully.',

            'data' =>
                new ChequeResource($cheque),
        ], 201);
    }

    public function show(
        Cheque $cheque
    ): JsonResponse {
        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque loaded successfully.',

            'data' =>
                new ChequeResource($cheque),
        ]);
    }

    public function update(
        UpdateChequeRequest $request,
        Cheque $cheque
    ): JsonResponse {
        if ($cheque->is_used) {
            return response()->json([
                'success' => false,

                'message' =>
                    'This cheque has already been used and cannot be edited.',
            ], 422);
        }

        if ($cheque->status === 'void') {
            return response()->json([
                'success' => false,

                'message' =>
                    'A void cheque cannot be edited. Activate it first.',
            ], 422);
        }

        DB::transaction(
            function () use (
                $request,
                $cheque
            ): void {
                $data = $request->validated();

                unset(
                    $data['status'],
                    $data['registered_by'],
                    $data['registered_by_user_id'],
                    $data['date_registered'],
                    $data['void_by'],
                    $data['void_by_user_id'],
                    $data['void_date'],
                    $data['active_by'],
                    $data['active_by_user_id'],
                    $data['active_date'],
                    $data['is_used'],
                    $data['used_reference_type'],
                    $data['used_reference_id'],
                    $data['used_at']
                );

                $cheque->update($data);
            }
        );

        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque updated successfully.',

            'data' =>
                new ChequeResource(
                    $cheque->fresh('bank')
                ),
        ]);
    }

    public function void(
        Request $request,
        Cheque $cheque
    ): JsonResponse {
        if ($cheque->is_used) {
            return response()->json([
                'success' => false,

                'message' =>
                    'A used cheque cannot be voided.',
            ], 422);
        }

        if ($cheque->status === 'void') {
            return response()->json([
                'success' => false,

                'message' =>
                    'This cheque is already void.',
            ], 422);
        }

        DB::transaction(
            function () use (
                $request,
                $cheque
            ): void {
                $user = $request->user();

                $cheque->update([
                    'status' => 'void',

                    'void_by' =>
                        $user?->name
                        ?? $user?->email
                        ?? 'System',

                    'void_by_user_id' =>
                        $user?->id,

                    'void_date' =>
                        now()->toDateString(),

                    'active_by' => null,
                    'active_by_user_id' => null,
                    'active_date' => null,
                ]);
            }
        );

        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque voided successfully.',

            'data' =>
                new ChequeResource($cheque),
        ]);
    }

    public function activate(
        Request $request,
        Cheque $cheque
    ): JsonResponse {
        if ($cheque->is_used) {
            return response()->json([
                'success' => false,

                'message' =>
                    'A used cheque cannot be activated.',
            ], 422);
        }

        if ($cheque->status === 'active') {
            return response()->json([
                'success' => false,

                'message' =>
                    'This cheque is already active.',
            ], 422);
        }

        DB::transaction(
            function () use (
                $request,
                $cheque
            ): void {
                $user = $request->user();

                $cheque->update([
                    'status' => 'active',

                    'active_by' =>
                        $user?->name
                        ?? $user?->email
                        ?? 'System',

                    'active_by_user_id' =>
                        $user?->id,

                    'active_date' =>
                        now()->toDateString(),
                ]);
            }
        );

        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque activated successfully.',

            'data' =>
                new ChequeResource($cheque),
        ]);
    }

    public function destroy(
        Cheque $cheque
    ): JsonResponse {
        if ($cheque->is_used) {
            return response()->json([
                'success' => false,

                'message' =>
                    'A used cheque cannot be deleted.',
            ], 422);
        }

        $cheque->delete();

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque moved to the recycle bin.',
        ]);
    }

    public function deleted(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $cheques = Cheque::onlyTrashed()
            ->with('bank')
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $this->applySearch(
                        $query,
                        $search
                    );
                }
            )
            ->orderByDesc('deleted_at')
            ->paginate(
                $validated['per_page'] ?? 10
            );

        $pagination = [
            'current_page' =>
                $cheques->currentPage(),

            'last_page' =>
                $cheques->lastPage(),

            'per_page' =>
                $cheques->perPage(),

            'total' =>
                $cheques->total(),

            'from' =>
                $cheques->firstItem(),

            'to' =>
                $cheques->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' =>
                'Deleted cheques loaded successfully.',

            'data' =>
                ChequeResource::collection(
                    $cheques->items()
                ),

            'pagination' => $pagination,

            'meta' => $pagination,
        ]);
    }

    public function restore(
        int $id
    ): JsonResponse {
        $cheque = Cheque::onlyTrashed()
            ->findOrFail($id);

        $cheque->restore();

        $cheque->load('bank');

        return response()->json([
            'success' => true,

            'message' =>
                'Cheque restored successfully.',

            'data' =>
                new ChequeResource($cheque),
        ]);
    }

    public function statistics(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'data' => [
                'total' =>
                    Cheque::count(),

                'active' =>
                    Cheque::where(
                        'status',
                        'active'
                    )->count(),

                'void' =>
                    Cheque::where(
                        'status',
                        'void'
                    )->count(),

                'fully_signed' =>
                    Cheque::where(
                        'signature_status',
                        'fully'
                    )->count(),

                'partially_signed' =>
                    Cheque::where(
                        'signature_status',
                        'partially'
                    )->count(),

                'used' =>
                    Cheque::where(
                        'is_used',
                        true
                    )->count(),

                'unused' =>
                    Cheque::where(
                        'is_used',
                        false
                    )->count(),

                'deleted' =>
                    Cheque::onlyTrashed()
                        ->count(),
            ],
        ]);
    }

    public function export(
        Request $request
    ): StreamedResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'bank_id' => [
                'nullable',
                'integer',
            ],

            'signature_status' => [
                'nullable',
                'in:fully,partially',
            ],

            'status' => [
                'nullable',
                'in:active,void',
            ],
        ]);

        $fileName =
            'cheques_'
            . now()->format('Y-m-d_H-i-s')
            . '.csv';

        return response()->streamDownload(
            function () use ($validated): void {
                $handle = fopen(
                    'php://output',
                    'wb'
                );

                if ($handle === false) {
                    return;
                }

                fwrite(
                    $handle,
                    "\xEF\xBB\xBF"
                );

                fputcsv($handle, [
                    'ID',
                    'Bank',
                    'Branch',
                    'Cheque Number',
                    'Signature Status',
                    'Status',
                    'Used',
                    'Registered By',
                    'Registered Date',
                    'Void By',
                    'Void Date',
                    'Activated By',
                    'Activated Date',
                ]);

                $cheques = $this
                    ->buildFilteredQuery($validated)
                    ->with('bank')
                    ->orderBy('id')
                    ->cursor();

                foreach ($cheques as $cheque) {
                    fputcsv($handle, [
                        $cheque->id,

                        $cheque->bank?->bank_name_original
                        ?? $cheque->bank?->bank_name_orginal
                        ?? $cheque->bank?->bank_name
                        ?? $cheque->bank?->name
                        ?? '',

                        $cheque->branch,
                        $cheque->cheque_no,
                        $cheque->signature_status,
                        $cheque->status,

                        $cheque->is_used
                            ? 'Yes'
                            : 'No',

                        $cheque->registered_by,

                        $cheque->date_registered
                            ?->format('Y-m-d'),

                        $cheque->void_by,

                        $cheque->void_date
                            ?->format('Y-m-d'),

                        $cheque->active_by,

                        $cheque->active_date
                            ?->format('Y-m-d'),
                    ]);
                }

                fclose($handle);
            },
            $fileName,
            [
                'Content-Type' =>
                    'text/csv; charset=UTF-8',
            ]
        );
    }

    private function buildFilteredQuery(
        array $filters
    ): Builder {
        $search = trim(
            (string) (
                $filters['search'] ?? ''
            )
        );

        return Cheque::query()
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $this->applySearch(
                        $query,
                        $search
                    );
                }
            )
            ->when(
                $filters['bank_id'] ?? null,
                fn (
                    Builder $query,
                    int|string $bankId
                ): Builder => $query->where(
                    'bank_id',
                    $bankId
                )
            )
            ->when(
                $filters['signature_status'] ?? null,
                fn (
                    Builder $query,
                    string $signatureStatus
                ): Builder => $query->where(
                    'signature_status',
                    $signatureStatus
                )
            )
            ->when(
                $filters['status'] ?? null,
                fn (
                    Builder $query,
                    string $status
                ): Builder => $query->where(
                    'status',
                    $status
                )
            );
    }

    private function applySearch(
        Builder $query,
        string $search
    ): void {
        $query->where(
            function (
                Builder $builder
            ) use ($search): void {
                $builder
                    ->where(
                        'cheque_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'branch',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhereHas(
                        'bank',
                        function (
                            Builder $bankQuery
                        ) use ($search): void {
                            $bankQuery
                                ->where(
                                    'bank_name',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'name',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
            }
        );
    }

    private function resolveSortColumn(
        ?string $sortBy
    ): string {
        if (
            $sortBy === null
            || ! in_array(
                $sortBy,
                self::SORTABLE_COLUMNS,
                true
            )
        ) {
            return 'id';
        }

        return $sortBy;
    }
}