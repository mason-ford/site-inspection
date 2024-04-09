-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2024 at 03:37 AM
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
-- Database: `site_inspector`
--

-- --------------------------------------------------------

--
-- Table structure for table `site`
--

CREATE TABLE `site` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `acronym` varchar(4) NOT NULL,
  `number` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latlong` point NOT NULL,
  `standard_key` tinyint(1) NOT NULL,
  `key_instructions` text NOT NULL,
  `access_instructions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site`
--

INSERT INTO `site` (`id`, `name`, `acronym`, `number`, `address`, `latlong`, `standard_key`, `key_instructions`, `access_instructions`) VALUES
(1, 'Wickaninnish', 'WICK', 101, 'Park', 0x00000000010100000079aeefc3416b5fc0baf59a1e14824840, 1, 'Standard', 'Go to park'),
(2, 'Florencia', 'FLO', 102, 'National Park', 0x0000000001010000007c2c7de882695fc01a31b3cf63804840, 1, 'Standard Key', 'National park, need to pay'),
(6, 'Cox Bay', 'COX', 201, 'Tofino', 0x0000000001010000008d0a9c6c03785fc06d0377a04e8d4840, 1, 'Standard Key', 'Go to the bay'),
(7, 'South Chesterman', 'SCHN', 202, 'South chesterman road', 0x000000000101000000e44c13b69f785fc0c74b3789418e4840, 1, 'Standard Key', 'Through the path');

-- --------------------------------------------------------

--
-- Table structure for table `site_airfilter`
--

CREATE TABLE `site_airfilter` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `information` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_airfilter`
--

INSERT INTO `site_airfilter` (`id`, `site_id`, `type`, `size`, `quantity`, `information`) VALUES
(1, 1, 'Shelter', '8in x 8in x 3in', 2, 'Serial Number: 123456789\r\nManufacturer: Best Air Filters\r\nSupplier: Amazon'),
(2, 1, 'vehicle', '304', 0, 'asdf'),
(3, 1, 'asdf', 'asdf', 0, 'asdf'),
(4, 2, 'asdf', 'asdf', 0, 'asdf'),
(5, 7, 'Ventilation', '1', 10, 'On the roof'),
(6, 7, 'asdf', 'asdf', 0, 'asdf');

-- --------------------------------------------------------

--
-- Table structure for table `site_contact`
--

CREATE TABLE `site_contact` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `number` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_contact`
--

INSERT INTO `site_contact` (`id`, `site_id`, `name`, `number`, `email`, `info`) VALUES
(1, 1, 'Mason Ford', '7786785942', 'forddmason@gmail.com', 'Primary'),
(6, 1, 'Mahikan Ford', '7786785942', 'mahikandford@gmail.com', 'Secondary');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SiteAirFilter` (`site_id`);

--
-- Indexes for table `site_contact`
--
ALTER TABLE `site_contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SiteContact` (`site_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `site`
--
ALTER TABLE `site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `site_contact`
--
ALTER TABLE `site_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  ADD CONSTRAINT `SiteAirFilter` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `site_contact`
--
ALTER TABLE `site_contact`
  ADD CONSTRAINT `SiteContact` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
