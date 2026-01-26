-- SQL Seed Data for CampusFix
-- Paste this into your Supabase SQL Editor

-- 1. Seed issues table
INSERT INTO issues (description, location, status, upvotes, created_at, category, priority, reporter_name)
VALUES 
('Broken projector in Lecture Hall 3', 'Lecture Hall 3', 'pending', 5, NOW() - INTERVAL '3 days', 'general', 'medium', 'Student A'),
('Water cooler leaking near gym', 'Sports Complex', 'in_progress', 12, NOW() - INTERVAL '1 day', 'general', 'high', 'Staff B'),
('Loose tile on main walkway', 'Main Walkway', 'resolved', 2, NOW() - INTERVAL '5 days', 'safety_hazard', 'low', 'Student C'),
('Dim lighting in library study area', 'Central Library', 'pending', 8, NOW() - INTERVAL '2 days', 'general', 'medium', 'Rahul S.'),
('Elevator in Block B making strange noises', 'Block B', 'pending', 15, NOW() - INTERVAL '4 hours', 'safety_hazard', 'high', 'Priya K.');

-- 2. Seed safety_reports table
INSERT INTO safety_reports (description, location, status, is_critical, is_nsfw, created_at)
VALUES 
('Suspicious person loitering near back gate late at night.', 'Back Gate', 'investigating', 1, 0, NOW() - INTERVAL '12 hours'),
('Dark alleyway lights not working.', 'Pathway to Hostel D', 'received', 0, 0, NOW() - INTERVAL '2 days'),
('Stray dogs acting aggressive.', 'Near Cafeteria', 'resolved', 1, 0, NOW() - INTERVAL '1 day'),
('Emergency exit blocked by stored boxes.', 'Auditorium', 'received', 1, 0, NOW() - INTERVAL '6 hours'),
('Broken window in female dormitory (Level 1).', 'Hostel C', 'investigating', 1, 0, NOW() - INTERVAL '3 hours');
