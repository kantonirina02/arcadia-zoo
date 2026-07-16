<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260716231500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Increase service description length.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE service MODIFY description VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE service MODIFY description VARCHAR(50) NOT NULL');
    }
}
