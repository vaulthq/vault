<?php namespace app\Http\Requests;

use Illuminate\Http\Exception\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;

class FormRequest extends \Illuminate\Foundation\Http\FormRequest
{
    protected function formatErrors(Validator $validator)
    {
        return $validator->errors()->first();
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(new JsonResponse($this->formatErrors($validator), 419));
    }
}
