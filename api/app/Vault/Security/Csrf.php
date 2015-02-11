<?php namespace Vault\Security;

use Illuminate\Http\Request;

class Csrf
{
    const COOKIE_NAME = 'XSRF-TOKEN';
    const NG_HEADER_NAME = 'X-XSRF-TOKEN';

    public function createCsfrCookie()
    {
        $existing = $this->getCsrfCookie();

        if ($this->usingProtection() && is_null($existing)) {
            $this->setCsrfCookie($this->generateToken());
        }
    }

    public function isRequestValid(Request $request)
    {
        if ($this->usingProtection()) {
            return $this->tokenMatches($request->header(self::NG_HEADER_NAME));
        }

        return true;
    }

    public function usingProtection()
    {
        return \Config::get('app.csrf', true);
    }

    protected function tokenMatches($token)
    {
        if (empty($token)) {
            return false;
        }

        return $this->generateToken() == $token;
    }

    protected function setCsrfCookie($value)
    {
        setcookie(
            self::COOKIE_NAME,
            $value, 0,
            '/',
            \Config::get('app.domain'),
            \Config::get('app.https'),
            false
        );
    }

    protected function generateToken()
    {
        return md5(\Session::token());
    }

    protected function getCsrfCookie()
    {
        return \Cookie::get(self::COOKIE_NAME);
    }

}