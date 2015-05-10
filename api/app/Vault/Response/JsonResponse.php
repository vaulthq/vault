<?php namespace App\Vault\Response;

trait JsonResponse
{
    /**
     * Return a new JSON response from the application.
     *
     * @param  string|array  $data
     * @param  int    $status
     * @param  array  $headers
     * @param  int    $options
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function jsonResponse($data = array(), $status = 200, array $headers = array(), $options = 0)
    {
        return response()->json($data, $status, $headers, $options);
    }
}