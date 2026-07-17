<?php

namespace App\Controller;

use App\Entity\RapportVeterinaire;
use App\Repository\AnimalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/veterinaire/rapports')]
#[IsGranted('ROLE_VETERINAIRE')]
class VetRapportController extends AbstractController
{
    #[Route('', name: 'api_vet_rapports_create', methods: ['POST'])]
    public function createRapport(Request $request, AnimalRepository $animalRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['animal_id']) || empty($data['date']) || empty($data['etat_animal']) || empty($data['nourriture_proposee']) || empty($data['grammage_propose'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $animal = $animalRepository->find($data['animal_id']);

        if (!$animal) {
            return $this->json(['message' => 'Animal non trouvé'], 404);
        }

        $veterinaire = $this->getUser();
        if (!$veterinaire) {
            return $this->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $rapport = new RapportVeterinaire();
        $rapport->setAnimal($animal);
        $rapport->setVeterinaire($veterinaire);
        $rapport->setDate(new \DateTime($data['date']));
        $rapport->setEtatAnimal($data['etat_animal']);
        $rapport->setNourritureProposee($data['nourriture_proposee']);
        $rapport->setGrammagePropose($data['grammage_propose']);
        
        if (isset($data['detail_etat'])) {
            $rapport->setDetailEtat($data['detail_etat']);
        }

        $em->persist($rapport);
        $em->flush();

        return $this->json(['message' => 'Rapport vétérinaire ajouté avec succès'], 201);
    }
}
