<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class EmployeTest extends WebTestCase
{
    private function getToken($client): string
    {
        $client->request('POST', '/api/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'employe@arcadia.com',
            'password' => 'employe123'
        ]));

        $response = json_decode($client->getResponse()->getContent(), true);
        return $response['token'];
    }

    public function testEmployeCanPostAlimentation(): void
    {
        $client = static::createClient();
        $token = $this->getToken($client);

        $payload = [
            'animal_id' => 1,
            'date' => '2026-07-17',
            'heure' => '12:00',
            'nourriture_donnee' => 'Poulet',
            'quantite_donnee' => 3000
        ];

        $client->request('POST', '/api/employe/alimentation', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ], json_encode($payload));

        $this->assertResponseStatusCodeSame(201);
        
        $responseContent = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Alimentation ajoutée avec succès', $responseContent['message']);
    }

    public function testUnauthorizedForEmployeInVetoRoute(): void
    {
        $client = static::createClient();
        $token = $this->getToken($client);

        // Employé essaie d'aller sur la route vétérinaire
        $payload = [
            'animal_id' => 1,
            'date' => '2026-07-17',
            'etat' => 'Hack'
        ];

        $client->request('POST', '/api/veterinaire/rapports', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ], json_encode($payload));

        // Le statut doit être 403 Forbidden (accès refusé selon les roles)
        $this->assertResponseStatusCodeSame(403);
    }
}
