<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentSequenceRequest;
use App\Http\Requests\UpdateDocumentSequenceRequest;
use App\Models\DocumentSequence;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentSequenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('document-sequences.view'),
            403,
            'You do not have permission to view document sequences.'
        );

        $query = DocumentSequence::query()
            ->with('fiscalYear:id,name,code,start_date,end_date');

        if ($request->filled('fiscal_year_id')) {
            $query->where(
                'fiscal_year_id',
                $request->integer('fiscal_year_id')
            );
        }

        if ($request->filled('document_type')) {
            $query->where(
                'document_type',
                $request->string('document_type')
            );
        }

        $sequences = $query
            ->orderBy('document_type')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sequences,
        ]);
    }

    public function store(
        StoreDocumentSequenceRequest $request
    ): JsonResponse {
        $sequence = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            return DocumentSequence::create($data);
        });

        return response()->json([
            'success' => true,
            'message' => 'Document sequence created successfully.',
            'data' => $sequence->load('fiscalYear'),
        ], 201);
    }

    public function show(
        Request $request,
        DocumentSequence $documentSequence
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('document-sequences.view'),
            403,
            'You do not have permission to view document sequences.'
        );

        return response()->json([
            'success' => true,
            'data' => $documentSequence->load('fiscalYear'),
        ]);
    }

    public function update(
        UpdateDocumentSequenceRequest $request,
        DocumentSequence $documentSequence
    ): JsonResponse {
        $data = $request->validated();
        $data['updated_by'] = $request->user()->id;

        $documentSequence->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Document sequence updated successfully.',
            'data' => $documentSequence
                ->fresh()
                ->load('fiscalYear'),
        ]);
    }
}