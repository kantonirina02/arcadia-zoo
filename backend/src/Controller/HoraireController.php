<?php
namespace App\Controller;

use App\Repository\HoraireRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/horaires')]
class HoraireController extends AbstractController
{
    #[Route('', name: 'api_horaires_index', methods: ['GET'])]
    public function index(HoraireRepository $horaireRepository): JsonResponse
    {
        $horaires = $horaireRepository->findAll();
        $data = [];

        foreach ($horaires as $horaire) {
            $data[] = [
                'id' => $horaire->getId(),
                'jour' => $horaire->getJourSemaine(),
                'heure_ouverture' => $horaire->getOuverture()->format('H:i'),
                'heure_fermeture' => $horaire->getFermeture()->format('H:i')
            ];
        }

        return $this->json($data, 200);
    }
}
