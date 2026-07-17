<?php
namespace App\DataFixtures;

use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    // Injection de dépendance du service de hachage de sécurité de Symfony
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Création des rôles
        $roleAdmin = new \App\Entity\Role();
        $roleAdmin->setLabel('ROLE_ADMIN');
        $manager->persist($roleAdmin);

        $roleVeto = new \App\Entity\Role();
        $roleVeto->setLabel('ROLE_VETERINAIRE');
        $manager->persist($roleVeto);

        $roleEmploye = new \App\Entity\Role();
        $roleEmploye->setLabel('ROLE_EMPLOYE');
        $manager->persist($roleEmploye);

        // Création du compte Administrateur
        $admin = new Utilisateur();
        $admin->setUsername('jose@arcadia.com');
        $admin->setNom('Arcadia');
        $admin->setPrenom('José');
        $admin->setRole($roleAdmin);

        // Hachage sécurisé du mot de passe
        $hashedPasswordAdmin = $this->passwordHasher->hashPassword($admin, 'admin123');
        $admin->setPassword($hashedPasswordAdmin);
        $manager->persist($admin);

        // Création d'un compte Vétérinaire
        $veto = new Utilisateur();
        $veto->setUsername('veto@arcadia.com');
        $veto->setNom('Dupont');
        $veto->setPrenom('Claire');
        $veto->setRole($roleVeto);

        $hashedPasswordVeto = $this->passwordHasher->hashPassword($veto, 'veto123');
        $veto->setPassword($hashedPasswordVeto);
        $manager->persist($veto);

        // Création d'un compte Employé
        $employe = new Utilisateur();
        $employe->setUsername('employe@arcadia.com');
        $employe->setNom('Martin');
        $employe->setPrenom('Jean');
        $employe->setRole($roleEmploye);

        $hashedPasswordEmploye = $this->passwordHasher->hashPassword($employe, 'employe123');
        $employe->setPassword($hashedPasswordEmploye);
        $manager->persist($employe);

        $manager->flush();
    }
}
