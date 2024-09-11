<?php

namespace App\CurrencyBundle\Service;

use App\CurrencyBundle\DTO\CurrencyDto2;
use App\CurrencyBundle\Entity\Currency;
use App\CurrencyBundle\Repository\CurrencyRepository;
use Doctrine\ORM\EntityManagerInterface;

class CurrencyService
{
    /*
        * @var EntityManagerInterface
        */
    private EntityManagerInterface $em;

    /**
     * @var CurrencyRepository
     */
    private CurrencyRepository $currencyRepository;

    /**
     * @param EntityManagerInterface $em
     * @param CurrencyRepository $currencyRepository
     */
    public function __construct(EntityManagerInterface $em, CurrencyRepository $currencyRepository)
    {
        $this->em = $em;
        $this->currencyRepository = $currencyRepository;
    }

    /**
     * @param CurrencyDto2 $currencyDto
     * @return void
     */
    public function createCurrency(CurrencyDTO2 $currencyDto)
    {
        $currency = new Currency();
        $currency->setName($currencyDto->getName());
        $currency->setValue($currencyDto->getValue());

        $this->em->persist($currency);
        $this->em->flush();
    }

    /**
     * @param Currency $currency
     * @return void
     */
    public function deleteCurrency(Currency $currency)
    {
        $this->em->remove($currency);
        $this->em->flush();
    }

    /**
     * @param CurrencyDto2 $currencyDto
     * @return void
     */
    public function deleteCurrencyByParams(CurrencyDTO2 $currencyDto)
    {
        $currency = $this->currencyRepository->findOneBy([
            'name' => $currencyDto->getName()
        ]);

        if ($currency instanceof Currency) {
            $this->em->remove($currency);
            $this->em->flush();
        }
    }

    /**
     * @param CurrencyDto2 $currencyDto
     * @return void
     */
    public function updateCurrency(CurrencyDTO2 $currencyDto)
    {
        $currency = $this->currencyRepository->findOneBy([
            'name' => $currencyDto->getName()
        ]);

        if ($currency instanceof Currency) {
            $currency->setValue($currencyDto->getValue());

            $this->em->persist($currency);
            $this->em->flush();
        }
    }
}
