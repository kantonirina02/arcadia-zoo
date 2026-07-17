<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthenticationTest extends WebTestCase
{
    public function testLoginSuccess(): void
    {
        $client = static::createClient();

        // On envoie une requête POST avec les identifiants de l'admin créés par les fixtures
        $client->request('POST', '/api/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'jose@arcadia.com',
            'password' => 'admin123'
        ]));

        // Le statut attendu est 200 OK
        $this->assertResponseIsSuccessful();

        $responseContent = json_decode($client->getResponse()->getContent(), true);

        // On vérifie que la réponse contient un token
        $this->assertArrayHasKey('token', $responseContent);
    }

    public function testLoginFailure(): void
    {
        $client = static::createClient();

        // Mauvais mot de passe
        $client->request('POST', '/api/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'jose@arcadia.com',
            'password' => 'wrongpassword'
        ]));

        // Le statut attendu est 401 Unauthorized
        $this->assertResponseStatusCodeSame(401);
    }
}
