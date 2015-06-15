<?php namespace App\Http\Requests;

class DeployKeyRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'host' => 'required',
        ];
    }
}
