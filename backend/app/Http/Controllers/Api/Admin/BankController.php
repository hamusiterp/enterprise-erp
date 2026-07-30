<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BankRequest;
use App\Http\Resources\Admin\BankResource;
use App\Models\Bank;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BankController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'bank_id',
        'bank_name',
        'bank_name_orginal',
        'account_no',
        'branch',
        'begnning_amount',
        'od_amount',
        'term_loan_amount',
        'status',
        'loan_status',
        'date_registered',
        'created_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:200'],
            'status' => ['nullable', 'string', 'max:20'],
            'od_status' => ['nullable', 'string', 'max:30'],
            'loan_status' => ['nullable', 'string', 'max:20'],
            'sort_by' => ['nullable', 'string'],
            'sort_direction' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';

        if (! in_array($sortBy, self::SORTABLE_COLUMNS, true)) {
            $sortBy = 'id';
        }

        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $banks = Bank::query()
            ->search($validated['search'] ?? null)
            ->when(
                $validated['status'] ?? null,
                fn ($query, $status) => $query->where('status', $status)
            )
            ->when(
                $validated['od_status'] ?? null,
                fn ($query, $status) => $query->where('od_status', $status)
            )
            ->when(
                $validated['loan_status'] ?? null,
                fn ($query, $status) => $query->where('loan_status', $status)
            )
            ->orderBy($sortBy, $sortDirection)
            ->paginate($validated['per_page'] ?? 10);

        return $this->paginatedResponse(
            $banks,
            'Banks loaded successfully.'
        );
    }

    public function store(BankRequest $request): JsonResponse
    {
        $bank = DB::transaction(function () use ($request) {
            /*
             * PostgreSQL transaction-level advisory lock.
             * This prevents duplicate IDs during simultaneous requests,
             * including when the table is still empty.
             */
            DB::statement(
                'SELECT pg_advisory_xact_lock(1001001)'
            );

            $lastNumber = Bank::withTrashed()
                ->where('bank_id', 'like', 'BNK%')
                ->selectRaw(
                    "MAX(CAST(SUBSTRING(bank_id FROM 4) AS INTEGER)) AS max_number"
                )
                ->value('max_number');

            $nextNumber = max((int) $lastNumber + 1, 1001);

            $data = $this->normalizeBankData(
                $request->validated()
            );

            $data['bank_id'] =
                'BNK' . $nextNumber;

            return Bank::create($data);
        });

        return response()->json([
            'success' => true,
            'message' => 'Bank created successfully.',
            'data' => new BankResource($bank),
        ], 201);
    }

    public function show(Bank $bank): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Bank loaded successfully.',
            'data' => new BankResource($bank),
        ]);
    }

    public function update(
        BankRequest $request,
        Bank $bank
    ): JsonResponse {
        $data = $this->normalizeBankData(
            $request->validated()
        );

        // Bank ID is generated once during creation and must not change.
        unset($data['bank_id']);

        $bank->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Bank updated successfully.',
            'data' => new BankResource($bank->fresh()),
        ]);
    }

    public function destroy(Bank $bank): JsonResponse
    {
        $bank->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bank deleted successfully.',
        ]);
    }

    public function deleted(Request $request): JsonResponse
    {
        $banks = Bank::onlyTrashed()
            ->orderByDesc('deleted_at')
            ->paginate(
                $request->integer('per_page', 10)
            );

        return $this->paginatedResponse(
            $banks,
            'Deleted banks loaded successfully.'
        );
    }

    public function restore(int $id): JsonResponse
    {
        $bank = Bank::onlyTrashed()->findOrFail($id);
        $bank->restore();

        return response()->json([
            'success' => true,
            'message' => 'Bank restored successfully.',
            'data' => new BankResource($bank),
        ]);
    }

    public function forceDelete(int $id): JsonResponse
    {
        $bank = Bank::onlyTrashed()->findOrFail($id);
        $bank->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Bank permanently deleted.',
        ]);
    }

    public function changeStatus(
        Request $request,
        Bank $bank
    ): JsonResponse {
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $bank->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank status updated successfully.',
            'data' => new BankResource($bank->fresh()),
        ]);
    }


    private function normalizeBankData(
        array $data
    ): array {
        /*
         * Laravel converts empty strings to null. Several legacy
         * sales_bank columns are NOT NULL, so use empty strings
         * for fields that are not applicable.
         */

        if (($data['od_available'] ?? 'No') !== 'Yes') {
            $data['od_amount'] = null;
            $data['od_amount_left'] = null;
            $data['od_limit'] = '';
            $data['od_status'] = null;
            $data['start_date'] = null;
            $data['end_date'] = null;
        }

        if (($data['term_loan'] ?? 'No') !== 'Yes') {
            $data['term_loan_amount'] = null;
            $data['loan_status'] = '';
            $data['term_loan_start_date'] = null;
            $data['term_loan_end_date'] = null;
            $data['repayment_amount'] = null;
            $data['repayment_amount_left'] = '';
            $data['period'] = null;
        }

        if (
            ($data['term_loan_relief'] ?? 'No')
            !== 'Yes'
        ) {
            $data['term_loan_relief_start_date'] = '';
            $data['term_loan_relief_end_date'] = '';
        }

        foreach ([
            'cob_balance',
            'last_activity',
            'suggestion',
            'end_balance',
            'credit_suggestion',
            'category',
            'start_month',
        ] as $field) {
            $data[$field] = $data[$field] ?? '';
        }

        return $data;
    }

    private function paginatedResponse(
        $paginator,
        string $message
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => BankResource::collection(
                $paginator->items()
            ),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }
}