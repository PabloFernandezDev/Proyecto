-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2025 a las 21:23:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id` int(11) NOT NULL,
  `taller_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coche`
--

CREATE TABLE `coche` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `marca_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `coche`
--

INSERT INTO `coche` (`id`, `usuario_id`, `marca_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250319181141', '2025-03-19 19:11:54', 57);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id`, `nombre`) VALUES
(1, 'Seat'),
(2, 'Volkswagen'),
(3, 'Peugeot'),
(4, 'Citroën'),
(5, 'Renault'),
(6, 'Opel'),
(7, 'Ford'),
(8, 'Toyota'),
(9, 'Kia'),
(10, 'Hyundai'),
(11, 'Nissan'),
(12, 'BMW'),
(13, 'Mercedes-Benz'),
(14, 'Audi'),
(15, 'Skoda'),
(16, 'Honda'),
(17, 'Fiat'),
(18, 'Mazda'),
(19, 'Dacia'),
(20, 'Jeep'),
(21, 'Lexus'),
(22, 'Volvo'),
(23, 'Tesla'),
(24, 'Cupra'),
(25, 'MG');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mecanico`
--

CREATE TABLE `mecanico` (
  `id` int(11) NOT NULL,
  `administrador_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
  `id` int(11) NOT NULL,
  `marca_id` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `modelo`
--

