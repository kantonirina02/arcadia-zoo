<?php
namespace App\Controller;

use App\Repository\HabitatRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/habitats')]
class HabitatController extends AbstractController
{
    #[Route('', name: 'api_habitats_index', methods: ['GET'])]
    public function index(HabitatRepository $habitatRepository): JsonResponse
    {
        // 1. On récupère tous les habitats depuis MySQL
        $habitats = $habitatRepository->findAll();

        $data = [];

        // 2. On boucle sur chaque habitat
        foreach ($habitats as $habitat) {

            // 3. On prépare un tableau vide pour les animaux de CET habitat
            $animauxData = [];

            // 4. On boucle sur les animaux liés à cet habitat
            foreach ($habitat->getAnimals() as $animal) {
                $animauxData[] = [
                    'id' => $animal->getId(),
                    'prenom' => $animal->getPrenom(),
                    'etat' => $animal->getEtat(),
                    // On inclut le label de la race pour l'affichage complet
                    'race' => $animal->getRace() ? $animal->getRace()->getLabel() : null
                ];
            }

            // 5. On assemble les données de l'habitat et on y intègre la liste d'animaux nettoyée
            $data[] = [
                'id' => $habitat->getId(),
                'nom' => $habitat->getNom(),
                'description' => $habitat->getDescription(),
                'animaux' => $animauxData
            ];
        }

        // 6. On retourne le JSON avec un code 200 (Succès)
        return $this->json($data, 200);
    }
}
