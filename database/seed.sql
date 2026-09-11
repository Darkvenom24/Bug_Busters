-- FarmSetu MySQL Seed Data
USE farmsetu_db;

-- Initial Demo Users
INSERT INTO users (id, name, phone, email, hashed_password, role, location, verified, rating, avatar) VALUES
('farmer-1', 'Ramesh Patel', '+91 98250 12345', 'ramesh.farmer@farmsetu.in', '$2b$12$e0MYzX13g', 'farmer', 'Rajkot, Gujarat', TRUE, 4.9, 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'),
('farmer-2', 'Kishorebhai Vala', '+91 98250 12346', 'kishore.farmer@farmsetu.in', '$2b$12$e0MYzX13g', 'farmer', 'Ahmedabad, Gujarat', TRUE, 4.8, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'),
('fpo-1', 'Saurashtra Kisan Producer Co.', '+91 99040 56789', 'contact@saurashtrakisan.org', '$2b$12$e0MYzX13g', 'fpo', 'Aji GIDC Agri Hub, Rajkot', TRUE, 4.8, 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200'),
('buyer-1', 'GreenLeaf Grand Restaurant & Banquets', '+91 97120 78901', 'procurement@greenleaf.com', '$2b$12$e0MYzX13g', 'buyer', '150ft Ring Road, Rajkot', TRUE, 4.7, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'),
('admin-1', 'Dr. Alok Verma (AgriTech Officer)', '+91 94280 99999', 'alok.verma@doca.gov.in', '$2b$12$e0MYzX13g', 'admin', 'Dept. of Consumer Affairs, New Delhi', TRUE, 5.0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial Produce Listings
INSERT INTO produce (id, farmer_id, farmer_name, crop, variety, category, quantity_kg, quality_grade, price_per_kg, suggested_price_min, suggested_price_max, available_date, location, organic, freshness_priority, image_url) VALUES
('prod-101', 'farmer-1', 'Ramesh Patel', 'Tomato', 'Hybrid Vaishali', 'Vegetable', 500, 'Grade A', 31.0, 30.0, 33.0, 'Tomorrow', 'Rajkot, Gujarat', TRUE, 'High', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'),
('prod-102', 'farmer-2', 'Kishorebhai Vala', 'Onion', 'Nasik Red', 'Vegetable', 2400, 'Grade A', 28.0, 27.0, 30.0, 'Ready for Dispatch', 'Ahmedabad, Gujarat', FALSE, 'Medium', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'),
('prod-103', 'farmer-1', 'Ramesh Patel', 'Spinach (Palak)', 'All Green Desi', 'Vegetable', 350, 'Grade A', 22.0, 20.0, 24.0, 'Harvesting Today at 4 PM', 'Gondal, Gujarat', TRUE, 'Very High', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600')
ON DUPLICATE KEY UPDATE quantity_kg=VALUES(quantity_kg);

-- Initial Vehicle
INSERT INTO vehicles (id, registration_number, driver_name, driver_phone, capacity_kg, current_load_kg, is_available, current_location) VALUES
('veh-1', 'GJ-03-BX-4921', 'Suresh Parmar', '+91 98251 34912', 1500.0, 1150.0, TRUE, 'Rajkot Central Hub')
ON DUPLICATE KEY UPDATE current_load_kg=VALUES(current_load_kg);
