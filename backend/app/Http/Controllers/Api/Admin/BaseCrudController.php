<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\CodeGenerator;
use App\Traits\ApiResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

abstract class BaseCrudController extends Controller
{
    use ApiResponse;

    /**
     * Model class used by the module.
     *
     * Example:
     * protected string $modelClass = Bank::class;
     */
    protected string $modelClass;

    /**
     * API resource class used by the module.
     *
     * Example:
     * protected string $resourceClass = BankResource::class;
     */
    protected string $resourceClass;

    /**
     * Business-code prefix.
     *
     * Examples:
     * BNK, DEP, DES, CUS
     */
    protected string $codePrefix = '';

    /**
     * Database column containing the business code.
     */
    protected string $codeColumn = 'code';

    /**
     * Default sorting column.
     */
    protected string $defaultSortColumn = 'created_at';

    /**
     * Default sorting direction.
     */
    protected string $defaultSortDirection = 'desc';

    /**
     * Columns the API is allowed to sort.
     */
    protected array $sortableColumns = [
        'id',
        'code',
        'name',
        'status',
        'created_at',
        'updated_at',
    ];

    public function __construct(
        protected CodeGenerator $codeGenerator
    ) {
    }

    /**
     * Return a paginated list of active records.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = $this->newQuery();

            $this->applyQueryFilters(
                query: $query,
                request: $request
            );

            $paginator = $query->paginate(
                $this->getPerPage($request)
            )->withQueryString();

            return $this->paginatedResponse(
                paginator: $paginator,
                message: $this->getEntityName() . ' records retrieved successfully.'
            );
        } catch (Throwable $exception) {
            report($exception);

            return $this->errorResponse(
                message: 'Unable to retrieve records.',
                statusCode: 500
            );
        }
    }

    /**
     * Soft-delete a record.
     */
    public function destroy(int|string $id): JsonResponse
    {
        try {
            $record = $this->findRecordOrFail($id);

            DB::transaction(function () use ($record): void {
                $record->delete();
            });

            return $this->deletedResponse(
                $this->getEntityName() . ' moved to the recycle bin successfully.'
            );
        } catch (Throwable $exception) {
            return $this->handleException(
                exception: $exception,
                defaultMessage: 'Unable to delete the record.'
            );
        }
    }

    /**
     * Return soft-deleted records.
     */
    public function trash(Request $request): JsonResponse
    {
        try {
            $query = $this->newQuery()
                ->onlyTrashed();

            $this->applyQueryFilters(
                query: $query,
                request: $request
            );

            $paginator = $query->paginate(
                $this->getPerPage($request)
            )->withQueryString();

            return $this->paginatedResponse(
                paginator: $paginator,
                message: 'Deleted ' . strtolower($this->getEntityName())
                    . ' records retrieved successfully.'
            );
        } catch (Throwable $exception) {
            report($exception);

            return $this->errorResponse(
                message: 'Unable to retrieve deleted records.',
                statusCode: 500
            );
        }
    }

    /**
     * Restore a soft-deleted record.
     */
    public function restore(int|string $id): JsonResponse
    {
        try {
            $record = $this->newQuery()
                ->onlyTrashed()
                ->findOrFail($id);

            DB::transaction(function () use ($record): void {
                $record->restore();
            });

            return $this->updatedResponse(
                data: $this->makeResource($record->refresh()),
                message: $this->getEntityName() . ' restored successfully.'
            );
        } catch (Throwable $exception) {
            return $this->handleException(
                exception: $exception,
                defaultMessage: 'Unable to restore the record.'
            );
        }
    }

    /**
     * Permanently delete a soft-deleted record.
     */
    public function forceDelete(int|string $id): JsonResponse
    {
        try {
            $record = $this->newQuery()
                ->onlyTrashed()
                ->findOrFail($id);

            DB::transaction(function () use ($record): void {
                $record->forceDelete();
            });

            return $this->deletedResponse(
                $this->getEntityName() . ' permanently deleted successfully.'
            );
        } catch (Throwable $exception) {
            return $this->handleException(
                exception: $exception,
                defaultMessage: 'Unable to permanently delete the record.'
            );
        }
    }

