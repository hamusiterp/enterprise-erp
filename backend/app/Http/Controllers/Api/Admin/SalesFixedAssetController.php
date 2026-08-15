<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalesFixedAssetRequest;
use App\Http\Resources\SalesFixedAssetResource;
use App\Models\SalesFixedAsset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesFixedAssetController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'asset_no',
        'vehicle_no',
        'tag_no',
        'plate_no',
        'category_id',
        'name_of_machinery',
        'make_of_vehicle',
        'model',
        'make_of_year',
        'chassis_no',
        'engine_no',
        'engine_model',
        'make_of_engine',
        'horse_power',
        'type_of_fuel',
        'reading_type',
        'reading',
        'consumption',
        'standard_consumption',
        'tanker_capacity',
        'last_refill',
        'has_gauge',
        'gauge_reading',
        'service_interval',
        'last_service',
        'purchase_date',
        'licence_renewal_date',
        'last_inspection_renewal_date',
        'last_insurance_renewal_date',
        'asset_condition',
        'current_location',
        'assigned_to',
        'status',
        'registered_by',
        'registered_date',
        'edited_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    private const PHOTO_FIELDS = [
        'front_view_photo',
        'rear_view_photo',
        'right_side_view_photo',
        'left_side_view_photo',
    ];

    private const DOCUMENT_FIELDS = [
        'libre_document',
        'inspection_document',
        'insurance_document',
    ];

    /**
     * Display a paginated list of fixed assets.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'category_id' => [
                'nullable',
                'integer',
                'exists:sales_category,id',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],

            'asset_condition' => [
                'nullable',
                'in:excellent,good,fair,poor,out_of_service',
            ],

            'reading_type' => [
                'nullable',
                'in:engine_horse_power,km_reading',
            ],

            'type_of_fuel' => [
                'nullable',
                'string',
                'max:50',
            ],

            'has_gauge' => [
                'nullable',
                'boolean',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
                'nullable',
                'in:asc,desc',
            ],

            'sort_order' => [
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
            ?? $validated['sort_order']
            ?? 'desc';

        $assets = $this
            ->buildFilteredQuery($validated)
            ->with('category')
            ->orderBy($sortBy, $sortDirection)
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $assets,
            'Fixed assets loaded successfully.'
        );
    }

    /**
     * Store a newly created fixed asset.
     */
    public function store(
        SalesFixedAssetRequest $request
    ): JsonResponse {
        $asset = DB::transaction(
            function () use ($request): SalesFixedAsset {
                /*
                 * Prevent two users from receiving the same
                 * asset number during simultaneous registration.
                 */
                DB::statement(
                    'SELECT pg_advisory_xact_lock(1006001)'
                );

                $data = $request->validated();

                unset($data['asset_no']);

                $data['asset_no'] =
                    $this->generateNextAssetNumber();

                $data = $this->prepareAssetData(
                    data: $data,
                    request: $request,
                    creating: true
                );

                $data = $this->storeUploadedFiles(
                    data: $data,
                    request: $request
                );

                return SalesFixedAsset::create($data);
            }
        );

        $asset->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset created successfully.',

            'data' =>
                new SalesFixedAssetResource($asset),
        ], 201);
    }

    /**
     * Display one fixed asset.
     */
    public function show(
        SalesFixedAsset $salesFixedAsset
    ): JsonResponse {
        $salesFixedAsset->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset loaded successfully.',

            'data' =>
                new SalesFixedAssetResource(
                    $salesFixedAsset
                ),
        ]);
    }

    /**
     * Update an existing fixed asset.
     */
    public function update(
        SalesFixedAssetRequest $request,
        SalesFixedAsset $salesFixedAsset
    ): JsonResponse {
        DB::transaction(
            function () use (
                $request,
                $salesFixedAsset
            ): void {
                $data = $request->validated();

                unset(
                    $data['asset_no'],
                    $data['registered_by'],
                    $data['registered_by_user_id'],
                    $data['registered_date']
                );

                $data = $this->prepareAssetData(
                    data: $data,
                    request: $request,
                    creating: false
                );

                $data = $this->replaceUploadedFiles(
                    asset: $salesFixedAsset,
                    data: $data,
                    request: $request
                );

                $salesFixedAsset->update($data);
            }
        );

        $salesFixedAsset->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset updated successfully.',

            'data' =>
                new SalesFixedAssetResource(
                    $salesFixedAsset->fresh('category')
                ),
        ]);
    }

    /**
     * Soft-delete a fixed asset.
     */
    public function destroy(
        SalesFixedAsset $salesFixedAsset
    ): JsonResponse {
        $salesFixedAsset->delete();

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset moved to the recycle bin.',
        ]);
    }

    /**
     * Change active/inactive status.
     */
    public function changeStatus(
        Request $request,
        SalesFixedAsset $salesFixedAsset
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $user = $request->user();

        $salesFixedAsset->update([
            'status' =>
                $validated['status'],

            'edited_by_user_id' =>
                $user?->id,

            'edited_by' =>
                $user?->name
                ?? $user?->email
                ?? 'System',
        ]);

        $salesFixedAsset->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset status updated successfully.',

            'data' =>
                new SalesFixedAssetResource(
                    $salesFixedAsset
                ),
        ]);
    }

    /**
     * Return the next expected asset number.
     *
     * This is only for displaying the number in the form.
     * The number is generated again during store().
     */
    public function nextAssetNumber(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'message' =>
                'Next fixed asset number loaded successfully.',

            'data' => [
                'asset_no' =>
                    $this->generateNextAssetNumber(),
            ],
        ]);
    }

    /**
     * Fixed asset summary statistics.
     */
    public function statistics(): JsonResponse
    {
        $statistics = SalesFixedAsset::query()
            ->selectRaw('COUNT(*) AS total')
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE status = 'active'
                ) AS active"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE status = 'inactive'
                ) AS inactive"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE asset_condition = 'excellent'
                ) AS excellent"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE asset_condition = 'good'
                ) AS good"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE asset_condition = 'fair'
                ) AS fair"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE asset_condition = 'poor'
                ) AS poor"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE asset_condition = 'out_of_service'
                ) AS out_of_service"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE has_gauge = true
                ) AS with_gauge"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE has_gauge = false
                ) AS without_gauge"
            )
            ->first();

        return response()->json([
            'success' => true,

            'data' => [
                'total' => (int) (
                    $statistics?->total ?? 0
                ),

                'active' => (int) (
                    $statistics?->active ?? 0
                ),

                'inactive' => (int) (
                    $statistics?->inactive ?? 0
                ),

                'excellent' => (int) (
                    $statistics?->excellent ?? 0
                ),

                'good' => (int) (
                    $statistics?->good ?? 0
                ),

                'fair' => (int) (
                    $statistics?->fair ?? 0
                ),

                'poor' => (int) (
                    $statistics?->poor ?? 0
                ),

                'out_of_service' => (int) (
                    $statistics?->out_of_service ?? 0
                ),

                'with_gauge' => (int) (
                    $statistics?->with_gauge ?? 0
                ),

                'without_gauge' => (int) (
                    $statistics?->without_gauge ?? 0
                ),

                'deleted' =>
                    SalesFixedAsset::onlyTrashed()
                        ->count(),
            ],
        ]);
    }

    /**
     * Display fixed assets in the recycle bin.
     */
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

        $assets = SalesFixedAsset::onlyTrashed()
            ->with('category')
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

        return $this->paginatedResponse(
            $assets,
            'Deleted fixed assets loaded successfully.'
        );
    }

    /**
     * Restore a deleted fixed asset.
     */
    public function restore(int $id): JsonResponse
    {
        $asset = SalesFixedAsset::onlyTrashed()
            ->findOrFail($id);

        $asset->restore();

        $asset->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset restored successfully.',

            'data' =>
                new SalesFixedAssetResource($asset),
        ]);
    }

    /**
     * Permanently delete a fixed asset and its files.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $asset = SalesFixedAsset::onlyTrashed()
            ->findOrFail($id);

        DB::transaction(
            function () use ($asset): void {
                $this->deleteAllAssetFiles($asset);

                $asset->forceDelete();
            }
        );

        return response()->json([
            'success' => true,

            'message' =>
                'Fixed asset permanently deleted.',
        ]);
    }

    /**
     * Export fixed assets as an Excel-compatible CSV file.
     */
    public function export(
        Request $request
    ): StreamedResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'category_id' => [
                'nullable',
                'integer',
                'exists:sales_category,id',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],

            'asset_condition' => [
                'nullable',
                'in:excellent,good,fair,poor,out_of_service',
            ],

            'reading_type' => [
                'nullable',
                'in:engine_horse_power,km_reading',
            ],

            'type_of_fuel' => [
                'nullable',
                'string',
                'max:50',
            ],

            'has_gauge' => [
                'nullable',
                'boolean',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
                'nullable',
                'in:asc,desc',
            ],
        ]);

        $sortBy = $this->resolveSortColumn(
            $validated['sort_by'] ?? null
        );

        $sortDirection =
            $validated['sort_direction'] ?? 'asc';

        $fileName =
            'fixed_assets_'
            . now()->format('Y-m-d_H-i-s')
            . '.csv';

        return response()->streamDownload(
            function () use (
                $validated,
                $sortBy,
                $sortDirection
            ): void {
                $handle = fopen(
                    'php://output',
                    'wb'
                );

                if ($handle === false) {
                    return;
                }

                /*
                 * UTF-8 BOM improves Excel compatibility.
                 */
                fwrite(
                    $handle,
                    "\xEF\xBB\xBF"
                );

                fputcsv($handle, [
                    'ID',
                    'Asset Number',
                    'Vehicle Number',
                    'Tag Number',
                    'Plate Number',
                    'Category',
                    'Machinery Name',
                    'Vehicle Make',
                    'Model',
                    'Make Year',
                    'Chassis Number',
                    'Engine Number',
                    'Engine Model',
                    'Engine Make',
                    'Horse Power',
                    'Fuel Type',
                    'Reading Type',
                    'Reading',
                    'Consumption',
                    'Standard Consumption',
                    'Tanker Capacity',
                    'Last Refill',
                    'Has Gauge',
                    'Gauge Reading',
                    'Service Interval',
                    'Last Service',
                    'Purchase Date',
                    'Licence Renewal Date',
                    'Last Inspection Renewal Date',
                    'Last Insurance Renewal Date',
                    'Asset Condition',
                    'Current Location',
                    'Assigned To',
                    'Status',
                    'Registered By',
                    'Registered Date',
                    'Edited By',
                    'Created At',
                    'Updated At',
                ]);

                $assets = $this
                    ->buildFilteredQuery($validated)
                    ->with('category')
                    ->orderBy(
                        $sortBy,
                        $sortDirection
                    )
                    ->cursor();

                foreach ($assets as $asset) {
                    fputcsv($handle, [
                        $asset->id,
                        $asset->asset_no,
                        $asset->vehicle_no,
                        $asset->tag_no,
                        $asset->plate_no,
                        $asset->category?->category,
                        $asset->name_of_machinery,
                        $asset->make_of_vehicle,
                        $asset->model,
                        $asset->make_of_year,
                        $asset->chassis_no,
                        $asset->engine_no,
                        $asset->engine_model,
                        $asset->make_of_engine,
                        $asset->horse_power,
                        $asset->type_of_fuel,
                        $asset->reading_type,
                        $asset->reading,
                        $asset->consumption,
                        $asset->standard_consumption,
                        $asset->tanker_capacity,

                        $asset->last_refill
                            ?->format('Y-m-d'),

                        $asset->has_gauge
                            ? 'Yes'
                            : 'No',

                        $asset->gauge_reading,
                        $asset->service_interval,

                        $asset->last_service
                            ?->format('Y-m-d'),

                        $asset->purchase_date
                            ?->format('Y-m-d'),

                        $asset->licence_renewal_date
                            ?->format('Y-m-d'),

                        $asset
                            ->last_inspection_renewal_date
                            ?->format('Y-m-d'),

                        $asset
                            ->last_insurance_renewal_date
                            ?->format('Y-m-d'),

                        $asset->asset_condition,
                        $asset->current_location,
                        $asset->assigned_to,
                        $asset->status,
                        $asset->registered_by,

                        $asset->registered_date
                            ?->format('Y-m-d'),

                        $asset->edited_by,

                        $asset->created_at
                            ?->format('Y-m-d H:i:s'),

                        $asset->updated_at
                            ?->format('Y-m-d H:i:s'),
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

    /**
     * Normalize conditional and audit fields.
     */
    private function prepareAssetData(
        array $data,
        Request $request,
        bool $creating
    ): array {
        $data['has_gauge'] = filter_var(
            $data['has_gauge'] ?? false,
            FILTER_VALIDATE_BOOLEAN
        );

        if (! $data['has_gauge']) {
            $data['gauge_reading'] = null;
        }

        $user = $request->user();

        if ($creating) {
            $data['registered_by_user_id'] =
                $user?->id;

            $data['registered_by'] =
                $user?->name
                ?? $user?->email
                ?? 'System';

            $data['registered_date'] =
                now()->toDateString();
        } else {
            $data['edited_by_user_id'] =
                $user?->id;

            $data['edited_by'] =
                $user?->name
                ?? $user?->email
                ?? 'System';
        }

        return $data;
    }

    /**
     * Store newly uploaded files.
     */
    private function storeUploadedFiles(
        array $data,
        Request $request
    ): array {
        foreach (self::PHOTO_FIELDS as $field) {
            unset($data[$field]);

            if ($request->hasFile($field)) {
                $data[$field] =
                    $this->storeFile(
                        $request->file($field),
                        'fixed-assets/photos'
                    );
            }
        }

        foreach (self::DOCUMENT_FIELDS as $field) {
            unset($data[$field]);

            if ($request->hasFile($field)) {
                $data[$field] =
                    $this->storeFile(
                        $request->file($field),
                        'fixed-assets/documents'
                    );
            }
        }

        return $data;
    }

    /**
     * Replace uploaded files while preserving existing files
     * when no replacement is supplied.
     */
    private function replaceUploadedFiles(
        SalesFixedAsset $asset,
        array $data,
        Request $request
    ): array {
        foreach (self::PHOTO_FIELDS as $field) {
            unset($data[$field]);

            if (! $request->hasFile($field)) {
                continue;
            }

            $newPath = $this->storeFile(
                $request->file($field),
                'fixed-assets/photos'
            );

            $this->deleteFile(
                $asset->{$field}
            );

            $data[$field] = $newPath;
        }

        foreach (self::DOCUMENT_FIELDS as $field) {
            unset($data[$field]);

            if (! $request->hasFile($field)) {
                continue;
            }

            $newPath = $this->storeFile(
                $request->file($field),
                'fixed-assets/documents'
            );

            $this->deleteFile(
                $asset->{$field}
            );

            $data[$field] = $newPath;
        }

        return $data;
    }

    /**
     * Store one file on the public disk.
     */
    private function storeFile(
        UploadedFile $file,
        string $directory
    ): string {
        return $file->store(
            $directory,
            'public'
        );
    }

    /**
     * Delete one stored file when it exists.
     */
    private function deleteFile(
        ?string $path
    ): void {
        if (
            $path === null
            || trim($path) === ''
        ) {
            return;
        }

        Storage::disk('public')
            ->delete($path);
    }

    /**
     * Delete every photo and document belonging to an asset.
     */
    private function deleteAllAssetFiles(
        SalesFixedAsset $asset
    ): void {
        foreach (
            array_merge(
                self::PHOTO_FIELDS,
                self::DOCUMENT_FIELDS
            ) as $field
        ) {
            $this->deleteFile(
                $asset->{$field}
            );
        }
    }

    /**
     * Build the filtered fixed asset query.
     */
    private function buildFilteredQuery(
        array $filters
    ): Builder {
        $search = trim(
            (string) (
                $filters['search'] ?? ''
            )
        );

        return SalesFixedAsset::query()
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
                $filters['category_id']
                    ?? null,
                fn (
                    Builder $query,
                    int|string $categoryId
                ): Builder => $query->where(
                    'category_id',
                    $categoryId
                )
            )
            ->when(
                $filters['status']
                    ?? null,
                fn (
                    Builder $query,
                    string $status
                ): Builder => $query->where(
                    'status',
                    $status
                )
            )
            ->when(
                $filters['asset_condition']
                    ?? null,
                fn (
                    Builder $query,
                    string $condition
                ): Builder => $query->where(
                    'asset_condition',
                    $condition
                )
            )
            ->when(
                $filters['reading_type']
                    ?? null,
                fn (
                    Builder $query,
                    string $readingType
                ): Builder => $query->where(
                    'reading_type',
                    $readingType
                )
            )
            ->when(
                $filters['type_of_fuel']
                    ?? null,
                fn (
                    Builder $query,
                    string $fuelType
                ): Builder => $query->where(
                    'type_of_fuel',
                    $fuelType
                )
            )
            ->when(
                array_key_exists(
                    'has_gauge',
                    $filters
                )
                && $filters['has_gauge'] !== null,
                fn (
                    Builder $query
                ): Builder => $query->where(
                    'has_gauge',
                    filter_var(
                        $filters['has_gauge'],
                        FILTER_VALIDATE_BOOLEAN
                    )
                )
            );
    }

    /**
     * Apply a full-text-like search across common fields.
     */
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
                        'asset_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'vehicle_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'tag_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'plate_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'name_of_machinery',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'make_of_vehicle',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'model',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'chassis_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'engine_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'engine_model',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'make_of_engine',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'type_of_fuel',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'current_location',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'assigned_to',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhereHas(
                        'category',
                        function (
                            Builder $categoryQuery
                        ) use ($search): void {
                            $categoryQuery->where(
                                'category',
                                'ilike',
                                "%{$search}%"
                            );
                        }
                    );
            }
        );
    }

    /**
     * Generate FA000001, FA000002, FA000003...
     */
    private function generateNextAssetNumber(): string
    {
        $lastNumber = SalesFixedAsset::withTrashed()
            ->where(
                'asset_no',
                'like',
                'FA%'
            )
            ->whereRaw(
                "SUBSTRING(asset_no FROM 3) ~ '^[0-9]+$'"
            )
            ->selectRaw(
                '
                MAX(
                    CAST(
                        SUBSTRING(asset_no FROM 3)
                        AS INTEGER
                    )
                ) AS max_number
                '
            )
            ->value('max_number');

        $nextNumber = max(
            (int) $lastNumber + 1,
            1
        );

        return 'FA' . str_pad(
            (string) $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
        );
    }

    /**
     * Prevent arbitrary database-column sorting.
     */
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

    /**
     * Return pagination in the format expected by the frontend.
     */
    private function paginatedResponse(
        $paginator,
        string $message
    ): JsonResponse {
        $pagination = [
            'current_page' =>
                $paginator->currentPage(),

            'last_page' =>
                $paginator->lastPage(),

            'per_page' =>
                $paginator->perPage(),

            'total' =>
                $paginator->total(),

            'from' =>
                $paginator->firstItem(),

            'to' =>
                $paginator->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' => $message,

            'data' =>
                SalesFixedAssetResource::collection(
                    $paginator->items()
                ),

            'pagination' => $pagination,

            'meta' => $pagination,
        ]);
    }
}