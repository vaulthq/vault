<?php namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;

class AdminOnlyRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::user()->isAdmin();
    }

    public function rules()
    {
        return [];
    }
}