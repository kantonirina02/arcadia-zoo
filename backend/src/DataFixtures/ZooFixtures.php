<?php
namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Habitat;
use App\Entity\Race;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ZooFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // 1. CRÉATION DES HABITATS
        $savane = new Habitat();
        $savane->setNom('Savane');
        $savane->setDescription('Une vaste plaine herbeuse parsemée d\'acacias, idéale pour les grands mammifères africains.');
        $manager->persist($savane);

        $jungle = new Habitat();
        $jungle->setNom('Jungle');
        $jungle->setDescription('Une forêt dense et humide abritant une biodiversité incroyable.');
        $manager->persist($jungle);

        // 2. CRÉATION DES RACES
        $raceLion = new Race();
        $raceLion->setLabel('Lion d\'Afrique');
        $manager->persist($raceLion);

        $raceSinge = new Race();
        $raceSinge->setLabel('Chimpanzé');
        $manager->persist($raceSinge);

        // 3. CRÉATION DES ANIMAUX (et affectation des relations)
        $simba = new Animal();
        $simba->setPrenom('Simba');
        $simba->setEtat('En pleine forme');

        $simba->setRace($raceLion);
        $simba->setHabitat($savane);
        $manager->persist($simba);

        $nala = new Animal();
        $nala->setPrenom('Nala');
        $nala->setEtat('En pleine forme');
        $nala->setRace($raceLion);
        $nala->setHabitat($savane);
        $manager->persist($nala);

        $george = new Animal();
        $george->setPrenom('George');
        $george->setEtat('Légèrement fatigué');
        $george->setRace($raceSinge);
        $george->setHabitat($jungle);
        $manager->persist($george);

        // 4. SAUVEGARDE FINALE DANS MYSQL
        $manager->flush();
    }
}
