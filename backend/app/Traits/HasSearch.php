<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasSearch
{
    public function scopeSearch(
        Builder $query,
        ?string $search
    ): Builder {
        $search = trim((string) $search);

        if ($search === '') {
            return $query;
        }

        $searchableFields = $this->getSearchableFields();

        if ($searchableFields === []) {
            return $query;
        }

        return $query->where(
            function (Builder $builder) use (
                $search,
                $searchableFields
            ): void {
                foreach ($searchableFields as $field) {
                    $builder->orWhere(
                        $field,
                        'ilike',
                        '%' . $search . '%'
                    );
                }
            }
        );
    }

    public function getSearchableFields(): array
    {
        return property_exists($this, 'searchable')
            ? $this->searchable
            : [];
    }
}