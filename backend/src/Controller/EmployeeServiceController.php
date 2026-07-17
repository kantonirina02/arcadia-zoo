<?php

namespace App\Controller;

use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/employe/services')]
#[IsGranted('ROLE_EMPLOYE')]
class EmployeeServiceController extends AbstractController
{
    #[Route('/{id}', name: 'api_employe_services_update', methods: ['PUT'])]
    public function updateService(int $id, Request $request, ServiceRepository $serviceRepository, EntityManagerInterface $em): JsonResponse
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

        return $this->json(['message' => 'Service mis à jour avec succès par l\'employé'], 200);
    }
}
