<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use App\Services\DesignationService;
use App\Http\Requests\Admin\StoreDesignationRequest;
use App\Http\Requests\Admin\UpdateDesignationRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Services\AuditLogService;

class DesignationController extends Controller
{
    public function __construct(
        private readonly DesignationService $designationService
    ) {
    }

    public function index(
        Request $request
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('departments.view'),
            403,
            'You are not authorized to view departments.'
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'sort_by' => [
                'nullable',
                Rule::in([
                    'department_id',
                    'department_name',
                    'status',
                    'created_at',
                    'updated_at',
                ]),
            ],

            'sort_order' => [
                'nullable',
                Rule::in([
                    'asc',
                    'desc',
                ]),
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:100',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $status =
            $validated['status'] ?? null;

        $sortBy =
            $validated['sort_by'] ?? 'created_at';

        $sortOrder =
            $validated['sort_order'] ?? 'desc';

        $perPage = (int) (
            $validated['per_page'] ?? 10
        );

        $query = Department::query()
            ->with([
                'registeredBy:id,name,email',
            ]);

        $this->applyFilters(
            $query,
            $search,
            $status
        );

        $departments = $query
            ->orderBy(
                $sortBy,
                $sortOrder
            )
            ->paginate($perPage);

        return response()->json([
            'data' => DepartmentResource::collection(
                $departments->items()
            )->resolve(),

            'meta' => [
                'current_page' =>
                    $departments->currentPage(),

                'from' =>
                    $departments->firstItem(),

                'last_page' =>
                    $departments->lastPage(),

                'per_page' =>
                    $departments->perPage(),

                'to' =>
                    $departments->lastItem(),

                'total' =>
                    $departments->total(),
            ],
        ]);
    }

    public function store(
        StoreDepartmentRequest $request
    ): JsonResponse {
        $department =
            $this->departmentService->create(
                $request->validated(),
                (int) $request->user()->id
            );

        $department->load([
            'registeredBy:id,name,email',
        ]);

        return response()->json([
            'message' =>
                'Designation created successfully.',

            'data' =>
                new DepartmentResource(
                    $department
                ),
        ], 201);
    }

    public function show(
        Request $request,
        Designation $designation
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('departments.view'),
            403,
            'You are not authorized to view this department.'
        );

        $department->load([
            'registeredBy:id,name,email',
        ]);

        return response()->json([
            'data' =>
                new DepartmentResource(
                    $department
                ),
        ]);
    }

    public function update(
        UpdateDepartmentRequest $request,
        Designation $designation
    ): JsonResponse {
        $department =
            $this->departmentService->update(
                $department,
                $request->validated()
            );

        $department->load([
            'registeredBy:id,name,email',
        ]);

        return response()->json([
            'message' =>
                'Department updated successfully.',

            'data' =>
                new DepartmentResource(
                    $department
                ),
        ]);
    }

    public function destroy(
        Request $request,
        Designation $designation
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('departments.delete'),
            403,
            'You are not authorized to delete departments.'
        );

        $old = $department->toArray();

        $department->delete();

        AuditLogService::log(
            auth()->id(),
            'Departments',
            'Delete',
            $department->id,
            $department->department_name,
            $old,
            null
        );

