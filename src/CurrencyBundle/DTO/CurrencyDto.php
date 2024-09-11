<?php

namespace App\CurrencyBundle\DTO;

readonly class CurrencyDto
{
    public function __construct(public string $name, public float $value = 0)
    {}
}