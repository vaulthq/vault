<?php namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::user()->isAdmin();
    }

    public function rules()
    {
        return [
            'id' => 'required',
            'group' => 'required',
            'email' => 'required',
        ];
    }
}
