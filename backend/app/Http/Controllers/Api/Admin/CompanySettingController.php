<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCompanySettingRequest;
use App\Models\CompanySetting;
use App\Services\CompanySettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UploadCompanyBrandingRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CompanySettingResource;

class CompanySettingController extends Controller
{
    public function __construct(
        private readonly CompanySettingService $companySettingService
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('company-settings.view'),
            403,
            'You do not have permission to view company settings.'
        );

        $setting = $this->companySettingService->getOrCreate();

        return response()->json([
            'success' => true,
            'data' => new CompanySettingResource($setting),
        ]);
    }

    public function update(UpdateCompanySettingRequest $request): JsonResponse
    {
        $setting = $this->companySettingService->getOrCreate();

        $setting = DB::transaction(function () use ($request, $setting) {
            $data = $request->validated();

            $data['updated_by'] = $request->user()->id;

            if (!$setting->created_by) {
                $data['created_by'] = $request->user()->id;
            }

            $setting->update($data);

            return $setting->fresh();
        });

        return response()->json([
            'success' => true,
            'message' => 'Company settings updated successfully.',
            'data' => new CompanySettingResource($setting),
        ]);
    }

    public function uploadBranding(
    UploadCompanyBrandingRequest $request
): JsonResponse {
    $setting = $this->companySettingService->getOrCreate();

    $data = [];

    if ($request->hasFile('logo')) {

        if ($setting->logo) {
            Storage::disk('public')->delete($setting->logo);
        }

        $data['logo'] = $request
            ->file('logo')
            ->store('company/branding', 'public');
    }

    if ($request->hasFile('favicon')) {

        if ($setting->favicon) {
            Storage::disk('public')->delete($setting->favicon);
        }

        $data['favicon'] = $request
            ->file('favicon')
            ->store('company/branding', 'public');
    }

    $data['updated_by'] = $request->user()->id;

    if (!$setting->created_by) {
        $data['created_by'] = $request->user()->id;
    }

    $setting->update($data);

    return response()->json([
    'success' => true,
    'message' => 'Company branding updated successfully.',
    'data' => new CompanySettingResource($setting->fresh()),
]);
}
}