<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,

            'department_id' => $this->department_id,

            'department' => $this->whenLoaded(
                'department',
                function () {
                    return [
                        'id' => $this->department->id,
            'department_name' =>
                $this->department->department_name,
                    ];
                }
            ),

            'level' => $this->level,
            'status' => $this->status,
            'description' => $this->description,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}