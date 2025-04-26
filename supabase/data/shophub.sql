-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2025 at 07:45 PM
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
-- Database: `shophub`
--

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `description`, `created_at`, `updated_at`) VALUES
('1', 'Electronics', 'electronics', 'https://images.pexels.com/photos/1616513/pexels-photo-1616513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Explore the latest technology gadgets and electronics.', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('2', 'Fashion', 'fashion', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Discover trendy clothing, accessories, and footwear.', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('3', 'Home & Kitchen', 'home-kitchen', 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Everything you need for your home and kitchen.', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('4', 'Books', 'books', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Browse our extensive collection of books across all genres.', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('5', 'Beauty', 'beauty', 'https://images.pexels.com/photos/2253834/pexels-photo-2253834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Premium beauty and personal care products.', '2025-04-20 11:17:21', '2025-04-20 11:17:21');

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `original_price`, `stock`, `rating`, `category_id`, `created_at`, `updated_at`) VALUES
('1', 'Wireless Noise-Cancelling Headphones', 'wireless-noise-cancelling-headphones', 'Premium wireless headphones with industry-leading noise cancellation, exceptional sound quality, and 30-hour battery life.', 299.99, 349.99, 15, 4.70, '1', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('2', 'Ultra HD 4K Smart TV 55\"', 'ultra-hd-4k-smart-tv-55', 'Experience stunning clarity with this 55-inch 4K Ultra HD Smart TV featuring HDR, a brilliant LED display, and smart functionality for all your entertainment needs.', 599.99, 799.99, 8, 4.50, '1', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('3', 'Premium Leather Messenger Bag', 'premium-leather-messenger-bag', 'Handcrafted genuine leather messenger bag, perfect for professionals. Features multiple compartments and can fit up to a 15\" laptop.', 149.99, 189.99, 12, 4.80, '2', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('4', 'Smart Home Security Camera System', 'smart-home-security-camera-system', 'Comprehensive home security system with 4 wireless cameras, motion detection, night vision, and mobile app control.', 279.99, 349.99, 7, 4.60, '1', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('5', 'Professional Chef Knife Set', 'professional-chef-knife-set', 'Complete 8-piece professional chef knife set with high-carbon stainless steel blades and ergonomic handles. Includes knife block.', 129.99, 159.99, 20, 4.90, '3', '2025-04-20 11:17:21', '2025-04-20 11:17:21'),
('6', 'Organic Cotton Bedding Set', 'organic-cotton-bedding-set', 'Luxurious 100% organic cotton bedding set, including duvet cover, fitted sheet, and pillowcases. Supremely soft and eco-friendly.', 99.99, 129.99, 15, 4.70, '3', '2025-04-20 11:17:21', '2025-04-20 11:17:21');

--
-- Dumping data for table `product_features`
--

INSERT INTO `product_features` (`id`, `product_id`, `feature`, `created_at`) VALUES
('0710e607-1dd9-11f0-887c-d843ae68edf3', '1', 'Industry-leading noise cancellation', '2025-04-20 11:17:21'),
('0710f8d9-1dd9-11f0-887c-d843ae68edf3', '1', '30-hour battery life', '2025-04-20 11:17:21'),
('0710f94c-1dd9-11f0-887c-d843ae68edf3', '1', 'Bluetooth 5.0 connectivity', '2025-04-20 11:17:21'),
('0710f984-1dd9-11f0-887c-d843ae68edf3', '1', 'Built-in voice assistant', '2025-04-20 11:17:21'),
('0711b2dc-1dd9-11f0-887c-d843ae68edf3', '2', '4K Ultra HD resolution', '2025-04-20 11:17:21'),
('0711b9bd-1dd9-11f0-887c-d843ae68edf3', '2', 'HDR technology', '2025-04-20 11:17:21'),
('0711ba15-1dd9-11f0-887c-d843ae68edf3', '2', 'Smart TV functionality', '2025-04-20 11:17:21'),
('0711ba33-1dd9-11f0-887c-d843ae68edf3', '2', 'Voice control compatible', '2025-04-20 11:17:21'),
('0712893f-1dd9-11f0-887c-d843ae68edf3', '3', '100% genuine leather', '2025-04-20 11:17:21'),
('071291b4-1dd9-11f0-887c-d843ae68edf3', '3', 'Fits up to 15\" laptop', '2025-04-20 11:17:21'),
('0712920b-1dd9-11f0-887c-d843ae68edf3', '3', 'Adjustable shoulder strap', '2025-04-20 11:17:21'),
('07129233-1dd9-11f0-887c-d843ae68edf3', '3', 'Multiple compartments', '2025-04-20 11:17:21'),
('071351bc-1dd9-11f0-887c-d843ae68edf3', '4', '4 HD wireless cameras', '2025-04-20 11:17:21'),
('071358df-1dd9-11f0-887c-d843ae68edf3', '4', 'Motion detection alerts', '2025-04-20 11:17:21'),
('07135936-1dd9-11f0-887c-d843ae68edf3', '4', 'Night vision up to 30ft', '2025-04-20 11:17:21'),
('07135956-1dd9-11f0-887c-d843ae68edf3', '4', 'Mobile app remote access', '2025-04-20 11:17:21'),
('07140dc8-1dd9-11f0-887c-d843ae68edf3', '5', '8-piece set with knife block', '2025-04-20 11:17:21'),
('071414f8-1dd9-11f0-887c-d843ae68edf3', '5', 'High-carbon stainless steel', '2025-04-20 11:17:21'),
('07141545-1dd9-11f0-887c-d843ae68edf3', '5', 'Ergonomic handles', '2025-04-20 11:17:21'),
('07141568-1dd9-11f0-887c-d843ae68edf3', '5', 'Dishwasher safe', '2025-04-20 11:17:21'),
('0714cbe4-1dd9-11f0-887c-d843ae68edf3', '6', '100% organic cotton', '2025-04-20 11:17:21'),
('0714d2c3-1dd9-11f0-887c-d843ae68edf3', '6', 'Hypoallergenic material', '2025-04-20 11:17:21'),
('0714d314-1dd9-11f0-887c-d843ae68edf3', '6', '300 thread count', '2025-04-20 11:17:21'),
('0714d335-1dd9-11f0-887c-d843ae68edf3', '6', 'Machine washable', '2025-04-20 11:17:21');

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`, `position`, `created_at`) VALUES
('07100523-1dd9-11f0-887c-d843ae68edf3', '1', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('0710198f-1dd9-11f0-887c-d843ae68edf3', '1', 'https://images.pexels.com/photos/3394654/pexels-photo-3394654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21'),
('07101a13-1dd9-11f0-887c-d843ae68edf3', '2', 'https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('07101a51-1dd9-11f0-887c-d843ae68edf3', '2', 'https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21'),
('07101a82-1dd9-11f0-887c-d843ae68edf3', '3', 'https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('07101ab7-1dd9-11f0-887c-d843ae68edf3', '3', 'https://images.pexels.com/photos/1139785/pexels-photo-1139785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21'),
('07101ae7-1dd9-11f0-887c-d843ae68edf3', '4', 'https://images.pexels.com/photos/256510/pexels-photo-256510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('07101b13-1dd9-11f0-887c-d843ae68edf3', '4', 'https://images.pexels.com/photos/1215691/pexels-photo-1215691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21'),
('07101b47-1dd9-11f0-887c-d843ae68edf3', '5', 'https://images.pexels.com/photos/593824/pexels-photo-593824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('07101b7b-1dd9-11f0-887c-d843ae68edf3', '5', 'https://images.pexels.com/photos/161519/knife-knives-blade-kitchen-161519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21'),
('07101bbc-1dd9-11f0-887c-d843ae68edf3', '6', 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 0, '2025-04-20 11:17:21'),
('07101bee-1dd9-11f0-887c-d843ae68edf3', '6', 'https://images.pexels.com/photos/6284230/pexels-photo-6284230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1, '2025-04-20 11:17:21');

--
-- Dumping data for table `product_specifications`
--

INSERT INTO `product_specifications` (`id`, `product_id`, `name`, `value`, `created_at`) VALUES
('07158c12-1dd9-11f0-887c-d843ae68edf3', '1', 'Brand', 'SoundMaster', '2025-04-20 11:17:21'),
('07159f39-1dd9-11f0-887c-d843ae68edf3', '1', 'Model', 'SM-WH1000', '2025-04-20 11:17:21'),
('07159fa8-1dd9-11f0-887c-d843ae68edf3', '1', 'Color', 'Black', '2025-04-20 11:17:21'),
('07159fd1-1dd9-11f0-887c-d843ae68edf3', '1', 'Weight', '250g', '2025-04-20 11:17:21'),
('07159ff2-1dd9-11f0-887c-d843ae68edf3', '1', 'Connectivity', 'Bluetooth 5.0, 3.5mm jack', '2025-04-20 11:17:21'),
('0716785c-1dd9-11f0-887c-d843ae68edf3', '2', 'Brand', 'VisionPlus', '2025-04-20 11:17:21'),
('07167f86-1dd9-11f0-887c-d843ae68edf3', '2', 'Model', 'VP-55UHD', '2025-04-20 11:17:21'),
('07167fde-1dd9-11f0-887c-d843ae68edf3', '2', 'Display', '55\" LED', '2025-04-20 11:17:21'),
('07168007-1dd9-11f0-887c-d843ae68edf3', '2', 'Resolution', '3840 x 2160', '2025-04-20 11:17:21'),
('07168024-1dd9-11f0-887c-d843ae68edf3', '2', 'HDMI Ports', '3', '2025-04-20 11:17:21'),
('07174377-1dd9-11f0-887c-d843ae68edf3', '3', 'Brand', 'UrbanCraft', '2025-04-20 11:17:21'),
('07174a7a-1dd9-11f0-887c-d843ae68edf3', '3', 'Material', 'Genuine Leather', '2025-04-20 11:17:21'),
('07174ad0-1dd9-11f0-887c-d843ae68edf3', '3', 'Dimensions', '15\" x 11\" x 4\"', '2025-04-20 11:17:21'),
('07174af6-1dd9-11f0-887c-d843ae68edf3', '3', 'Weight', '1.2kg', '2025-04-20 11:17:21'),
('07174b14-1dd9-11f0-887c-d843ae68edf3', '3', 'Color', 'Dark Brown', '2025-04-20 11:17:21'),
('07180729-1dd9-11f0-887c-d843ae68edf3', '4', 'Brand', 'SecureHome', '2025-04-20 11:17:21'),
('07180e58-1dd9-11f0-887c-d843ae68edf3', '4', 'Model', 'SH-CamX4', '2025-04-20 11:17:21'),
('07180ea8-1dd9-11f0-887c-d843ae68edf3', '4', 'Resolution', '1080p Full HD', '2025-04-20 11:17:21'),
('07180ecc-1dd9-11f0-887c-d843ae68edf3', '4', 'Connectivity', 'Wi-Fi, Mobile App', '2025-04-20 11:17:21'),
('07180eee-1dd9-11f0-887c-d843ae68edf3', '4', 'Night Vision', 'Yes', '2025-04-20 11:17:21'),
('0718d472-1dd9-11f0-887c-d843ae68edf3', '5', 'Brand', 'ChefPro', '2025-04-20 11:17:21'),
('0718dbba-1dd9-11f0-887c-d843ae68edf3', '5', 'Material', 'High-Carbon Stainless Steel', '2025-04-20 11:17:21'),
('0718dc0f-1dd9-11f0-887c-d843ae68edf3', '5', 'Pieces', '8', '2025-04-20 11:17:21'),
('0718dc32-1dd9-11f0-887c-d843ae68edf3', '5', 'Handle', 'Ergonomic, Non-slip', '2025-04-20 11:17:21'),
('0718dc54-1dd9-11f0-887c-d843ae68edf3', '5', 'Block Included', 'Yes', '2025-04-20 11:17:21'),
('0719a549-1dd9-11f0-887c-d843ae68edf3', '6', 'Brand', 'EcoLuxe', '2025-04-20 11:17:21'),
('0719ac4d-1dd9-11f0-887c-d843ae68edf3', '6', 'Material', '100% Organic Cotton', '2025-04-20 11:17:21'),
('0719ac8f-1dd9-11f0-887c-d843ae68edf3', '6', 'Thread Count', '300', '2025-04-20 11:17:21'),
('0719acb4-1dd9-11f0-887c-d843ae68edf3', '6', 'Set Includes', 'Duvet Cover, Fitted Sheet, 2 Pillowcases', '2025-04-20 11:17:21'),
('0719acdf-1dd9-11f0-887c-d843ae68edf3', '6', 'Color', 'White', '2025-04-20 11:17:21');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
