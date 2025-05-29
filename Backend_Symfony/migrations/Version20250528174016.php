<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250528174016 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notificacion (id INT AUTO_INCREMENT NOT NULL, usuario_id INT DEFAULT NULL, mensaje VARCHAR(255) NOT NULL, fecha DATE NOT NULL, leido TINYINT(1) NOT NULL, tipo VARCHAR(255) NOT NULL, INDEX IDX_729A19ECDB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notificacion ADD CONSTRAINT FK_729A19ECDB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notificacion DROP FOREIGN KEY FK_729A19ECDB38439E');
        $this->addSql('DROP TABLE notificacion');
    }
}
