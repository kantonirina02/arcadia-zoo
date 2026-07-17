<?php

namespace App\Controller;

use App\Repository\AlimentationReelleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/veterinaire/alimentation')]
#[IsGranted('ROLE_VETERINAIRE')]
class VetAlimentationController extends AbstractController
{
    #[Route('/animal/{animal_id}', name: 'api_vet_alimentation_get', methods: ['GET'])]
    public function getAlimentation(int $animal_id, AlimentationReelleRepository $alimentationRepository): JsonResponse
    {
        $alimentations = $alimentationRepository->findBy(['animal' => $animal_id], ['date' => 'DESC', 'heure' => 'DESC']);
        $data = [];

        foreach ($alimentations as $alim) {
            $data[] = [
                'id' => $alim->getId(),
                'date' => $alim->getDate()->format('Y-m-d'),
                'heure' => $alim->getHeure()->format('H:i:s'),
                'nourriture_donnee' => $alim->getNourritureDonnee(),
                'quantite_donnee' => $alim->getQuantiteDonnee(),
                'employe' => $alim->getEmploye() ? $alim->getEmploye()->getUsername() : null
            ];
        }

        return $this->json($data, 200);
    }
}
