<?php
namespace App\DataFixtures;

use App\Entity\Service;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ServiceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Création des 3 services
        $servicesData = [
            [
                'nom' => 'Restauration',
                'description' => 'Profitez de nos différents points de restauration dans le parc.'
            ],
            [
                'nom' => 'Visite guidée',
                'description' => 'Visite des habitats avec un guide (gratuit).'
            ],
            [
                'nom' => 'Petit train',
                'description' => 'Visite du zoo en petit train.'
            ]
        ];

        // Boucle pour créer et préparer chaque service pour la base de données
        foreach ($servicesData as $data) {
            $service = new Service();
            $service->setNom($data['nom']);
            $service->setDescription($data['description']);

            $manager->persist($service);
        }

        // Sauvegarde physique dans MySQL
        $manager->flush();
    }
}
