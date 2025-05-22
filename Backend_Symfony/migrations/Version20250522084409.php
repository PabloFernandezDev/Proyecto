<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250522084409 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE linea_factura ADD facturas_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE linea_factura ADD CONSTRAINT FK_B8330A4E1C55BE39 FOREIGN KEY (facturas_id) REFERENCES factura (id)');
        $this->addSql('CREATE INDEX IDX_B8330A4E1C55BE39 ON linea_factura (facturas_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE linea_factura DROP FOREIGN KEY FK_B8330A4E1C55BE39');
        $this->addSql('DROP INDEX IDX_B8330A4E1C55BE39 ON linea_factura');
        $this->addSql('ALTER TABLE linea_factura DROP facturas_id');
    }
}
