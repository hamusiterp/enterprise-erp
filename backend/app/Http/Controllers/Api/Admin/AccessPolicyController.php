<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccessPolicyRequest;
use App\Http\Requests\UpdateAccessPolicyRequest;
use App\Models\AccessPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessPolicyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('access-policies.view'),
            403,
            'You do not have permission to view access policies.'
        );

        $policies = AccessPolicy::query()
            ->with([
                'schedules',
                'assignments',
            ])
            ->orderBy('priority')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $policies,
        ]);
    }

    public function store(
        StoreAccessPolicyRequest $request
    ): JsonResponse {
        $policy = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $schedules = $data['schedules'];
            $assignments = $data['assignments'] ?? [];

            unset(
                $data['schedules'],
                $data['assignments']
            );

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            $policy = AccessPolicy::create($data);

            foreach ($schedules as $schedule) {
                $policy->schedules()->create($schedule);
            }

            foreach ($assignments as $assignment) {
                $assignment['created_by'] = $request->user()->id;
                $assignment['updated_by'] = $request->user()->id;

                $policy->assignments()->create($assignment);
            }

            return $policy;
        });

        return response()->json([
            'success' => true,
            'message' => 'Access policy created successfully.',
            'data' => $policy->load([
                'schedules',
                'assignments',
            ]),
        ], 201);
    }

    public function show(
        Request $request,
        AccessPolicy $accessPolicy
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('access-policies.view'),
            403,
            'You do not have permission to view access policies.'
        );

        return response()->json([
            'success' => true,
            'data' => $accessPolicy->load([
                'schedules',
                'assignments',
            ]),
        ]);
    }

    public function update(
        UpdateAccessPolicyRequest $request,
        AccessPolicy $accessPolicy
    ): JsonResponse {
        $accessPolicy = DB::transaction(
            function () use (
                $request,
                $accessPolicy
            ) {
                $data = $request->validated();

                $schedules = $data['schedules'];
                $assignments = $data['assignments'] ?? [];

                unset(
                    $data['schedules'],
                    $data['assignments']
                );

                $data['updated_by'] = $request->user()->id;

                $accessPolicy->update($data);

                $accessPolicy
                    ->schedules()
                    ->delete();

                foreach ($schedules as $schedule) {
                    $accessPolicy
                        ->schedules()
                        ->create($schedule);
                }

                $accessPolicy
                    ->assignments()
                    ->delete();

                foreach ($assignments as $assignment) {
                    $assignment['created_by'] =
                        $request->user()->id;

                    $assignment['updated_by'] =
                        $request->user()->id;

                    $accessPolicy
                        ->assignments()
                        ->create($assignment);
                }

                return $accessPolicy;
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Access policy updated successfully.',
            'data' => $accessPolicy
                ->fresh()
                ->load([
                    'schedules',
                    'assignments',
                ]),
        ]);
    }
}