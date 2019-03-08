-- Data Definiton Queries for the Employee Recognition
--
--
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `awardType`;
DROP TABLE IF EXISTS `awardGiven`;
SET foreign_key_checks = 1;

-- Table structure for table `user`

CREATE TABLE `user` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `userClass` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(100) NOT NULL,
  `signature` varchar(100) NOT NULL,
  `accountCreated` TIMESTAMP NOT NULL,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `awardType`
--

CREATE TABLE `awardType` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `employees`
--

CREATE TABLE `employee` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `awardGiven`
--

CREATE TABLE `awardGiven` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `awardTypeID` int(255) NOT NULL,
  `recipientID` int(255) NOT NULL,
  `creatorID` int(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`awardTypeID`) REFERENCES awardType(id),
  FOREIGN KEY (`recipientID`) REFERENCES employee(id),
  FOREIGN KEY (`creatorID`) REFERENCES user(id)
) ENGINE=InnoDB;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`firstName`, `lastName`, `userClass`, `email`, `password`, `signature`) VALUES
('Indiana', 'Jones', 'administrator', 'IndianaJones@rocks.com', 'indianajones', 'indianajonessignature.jpg'),
('Jared', 'Goff', 'nonadministrator', 'jaredgoff@beatthepatriots.com', 'jaredgoff', 'jaredgoffsignature.jpg'),
('Steve', 'Rogers', 'nonadministrator', 'steverogers@captainamerica.com', 'steverogers', 'steverogerssignature.jpg');

--
-- Dumping data for table `awardType`
--

INSERT INTO `awardType` (`name`, `description`) VALUES
('Employee of the Month', 'Award given to the employee of the month'),
('Employee of the Year', 'Award given to the employee of the week'),
('Highest Sales in a Month', 'Award given to employee who sold the most products');

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`firstName`, `lastName`, `email`) VALUES
('Bob', 'Roberts', '1@fakeemail.com'),
('Steve', 'Roberts', '2@fakeemail.com'),
('Jenny', 'Davidson', '3@fakeemail.com'),
('Daryl', 'Guy', '4@fakeemail.com'),
('Eric', 'Davidson', '5@fakeemail.com'),
('Mark', 'Wahlberg', '6@fakeemail.com'),
('Derrick', 'Guy', '7@fakeemail.com');

--
-- Dumping data for table `awardGiven`
--

INSERT INTO `awardGiven` (`awardTypeID`, `recipientID`, `creatorID`, `date`, `time`) VALUES
(2, 2, 2, '2018-01-01', '15:00:00'),
(1, 2, 2, '2018-01-31', '15:00:00'),
(3, 6, 3, '2018-02-01', '15:00:00'),
(1, 7, 1, '2018-03-01', '15:00:00'),
(1, 1, 1, '2018-03-15', '15:00:00'),
(1, 3, 2, '2018-04-01', '15:00:00'),
(3, 4, 2, '2018-05-01', '15:00:00'),
(3, 5, 3, '2018-06-01', '15:00:00'),
(1, 3, 3, '2018-06-08', '15:00:00'),
(1, 2, 3, '2018-07-01', '15:00:00'),
(1, 6, 3, '2018-08-01', '15:00:00'),
(3, 1, 3, '2018-09-01', '15:00:00'),
(1, 5, 3, '2018-10-01', '15:00:00'),
(1, 5, 1, '2018-11-01', '15:00:00'),
(1, 5, 1, '2018-12-01', '15:00:00');