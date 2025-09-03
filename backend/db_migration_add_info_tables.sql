-- Add tables for salon key information and languages
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

-- Create indexes for better performance
CREATE INDEX idx_salon_key_info_salon_id ON salon_key_info(salon_id);
CREATE INDEX idx_salon_languages_salon_id ON salon_languages(salon_id);

-- Comments for documentation
COMMENT ON TABLE salon_key_info IS 'Stores key information about salons such as join date, career length, and reputation';
COMMENT ON TABLE salon_languages IS 'Stores languages spoken by the salon staff';

-- Insert some sample data for existing salons (optional)
-- This would be populated during salon registration process
