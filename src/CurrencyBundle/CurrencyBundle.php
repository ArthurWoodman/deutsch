<?php

namespace App\CurrencyBundle;

use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

class CurrencyBundle extends AbstractBundle
{
    public function getPath(): string
    {
        return __DIR__;
    }
}