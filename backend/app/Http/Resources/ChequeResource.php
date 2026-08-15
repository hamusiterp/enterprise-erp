<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChequeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'bank_id' => $this->bank_id,

            'bank' => $this->whenLoaded(
                'bank',
                function (): ?array {
                    if (! $this->bank) {
                        return null;
                    }

                    return [
                        'id' => $this->bank->id,

                        'name' =>
                            $this->bank->bank_name_original
                            ?? $this->bank->bank_name_orginal
                            ?? $this->bank->bank_name
                            ?? $this->bank->name
                            ?? 'Bank',

                        'branch' =>
                            $this->bank->branch
                            ?? null,
                    ];
                }
            ),

            'branch' => $this->branch,

            'cheque_no' => $this->cheque_no,

            'signature_status' =>
                $this->signature_status,

            'status' => $this->status,

            'is_used' =>
                (bool) $this->is_used,

            'can_edit' =>
                ! $this->is_used
                && $this->status === 'active',

            'can_void' =>
                ! $this->is_used
                && $this->status === 'active',

            'can_activate' =>
                ! $this->is_used
                && $this->status === 'void',

            'registered_by' =>
                $this->registered_by,

            'registered_by_user_id' =>
                $this->registered_by_user_id,

            'date_registered' =>
                $this->date_registered
                    ?->format('Y-m-d'),

            'void_by' => $this->void_by,

            'void_by_user_id' =>
                $this->void_by_user_id,

            'void_date' =>
                $this->void_date
                    ?->format('Y-m-d'),

            'active_by' => $this->active_by,

            'active_by_user_id' =>
                $this->active_by_user_id,

            'active_date' =>
                $this->active_date
                    ?->format('Y-m-d'),

            'created_at' =>
                $this->created_at
                    ?->format('Y-m-d H:i:s'),

            'updated_at' =>
                $this->updated_at
                    ?->format('Y-m-d H:i:s'),

            'deleted_at' =>
                $this->deleted_at
                    ?->format('Y-m-d H:i:s'),
        ];
    }
}