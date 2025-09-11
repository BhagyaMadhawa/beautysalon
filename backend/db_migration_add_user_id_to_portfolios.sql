-- Migration to add user_id column to portfolios, services, and faqs tables
-- This allows linking portfolios, services, and faqs directly to beauty professionals (users) without requiring a salon

ALTER TABLE portfolios ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE services ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE faqs ADD COLUMN user_id INTEGER REFERENCES users(id);
