<?php namespace App\Http\Requests;

/**
 * Class FindByTagRequest
 */
class FindByTagRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            'project' => 'required|integer',
            'tags' => 'required|string'
        ];
    }
}
