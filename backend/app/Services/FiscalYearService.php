<?php

namespace App\Services;

use App\Models\FiscalYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\DocumentSequence;

class FiscalYearService
{
    public function current(): ?FiscalYear
    {
        return FiscalYear::query()
            ->where('is_current', true)
            ->where('is_active', true)
            ->first();
    }

    public function getCurrentOrFail(): FiscalYear
    {
        $fiscalYear = $this->current();

        if (!$fiscalYear) {
            throw ValidationException::withMessages([
                'fiscal_year' => 'No current fiscal year is configured.',
            ]);
        }

        return $fiscalYear;
    }

    public function setCurrent(FiscalYear $fiscalYear): FiscalYear
    {
        if (!$fiscalYear->is_active) {
            throw ValidationException::withMessages([
                'fiscal_year' => 'Inactive fiscal year cannot be set as current.',
            ]);
        }

        if ($fiscalYear->is_locked) {
            throw ValidationException::withMessages([
                'fiscal_year' => 'Locked fiscal year cannot be set as current.',
            ]);
        }

        if ($fiscalYear->status !== 'open') {
            throw ValidationException::withMessages([
                'fiscal_year' => 'Only an open fiscal year can be set as current.',
            ]);
        }

        return DB::transaction(function () use ($fiscalYear) {

            FiscalYear::query()
                ->where('is_current', true)
                ->where('id', '!=', $fiscalYear->id)
                ->update([
                    'is_current' => false,
                ]);

            $fiscalYear->update([
                'is_current' => true,
            ]);

            return $fiscalYear->fresh();
        });
    }

    public function close(FiscalYear $fiscalYear): FiscalYear
{
    if ($fiscalYear->is_locked) {
        throw ValidationException::withMessages([
            'fiscal_year' => 'Fiscal year is already locked.',
        ]);
    }

    if ($fiscalYear->status === 'closed') {
        throw ValidationException::withMessages([
            'fiscal_year' => 'Fiscal year is already closed.',
        ]);
    }

    if ($fiscalYear->is_current) {
        $anotherAvailableYear = FiscalYear::query()
            ->where('id', '!=', $fiscalYear->id)
            ->where('is_active', true)
            ->where('is_locked', false)
            ->where('status', 'open')
            ->exists();

        if (!$anotherAvailableYear) {
            throw ValidationException::withMessages([
                'fiscal_year' =>
                    'You cannot close the current fiscal year until another open and active fiscal year is available.',
            ]);
        }
    }

    return DB::transaction(function () use ($fiscalYear) {
        $fiscalYear->update([
            'status' => 'closed',
            'is_current' => false,
        ]);

        return $fiscalYear->fresh();
    });
}

    public function lock(FiscalYear $fiscalYear): FiscalYear
    {
        if ($fiscalYear->status !== 'closed') {
            throw ValidationException::withMessages([
                'fiscal_year' => 'Fiscal year must be closed before it can be locked.',
            ]);
        }

        $fiscalYear->update([
            'is_locked' => true,
            'is_current' => false,
        ]);

        return $fiscalYear->fresh();
    }

    public function cloneDocumentSequences(
    FiscalYear $sourceFiscalYear,
    FiscalYear $targetFiscalYear
): int {
    if ($sourceFiscalYear->id === $targetFiscalYear->id) {
        throw ValidationException::withMessages([
            'fiscal_year' =>
                'Source and target fiscal years cannot be the same.',
        ]);
    }

    return DB::transaction(function () use (
        $sourceFiscalYear,
        $targetFiscalYear
    ) {
        $sourceSequences = DocumentSequence::query()
            ->where('fiscal_year_id', $sourceFiscalYear->id)
            ->where('reset_per_fiscal_year', true)
            ->get();

        $created = 0;

        foreach ($sourceSequences as $sequence) {
            $exists = DocumentSequence::query()
                ->where(
                    'document_type',
                    $sequence->document_type
                )
                ->where(
                    'fiscal_year_id',
                    $targetFiscalYear->id
                )
                ->exists();

            if ($exists) {
                continue;
            }

            DocumentSequence::create([
                'document_type' =>
                    $sequence->document_type,

                'name' =>
                    $sequence->name,

                'prefix' =>
                    $sequence->prefix,

                'fiscal_year_id' =>
                    $targetFiscalYear->id,

                'current_number' => 0,

                'number_length' =>
                    $sequence->number_length,

                'format' =>
                    $sequence->format,

                'reset_per_fiscal_year' =>
                    $sequence->reset_per_fiscal_year,

                'is_active' =>
                    $sequence->is_active,

                'remarks' =>
                    $sequence->remarks,

                'created_by' =>
                    $targetFiscalYear->created_by,

                'updated_by' =>
                    $targetFiscalYear->updated_by,
            ]);

            $created++;
        }

        return $created;
    });
}
}