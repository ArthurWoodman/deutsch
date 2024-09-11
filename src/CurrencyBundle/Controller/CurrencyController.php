<?php

namespace App\CurrencyBundle\Controller;

use App\CurrencyBundle\Entity\Currency;
use App\CurrencyBundle\Service\CurrencyService;
use Doctrine\DBAL\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\CurrencyBundle\DTO\CurrencyDto;
use App\CurrencyBundle\DTO\CurrencyDto2;
use Symfony\Component\HttpFoundation\RequestStack;
use App\CurrencyBundle\Repository\CurrencyRepository;

class CurrencyController extends AbstractController
{
    public function __construct(
        protected RequestStack $requestStack,
    ) {
    }

    #[Route('/', name: 'app_currency', methods: ['GET'])]
    public function index(CurrencyRepository $currencyRepository): Response
    {
        $currencies = $currencyRepository->findAll();
        return $this->render('currency/index.html.twig', [
            'currencies' => $currencies
        ]);
    }
}
