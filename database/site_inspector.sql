-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2024 at 05:04 PM
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
  `fail_text` varchar(255) NOT NULL,
  `action_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkpoint`
--

INSERT INTO `checkpoint` (`id`, `name`, `information`, `pass_text`, `fail_text`, `action_text`) VALUES
(1, 'Swell Height', 'How is the swell height?', 'Big', 'Small', ''),
(2, 'Swell Period', 'How is the swell period?', 'Long', 'Short', ''),
(3, 'Wind Direction', 'What is the wind direction?', 'Offshore', 'Onshore', ''),
(4, 'Wind Speed', 'How is the wind speed?', 'Slow', 'Fast', ''),
(7, 'Crowded', 'How many people are out there?', 'No', 'Yes', 'Scared people away'),
(8, 'Lost Equipment', 'Is there any lost equipment found on the beach or parking lot?', 'No', 'Yes', 'Returned equipment');

-- --------------------------------------------------------

--
-- Table structure for table `inspection`
--

CREATE TABLE `inspection` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `date_time_edit` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `information` text NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspection`
--

INSERT INTO `inspection` (`id`, `site_id`, `date_time`, `date_time_edit`, `information`, `user_name`, `user_id`) VALUES
(2, 1, '2024-04-14 00:00:00', '2024-04-15 20:08:57', 'First inspection.', 'Mason Ford', '1'),
(3, 8, '2024-04-14 00:00:00', '2024-04-14 19:07:31', 'Late afternoon', 'Mason Ford', '1'),
(8, 6, '2024-04-12 00:00:00', '2024-04-14 20:30:43', 'Inspect cox', 'Mason Ford', '1'),
(9, 2, '2024-04-01 00:00:00', '2024-04-14 20:46:25', 'Old', 'Mason Ford', '1'),
(10, 1, '2024-04-16 00:00:00', '2024-04-15 20:08:45', 'Future inspection.', 'Mason Ford', '1');

-- --------------------------------------------------------

--
-- Table structure for table `inspection_checkpoint`
--

CREATE TABLE `inspection_checkpoint` (
  `id` int(11) NOT NULL,
  `inspection_id` int(11) NOT NULL,
  `checkpoint_id` int(11) NOT NULL,
  `result` int(1) NOT NULL,
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspection_checkpoint`
--

INSERT INTO `inspection_checkpoint` (`id`, `inspection_id`, `checkpoint_id`, `result`, `note`) VALUES
(6, 3, 7, 0, 'Lots of people'),
(7, 3, 1, 0, 'Small, as usual for summer'),
(8, 3, 2, 0, 'Long swell period though with south swell'),
(9, 3, 3, 0, 'Nice offshore'),
(10, 3, 4, 0, 'Slow wind speed'),
(116, 8, 7, 1, 'Always'),
(117, 8, 8, 2, ''),
(118, 8, 1, 2, 'Barrels'),
(119, 8, 2, 2, 'Lines'),
(120, 8, 3, 2, 'Clean'),
(121, 8, 4, 1, 'Gusty'),
(122, 9, 7, 2, ''),
(123, 9, 8, 3, 'Found glove and was returned.'),
(124, 9, 1, 2, ''),
(125, 9, 2, 2, ''),
(126, 9, 3, 2, ''),
(127, 9, 4, 2, ''),
(203, 10, 7, 3, 'Scared lots of people.'),
(204, 10, 8, 3, 'Returned a board someone left behind.'),
(205, 10, 1, 2, ''),
(206, 10, 2, 2, ''),
(207, 10, 3, 1, ''),
(208, 10, 4, 1, ''),
(209, 2, 7, 3, ''),
(210, 2, 1, 2, ''),
(211, 2, 2, 2, ''),
(212, 2, 3, 1, ''),
(213, 2, 4, 0, '');

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
-- Indexes for table `inspection_checkpoint`
--
ALTER TABLE `inspection_checkpoint`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Checkpoint` (`checkpoint_id`),
  ADD KEY `Inspection Checkpoint` (`inspection_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `inspection`
--
ALTER TABLE `inspection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `inspection_checkpoint`
--
ALTER TABLE `inspection_checkpoint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- AUTO_INCREMENT for table `site`
--
ALTER TABLE `site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `site_contact`
--
ALTER TABLE `site_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inspection`
--
ALTER TABLE `inspection`
  ADD CONSTRAINT `Inspection` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`);

--
-- Constraints for table `inspection_checkpoint`
--
ALTER TABLE `inspection_checkpoint`
  ADD CONSTRAINT `Checkpoint` FOREIGN KEY (`checkpoint_id`) REFERENCES `checkpoint` (`id`),
  ADD CONSTRAINT `Inspection Checkpoint` FOREIGN KEY (`inspection_id`) REFERENCES `inspection` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
