<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250515091242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cita (id INT AUTO_INCREMENT NOT NULL, usuario_id INT DEFAULT NULL, provincia_id INT DEFAULT NULL, fecha DATE NOT NULL, hora TIME NOT NULL, motivo VARCHAR(255) NOT NULL, INDEX IDX_3E379A62DB38439E (usuario_id), INDEX IDX_3E379A624E7121AF (provincia_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cita ADD CONSTRAINT FK_3E379A62DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE cita ADD CONSTRAINT FK_3E379A624E7121AF FOREIGN KEY (provincia_id) REFERENCES provincia (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cita DROP FOREIGN KEY FK_3E379A62DB38439E');
        $this->addSql('ALTER TABLE cita DROP FOREIGN KEY FK_3E379A624E7121AF');
        $this->addSql('DROP TABLE cita');
    }
}
