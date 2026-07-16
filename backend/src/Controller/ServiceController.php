<?php
namespace App\Controller;

use App\Repository\ServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/services')]
class ServiceController extends AbstractController
{
    // Méthode GET pour récupérer la liste de tous les services
    #[Route('', name: 'api_services_index', methods: ['GET'])]
    public function index(ServiceRepository $serviceRepository): JsonResponse
    {
        // 1. On demande au Repository d'aller chercher tous les services dans MySQL
        $services = $serviceRepository->findAll();

        // 2. On prépare un tableau vide pour formater nos données proprement
        $data = [];

        // 3. On boucle sur les objets PHP pour en extraire les informations simples
        foreach ($services as $service) {
            $data[] = [
                'id' => $service->getId(),
                'nom' => $service->getNom(),
                'description' => $service->getDescription(),
            ];
        }

        // 4. On retourne la réponse au format JSON avec le statut HTTP 200 (OK)
        return $this->json($data, 200);
    }
}
