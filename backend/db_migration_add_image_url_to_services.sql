-- Migration to add image_url column to services table
-- This allows services to have associated images uploaded during registration

ALTER TABLE services ADD COLUMN image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN services.image_url IS 'URL of the service image stored in cloud storage';

-- Create index for potential queries on image_url (optional, for performance if needed)
CREATE INDEX idx_services_image_url ON services(image_url) WHERE image_url IS NOT NULL;
