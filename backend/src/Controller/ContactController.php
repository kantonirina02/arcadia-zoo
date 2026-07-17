<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/contact')]
class ContactController extends AbstractController
{
    #[Route('', name: 'api_contact_send', methods: ['POST'])]
    public function sendContactEmail(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['titre']) || empty($data['description']) || empty($data['email'])) {
            return $this->json(['message' => 'Veuillez remplir tous les champs (titre, description, email).'], 400);
        }

        // Création de l'email à envoyer au zoo
        $email = (new Email())
            ->from($data['email']) // L'email du visiteur
            ->to('contact@arcadia-zoo.fr') // L'email de destination du zoo
            ->subject('Nouveau message de contact : ' . $data['titre'])
            ->text("Vous avez reçu un nouveau message de " . $data['email'] . " :\n\n" . $data['description']);

        try {
            $mailer->send($email);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Une erreur est survenue lors de l\'envoi de l\'email.'], 500);
        }

        return $this->json(['message' => 'Votre message a bien été envoyé au zoo !'], 200);
    }
}
