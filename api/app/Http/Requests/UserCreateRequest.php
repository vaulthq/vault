<?php namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;

class UserCreateRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::user()->isAdmin();
    }

    public function rules()
    {
        return [
            'email' => 'required|unique:user',
            'group' => 'required',
            'password' => 'required'
        ];
    }
}