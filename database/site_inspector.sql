-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: awseb-e-5kvuknhzpz-stack-awsebrdsdatabase-fbbofola8cgy.c1kgqc2us2f7.us-east-2.rds.amazonaws.com
-- Generation Time: Jul 07, 2024 at 02:54 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ebdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkpoint`
--

CREATE TABLE `checkpoint` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `information` text COLLATE utf8mb4_general_ci NOT NULL,
  `pass_text` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fail_text` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `action_text` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
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
  `id` int NOT NULL,
  `site_id` int NOT NULL,
  `date_time` datetime NOT NULL,
  `date_time_edit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `information` text COLLATE utf8mb4_general_ci NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspection`
--

INSERT INTO `inspection` (`id`, `site_id`, `date_time`, `date_time_edit`, `information`, `user_name`, `user_id`) VALUES
(2, 1, '2024-04-14 00:00:00', '2024-04-15 20:08:57', 'First inspection.', 'John Doe', '1'),
(3, 8, '2024-04-14 00:00:00', '2024-04-14 19:07:31', 'Late afternoon', 'John Doe', '1'),
(8, 6, '2024-04-12 00:00:00', '2024-04-14 20:30:43', 'Inspect cox', 'John Doe', '1'),
(9, 2, '2024-04-01 00:00:00', '2024-04-14 20:46:25', 'Old', 'John Doe', '1'),
(10, 1, '2024-04-16 00:00:00', '2024-04-15 20:08:45', 'Future inspection.', 'John Doe', '1'),
(11, 10, '2024-04-16 00:00:00', '2024-04-16 17:13:33', 'Went to Long Beach as I was passing by on my way to Tofino to check the surf.', 'John Doe', '1'),
(14, 7, '2024-04-16 00:00:00', '2024-04-16 21:56:08', 'cloudy dusty', 'John Doe', '1'),
(23, 10, '2024-04-16 00:00:00', '2024-04-17 01:13:28', 'S3 and RDS photos, almost working.', 'John Doe', '1'),
(26, 6, '2024-04-30 00:00:00', '2024-04-30 22:19:00', 'New Inspection, everything good.', 'John Doe', '1'),
(27, 2, '2024-05-02 00:00:00', '2024-05-15 00:10:18', '', 'John Doe', '1'),
(28, 8, '2024-05-04 00:00:00', '2024-05-15 00:11:05', '', 'John Doe', '1'),
(29, 10, '2024-05-04 00:00:00', '2024-05-15 00:11:26', '', 'John Doe', '1'),
(30, 1, '2024-05-02 00:00:00', '2024-05-15 00:11:44', '', 'John Doe', '1'),
(31, 10, '2024-05-06 00:00:00', '2024-05-15 17:19:19', 'Long beach inspection with all options', 'John Doe', '1'),
(32, 10, '2024-05-09 00:00:00', '2024-05-17 03:57:16', '', 'John Doe', '1'),
(33, 1, '2024-05-16 00:00:00', '2024-05-17 04:10:23', '', 'John Doe', '1');

-- --------------------------------------------------------

--
-- Table structure for table `inspection_checkpoint`
--

