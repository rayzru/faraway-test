-- Create Table Users
CREATE TABLE IF NOT EXISTS users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE
);

-- Users Seed
INSERT INTO users (name, email) VALUES 
('Test User', 'test@example.com'), 
('Test User 2', 'test+2@example.com');