<?php

namespace App\Controller;

use App\Entity\Animal;
use App\Repository\AnimalRepository;
use App\Repository\HabitatRepository;
use App\Repository\RaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/animaux')]
#[IsGranted('ROLE_ADMIN')]
class AdminAnimalController extends AbstractController
{
    #[Route('', name: 'api_admin_animaux_create', methods: ['POST'])]
    public function create(
        Request $request, 
        EntityManagerInterface $em,
        HabitatRepository $habitatRepository,
        RaceRepository $raceRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['prenom']) || empty($data['habitat_id']) || empty($data['race_id'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $habitat = $habitatRepository->find($data['habitat_id']);
        $race = $raceRepository->find($data['race_id']);

        if (!$habitat || !$race) {
            return $this->json(['message' => 'Habitat ou Race non trouvé'], 404);
        }

        $animal = new Animal();
        $animal->setPrenom($data['prenom']);
        $animal->setHabitat($habitat);
        $animal->setRace($race);
        
        // Par défaut, l'état peut être nul ou initialisé
        if (isset($data['etat'])) {
            $animal->setEtat($data['etat']);
        }

        $em->persist($animal);
        $em->flush();

        return $this->json(['message' => 'Animal créé avec succès', 'id' => $animal->getId()], 201);
    }

    #[Route('/{id}', name: 'api_admin_animaux_update', methods: ['PUT'])]
    public function update(
        int $id, 
        Request $request, 
        AnimalRepository $animalRepository, 
        HabitatRepository $habitatRepository,
        RaceRepository $raceRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $animal = $animalRepository->find($id);

        if (!$animal) {
            return $this->json(['message' => 'Animal non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['prenom'])) {
            $animal->setPrenom($data['prenom']);
        }
        if (!empty($data['etat'])) {
            $animal->setEtat($data['etat']);
        }
        if (!empty($data['habitat_id'])) {
            $habitat = $habitatRepository->find($data['habitat_id']);
            if ($habitat) {
                $animal->setHabitat($habitat);
            }
        }
        if (!empty($data['race_id'])) {
            $race = $raceRepository->find($data['race_id']);
            if ($race) {
                $animal->setRace($race);
            }
        }

        $em->flush();

        return $this->json(['message' => 'Animal mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'api_admin_animaux_delete', methods: ['DELETE'])]
    public function delete(int $id, AnimalRepository $animalRepository, EntityManagerInterface $em): JsonResponse
    {
        $animal = $animalRepository->find($id);

        if (!$animal) {
            return $this->json(['message' => 'Animal non trouvé'], 404);
        }

        $em->remove($animal);
        $em->flush();

        return $this->json(['message' => 'Animal supprimé avec succès'], 200);
    }
}
