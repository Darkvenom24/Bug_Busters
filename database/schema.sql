-- FarmSetu MySQL Database Schema
-- Problem Statement ID: 26033 (Department of Consumer Affairs)
-- Title: Multiple intermediaries reduce farmers' earnings and increase consumer prices

CREATE DATABASE IF NOT EXISTS farmsetu_db;
USE farmsetu_db;

-- Users Table (RBAC: farmer, fpo, buyer, admin)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'fpo', 'buyer', 'admin') NOT NULL DEFAULT 'farmer',
    location VARCHAR(150) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    rating FLOAT DEFAULT 5.0,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmer Profiles
CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    farm_name VARCHAR(150),
    land_area_acres FLOAT DEFAULT 5.0,
    primary_crops VARCHAR(255),
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Gujarat',
    fpo_member_id VARCHAR(50),
    total_sales_amount FLOAT DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FPO Profiles
CREATE TABLE IF NOT EXISTS fpos (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    fpo_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    member_farmer_count INT DEFAULT 0,
    central_hub_location VARCHAR(200) NOT NULL,
    storage_capacity_tons FLOAT DEFAULT 500.0,
    primary_crops VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Buyer Profiles
CREATE TABLE IF NOT EXISTS buyers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    business_name VARCHAR(200) NOT NULL,
    buyer_type ENUM('Restaurant', 'Hotel', 'Retailer', 'Supermarket', 'Food Processor', 'Consumer') DEFAULT 'Restaurant',
    gst_number VARCHAR(50),
    delivery_address VARCHAR(255) NOT NULL,
    credit_limit FLOAT DEFAULT 100000.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Produce Catalog
CREATE TABLE IF NOT EXISTS produce (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) NOT NULL,
    farmer_name VARCHAR(100) NOT NULL,
    fpo_id VARCHAR(50),
    fpo_name VARCHAR(100),
    crop VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    category ENUM('Vegetable', 'Fruit', 'Grain', 'Pulse', 'Spice') NOT NULL,
    quantity_kg FLOAT NOT NULL,
    quality_grade ENUM('Grade A', 'Grade B', 'Grade C') NOT NULL DEFAULT 'Grade A',
    price_per_kg FLOAT NOT NULL,
    suggested_price_min FLOAT,
    suggested_price_max FLOAT,
    available_date VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    latitude FLOAT DEFAULT 22.3039,
    longitude FLOAT DEFAULT 70.8022,
    organic BOOLEAN DEFAULT FALSE,
    freshness_priority ENUM('Very High', 'High', 'Medium', 'Low') DEFAULT 'High',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    buyer_id VARCHAR(50) NOT NULL,
    buyer_name VARCHAR(100) NOT NULL,
    farmer_id VARCHAR(50) NOT NULL,
    farmer_name VARCHAR(100) NOT NULL,
    produce_id VARCHAR(50) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    quantity_kg FLOAT NOT NULL,
    price_per_kg FLOAT NOT NULL,
    total_price FLOAT NOT NULL,
    status ENUM('Order Placed', 'Farmer/FPO Confirmed', 'Produce Prepared', 'Pickup', 'In Transit', 'Delivered', 'Payment / Completion') DEFAULT 'Order Placed',
    status_step INT DEFAULT 1,
    eta VARCHAR(100),
    pickup_location VARCHAR(200) NOT NULL,
    delivery_location VARCHAR(200) NOT NULL,
    transit_progress INT DEFAULT 10,
    vehicle_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (produce_id) REFERENCES produce(id) ON DELETE CASCADE
);

-- Vehicles & Logistics
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    capacity_kg FLOAT NOT NULL,
    current_load_kg FLOAT DEFAULT 0.0,
    is_available BOOLEAN DEFAULT TRUE,
    current_location VARCHAR(150)
);

-- Ratings & Trust System
CREATE TABLE IF NOT EXISTS ratings (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    from_user_id VARCHAR(50) NOT NULL,
    to_user_id VARCHAR(50) NOT NULL,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT,
    category VARCHAR(50) DEFAULT 'quality',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);
