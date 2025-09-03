-- Complete Database Structure for Beauty Salon Application
-- This file contains all table definitions, constraints, indexes, and default data
-- Created from db_migration_complete.sql with proper structure

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    login_type VARCHAR(20), -- 'email', 'google', 'apple'
    requesting_role VARCHAR(50) NOT NULL CHECK (requesting_role IN ('client', 'professional', 'admin', 'owner')),
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'professional', 'admin', 'owner', 'pending')),
    profile_image_url TEXT,
    registration_step INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1, -- 1 = active, 0 = inactive, 2 = deleted
    approval_status VARCHAR(20) DEFAULT 'pending',
    approval_message TEXT
);

-- Salons table
CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('salon_owner', 'beauty_professional')),
    profile_image_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1,
    registration_step INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0
);

-- User addresses table
CREATE TABLE user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    country VARCHAR(100),
    city VARCHAR(100),
    postcode VARCHAR(20),
    full_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Salon addresses table
CREATE TABLE salon_addresses (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    country VARCHAR(100),
    city VARCHAR(100),
    postcode VARCHAR(20),
    full_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Social links table
CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    platform VARCHAR(50), -- e.g. facebook, instagram, tiktok
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Portfolios table
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    album_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Portfolio images table
CREATE TABLE portfolio_images (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    name VARCHAR(255),
    duration INTEGER, -- in minutes
    price NUMERIC(10,2),
    discounted_price NUMERIC(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Opening hours table
CREATE TABLE opening_hours (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    day_of_week VARCHAR(10), -- e.g. Monday
    is_opened BOOLEAN DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- FAQs table
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Certifications table
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id),
    certificate_name VARCHAR(255),
    issue_date DATE,
    certificate_id VARCHAR(100),
    certificate_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Salon gallery table
CREATE TABLE salon_gallery (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1 -- 1 = active, 0 = deleted
);

-- Review images table
CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Rating categories table for detailed ratings
CREATE TABLE rating_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Individual category ratings
CREATE TABLE category_ratings (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES rating_categories(id),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- User favorites table for saving favorite salons
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1, -- 1 = active, 0 = removed
    UNIQUE(user_id, salon_id) -- Prevent duplicate favorites
);

-- Key Information table
CREATE TABLE salon_key_info (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    joined_on VARCHAR(100), -- Could be date or descriptive text like "May 2006"
    stylist_career VARCHAR(100), -- Could be "5 years" or similar
    good_image VARCHAR(255), -- Descriptive text like "Popular and loved"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Languages table
CREATE TABLE salon_languages (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    language VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1
);

-- Insert default rating categories
INSERT INTO rating_categories (name, description) VALUES
('Supplier Service', 'Quality of service provided by the supplier'),
('On-time Service', 'Punctuality and timeliness of service'),
('Service Quality', 'Overall quality of the service provided');

-- Create indexes for better performance
CREATE INDEX idx_reviews_salon_id ON reviews(salon_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_review_images_review_id ON review_images(review_id);
CREATE INDEX idx_category_ratings_review_id ON category_ratings(review_id);
CREATE INDEX idx_services_salon_id ON services(salon_id);
CREATE INDEX idx_portfolios_salon_id ON portfolios(salon_id);
CREATE INDEX idx_faqs_salon_id ON faqs(salon_id);
CREATE INDEX idx_certifications_salon_id ON certifications(salon_id);
CREATE INDEX idx_opening_hours_salon_id ON opening_hours(salon_id);
CREATE INDEX idx_salon_gallery_salon_id ON salon_gallery(salon_id);
CREATE INDEX idx_social_links_salon_id ON social_links(salon_id);
CREATE INDEX idx_salon_addresses_salon_id ON salon_addresses(salon_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_salon_id ON user_favorites(salon_id);
CREATE INDEX idx_user_favorites_user_salon ON user_favorites(user_id, salon_id);
CREATE INDEX idx_salon_key_info_salon_id ON salon_key_info(salon_id);
CREATE INDEX idx_salon_languages_salon_id ON salon_languages(salon_id);

-- Comments for better documentation
COMMENT ON TABLE users IS 'Stores user information including authentication and roles';
COMMENT ON TABLE salons IS 'Stores salon information and business details';
COMMENT ON TABLE user_addresses IS 'Stores user addresses for delivery and location services';
COMMENT ON TABLE salon_addresses IS 'Stores physical locations of salons';
COMMENT ON TABLE social_links IS 'Stores social media links for salons';
COMMENT ON TABLE portfolios IS 'Stores portfolio albums for salons';
COMMENT ON TABLE portfolio_images IS 'Stores images associated with portfolio albums';
COMMENT ON TABLE services IS 'Stores services offered by salons with pricing';
COMMENT ON TABLE opening_hours IS 'Stores business hours for salons';
COMMENT ON TABLE faqs IS 'Stores frequently asked questions for salons';
COMMENT ON TABLE certifications IS 'Stores professional certifications for salons';
COMMENT ON TABLE salon_gallery IS 'Stores gallery images for salon showcases';
COMMENT ON TABLE reviews IS 'Stores customer reviews and ratings for salons';
COMMENT ON TABLE review_images IS 'Stores images associated with reviews';
COMMENT ON TABLE rating_categories IS 'Stores categories for detailed rating system';
COMMENT ON TABLE category_ratings IS 'Stores individual category ratings within reviews';
COMMENT ON TABLE user_favorites IS 'Stores user favorite salons for quick access and bookmarking';
COMMENT ON TABLE salon_key_info IS 'Stores key information about salons such as join date, career length, and reputation';
COMMENT ON TABLE salon_languages IS 'Stores languages spoken by the salon staff';

COMMENT ON COLUMN users.status IS '1 = active, 0 = inactive, 2 = deleted';
COMMENT ON COLUMN users.approval_status IS 'User approval status: approved, pending, rejected';
COMMENT ON COLUMN users.registration_step IS 'Tracks user registration progress (0-5 steps)';
COMMENT ON COLUMN salons.status IS '1 = active, 0 = inactive';
COMMENT ON COLUMN salons.registration_step IS 'Tracks salon registration progress (0-5 steps)';
COMMENT ON COLUMN salons.average_rating IS 'Calculated average rating from reviews';
COMMENT ON COLUMN salons.total_reviews IS 'Total number of reviews for the salon';
COMMENT ON COLUMN reviews.status IS '1 = active, 0 = deleted';
COMMENT ON COLUMN user_favorites.status IS '1 = active (favorited), 0 = removed from favorites';
