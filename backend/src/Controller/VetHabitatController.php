<?php

namespace App\Controller;

use App\Repository\HabitatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/veterinaire/habitats')]
#[IsGranted('ROLE_VETERINAIRE')]
class VetHabitatController extends AbstractController
{
    #[Route('/{id}', name: 'api_vet_habitats_comment', methods: ['PUT'])]
    public function commentHabitat(int $id, Request $request, HabitatRepository $habitatRepository, EntityManagerInterface $em): JsonResponse
    {
        $habitat = $habitatRepository->find($id);

        if (!$habitat) {
            return $this->json(['message' => 'Habitat non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['commentaire_veterinaire'])) {
            $habitat->setCommentaireVeterinaire($data['commentaire_veterinaire']);
            $em->flush();
            return $this->json(['message' => 'Commentaire sur l\'habitat ajouté avec succès'], 200);
        }

        return $this->json(['message' => 'Paramètre commentaire_veterinaire manquant'], 400);
    }
}
