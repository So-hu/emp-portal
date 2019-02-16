-- Data Definiton Queries for the Employee Recognition
--
--
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `awardType`;
DROP TABLE IF EXISTS `awardType`;

-- Table structure for table `user`

CREATE TABLE `user` (
  `userID` int(255) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `signature` varchar(100) NOT NULL,
  `accountCreated` TIMESTAMP NOT NULL,
  PRIMARY KEY(`userID`)
) ENGINE=InnoDB;

--
-- Table structure for table `awardType`
--

CREATE TABLE `awardType` (
  `awardTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY(`awardTypeID`)
) ENGINE=InnoDB;

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `groupID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY(`groupID`)
) ENGINE=InnoDB;

--
-- Table structure for table `user_groups`
--

CREATE TABLE `user_groups` (
  `userID` int(11),
  `groupID` int(11),
  PRIMARY KEY(`userID`, `groupID`)
  CONSTRAINT user_group_fk1 FOREIGN KEY (userID) REFERENCES user (userID) ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Table structure for table `awardGiven`
--

CREATE TABLE `awardGiven` (
  `awardGivenID` int(255) NOT NULL AUTO_INCREMENT,
  `awardTypeID` int(255) NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `time` VARCHAR(20),
  `nameID` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `userEmail` VARCHAR(100) NOT NULL,
  `creatorID` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`awardGivenID`),
  FOREIGN KEY (`awardTypeID`) REFERENCES awardType(awardTypeID),
  FOREIGN KEY (`creatorID`) REFERENCES user(userID)
) ENGINE=InnoDB;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`firstName`, `lastName`, `email`, `password`, `signature`) VALUES
('Indiana', 'Jones', 'IndianaJones@rocks.com', 'indianajones', 'indianajonessignature.jpg'),
('Jared', 'Goff', 'jaredgoff@beatthepatriots.com', 'jaredgoff', 'jaredgoffsignature.jpg'),
('Steve', 'Rogers', 'steverogers@captainamerica.com', 'steverogers', 'steverogerssignature.jpg');

--
-- Dumping data for table `awardType`
--

INSERT INTO `awardType` (`name`, `description`) VALUES
('Employee of the Month', 'Award given to the employee of the month'),
('Employee of the Year', 'Award given to the employee of the week'),
('Highest Sales in a Month', 'Award given to employee who sold the most products');

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`name`, `description`) VALUES
('Admin', 'Admin account - cannot give out awards but can modify the awards can be given'),
('Supervisor', 'Can hand out awards'),
('Sales', 'Works for sales department');

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`userID`, `groupID`) VALUES
(3, 1),
(1, 2),
(2, 3);

--
-- Dumping data for table `awardGiven`
--

INSERT INTO `awardGiven` (`awardGivenID`, `awardTypeID`, `month`, `day`, `year`, `firstName`) VALUES
(3, 1),
(1, 2),
(2, 3);


