<?php

namespace App\Controller;

use App\Repository\RapportVeterinaireRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/rapports')]
#[IsGranted('ROLE_ADMIN')]
class AdminRapportController extends AbstractController
{
    #[Route('', name: 'api_admin_rapports_list', methods: ['GET'])]
    public function getRapports(Request $request, RapportVeterinaireRepository $rapportRepository): JsonResponse
    {
        $animalId = $request->query->get('animal_id');
        $date = $request->query->get('date');

        $criteria = [];
        if ($animalId) {
            $criteria['animal'] = $animalId;
        }
        if ($date) {
            $criteria['date'] = new \DateTime($date);
        }

        $rapports = $rapportRepository->findBy($criteria, ['date' => 'DESC']);
        $data = [];

        foreach ($rapports as $rapport) {
            $data[] = [
                'id' => $rapport->getId(),
                'date' => $rapport->getDate()->format('Y-m-d'),
                'etat_animal' => $rapport->getEtatAnimal(),
                'nourriture_proposee' => $rapport->getNourritureProposee(),
                'grammage_propose' => $rapport->getGrammagePropose(),
                'detail_etat' => $rapport->getDetailEtat(),
                'animal' => $rapport->getAnimal() ? $rapport->getAnimal()->getPrenom() : null,
                'veterinaire' => $rapport->getVeterinaire() ? $rapport->getVeterinaire()->getUsername() : null
            ];
        }

        return $this->json($data, 200);
    }
}