INSERT INTO `modelo` (`id`, `marca_id`, `nombre`) VALUES
(1, 1, 'Ibiza'),
(2, 1, 'León'),
(3, 1, 'Ateca'),
(4, 1, 'Arona'),
(5, 1, 'Tarraco'),
(6, 1, 'Toledo'),
(7, 1, 'Alhambra'),
(8, 1, 'Mii'),
(9, 2, 'Golf'),
(10, 2, 'Polo'),
(11, 2, 'Passat'),
(12, 2, 'Tiguan'),
(13, 2, 'T-Roc'),
(14, 2, 'Touran'),
(15, 2, 'Arteon'),
(16, 3, '208'),
(17, 3, '308'),
(18, 3, '3008'),
(19, 3, '508'),
(20, 3, '2008'),
(21, 3, '5008'),
(22, 3, 'Rifter'),
(23, 4, 'C1'),
(24, 4, 'C3'),
(25, 4, 'C4'),
(26, 4, 'C5 Aircross'),
(27, 4, 'Berlingo'),
(28, 5, 'Clio'),
(29, 5, 'Mégane'),
(30, 5, 'Twingo'),
(31, 5, 'Captur'),
(32, 5, 'Kadjar'),
(33, 5, 'Scénic'),
(34, 5, 'Zoe'),
(35, 6, 'Corsa'),
(36, 6, 'Astra'),
(37, 6, 'Insignia'),
(38, 6, 'Mokka'),
(39, 6, 'Crossland'),
(40, 6, 'Grandland'),
(41, 7, 'Fiesta'),
(42, 7, 'Focus'),
(43, 7, 'Mondeo'),
(44, 7, 'Kuga'),
(45, 7, 'Puma'),
(46, 7, 'S-Max'),
(47, 8, 'Yaris'),
(48, 8, 'Corolla'),
(49, 8, 'C-HR'),
(50, 8, 'RAV4'),
(51, 8, 'Auris'),
(52, 8, 'Prius'),
(53, 8, 'Avensis'),
(54, 9, 'Picanto'),
(55, 9, 'Rio'),
(56, 9, 'Ceed'),
(57, 9, 'Sportage'),
(58, 9, 'Stonic'),
(59, 9, 'Sorento'),
(60, 10, 'i10'),
(61, 10, 'i20'),
(62, 10, 'i30'),
(63, 10, 'Tucson'),
(64, 10, 'Kona'),
(65, 10, 'Santa Fe'),
(66, 11, 'Micra'),
(67, 11, 'Juke'),
(68, 11, 'Qashqai'),
(69, 11, 'X-Trail'),
(70, 11, 'Leaf'),
(71, 12, 'Serie 1'),
(72, 12, 'Serie 2'),
(73, 12, 'Serie 3'),
(74, 12, 'Serie 5'),
(75, 12, 'Serie 7'),
(76, 12, 'X1'),
(77, 12, 'X3'),
(78, 12, 'X5'),
(79, 12, 'i3'),
(80, 12, 'iX'),
(81, 13, 'Clase A'),
(82, 13, 'Clase B'),
(83, 13, 'Clase C'),
(84, 13, 'Clase E'),
(85, 13, 'Clase S'),
(86, 13, 'GLA'),
(87, 13, 'GLC'),
(88, 13, 'GLE'),
(89, 14, 'A1'),
(90, 14, 'A3'),
(91, 14, 'A4'),
(92, 14, 'A6'),
(93, 14, 'Q2'),
(94, 14, 'Q3'),
(95, 14, 'Q5'),
(96, 14, 'Q7'),
(97, 15, 'Fabia'),
(98, 15, 'Octavia'),
(99, 15, 'Superb'),
(100, 15, 'Karoq'),
(101, 15, 'Kodiaq'),
(102, 16, 'Jazz'),
(103, 16, 'Civic'),
(104, 16, 'Accord'),
(105, 16, 'CR-V'),
(106, 16, 'HR-V'),
(107, 17, '500'),
(108, 17, 'Panda'),
(109, 17, 'Tipo'),
(110, 17, '500X'),
(111, 17, '500L'),
(112, 17, 'Doblo'),
(113, 18, 'Mazda2'),
(114, 18, 'Mazda3'),
(115, 18, 'Mazda6'),
(116, 18, 'CX-3'),
(117, 18, 'CX-5'),
(118, 19, 'Sandero'),
(119, 19, 'Logan'),
(120, 19, 'Duster'),
(121, 19, 'Lodgy'),
(122, 19, 'Spring'),
(123, 20, 'Wrangler'),
(124, 20, 'Renegade'),
(125, 20, 'Compass'),
(126, 20, 'Cherokee'),
(127, 20, 'Grand Cherokee'),
(128, 21, 'CT'),
(129, 21, 'IS'),
(130, 21, 'ES'),
(131, 21, 'NX'),
(132, 21, 'RX'),
(133, 21, 'UX'),
(134, 22, 'XC40'),
(135, 22, 'XC60'),
(136, 22, 'XC90'),
(137, 22, 'S60'),
(138, 22, 'S90'),
(139, 22, 'V60'),
(140, 22, 'V90'),
(141, 23, 'Model 3'),
(142, 23, 'Model S'),
(143, 23, 'Model X'),
(144, 23, 'Model Y'),
(145, 24, 'Formentor'),
(146, 24, 'Leon'),
(147, 24, 'Ateca'),
(148, 24, 'Born'),
(149, 25, 'MG ZS'),
(150, 25, 'MG HS'),
(151, 25, 'MG EHS'),
(152, 25, 'MG5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `provincia`
--

INSERT INTO `provincia` (`id`, `nombre`) VALUES
(1, 'A Coruña'),
(2, 'Álava'),
(3, 'Albacete'),
(4, 'Alicante'),
(5, 'Almería'),
(6, 'Asturias'),
(7, 'Ávila'),
(8, 'Badajoz'),
(9, 'Barcelona'),
(10, 'Burgos'),
(11, 'Cáceres'),
(12, 'Cádiz'),
(13, 'Cantabria'),
(14, 'Castellón'),
(15, 'Ciudad Real'),
(16, 'Córdoba'),
(17, 'Cuenca'),
(18, 'Girona'),
(19, 'Granada'),
(20, 'Guadalajara'),
(21, 'Guipúzcoa'),
(22, 'Huelva'),
(23, 'Huesca'),
(24, 'Islas Baleares'),
(25, 'Jaén'),
(26, 'La Rioja'),
(27, 'Las Palmas'),
(28, 'León'),
(29, 'Lleida'),
(30, 'Lugo'),
(31, 'Madrid'),
(32, 'Málaga'),
(33, 'Murcia'),
(34, 'Navarra'),
(35, 'Ourense'),
(36, 'Palencia'),
(37, 'Pontevedra'),
(38, 'Salamanca'),
(39, 'Santa Cruz de Tenerife'),
(40, 'Segovia'),
(41, 'Sevilla'),
(42, 'Soria'),
(43, 'Tarragona'),
(44, 'Teruel'),
(45, 'Toledo'),
(46, 'Valencia'),
(47, 'Valladolid'),
(48, 'Vizcaya'),
(49, 'Zamora'),
(50, 'Zaragoza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reparaciones`
--

CREATE TABLE `reparaciones` (
  `id` int(11) NOT NULL,
  `mecanico_id` int(11) DEFAULT NULL,
  `coche_id` int(11) DEFAULT NULL,
  `estado` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taller`
--

CREATE TABLE `taller` (
  `id` int(11) NOT NULL,
  `provincia_id` int(11) DEFAULT NULL,
  `direccion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `telefono` varchar(200) NOT NULL,
  `dni` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellidos`, `email`, `password`, `telefono`, `dni`) VALUES
(1, 'Juan', 'Pérez García', 'juan.perez@example.com', 'password123', '600111222', '12345678A'),
(2, 'María', 'López Sánchez', 'maria.lopez@example.com', 'password456', '600333444', '23456789B'),
(3, 'Carlos', 'Gómez Fernández', 'carlos.gomez@example.com', 'password789', '600555666', '34567890C'),
(4, 'Ana', 'Martínez Ruiz', 'ana.martinez@example.com', 'passwordabc', '600777888', '45678901D'),
(5, 'Luis', 'Hernández López', 'luis.hernandez@example.com', 'passworddef', '600999000', '56789012E');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_44F9A5216DC343EA` (`taller_id`);

--
-- Indices de la tabla `coche`
--
ALTER TABLE `coche`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_A1981CD4DB38439E` (`usuario_id`),
  ADD KEY `IDX_A1981CD481EF0041` (`marca_id`);

--
-- Indices de la tabla `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mecanico`
--
ALTER TABLE `mecanico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D2521E7A48DFEBB7` (`administrador_id`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F0D76C4681EF0041` (`marca_id`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_60AF46E6E032763` (`mecanico_id`),
  ADD KEY `IDX_60AF46EF4621E56` (`coche_id`);

--
-- Indices de la tabla `taller`
--
ALTER TABLE `taller`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_139F45844E7121AF` (`provincia_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `coche`
--
ALTER TABLE `coche`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `mecanico`
--
ALTER TABLE `mecanico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modelo`
--
ALTER TABLE `modelo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `taller`
--
ALTER TABLE `taller`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `FK_44F9A5216DC343EA` FOREIGN KEY (`taller_id`) REFERENCES `taller` (`id`);

--
-- Filtros para la tabla `coche`
--
ALTER TABLE `coche`
  ADD CONSTRAINT `FK_A1981CD481EF0041` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`),
  ADD CONSTRAINT `FK_A1981CD4DB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `mecanico`
--
ALTER TABLE `mecanico`
  ADD CONSTRAINT `FK_D2521E7A48DFEBB7` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`);

--
-- Filtros para la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD CONSTRAINT `FK_F0D76C4681EF0041` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`);

--
-- Filtros para la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  ADD CONSTRAINT `FK_60AF46E6E032763` FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`),
  ADD CONSTRAINT `FK_60AF46EF4621E56` FOREIGN KEY (`coche_id`) REFERENCES `coche` (`id`);

--
-- Filtros para la tabla `taller`
--
ALTER TABLE `taller`
  ADD CONSTRAINT `FK_139F45844E7121AF` FOREIGN KEY (`provincia_id`) REFERENCES `provincia` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
