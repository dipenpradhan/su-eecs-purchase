-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 16, 2015 at 11:30 PM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecs`
--

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `req_no` varchar(255) NOT NULL,
  `delivery_address` varchar(500) NOT NULL,
  `delivery_attn` varchar(500) NOT NULL,
  `chartstrings` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `approval_items`
--

CREATE TABLE `approval_items` (
  `id` int(11) NOT NULL,
  `approval_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_no` int(11) NOT NULL,
  `fund` double(10,2) NOT NULL,
  `dept` varchar(255) NOT NULL,
  `program` varchar(255) NOT NULL,
  `acct` varchar(255) NOT NULL,
  `project` varchar(255) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `bud_ref` varchar(255) NOT NULL,
  `dept_auth_sign` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('pending','processed','ack','cancelled') NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_email` varchar(255) DEFAULT NULL,
  `prof_name` varchar(255) NOT NULL,
  `prof_email` varchar(255) NOT NULL,
  `vendor` varchar(500) NOT NULL,
  `date_needed` date NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_type` enum('student','professor') NOT NULL,
  `total_price` double(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_product`
--

CREATE TABLE `order_product` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_no` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `description` text NOT NULL,
  `purpose` text NOT NULL,
  `unit_price` double NOT NULL,
  `total_price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `inventory` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` set('professor','student','admin','approver','reviewer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `type`) VALUES
(1, 'dipenpradhan13@gmail.com', 'test', 'Tester', 'professor,student,admin,approver,reviewer'),
(2, 'esyu@syr.edu', '', 'Yu, Edmund', 'professor'),
(3, 'heyinWang@syr.edu', '', 'Yin, Heng', 'professor'),
(4, 'svelipas@syr.edu', '', 'Velipasalar, Senem', 'professor'),
(5, 'varshney@syr.edu', '', 'Varshney, Pramod', 'professor'),
(6, 'wctetley@syr.edu', '', 'Tetley, William', 'professor'),
(7, 'jtang02@syr.edu', '', 'Tang, Jian', 'professor'),
(8, 'ytang100@syr.edu', '', 'Tang, Yuzhe', 'professor'),
(9, 'susounda@syr.edu', '', 'Soundarajan, Sucheta', 'professor'),
(10, 'schleret@syr.edu', '', 'Schlereth, Fred', 'professor'),
(11, 'tksarkar@syr.edu', '', 'Sarkar, Tapan', 'professor'),
(12, 'jsroyer@syr.edu', '', 'Royer, James', 'professor'),
(13, 'qiqiu@syr.edu', '', 'Qiu, Qinru', 'professor'),
(14, 'vvphoha@syr.edu', '', 'Phoha, Vir', 'professor'),
(15, 'jcoh@syr.edu', '', 'Oh, Jae', 'professor'),
(16, 'sbolder@syr.edu', '', 'Older, Susan', 'professor'),
(17, 'ckmohan@syr.edu', '', 'Mohan, Chilukuri', 'professor'),
(18, 'mehrotra@syr.edu', '', 'Mehrotra, Kishan', 'professor'),
(19, 'dlmarcy@syr.edu', '', 'Marcy, Duane', 'professor'),
(20, 'yliang06@syr.edu', '', 'Liang, Yinobin', 'professor'),
(21, 'leejk@syr.edu', '', 'Lee, Jay K.', 'professor'),
(22, 'alee18@syr.edu', '', 'Lee, Andrew', 'professor'),
(23, 'rjirwin@syr.edu', '', 'Irwin, Robert', 'professor'),
(24, 'mcgursoy@syr.edu', '', 'Gursoy, Mustafa Cenk', 'professor'),
(25, 'jiwarzal@syr.edu', '', 'Graham, Jennifer', 'professor'),
(26, 'pkghosh@syr.edu', '', 'Ghosh, Prasanta', 'professor'),
(27, 'jfawcett@twcny.rr.com', '', 'Fawcett, James', 'professor'),
(28, 'makan@syr.edu', '', 'Fardad, Makan', 'professor'),
(29, 'eercanli@syr.edu', '', 'Ercanli, Ehat', 'professor'),
(30, 'seftekha@syr.edu', '', 'Eftekharnejad, Sara', 'professor'),
(31, 'jcho100@syr.edu', '', 'Choi, Jun Hwan', 'professor'),
(32, 'wedu@syr.edu', '', 'Du, Kevin', 'professor'),
(33, 'skchin@syr.edu', '', 'Chin, Shiu-Kai', 'professor'),
(34, 'crchen@syr.edu', '', 'Chen, C. Y. Roger', 'professor'),
(35, 'bichen@syr.edu', '', 'Chen, Biao', 'professor'),
(36, 'chapin@syr.edu', '', 'Chapin, Stephan', 'professor'),
(37, 'tbujanov@syr.edu', '', 'Bujanovic, Tomislav', 'professor'),
(38, 'blair@syr.edu', '', 'Blair, Howard', 'professor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `approval_items`
--
ALTER TABLE `approval_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_product`
--
ALTER TABLE `order_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `approval`
--
ALTER TABLE `approval`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `approval_items`
--
ALTER TABLE `approval_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `order_product`
--
ALTER TABLE `order_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
