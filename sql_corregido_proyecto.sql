

-- Base de datos: `proyecto`
DROP DATABASE IF EXISTS `proyecto`;
CREATE DATABASE `proyecto` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `proyecto`;

-- Tabla: provincia
CREATE TABLE `provincia` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: taller
CREATE TABLE `taller` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `provincia_id` INT(11) DEFAULT NULL,
  `direccion` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`provincia_id`) REFERENCES `provincia` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: administrador
CREATE TABLE `administrador` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `taller_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`taller_id`) REFERENCES `taller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: marca
CREATE TABLE `marca` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: modelo
CREATE TABLE `modelo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `marca_id` INT(11) DEFAULT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuario
CREATE TABLE `usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  `apellidos` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL, -- NOTA: en producción debería ser un hash
  `telefono` VARCHAR(200) NOT NULL,
  `dni` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: coche
CREATE TABLE `coche` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` INT(11) DEFAULT NULL,
  `marca_id` INT(11) DEFAULT NULL,
  `modelo_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`),
  FOREIGN KEY (`modelo_id`) REFERENCES `modelo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: mecanico
CREATE TABLE `mecanico` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `administrador_id` INT(11) DEFAULT NULL,
  `taller_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`),
  FOREIGN KEY (`taller_id`) REFERENCES `taller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: reparaciones
CREATE TABLE `reparaciones` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `mecanico_id` INT(11) DEFAULT NULL,
  `coche_id` INT(11) DEFAULT NULL,
  `estado` ENUM('PENDIENTE', 'EN PROCESO', 'FINALIZADA') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`),
  FOREIGN KEY (`coche_id`) REFERENCES `coche` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: doctrine_migration_versions (sin cambios estructurales)
CREATE TABLE `doctrine_migration_versions` (
  `version` VARCHAR(191) NOT NULL,
  `executed_at` DATETIME DEFAULT NULL,
  `execution_time` INT(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

