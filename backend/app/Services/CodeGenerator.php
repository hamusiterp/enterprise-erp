<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use InvalidArgumentException;

class CodeGenerator
{
    /**
     * Generate a temporary unique code.
     *
     * This is used before the database creates the record ID.
     */
    public function temporary(
        string $prefix = 'TMP'
    ): string {
        return strtoupper($prefix)
            . '-'
            . Str::upper(Str::uuid()->toString());
    }

    /**
     * Format a database ID into a business code.
     *
     * Examples:
     * 1    => BNK001
     * 25   => BNK025
     * 1000 => BNK1000
     */
    public function fromId(
        int $id,
        string $prefix,
        int $length = 3
    ): string {
        if ($id < 1) {
            throw new InvalidArgumentException(
                'The record ID must be greater than zero.'
            );
        }

        if (trim($prefix) === '') {
            throw new InvalidArgumentException(
                'The code prefix is required.'
            );
        }

        return strtoupper(trim($prefix))
            . str_pad(
                (string) $id,
                $length,
                '0',
                STR_PAD_LEFT
            );
    }

    /**
     * Assign the final business code to a model.
     */
    public function assign(
        Model $model,
        string $prefix,
        string $column = 'code',
        int $length = 3
    ): Model {
        if (!$model->exists) {
            throw new InvalidArgumentException(
                'The model must be saved before assigning its code.'
            );
        }

        $model->setAttribute(
            $column,
            $this->fromId(
                id: (int) $model->getKey(),
                prefix: $prefix,
                length: $length
            )
        );

        $model->save();

        return $model->refresh();
    }
}