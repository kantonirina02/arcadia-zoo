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
                    'id_animal' => $animal->getId(),
                    'prenom' => $animal->getPrenom(),
                    'etat' => $animal->getEtat(),
                    // On inclut le label de la race pour l'affichage complet
                    'race' => $animal->getRace() ? $animal->getRace()->getLabel() : null
                ];
            }

            // 5. On assemble les données de l'habitat et on y intègre la liste d'animaux nettoyée
            $data[] = [
                'id_habitat' => $habitat->getId(),
                'nom' => $habitat->getNom(),
                'description' => $habitat->getDescription(),
                'animaux' => $animauxData
            ];
        }

        // 6. On retourne le JSON avec un code 200 (Succès)
        return $this->json($data, 200);
    }

    #[Route('/{id}', name: 'api_habitats_show', methods: ['GET'])]
    public function show(
        HabitatRepository $habitatRepository,
        \App\Repository\RapportVeterinaireRepository $rapportRepo,
        int $id
    ): JsonResponse {
        $habitat = $habitatRepository->find($id);
        if (!$habitat) {
            return $this->json(['message' => 'Habitat non trouvé'], 404);
        }

        $animauxData = [];
        foreach ($habitat->getAnimals() as $animal) {
            // Fetch latest vet report for this animal
            $latestReport = $rapportRepo->findOneBy(['animal' => $animal], ['date' => 'DESC']);
            $reportData = null;
            if ($latestReport) {
                $reportData = [
                    'date' => $latestReport->getDate()->format('Y-m-d'),
                    'etat_animal' => $latestReport->getEtatAnimal(),
                    'nourriture_proposee' => $latestReport->getNourritureProposee(),
                    'grammage_propose' => $latestReport->getGrammagePropose(),
                    'detail_etat' => $latestReport->getDetailEtat()
                ];
            }

            $animauxData[] = [
                'id_animal' => $animal->getId(),
                'prenom' => $animal->getPrenom(),
                'etat' => $animal->getEtat(),
                'race' => $animal->getRace() ? $animal->getRace()->getLabel() : null,
                'rapport_veterinaire' => $reportData,
                'image_path' => null // Placeholder for image if needed
            ];
        }

        return $this->json([
            'id_habitat' => $habitat->getId(),
            'nom' => $habitat->getNom(),
            'description' => $habitat->getDescription(),
            'animaux' => $animauxData
        ]);
    }
}
