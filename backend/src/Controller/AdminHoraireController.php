<?php

namespace App\Controller;

use App\Entity\Horaire;
use App\Repository\HoraireRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/horaires')]
#[IsGranted('ROLE_ADMIN')]
class AdminHoraireController extends AbstractController
{
    #[Route('', name: 'api_admin_horaires_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['jour_semaine']) || empty($data['ouverture']) || empty($data['fermeture'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $horaire = new Horaire();
        $horaire->setJourSemaine($data['jour_semaine']);
        $horaire->setOuverture(new \DateTime($data['ouverture']));
        $horaire->setFermeture(new \DateTime($data['fermeture']));

        $em->persist($horaire);
        $em->flush();

        return $this->json(['message' => 'Horaire créé avec succès', 'id' => $horaire->getId()], 201);
    }

    #[Route('/{id}', name: 'api_admin_horaires_update', methods: ['PUT'])]
    public function update(int $id, Request $request, HoraireRepository $horaireRepository, EntityManagerInterface $em): JsonResponse
    {
        $horaire = $horaireRepository->find($id);

        if (!$horaire) {
            return $this->json(['message' => 'Horaire non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['jour_semaine'])) {
            $horaire->setJourSemaine($data['jour_semaine']);
        }
        if (!empty($data['ouverture'])) {
            $horaire->setOuverture(new \DateTime($data['ouverture']));
        }
        if (!empty($data['fermeture'])) {
            $horaire->setFermeture(new \DateTime($data['fermeture']));
        }

        $em->flush();

        return $this->json(['message' => 'Horaire mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'api_admin_horaires_delete', methods: ['DELETE'])]
    public function delete(int $id, HoraireRepository $horaireRepository, EntityManagerInterface $em): JsonResponse
    {
        $horaire = $horaireRepository->find($id);

        if (!$horaire) {
            return $this->json(['message' => 'Horaire non trouvé'], 404);
        }

        $em->remove($horaire);
        $em->flush();

        return $this->json(['message' => 'Horaire supprimé avec succès'], 200);
    }
}
