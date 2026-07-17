<?php

namespace App\DataFixtures;

use App\Entity\Avis;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AvisFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $avisData = [
            [
                'pseudo' => 'Lucas_P',
                'commentaire' => 'Un zoo magnifique et propre. Les animaux semblent tres heureux.',
                'isVisible' => true,
            ],
            [
                'pseudo' => 'Emma_V',
                'commentaire' => 'L engagement ecologique est vraiment visible, bravo !',
                'isVisible' => true,
            ],
            [
                'pseudo' => 'Test_Visiteur',
                'commentaire' => 'Avis en cours de moderation.',
                'isVisible' => false,
            ],
        ];

        foreach ($avisData as $data) {
            $avis = new Avis();
            $avis->setPseudo($data['pseudo']);
            $avis->setCommentaire($data['commentaire']);
            $avis->setIsVisible($data['isVisible']);

            $manager->persist($avis);
        }

        $manager->flush();
    }
}
