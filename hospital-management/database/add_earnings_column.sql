-- Migration: Add total_earnings column to doctors table
-- This ensures doctor earnings are tracked properly when patients pay bills

DO $$ 
BEGIN
    -- Add total_earnings column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'doctors' AND column_name = 'total_earnings') THEN
        ALTER TABLE doctors ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
        COMMENT ON COLUMN doctors.total_earnings IS 'Total earnings from paid appointments and services';
    END IF;
END $$;

-- Update existing doctors to have 0 earnings if null
UPDATE doctors SET total_earnings = 0 WHERE total_earnings IS NULL;

-- Create index for faster earnings queries
CREATE INDEX IF NOT EXISTS idx_doctors_total_earnings ON doctors(total_earnings);

COMMENT ON TABLE doctors IS 'Updated to include total_earnings for tracking doctor revenue from patient payments'; 