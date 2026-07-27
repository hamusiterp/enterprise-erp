<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        return [
            'id' => $this->id,

            'department_id' =>
                $this->department_id,

            'department_name' =>
                $this->department_name,

            'description' =>
                $this->description,

            'status' =>
                $this->status,

            'registered_by' => $this->whenLoaded(
                'registeredBy',
                function (): ?array {
                    if (!$this->registeredBy) {
                        return null;
                    }

                    return [
                        'id' =>
                            $this->registeredBy->id,

                        'name' =>
                            $this->registeredBy->name,

                        'email' =>
                            $this->registeredBy->email,
                    ];
                }
            ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}