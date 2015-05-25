<?php namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;

class ProjectRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
        ];
    }
}
