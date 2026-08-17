<?php

namespace App\Services;

use App\Models\DocumentSequence;
use App\Models\FiscalYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DocumentNumberService
{
    public function __construct(
        private readonly FiscalYearService $fiscalYearService
    ) {
    }

    public function generate(
        string $documentType,
        ?FiscalYear $fiscalYear = null
    ): string {
        $fiscalYear ??= $this->fiscalYearService->getCurrentOrFail();

        if (!$fiscalYear->is_active) {
            throw ValidationException::withMessages([
                'fiscal_year' => 'The fiscal year is not active.',
            ]);
        }

        if ($fiscalYear->is_locked) {
            throw ValidationException::withMessages([
                'fiscal_year' => 'The fiscal year is locked.',
            ]);
        }

        if ($fiscalYear->status !== 'open') {
            throw ValidationException::withMessages([
                'fiscal_year' => 'The fiscal year is not open.',
            ]);
        }

        return DB::transaction(function () use (
            $documentType,
            $fiscalYear
        ) {
            $sequence = DocumentSequence::query()
                ->where('document_type', $documentType)
                ->where('fiscal_year_id', $fiscalYear->id)
                ->where('is_active', true)
                ->lockForUpdate()
                ->first();

            if (!$sequence) {
                throw ValidationException::withMessages([
                    'document_type' =>
                        "No active document sequence is configured for {$documentType} in fiscal year {$fiscalYear->name}.",
                ]);
            }

            $sequence->current_number++;

            $sequence->save();

            return $this->formatNumber(
                $sequence,
                $fiscalYear
            );
        }, 3);
    }

    private function formatNumber(
        DocumentSequence $sequence,
        FiscalYear $fiscalYear
    ): string {
        $number = str_pad(
            (string) $sequence->current_number,
            $sequence->number_length,
            '0',
            STR_PAD_LEFT
        );

        $replacements = [
            '{PREFIX}' => $sequence->prefix,
            '{FY}' => $fiscalYear->code,
            '{NUMBER}' => $number,
        ];

        return strtr(
            $sequence->format,
            $replacements
        );
    }
}