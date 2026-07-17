<?php

namespace App\Controller;

use App\Entity\Service;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/services')]
#[IsGranted('ROLE_ADMIN')]
class AdminServiceController extends AbstractController
{
    #[Route('', name: 'api_admin_services_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['nom']) || empty($data['description'])) {
            return $this->json(['message' => 'Données incomplètes'], 400);
        }

        $service = new Service();
        $service->setNom($data['nom']);
        $service->setDescription($data['description']);

        $em->persist($service);
        $em->flush();

        return $this->json(['message' => 'Service créé avec succès', 'id' => $service->getId()], 201);
    }

    #[Route('/{id}', name: 'api_admin_services_update', methods: ['PUT'])]
    public function update(int $id, Request $request, ServiceRepository $serviceRepository, EntityManagerInterface $em): JsonResponse
    {
        $service = $serviceRepository->find($id);

        if (!$service) {
            return $this->json(['message' => 'Service non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['nom'])) {
            $service->setNom($data['nom']);
        }
        if (!empty($data['description'])) {
            $service->setDescription($data['description']);
        }

        $em->flush();

        return $this->json(['message' => 'Service mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'api_admin_services_delete', methods: ['DELETE'])]
    public function delete(int $id, ServiceRepository $serviceRepository, EntityManagerInterface $em): JsonResponse
    {
        $service = $serviceRepository->find($id);

        if (!$service) {
            return $this->json(['message' => 'Service non trouvé'], 404);
        }

        $em->remove($service);
        $em->flush();

        return $this->json(['message' => 'Service supprimé avec succès'], 200);
    }
}
