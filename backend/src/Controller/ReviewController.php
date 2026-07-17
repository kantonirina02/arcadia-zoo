<?php

namespace App\Controller;

use App\Entity\Avis;
use App\Repository\AvisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/reviews')]
class ReviewController extends AbstractController
{
    #[Route('/validated', name: 'api_reviews_validated', methods: ['GET'])]
    public function validated(AvisRepository $avisRepository): JsonResponse
    {
        $avis = $avisRepository->findBy(['isVisible' => true], ['id' => 'DESC']);

        $data = array_map(static fn (Avis $avis): array => [
            'id' => $avis->getId(),
            'pseudo' => $avis->getPseudo(),
            'commentaire' => $avis->getCommentaire(),
        ], $avis);

        return $this->json($data, 200);
    }

    #[Route('', name: 'api_reviews_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->json(['message' => 'Le JSON transmis est invalide.'], 400);
        }

        $pseudo = trim((string) ($payload['pseudo'] ?? ''));
        $commentaire = trim((string) ($payload['commentaire'] ?? ''));

        if ($pseudo === '' || $commentaire === '') {
            return $this->json(['message' => 'Le pseudo et le commentaire sont obligatoires.'], 400);
        }

        if (mb_strlen($pseudo) > 50 || mb_strlen($commentaire) > 255) {
            return $this->json(['message' => 'Le pseudo ou le commentaire est trop long.'], 422);
        }

        $avis = new Avis();
        $avis->setPseudo($pseudo);
        $avis->setCommentaire($commentaire);
        $avis->setIsVisible(false);

        $entityManager->persist($avis);
        $entityManager->flush();

        return $this->json([
            'id' => $avis->getId(),
            'message' => 'Votre avis est en attente de validation.',
        ], 201);
    }
}
