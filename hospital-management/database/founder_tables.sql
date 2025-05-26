-- Additional tables for founder functionality

-- Financial transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'Revenue' or 'Expense'
    description TEXT NOT NULL,
    reference_id UUID, -- Reference to related record (appointment, bill, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital reports table
CREATE TABLE IF NOT EXISTS hospital_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(100) NOT NULL,
    report_data JSONB NOT NULL, -- Store report data as JSON
    generated_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders table (if not exists)
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    salary DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update departments table to include head_doctor_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'head_doctor_id') THEN
        ALTER TABLE departments ADD COLUMN head_doctor_id UUID REFERENCES users(id);
    END IF;
END $$;

-- Update doctors table to include department_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'doctors' AND column_name = 'department_id') THEN
        ALTER TABLE doctors ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
END $$;

-- Update assistants table to include department_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'assistants' AND column_name = 'department_id') THEN
        ALTER TABLE assistants ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
END $$;

-- Update assistants table to include experience_years if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'assistants' AND column_name = 'experience_years') THEN
        ALTER TABLE assistants ADD COLUMN experience_years INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update pharmacists table to include pharmacy_location if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pharmacists' AND column_name = 'pharmacy_location') THEN
        ALTER TABLE pharmacists ADD COLUMN pharmacy_location VARCHAR(255);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON financial_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_hospital_reports_created_at ON hospital_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_hospital_reports_generated_by ON hospital_reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_departments_head_doctor ON departments(head_doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_assistants_department ON assistants(department_id);

-- Insert sample founder data if not exists
INSERT INTO users (id, first_name, last_name, age, gender, phone_number, email, role)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Burak Sahin', 'Kucuk', 40, 'M', '5319870221', 'founder@sirlewis.com', 'founder')
ON CONFLICT (email) DO NOTHING;

INSERT INTO founders (id, salary)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 150000.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample departments if not exists
INSERT INTO departments (id, name, location, head_doctor_id)
VALUES 
    ('d1234567-1234-1234-1234-123456789012', 'Cardiology', 'Building A, Floor 2', (SELECT id FROM users WHERE email = 'doctor1@sirlewis.com' LIMIT 1)),
    ('d2234567-1234-1234-1234-123456789012', 'Neurology', 'Building B, Floor 3', (SELECT id FROM users WHERE email = 'doctor2@sirlewis.com' LIMIT 1)),
    ('d3234567-1234-1234-1234-123456789012', 'Emergency', 'Building A, Floor 1', NULL)
ON CONFLICT (id) DO NOTHING;

-- Update existing doctors with department assignments
UPDATE doctors 
SET department_id = 'd1234567-1234-1234-1234-123456789012'
WHERE id = (SELECT id FROM users WHERE email = 'doctor1@sirlewis.com' LIMIT 1);

UPDATE doctors 
SET department_id = 'd2234567-1234-1234-1234-123456789012'
WHERE id = (SELECT id FROM users WHERE email = 'doctor2@sirlewis.com' LIMIT 1);

-- Insert sample financial transactions
INSERT INTO financial_transactions (amount, transaction_type, description)
VALUES 
    (50000.00, 'Revenue', 'Monthly appointment revenue'),
    (-25000.00, 'Expense', 'Doctor salaries'),
    (-5000.00, 'Expense', 'Medical supplies'),
    (15000.00, 'Revenue', 'Private consultation fees'),
    (-50000.00, 'Expense', 'Department Setup - Cardiology'),
    (-50000.00, 'Expense', 'Department Setup - Neurology')
ON CONFLICT DO NOTHING; 