<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521111038 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE linea_factura (id INT AUTO_INCREMENT NOT NULL, factura_id INT DEFAULT NULL, concepto VARCHAR(255) NOT NULL, descripcion VARCHAR(255) DEFAULT NULL, precio DOUBLE PRECISION NOT NULL, cantidad INT NOT NULL, total DOUBLE PRECISION NOT NULL, INDEX IDX_B8330A4EF04F795F (factura_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE linea_factura ADD CONSTRAINT FK_B8330A4EF04F795F FOREIGN KEY (factura_id) REFERENCES factura (id)');
        $this->addSql('ALTER TABLE factura ADD usuario_id INT DEFAULT NULL, ADD metodo_pago VARCHAR(255) NOT NULL, CHANGE fecha_emision fecha DATETIME NOT NULL');
        $this->addSql('ALTER TABLE factura ADD CONSTRAINT FK_F9EBA009DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('CREATE INDEX IDX_F9EBA009DB38439E ON factura (usuario_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE linea_factura DROP FOREIGN KEY FK_B8330A4EF04F795F');
        $this->addSql('DROP TABLE linea_factura');
        $this->addSql('ALTER TABLE factura DROP FOREIGN KEY FK_F9EBA009DB38439E');
        $this->addSql('DROP INDEX IDX_F9EBA009DB38439E ON factura');
        $this->addSql('ALTER TABLE factura DROP usuario_id, DROP metodo_pago, CHANGE fecha fecha_emision DATETIME NOT NULL');
    }
}
