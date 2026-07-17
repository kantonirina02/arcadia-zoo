<?php

namespace App\Controller;

use App\Repository\AvisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/employe/reviews')]
#[IsGranted('ROLE_EMPLOYE')]
class EmployeeReviewController extends AbstractController
{
    #[Route('', name: 'api_employe_reviews_unvalidated', methods: ['GET'])]
    public function getUnvalidatedReviews(AvisRepository $avisRepository): JsonResponse
    {
        $reviews = $avisRepository->findBy(['isVisible' => false]);
        $data = [];

        foreach ($reviews as $review) {
            $data[] = [
                'id' => $review->getId(),
                'pseudo' => $review->getPseudo(),
                'commentaire' => $review->getCommentaire(),
                'is_visible' => $review->isVisible()
            ];
        }

        return $this->json($data, 200);
    }

    #[Route('/{id}/validate', name: 'api_employe_reviews_validate', methods: ['PUT'])]
    public function validateReview(int $id, Request $request, AvisRepository $avisRepository, EntityManagerInterface $em): JsonResponse
    {
        $review = $avisRepository->find($id);

        if (!$review) {
            return $this->json(['message' => 'Avis non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['is_visible'])) {
            $review->setIsVisible((bool) $data['is_visible']);
            $em->flush();
            return $this->json(['message' => 'Statut de l\'avis mis à jour'], 200);
        }

        return $this->json(['message' => 'Paramètre is_visible manquant'], 400);
    }
}
