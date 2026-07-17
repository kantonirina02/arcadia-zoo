<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260717001000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create review table for visitor feedback moderation.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE avis (id INT AUTO_INCREMENT NOT NULL, pseudo VARCHAR(50) NOT NULL, commentaire VARCHAR(255) NOT NULL, is_visible TINYINT(1) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE avis');
    }
}
