<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class VeterinaireTest extends WebTestCase
{
    private function getToken($client): string
    {
        $client->request('POST', '/api/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'veto@arcadia.com',
            'password' => 'veto123'
        ]));

        $response = json_decode($client->getResponse()->getContent(), true);
        return $response['token'];
    }

    public function testVetoCanPostRapport(): void
    {
        $client = static::createClient();
        $token = $this->getToken($client);

        // Récupérer un ID d'animal (on suppose que les fixtures en ont créé)
        // Mais vu que c'est l'API on peut simuler avec l'ID 1
        $payload = [
            'animal_id' => 1,
            'date' => '2026-07-17',
            'etat_animal' => 'En pleine forme',
            'nourriture_proposee' => 'Viande',
            'grammage_propose' => 5000,
            'detail_etat' => 'Test PHPUnit Veto'
        ];

        $client->request('POST', '/api/veterinaire/rapports', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ], json_encode($payload));

        $this->assertResponseStatusCodeSame(201);
        
        $responseContent = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Rapport vétérinaire ajouté avec succès', $responseContent['message']);
    }

    public function testUnauthorizedWithoutToken(): void
    {
        $client = static::createClient();

        $payload = [
            'animal_id' => 1,
            'date' => '2026-07-17',
            'etat' => 'Test'
        ];

        $client->request('POST', '/api/veterinaire/rapports', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($payload));

        $this->assertResponseStatusCodeSame(401);
    }
}
