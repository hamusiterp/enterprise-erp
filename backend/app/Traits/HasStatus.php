<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasStatus
{
    public function scopeActive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'active'
        );
    }

    public function scopeInactive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'inactive'
        );
    }

    public function scopeWithStatus(
        Builder $query,
        ?string $status
    ): Builder {
        if (
            $status === null ||
            $status === ''
        ) {
            return $query;
        }

        return $query->where(
            'status',
            $status
        );
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    public function activate(): bool
    {
        return $this->update([
            'status' => 'active',
        ]);
    }

    public function deactivate(): bool
    {
        return $this->update([
            'status' => 'inactive',
        ]);
    }
}