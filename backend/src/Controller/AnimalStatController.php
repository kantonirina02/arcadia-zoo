<?php

namespace App\Controller;

use App\Document\AnimalStat;
use App\Repository\AnimalRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class AnimalStatController extends AbstractController
{
    #[Route('/stats/animal/{id}', name: 'api_stats_increment_animal', methods: ['POST'])]
    public function incrementStat(int $id, AnimalRepository $animalRepository, DocumentManager $dm): JsonResponse
    {
        // 1. Vérifier si l'animal existe dans MySQL
        $animal = $animalRepository->find($id);
        if (!$animal) {
            return $this->json(['message' => 'Animal non trouvé'], 404);
        }

        // 2. Chercher ou créer les statistiques de cet animal dans MongoDB
        $stat = $dm->getRepository(AnimalStat::class)->findOneBy(['animalId' => $id]);

        if (!$stat) {
            $stat = new AnimalStat();
            $stat->setAnimalId($id);
            $stat->setConsultations(1);
            $dm->persist($stat);
        } else {
            $stat->incrementConsultations();
        }

        $dm->flush();

        return $this->json(['message' => 'Consultation enregistrée', 'consultations' => $stat->getConsultations()], 200);
    }

    #[Route('/admin/stats', name: 'api_admin_stats', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAdminStats(DocumentManager $dm, AnimalRepository $animalRepository): JsonResponse
    {
        $stats = $dm->getRepository(AnimalStat::class)->findBy([], ['consultations' => 'DESC']);
        $data = [];

        foreach ($stats as $stat) {
            $animal = $animalRepository->find($stat->getAnimalId());
            $prenom = $animal ? $animal->getPrenom() : 'Animal inconnu';

            $data[] = [
                'animal_id' => $stat->getAnimalId(),
                'prenom' => $prenom,
                'consultations' => $stat->getConsultations()
            ];
        }

        return $this->json($data, 200);
    }
}
