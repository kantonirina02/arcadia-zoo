<?php

namespace App\Controller;

use App\Entity\AlimentationReelle;
use App\Repository\AnimalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/employe/alimentation')]
#[IsGranted('ROLE_EMPLOYE')]
class EmployeeAlimentationController extends AbstractController
{
    #[Route('', name: 'api_employe_alimentation_create', methods: ['POST'])]
    public function addAlimentation(Request $request, AnimalRepository $animalRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['animal_id']) || empty($data['date']) || empty($data['heure']) || empty($data['nourriture_donnee']) || empty($data['quantite_donnee'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $animal = $animalRepository->find($data['animal_id']);

        if (!$animal) {
            return $this->json(['message' => 'Animal non trouvé'], 404);
        }

        // L'utilisateur actuellement connecté est l'employé
        $employe = $this->getUser();
        if (!$employe) {
            return $this->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $alimentation = new AlimentationReelle();
        $alimentation->setAnimal($animal);
        $alimentation->setEmploye($employe);
        $alimentation->setDate(new \DateTime($data['date']));
        $alimentation->setHeure(new \DateTime($data['heure']));
        $alimentation->setNourritureDonnee($data['nourriture_donnee']);
        $alimentation->setQuantiteDonnee($data['quantite_donnee']);

        $em->persist($alimentation);
        $em->flush();

        return $this->json(['message' => 'Alimentation ajoutée avec succès'], 201);
    }
}
