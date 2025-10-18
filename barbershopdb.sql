-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2025 at 01:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barbershopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `borbelyok`
--

CREATE TABLE `borbelyok` (
  `id` int(255) NOT NULL,
  `nev` varchar(75) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglalas`
--

CREATE TABLE `foglalas` (
  `vasarloNeve` varchar(255) NOT NULL,
  `vasarloEmail` varchar(255) NOT NULL,
  `idopont` datetime NOT NULL,
  `borbely` varchar(255) NOT NULL,
  `borbelyEmail` varchar(255) NOT NULL,
  `szolgaltatas` varchar(255) NOT NULL,
  `ar` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rendelesek`
--

CREATE TABLE `rendelesek` (
  `id` int(255) NOT NULL,
  `vasarloNeve` varchar(75) NOT NULL,
  `vasarloEmail` varchar(255) NOT NULL,
  `telefonszam` int(11) NOT NULL,
  `iranyitoszam` int(4) NOT NULL,
  `telepules` varchar(255) NOT NULL,
  `szallitasicim` varchar(255) NOT NULL,
  `rendelesideje` datetime NOT NULL,
  `termekekNeve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `temekek`
--

CREATE TABLE `temekek` (
  `id` int(255) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `kep` varchar(255) NOT NULL,
  `leiras` int(255) NOT NULL,
  `ar` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `nev` varchar(75) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borbelyok`
--
ALTER TABLE `borbelyok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `foglalas`
--
ALTER TABLE `foglalas`
  ADD UNIQUE KEY `vasarloEmail` (`vasarloEmail`),
  ADD UNIQUE KEY `vasarloNeve` (`vasarloNeve`),
  ADD UNIQUE KEY `borbely` (`borbely`),
  ADD UNIQUE KEY `borbelyEmail` (`borbelyEmail`);

--
-- Indexes for table `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vasarloNeve` (`vasarloNeve`),
  ADD UNIQUE KEY `vasarloEmail` (`vasarloEmail`);

--
-- Indexes for table `temekek`
--
ALTER TABLE `temekek`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`nev`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borbelyok`
--
ALTER TABLE `borbelyok`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `temekek`
--
ALTER TABLE `temekek`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `foglalas`
--
ALTER TABLE `foglalas`
  ADD CONSTRAINT `foglalas_ibfk_1` FOREIGN KEY (`vasarloNeve`) REFERENCES `users` (`nev`),
  ADD CONSTRAINT `foglalas_ibfk_2` FOREIGN KEY (`vasarloEmail`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `foglalas_ibfk_3` FOREIGN KEY (`borbely`) REFERENCES `borbelyok` (`nev`),
  ADD CONSTRAINT `foglalas_ibfk_4` FOREIGN KEY (`borbelyEmail`) REFERENCES `borbelyok` (`email`);

--
-- Constraints for table `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD CONSTRAINT `rendelesek_ibfk_1` FOREIGN KEY (`vasarloNeve`) REFERENCES `users` (`nev`),
  ADD CONSTRAINT `rendelesek_ibfk_2` FOREIGN KEY (`vasarloEmail`) REFERENCES `users` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