        return response()->json([
            'message' =>
                'Department deleted successfully.',
        ]);
    }

    public function changeStatus(
        Request $request,
        Designation $designation
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('departments.update'),
            403,
            'You are not authorized to update departments.'
        );

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        $department =
            $this->departmentService->changeStatus(
                $department,
                $validated['status']
            );

        $department->load([
            'registeredBy:id,name,email',
        ]);

        return response()->json([
            'message' =>
                'Department status updated successfully.',

            'data' =>
                new DepartmentResource(
                    $department
                ),
        ]);
    }

    public function options(
        Request $request
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('departments.view'),
            403,
            'You are not authorized to view departments.'
        );

        $departments = Department::query()
            ->where('status', 'active')
            ->orderBy('department_name')
            ->get([
                'id',
                'department_id',
                'department_name',
            ]);

        return response()->json([
            'data' => $departments,
        ]);
    }

    public function export(
        Request $request
    ): StreamedResponse {
        abort_unless(
            $request->user()?->can('departments.export'),
            403,
            'You are not authorized to export departments.'
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $status =
            $validated['status'] ?? null;

        $query = Department::query()
            ->with([
                'registeredBy:id,name,email',
            ]);

        $this->applyFilters(
            $query,
            $search,
            $status
        );

        $departments = $query
            ->orderBy('department_name')
            ->get();

        $spreadsheet = new Spreadsheet();

        $sheet =
            $spreadsheet->getActiveSheet();

        $sheet->setTitle('Departments');

        $sheet->fromArray([
            [
                'Database ID',
                'Department ID',
                'Department Name',
                'Description',
                'Status',
                'Registered By',
                'Date Registered',
                'Last Updated',
            ],
        ], null, 'A1');

        $rowNumber = 2;

        foreach ($departments as $department) {
            $sheet->fromArray([
                [
                    $department->id,

                    $department->department_id,

                    $department->department_name,

                    $department->description,

                    ucfirst(
                        $department->status
                    ),

                    $department->registeredBy?->name,

                    $department->created_at?->format(
                        'Y-m-d H:i:s'
                    ),

                    $department->updated_at?->format(
                        'Y-m-d H:i:s'
                    ),
                ],
            ], null, "A{$rowNumber}");

            $rowNumber++;
        }

        $sheet
            ->getStyle('A1:H1')
            ->getFont()
            ->setBold(true);

        $sheet
            ->getStyle('A1:H1')
            ->getAlignment()
            ->setHorizontal('center');

        $sheet->freezePane('A2');

        $lastRow = max(
            1,
            $rowNumber - 1
        );

        $sheet->setAutoFilter(
            "A1:H{$lastRow}"
        );

        foreach (range('A', 'H') as $column) {
            $sheet
                ->getColumnDimension($column)
                ->setAutoSize(true);
        }

        $sheet
            ->getStyle("D2:D{$lastRow}")
            ->getAlignment()
            ->setWrapText(true);

        $fileName =
            'departments-' .
            now()->format('Y-m-d-His') .
            '.xlsx';

        return response()->streamDownload(
            function () use (
                $spreadsheet
            ): void {
                $writer =
                    new Xlsx($spreadsheet);

                $writer->save(
                    'php://output'
                );

                $spreadsheet
                    ->disconnectWorksheets();
            },
            $fileName,
            [
                'Content-Type' =>
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Cache-Control' =>
                    'max-age=0, no-cache, no-store, must-revalidate',
            ]
        );
    }

    private function applyFilters(
        Builder $query,
        string $search,
        ?string $status
    ): void {
        if ($search !== '') {
            $operator =
                DB::connection()
                    ->getDriverName() === 'pgsql'
                    ? 'ilike'
                    : 'like';

            $query->where(
                function (
                    Builder $searchQuery
                ) use (
                    $search,
                    $operator
                ): void {
                    $searchQuery
                        ->where(
                            'department_id',
                            $operator,
                            '%' . $search . '%'
                        )
                        ->orWhere(
                            'department_name',
                            $operator,
                            '%' . $search . '%'
                        )
                        ->orWhere(
                            'description',
                            $operator,
                            '%' . $search . '%'
                        );
                }
            );
        }

        if ($status) {
            $query->where(
                'status',
                $status
            );
        }
    }


    public function deleted(Request $request): JsonResponse
{
    abort_unless(
        $request->user()?->can('departments.view'),
        403
    );

    $query = Department::onlyTrashed()
        ->with('registeredBy:id,name');

    if ($request->filled('search')) {
        $search = $request->string('search')->toString();

        $query->where(function ($q) use ($search) {
            $q->where('department_id', 'ilike', "%{$search}%")
                ->orWhere('department_name', 'ilike', "%{$search}%")
                ->orWhere('description', 'ilike', "%{$search}%");
        });
    }

    $perPage = (int) $request->input('per_page', 10);

    $departments = $query
        ->orderByDesc('deleted_at')
        ->paginate($perPage);

    return response()->json([
        'data' => DepartmentResource::collection($departments->items()),
        'meta' => [
            'current_page' => $departments->currentPage(),
            'last_page' => $departments->lastPage(),
            'per_page' => $departments->perPage(),
            'total' => $departments->total(),
        ],
    ]);
}

public function restore(Request $request, int $id): JsonResponse
{
    abort_unless(
        $request->user()?->can('departments.update'),
        403
    );

    $department = Department::onlyTrashed()->findOrFail($id);

    $department->restore();

    AuditLogService::log(
        auth()->id(),
        'Departments',
        'Restore',
        $department->id,
        $department->department_name,
        null,
        $department->fresh()->toArray()
    );

    return response()->json([
        'message' => 'Department restored successfully.',
    ]);
}

public function forceDelete(Request $request, int $id): JsonResponse
{
    abort_unless(
        $request->user()?->can('departments.delete'),
        403
    );

    $department = Department::onlyTrashed()->findOrFail($id);

    $old = $department->toArray();

    $department->forceDelete();

    AuditLogService::log(
        auth()->id(),
        'Departments',
        'Force Delete',
        $id,
        $old['department_name'] ?? null,
        $old,
        null
    );

    return response()->json([
        'message' => 'Department permanently deleted.',
    ]);
}

public function statistics(Request $request): JsonResponse
{
    abort_unless(
        $request->user()?->can('departments.view'),
        403
    );

    $total = Department::count();

    $active = Department::where('status', 'active')->count();

    $inactive = Department::where('status', 'inactive')->count();

    $deleted = Department::onlyTrashed()->count();

    return response()->json([
        'data' => [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'deleted' => $deleted,
        ],
    ]);
}


    
}