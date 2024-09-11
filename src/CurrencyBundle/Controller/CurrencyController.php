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

    #[Route('/', name: 'app_currency_save', methods: ['POST'])]
    public function save(
        // for some reasons Autowiring does not work as expected so switching to usual setter/getter
        //#[MapRequestPayload] CurrencyDto $currencyDto,
        CurrencyService $currencyService
    ): Response
    {
        $request = $this->requestStack->getCurrentRequest();
        $parameters = json_decode($request->getContent(), true);
        $currencyDto2 = new CurrencyDto2($parameters['name'], $parameters['value']);
        $currencyService->createCurrency($currencyDto2);

        return $this->json([], 204);
    }

    #[Route('/', name: 'app_currency_update', methods: ['PATCH'])]
    public function update(
        CurrencyService $currencyService
    ): Response
    {
        $request = $this->requestStack->getCurrentRequest();
        $parameters = json_decode($request->getContent(), true);
        $currencyDto2 = new CurrencyDto2($parameters['name'], $parameters['value']);
        $currencyService->updateCurrency($currencyDto2);

        return $this->json([], 204);
    }

    #[Route('/currency', name: 'app_currency_delete_by_params', methods: ['DELETE'])]
    public function deleteByParams(
        CurrencyService $currencyService
    ): Response
    {
        try {
            $request = $this->requestStack->getCurrentRequest();
            $parameters = json_decode($request->getContent(), true);
            $currencyDto2 = new CurrencyDto2($parameters['name'], $parameters['value']);
            $currencyService->deleteCurrencyByParams($currencyDto2);
        } catch (\Exception $e) {
            // supposedly here we would get a chance just log the issue...
            throw new \ErrorException($e->getMessage(), $e->getCode(), \E_ERROR, $e->getFile(), $e->getLine());
        }

        return $this->json([], 204);
    }

    #[Route('/{id}', name: 'app_currency_delete', methods: ['DELETE'])]
    public function delete(
        Currency $currency,
        CurrencyService $currencyService
    ): Response
    {
        try {
            $currencyService->deleteCurrency($currency);
        } catch (\Exception $e) {
            // supposedly here we would get a chance just log the issue...
            throw new \ErrorException($e->getMessage(), $e->getCode(), \E_ERROR, $e->getFile(), $e->getLine());
        }

        return $this->json([], 204);
    }
}
