-- Migration: Create discounts table for discounts/marketing
CREATE TABLE IF NOT EXISTS discounts (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  start_date DATETIME,
  end_date DATETIME,
  usage_limit INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
