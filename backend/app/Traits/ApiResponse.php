<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function successResponse(
        mixed $data = null,
        string $message = 'Request completed successfully.',
        int $statusCode = 200
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json(
            $response,
            $statusCode
        );
    }

    protected function createdResponse(
        mixed $data = null,
        string $message = 'Record created successfully.'
    ): JsonResponse {
        return $this->successResponse(
            data: $data,
            message: $message,
            statusCode: 201
        );
    }

    protected function updatedResponse(
        mixed $data = null,
        string $message = 'Record updated successfully.'
    ): JsonResponse {
        return $this->successResponse(
            data: $data,
            message: $message
        );
    }

    protected function deletedResponse(
        string $message = 'Record deleted successfully.'
    ): JsonResponse {
        return $this->successResponse(
            data: null,
            message: $message
        );
    }

    protected function errorResponse(
        string $message = 'Something went wrong.',
        int $statusCode = 400,
        mixed $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json(
            $response,
            $statusCode
        );
    }

    protected function notFoundResponse(
        string $message = 'Record not found.'
    ): JsonResponse {
        return $this->errorResponse(
            message: $message,
            statusCode: 404
        );
    }
}