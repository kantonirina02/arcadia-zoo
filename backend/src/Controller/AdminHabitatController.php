<?php

namespace App\Controller;

use App\Entity\Habitat;
use App\Repository\HabitatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/habitats')]
#[IsGranted('ROLE_ADMIN')]
class AdminHabitatController extends AbstractController
{
    #[Route('', name: 'api_admin_habitats_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['nom']) || empty($data['description'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $habitat = new Habitat();
        $habitat->setNom($data['nom']);
        $habitat->setDescription($data['description']);
        
        if (isset($data['commentaire_veterinaire'])) {
            $habitat->setCommentaireVeterinaire($data['commentaire_veterinaire']);
        }

        $em->persist($habitat);
        $em->flush();

        return $this->json(['message' => 'Habitat créé avec succès', 'id' => $habitat->getId()], 201);
    }

    #[Route('/{id}', name: 'api_admin_habitats_update', methods: ['PUT'])]
    public function update(int $id, Request $request, HabitatRepository $habitatRepository, EntityManagerInterface $em): JsonResponse
    {
        $habitat = $habitatRepository->find($id);

        if (!$habitat) {
            return $this->json(['message' => 'Habitat non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['nom'])) {
            $habitat->setNom($data['nom']);
        }
        if (!empty($data['description'])) {
            $habitat->setDescription($data['description']);
        }
        if (isset($data['commentaire_veterinaire'])) {
            $habitat->setCommentaireVeterinaire($data['commentaire_veterinaire']);
        }

        $em->flush();

        return $this->json(['message' => 'Habitat mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'api_admin_habitats_delete', methods: ['DELETE'])]
    public function delete(int $id, HabitatRepository $habitatRepository, EntityManagerInterface $em): JsonResponse
    {
        $habitat = $habitatRepository->find($id);

        if (!$habitat) {
            return $this->json(['message' => 'Habitat non trouvé'], 404);
        }

        $em->remove($habitat);
        $em->flush();

        return $this->json(['message' => 'Habitat supprimé avec succès'], 200);
    }
}
