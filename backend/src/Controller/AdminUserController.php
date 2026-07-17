<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminUserController extends AbstractController
{
    #[Route('/users', name: 'api_admin_create_user', methods: ['POST'])]
    public function createUser(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        RoleRepository $roleRepository,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation simple
        if (!isset($data['username'], $data['password'], $data['nom'], $data['prenom'], $data['role'])) {
            return $this->json(['message' => 'Données manquantes'], 400);
        }

        // On vérifie que le rôle demandé n'est pas Admin (US 6 : impossible de créer un admin)
        if (str_contains(strtoupper($data['role']), 'ADMIN')) {
            return $this->json(['message' => 'Impossible de créer un compte administrateur depuis l\'application'], 403);
        }

        // Recherche du rôle en base
        $roleLabel = strtoupper($data['role']);
        if (!str_starts_with($roleLabel, 'ROLE_')) {
            $roleLabel = 'ROLE_' . $roleLabel;
        }

        $roleEntity = $roleRepository->findOneBy(['label' => $roleLabel]);
        if (!$roleEntity) {
            return $this->json(['message' => 'Rôle non trouvé'], 400);
        }

        // Création de l'utilisateur
        $user = new Utilisateur();
        $user->setUsername($data['username']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setRole($roleEntity);

        // Hachage du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        // Envoi de l'email
        $email = (new Email())
            ->from('no-reply@arcadia-zoo.fr')
            ->to($user->getUsername())
            ->subject('Création de votre compte Arcadia Zoo')
            ->html(
                '<p>Bonjour ' . htmlspecialchars($user->getPrenom()) . ',</p>' .
                '<p>Votre compte a été créé avec succès.</p>' .
                '<p>Votre identifiant de connexion est : <strong>' . htmlspecialchars($user->getUsername()) . '</strong></p>' .
                '<p>Pour des raisons de sécurité, votre mot de passe ne vous est pas communiqué par email. Veuillez vous rapprocher de l\'administrateur pour l\'obtenir.</p>'
            );

        try {
            $mailer->send($email);
        } catch (\Exception $e) {
            // L'utilisateur est créé mais l'email n'a pas pu partir.
            // On peut logger l'erreur ou retourner une alerte.
        }

        return $this->json(['message' => 'Utilisateur créé avec succès'], 201);
    }
}