CREATE TABLE `inspection_checkpoint` (
  `id` int NOT NULL,
  `inspection_id` int NOT NULL,
  `checkpoint_id` int NOT NULL,
  `result` int NOT NULL,
  `note` text COLLATE utf8mb4_general_ci NOT NULL
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
(213, 2, 4, 0, ''),
(214, 11, 7, 2, 'Tuesday so not many people out.'),
(215, 11, 8, 2, ''),
(216, 11, 1, 1, 'Small waves.'),
(217, 11, 2, 1, 'No ground swell.'),
(218, 11, 3, 2, 'Nice offshore breeze'),
(219, 11, 4, 2, ''),
(232, 14, 7, 1, 'jibaway'),
(233, 14, 8, 0, ''),
(234, 14, 1, 0, ''),
(235, 14, 2, 0, ''),
(236, 14, 3, 0, ''),
(237, 14, 4, 0, ''),
(304, 23, 7, 0, ''),
(305, 23, 8, 0, ''),
(306, 23, 1, 0, ''),
(307, 23, 2, 2, ''),
(308, 23, 3, 0, ''),
(309, 23, 4, 0, ''),
(316, 26, 7, 2, ''),
(317, 26, 8, 2, ''),
(318, 26, 1, 2, ''),
(319, 26, 2, 2, ''),
(320, 26, 3, 2, ''),
(321, 26, 4, 2, ''),
(322, 27, 7, 1, ''),
(323, 27, 8, 1, ''),
(324, 27, 1, 1, ''),
(325, 27, 2, 2, ''),
(326, 27, 3, 2, ''),
(327, 27, 4, 2, ''),
(328, 28, 7, 2, ''),
(329, 28, 8, 2, ''),
(330, 28, 1, 2, ''),
(331, 28, 2, 2, ''),
(332, 28, 3, 2, ''),
(333, 28, 4, 0, ''),
(334, 29, 7, 1, ''),
(335, 29, 8, 2, ''),
(336, 29, 1, 2, ''),
(337, 29, 2, 0, ''),
(338, 29, 3, 0, ''),
(339, 29, 4, 0, ''),
(340, 30, 7, 2, ''),
(341, 30, 8, 2, ''),
(342, 30, 1, 1, ''),
(343, 30, 2, 1, ''),
(344, 30, 3, 1, ''),
(345, 30, 4, 1, ''),
(352, 31, 7, 3, 'Scared people away'),
(353, 31, 8, 1, 'Yes'),
(354, 31, 1, 2, 'Big'),
(355, 31, 2, 0, 'N/A'),
(356, 31, 3, 1, 'Onshore'),
(357, 31, 4, 2, 'Slow'),
(358, 32, 7, 1, ''),
(359, 32, 8, 3, ''),
(360, 32, 1, 2, ''),
(361, 32, 2, 2, ''),
(362, 32, 3, 2, ''),
(363, 32, 4, 2, ''),
(364, 33, 7, 0, ''),
(365, 33, 8, 0, ''),
(366, 33, 1, 0, ''),
(367, 33, 2, 0, ''),
(368, 33, 3, 0, ''),
(369, 33, 4, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int NOT NULL,
  `filename` varchar(255) NOT NULL,
  `inspection_checkpoint_id` int DEFAULT NULL,
  `site_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `filename`, `inspection_checkpoint_id`, `site_id`) VALUES
(2, '2-0.jpeg', 23, NULL),
(3, '7-0.jpg', 25, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site`
--

CREATE TABLE `site` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `acronym` varchar(4) COLLATE utf8mb4_general_ci NOT NULL,
  `number` int NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `latlong` point NOT NULL,
  `standard_key` tinyint(1) NOT NULL,
  `key_instructions` text COLLATE utf8mb4_general_ci NOT NULL,
  `access_instructions` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site`
--

INSERT INTO `site` (`id`, `name`, `acronym`, `number`, `address`, `latlong`, `standard_key`, `key_instructions`, `access_instructions`) VALUES
(1, 'Wickaninnish ', 'WICK', 101, 'Pacific Rim National Park - Wickaninnish Beach', 0x00000000010100000079aeefc3416b5fc0baf59a1e14824840, 1, 'Standard', '1. Go to Pacific Rim National Park \r\n2. Turn off at Wickanninish and Florencia exit\r\n3. Keep going past Florencia exit\r\n4. Turn right at the bottom of the hill\r\n3. Walk through paths onto beach'),
(2, 'Florencia', 'FLO', 102, 'Pacific Rim National Park - Florencia Beach', 0x0000000001010000007c2c7de882695fc01a31b3cf63804840, 0, 'Red key', '1. Go to Pacific Rim National Park \r\n2. Turn off at Wickanninish and Florencia exit \r\n3. Turn off at Florencia exit \r\n4. Park at parking lot (end of the road)\r\n3. Walk down path and down steps to beach'),
(6, 'Cox Bay', 'COX', 201, 'Tofino', 0x0000000001010000008d0a9c6c03785fc06d0377a04e8d4840, 1, 'Standard Key', 'Go to the bay'),
(7, 'South Chesterman', 'SCHM', 202, 'South chesterman road', 0x000000000101000000e44c13b69f785fc0c74b3789418e4840, 1, 'Standard Key', 'Through the path'),
(8, 'North Chesterman', 'NCHM', 203, '1360 Lynn Rd, Tofino, BC V0R 2Z0', 0x000000000101000000f4a44c6a68795fc06d8e739b708f4840, 0, 'Purple Key', 'Drive to the parking lot then walk down the path onto the beach.'),
(10, 'Long Beach', 'LNG', 103, 'Pacific Rim National Park - Long Beach', 0x000000000101000000cde9b298d8705fc0b2f1608bdd884840, 0, 'Standard', '1. Go to Pacific Rim National Park\r\n2. Park at either Lovekin or Incinerator Rock parking lots\r\n3. Walk through paths onto beach.');

-- --------------------------------------------------------

--
-- Table structure for table `site_airfilter`
--

CREATE TABLE `site_airfilter` (
  `id` int NOT NULL,
  `site_id` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `information` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_airfilter`
--

INSERT INTO `site_airfilter` (`id`, `site_id`, `type`, `size`, `quantity`, `information`) VALUES
(1, 1, 'Shelter', '8in x 8in x 3in', 2, 'Serial Number: 123456789\r\nManufacturer: Best Air Filters\r\nSupplier: Amazon'),
(2, 1, 'Vehicle', '100mm x 100mm x 20mm', 10, 'Toyota Tundra air filter.'),
(4, 2, 'Bathroom Air Filter', '25x25x5', 1, 'Change often as its an outhouse\r\nModel: STINK-Y'),
(5, 7, 'Ventilation', '1', 10, 'On the roof'),
(6, 7, 'asdf', 'asdf', 0, 'asdf'),
(10, 6, 'Buildling Vent', '20x20x5', 1, 'Building vent air filter, located on the southwest side of the building.'),
(11, 8, 'Building Vent', '10\" x 10\" x 2\"', 1, 'Building vent air filter, vent located on the north side of the building.'),
(14, 10, 'Building Vent', '10x10x10', 1, 'Model: ABCD-XYZ');

-- --------------------------------------------------------

--
-- Table structure for table `site_contact`
--

CREATE TABLE `site_contact` (
  `id` int NOT NULL,
  `site_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `number` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `information` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_contact`
--

INSERT INTO `site_contact` (`id`, `site_id`, `name`, `number`, `email`, `information`) VALUES
(7, 6, 'asdf', '1234', 'asdf', 'asdfasdfasdfasdf'),
(8, 6, 'Mason', '0123481981', 'forddmason@gmail.com', 'hgjkershstrdehjfdjhtsgh'),
(10, 8, 'John John Florence', '6176505144', 'jjflo@gmail.com', 'Primary Contact'),
(12, 10, 'Laird Hamilton', '250-111-22', 'LairdHamilton@gmail.com', 'Laird Hamilton is less famous for his competitive achievements, and more so for his pioneering approaches to surfing big waves. \r\n\r\nLaird famously discovered big wave surf spot Jaws (or Peahi), and caught what\'s known as the \'Millennium Wave\' at Teahupo - quite possibly the most famous image in surfing. \r\n\r\nAlongside that, Laird pioneered tow surfing, being the first to do it at Jaws, opening up a spectrum of waves that had previously been perceived as un-surfable. \r\n\r\nNowadays Laird is well known for his contributions to health and fitness, running elite retreats from his home in Malibu, USA.'),
(13, 1, 'John John Florence', '250-222-33', 'JohnJohnFlorence@wsl.com', 'John John\'s influence on the sport of surfing has been huge, and it\'s been done without being brash, without shouting and shameless self promotion - instead with integrity, honest, and raw talent. Growing up on the North Shore of Oahu, Hawaii, John\'s home break was Pipeline, and he was regularly seen charging huge waves from the early age of 8. And nothing seems to have stopped since then. In his competitive career he as amassed two World Titles and a bunch of other WCT victories too, with many years compromised with injury along the way. Regardless of his competitive accolades it\'s his free surfing that he is most famous for, whether that\'s charging huge waves at Pipeline, or launching monster airs at Backdoor - it\'s here that his biggest impact can be felt. A generational talent, and a surfing icon that will go down in history as one of the top male surfers of all time.'),
(14, 2, 'Stephanie Gilmore', '250-333-44', 'StephanieGilmore@wsl.com', 'Stephanie Gilmore, from the small town of Murwillumbah in New South Wales has arguably had a bigger impact on women\'s surfing than any other surfer in the world. \r\n\r\nAn eight time world champion, she is the most successful female surfer ever on the planet. \r\n\r\nBut her fame and notoriety don\'t just come from her competitive success, far from it, it\'s her style and grace on a wave that has thrust her image onto the walls of young surfers around the planet. \r\n\r\nSteph\'s influence on women\'s surfing cannot be underestimated, helping push the sport into the limelight and inspire a whole generation of young female frothers.');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `information` text,
  `site_id` int NOT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_completed` timestamp NULL DEFAULT NULL,
  `created_by_user_id` int DEFAULT NULL,
  `completed_by_user_id` int DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  `completeInformation` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `information`, `site_id`, `date_created`, `date_completed`, `created_by_user_id`, `completed_by_user_id`, `completed`, `completeInformation`) VALUES
(1, 'Get Surfboard', 'Left a surfboard at Cox I need to retrieve it.', 10, '2024-05-01 00:02:21', '2024-05-16 04:35:54', NULL, NULL, 1, 'Found surfboard!'),
(2, 'Forgot Surfboard', 'For my surfboard at Long Beach, I need to go get it.', 10, '2024-05-01 04:11:08', '2024-05-16 04:37:21', NULL, NULL, 1, 'Found surfboard!'),
(4, 'Test Task', 'asdfasdf', 2, '2024-05-01 04:51:07', NULL, NULL, NULL, 0, 'Completed'),
(5, 'Check Waves', 'Check the wave at South Chesterman', 7, '2024-05-13 22:15:08', NULL, NULL, NULL, 0, NULL),
(6, 'Pay for parking', 'Pay for parking at Wick', 1, '2024-05-16 04:36:36', NULL, NULL, NULL, 0, NULL),
(7, 'Change Tire', 'Change tire on way to Gravel Bar', 1, '2024-05-17 03:55:32', '2024-05-17 03:56:38', NULL, NULL, 1, 'Tire Changed');

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
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `site_id` (`site_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checkpoint`
--
ALTER TABLE `checkpoint`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `inspection`
--
ALTER TABLE `inspection`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `inspection_checkpoint`
--
ALTER TABLE `inspection_checkpoint`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=370;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `site`
--
ALTER TABLE `site`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `site_airfilter`
--
ALTER TABLE `site_airfilter`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `site_contact`
--
ALTER TABLE `site_contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
