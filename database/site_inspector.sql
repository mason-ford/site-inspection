-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2024 at 03:10 AM
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
-- Table structure for table `checkpoint`
--

CREATE TABLE `checkpoint` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `information` text NOT NULL,
  `pass_text` varchar(255) NOT NULL,
  `fail_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkpoint`
--

INSERT INTO `checkpoint` (`id`, `name`, `information`, `pass_text`, `fail_text`) VALUES
(1, 'Wave Height', 'How is the swell wave height?', 'Big', 'Small'),
(2, 'Swell Period', 'How is the swell period?', 'Long', 'Short'),
(3, 'Wind Direction', 'What is the wind direction?', 'Offshore', 'Onshore'),
(4, 'Wind Speed', 'How is the wind speed?', 'Fast', 'Slow');

-- --------------------------------------------------------

--
-- Table structure for table `inspection`
--

CREATE TABLE `inspection` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inspection_checkpoint`
--

CREATE TABLE `inspection_checkpoint` (
  `id` int(11) NOT NULL,
  `inspection_id` int(11) NOT NULL,
  `result` int(1) NOT NULL,
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 'Florencia', 'FLO', 102, 'National Park', 0x0000000001010000007c2c7de882695fc01a31b3cf63804840, 0, 'Red key', 'National park, need to pay'),
(6, 'Cox Bay', 'COX', 201, 'Tofino', 0x0000000001010000008d0a9c6c03785fc06d0377a04e8d4840, 1, 'Standard Key', 'Go to the bay'),
(7, 'South Chesterman', 'SCHN', 202, 'South chesterman road', 0x000000000101000000e44c13b69f785fc0c74b3789418e4840, 1, 'Standard Key', 'Through the path'),
(8, 'North Chesterman', 'NCHN', 203, '1360 Lynn Rd, Tofino, BC V0R 2Z0', 0x000000000101000000f4a44c6a68795fc06d8e739b708f4840, 0, 'Purple Key', 'Drive to the parking lot then walk down the path onto the beach.');

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
(2, 1, 'Vehicle', '100mm x 100mm x 20mm', 10, 'Toyota Tundra air filter.'),
(4, 2, 'asdf', 'asdf', 0, 'asdf'),
(5, 7, 'Ventilation', '1', 10, 'On the roof'),
(6, 7, 'asdf', 'asdf', 0, 'asdf'),
(10, 6, 'Buildling Vent', '20x20x5', 1, 'Building vent air filter, located on the southwest side of the building.'),
(11, 8, 'Building Vent', '10\" x 10\" x 2\"', 1, 'Building vent air filter, vent located on the north side of the building.');

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
  `information` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_contact`
--

INSERT INTO `site_contact` (`id`, `site_id`, `name`, `number`, `email`, `information`) VALUES
(1, 1, 'Mason Ford', '7786785942', 'forddmason@gmail.com', 'Primary'),
(6, 1, 'Emily Ford', '7786785942', 'mahikandford@gmail.com', 'Secondary'),
(7, 6, 'asdf', '1234', 'asdf', 'asdfasdfasdfasdf'),
(8, 6, 'Mason', '0123481981', 'forddmason@gmail.com', 'hgjkershstrdehjfdjhtsgh'),
(9, 1, 'Mahikan Ford', '12345678', 'mf@gmail.com ', 'asdflkjasgfoihwqeli;tfnasl.kfbnvasdgf'),
(10, 8, 'John John Florence', '6176505144', 'jjflo@gmail.com', 'Primary Contact');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkpoint`
--
ALTER TABLE `checkpoint`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inspection`
--
ALTER TABLE `inspection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Inspection` (`site_id`);

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
-- AUTO_INCREMENT for table `checkpoint`
--
ALTER TABLE `checkpoint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inspection`
--
ALTER TABLE `inspection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site`
--
ALTER TABLE `site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `site_contact`
--
ALTER TABLE `site_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inspection`
--
ALTER TABLE `inspection`
  ADD CONSTRAINT `Inspection` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`);

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
