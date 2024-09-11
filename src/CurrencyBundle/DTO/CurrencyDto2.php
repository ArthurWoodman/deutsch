<?php

namespace App\CurrencyBundle\DTO;

class CurrencyDto2
{
    public string $name;
    public float $value;
    public function __construct(string $name, float $value = 0)
    {
        $this->name = $name;
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return float
     */
    public function getValue(): float
    {
        return $this->value;
    }
}