    /**
     * Change a record's active/inactive status.
     */
    public function changeStatus(
        Request $request,
        int|string $id
    ): JsonResponse {
        try {
            $validated = $request->validate([
                'status' => [
                    'required',
                    'string',
                    'in:active,inactive',
                ],
            ]);

            $record = $this->findRecordOrFail($id);

            DB::transaction(function () use (
                $record,
                $validated
            ): void {
                $record->update([
                    'status' => $validated['status'],
                ]);
            });

            return $this->updatedResponse(
                data: $this->makeResource($record->refresh()),
                message: $this->getEntityName()
                    . ' status changed successfully.'
            );
        } catch (Throwable $exception) {
            return $this->handleException(
                exception: $exception,
                defaultMessage: 'Unable to change the record status.'
            );
        }
    }

    /**
     * Create and assign the final business code.
     *
     * Must be called inside a database transaction.
     */
    protected function createRecordWithCode(
        array $data
    ): Model {
        if (
            $this->codePrefix !== '' &&
            empty($data[$this->codeColumn])
        ) {
            $data[$this->codeColumn] =
                $this->codeGenerator->temporary(
                    $this->codePrefix
                );
        }

        $modelClass = $this->modelClass;

        /** @var Model $record */
        $record = $modelClass::query()->create($data);

        if ($this->codePrefix !== '') {
            $record = $this->codeGenerator->assign(
                model: $record,
                prefix: $this->codePrefix,
                column: $this->codeColumn
            );
        }

        return $record;
    }

    /**
     * Execute database work inside a transaction.
     */
    protected function transaction(
        callable $callback
    ): mixed {
        return DB::transaction($callback);
    }

    /**
     * Create a new model query.
     */
    protected function newQuery(): Builder
    {
        $modelClass = $this->modelClass;

        return $modelClass::query();
    }

    /**
     * Find an active record or fail.
     */
    protected function findRecordOrFail(
        int|string $id
    ): Model {
        return $this->newQuery()->findOrFail($id);
    }

    /**
     * Apply reusable search, status and sorting.
     */
    protected function applyQueryFilters(
        Builder $query,
        Request $request
    ): void {
        $search = $request->string('search')
            ->trim()
            ->toString();

        if (
            $search !== '' &&
            method_exists($query->getModel(), 'scopeSearch')
        ) {
            $query->search($search);
        }

        $status = $request->string('status')
            ->trim()
            ->toString();

        if ($status !== '') {
            $query->where('status', $status);
        }

        $sortColumn = $request->string('sort_by')
            ->trim()
            ->toString();

        if (
            $sortColumn === '' ||
            !in_array(
                $sortColumn,
                $this->sortableColumns,
                true
            )
        ) {
            $sortColumn = $this->defaultSortColumn;
        }

        $sortDirection = strtolower(
            $request->string('sort_direction')
                ->trim()
                ->toString()
        );

        if (!in_array(
            $sortDirection,
            ['asc', 'desc'],
            true
        )) {
            $sortDirection =
                $this->defaultSortDirection;
        }

        $query->orderBy(
            $sortColumn,
            $sortDirection
        );
    }

    /**
     * Validate and return pagination size.
     */
    protected function getPerPage(
        Request $request
    ): int {
        $perPage = (int) $request->input(
            'per_page',
            10
        );

        return min(
            max($perPage, 1),
            100
        );
    }

    /**
     * Build a resource instance.
     */
    protected function makeResource(
        Model $record
    ): JsonResource {
        $resourceClass = $this->resourceClass;

        return new $resourceClass($record);
    }

    /**
     * Build the standard paginated response.
     */
    protected function paginatedResponse(
        mixed $paginator,
        string $message
    ): JsonResponse {
        $resourceClass = $this->resourceClass;

        return response()->json([
            'success' => true,
            'message' => $message,

            'data' => $resourceClass::collection(
                $paginator->items()
            )->resolve(),

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

    /**
     * Return a readable module name.
     *
     * Bank becomes "Bank".
     */
    protected function getEntityName(): string
    {
        return class_basename(
            $this->modelClass
        );
    }

    /**
     * Convert common exceptions into API responses.
     */
    protected function handleException(
        Throwable $exception,
        string $defaultMessage
    ): JsonResponse {
        if (
            $exception instanceof
            \Illuminate\Database\Eloquent\ModelNotFoundException
        ) {
            return $this->notFoundResponse();
        }

        if ($exception instanceof ValidationException) {
            return $this->errorResponse(
                message: 'Validation failed.',
                statusCode: 422,
                errors: $exception->errors()
            );
        }

        report($exception);

        return $this->errorResponse(
            message: $defaultMessage,
            statusCode: 500
        );
    }
}