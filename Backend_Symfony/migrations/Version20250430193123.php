<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250430193123 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE administrador (id INT AUTO_INCREMENT NOT NULL, taller_id INT DEFAULT NULL, INDEX IDX_44F9A5216DC343EA (taller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE coche (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, marca_id INT DEFAULT NULL, modelo_id INT DEFAULT NULL, INDEX IDX_A1981CD4DB38439E (usuario_id), INDEX IDX_A1981CD481EF0041 (marca_id), INDEX IDX_A1981CD4C3A9576E (modelo_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE marca (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(200) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE mecanico (id INT AUTO_INCREMENT NOT NULL, administrador_id INT DEFAULT NULL, taller_id INT DEFAULT NULL, INDEX IDX_D2521E7A48DFEBB7 (administrador_id), INDEX IDX_D2521E7A6DC343EA (taller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE modelo (id INT AUTO_INCREMENT NOT NULL, marca_id INT DEFAULT NULL, nombre VARCHAR(200) NOT NULL, INDEX IDX_F0D76C4681EF0041 (marca_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE provincia (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(200) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reparaciones (id INT AUTO_INCREMENT NOT NULL, mecanico_id INT DEFAULT NULL, coche_id INT DEFAULT NULL, estado VARCHAR(200) NOT NULL, INDEX IDX_60AF46E6E032763 (mecanico_id), INDEX IDX_60AF46EF4621E56 (coche_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE taller (id INT AUTO_INCREMENT NOT NULL, provincia_id INT DEFAULT NULL, direccion VARCHAR(200) NOT NULL, INDEX IDX_139F45844E7121AF (provincia_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(200) NOT NULL, apellidos VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, password VARCHAR(200) NOT NULL, telefono VARCHAR(200) NOT NULL, dni VARCHAR(200) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE administrador ADD CONSTRAINT FK_44F9A5216DC343EA FOREIGN KEY (taller_id) REFERENCES taller (id)');
        $this->addSql('ALTER TABLE coche ADD CONSTRAINT FK_A1981CD4DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE coche ADD CONSTRAINT FK_A1981CD481EF0041 FOREIGN KEY (marca_id) REFERENCES marca (id)');
        $this->addSql('ALTER TABLE coche ADD CONSTRAINT FK_A1981CD4C3A9576E FOREIGN KEY (modelo_id) REFERENCES modelo (id)');
        $this->addSql('ALTER TABLE mecanico ADD CONSTRAINT FK_D2521E7A48DFEBB7 FOREIGN KEY (administrador_id) REFERENCES administrador (id)');
        $this->addSql('ALTER TABLE mecanico ADD CONSTRAINT FK_D2521E7A6DC343EA FOREIGN KEY (taller_id) REFERENCES taller (id)');
        $this->addSql('ALTER TABLE modelo ADD CONSTRAINT FK_F0D76C4681EF0041 FOREIGN KEY (marca_id) REFERENCES marca (id)');
        $this->addSql('ALTER TABLE reparaciones ADD CONSTRAINT FK_60AF46E6E032763 FOREIGN KEY (mecanico_id) REFERENCES mecanico (id)');
        $this->addSql('ALTER TABLE reparaciones ADD CONSTRAINT FK_60AF46EF4621E56 FOREIGN KEY (coche_id) REFERENCES coche (id)');
        $this->addSql('ALTER TABLE taller ADD CONSTRAINT FK_139F45844E7121AF FOREIGN KEY (provincia_id) REFERENCES provincia (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE administrador DROP FOREIGN KEY FK_44F9A5216DC343EA');
        $this->addSql('ALTER TABLE coche DROP FOREIGN KEY FK_A1981CD4DB38439E');
        $this->addSql('ALTER TABLE coche DROP FOREIGN KEY FK_A1981CD481EF0041');
        $this->addSql('ALTER TABLE coche DROP FOREIGN KEY FK_A1981CD4C3A9576E');
        $this->addSql('ALTER TABLE mecanico DROP FOREIGN KEY FK_D2521E7A48DFEBB7');
        $this->addSql('ALTER TABLE mecanico DROP FOREIGN KEY FK_D2521E7A6DC343EA');
        $this->addSql('ALTER TABLE modelo DROP FOREIGN KEY FK_F0D76C4681EF0041');
        $this->addSql('ALTER TABLE reparaciones DROP FOREIGN KEY FK_60AF46E6E032763');
        $this->addSql('ALTER TABLE reparaciones DROP FOREIGN KEY FK_60AF46EF4621E56');
        $this->addSql('ALTER TABLE taller DROP FOREIGN KEY FK_139F45844E7121AF');
        $this->addSql('DROP TABLE administrador');
        $this->addSql('DROP TABLE coche');
        $this->addSql('DROP TABLE marca');
        $this->addSql('DROP TABLE mecanico');
        $this->addSql('DROP TABLE modelo');
        $this->addSql('DROP TABLE provincia');
        $this->addSql('DROP TABLE reparaciones');
        $this->addSql('DROP TABLE taller');
        $this->addSql('DROP TABLE usuario');
    }
}
