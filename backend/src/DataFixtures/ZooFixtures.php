<?php
namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Habitat;
use App\Entity\Race;
use App\Entity\Horaire;
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

        $imgSavane = new \App\Entity\Image();
        $imgSavane->setImagePath('habitat-savane.jpg');
        $imgSavane->setHabitat($savane);
        $manager->persist($imgSavane);

        $jungle = new Habitat();
        $jungle->setNom('Jungle');
        $jungle->setDescription('Une forêt dense et humide abritant une biodiversité incroyable.');
        $manager->persist($jungle);

        $imgJungle = new \App\Entity\Image();
        $imgJungle->setImagePath('habitat-jungle.jpg');
        $imgJungle->setHabitat($jungle);
        $manager->persist($imgJungle);

        $marais = new Habitat();
        $marais->setNom('Marais');
        $marais->setDescription('Une zone marécageuse paisible, parfaite pour les reptiles et amphibiens.');
        $manager->persist($marais);

        $imgMarais = new \App\Entity\Image();
        $imgMarais->setImagePath('habitat-marais.jpg');
        $imgMarais->setHabitat($marais);
        $manager->persist($imgMarais);

        // 2. CRÉATION DES RACES
        $raceLion = new Race();
        $raceLion->setLabel('Lion d\'Afrique');
        $manager->persist($raceLion);

        $raceSinge = new Race();
        $raceSinge->setLabel('Chimpanzé');
        $manager->persist($raceSinge);

        $raceReptile = new Race();
        $raceReptile->setLabel('Alligator');
        $manager->persist($raceReptile);

        // 3. CRÉATION DES ANIMAUX (et affectation des relations)
        $simba = new Animal();
        $simba->setPrenom('Simba');
        $simba->setEtat('En pleine forme');
        $simba->setRace($raceLion);
        $simba->setHabitat($savane);
        $manager->persist($simba);

        $imgSimba = new \App\Entity\Image();
        $imgSimba->setImagePath('simba.jpg');
        $imgSimba->setAnimal($simba);
        $manager->persist($imgSimba);

        $nala = new Animal();
        $nala->setPrenom('Nala');
        $nala->setEtat('En pleine forme');
        $nala->setRace($raceLion);
        $nala->setHabitat($savane);
        $manager->persist($nala);

        $imgNala = new \App\Entity\Image();
        $imgNala->setImagePath('nala.jpg');
        $imgNala->setAnimal($nala);
        $manager->persist($imgNala);

        $george = new Animal();
        $george->setPrenom('George');
        $george->setEtat('Légèrement fatigué');
        $george->setRace($raceSinge);
        $george->setHabitat($jungle);
        $manager->persist($george);

        $imgGeorge = new \App\Entity\Image();
        $imgGeorge->setImagePath('animal-chimpanze.jpg');
        $imgGeorge->setAnimal($george);
        $manager->persist($imgGeorge);

        $alli = new Animal();
        $alli->setPrenom('Ali');
        $alli->setEtat('Très calme');
        $alli->setRace($raceReptile);
        $alli->setHabitat($marais);
        $manager->persist($alli);

        $imgAlli = new \App\Entity\Image();
        $imgAlli->setImagePath('animal-alligator.jpg');
        $imgAlli->setAnimal($alli);
        $manager->persist($imgAlli);

        // 4. CRÉATION DES HORAIRES
        $horaire = new Horaire();
        $horaire->setJourSemaine('Tous les jours');
        $horaire->setOuverture(new \DateTime('09:00'));
        $horaire->setFermeture(new \DateTime('18:00'));
        $manager->persist($horaire);

        // 5. SAUVEGARDE FINALE DANS MYSQL
        $manager->flush();
    }
}
