-- Sample Data for Hospital Management System
-- This file populates the database with initial data matching the Java application

-- Insert sample departments
INSERT INTO departments (id, name, location) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Cardiology', 'Block A'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Neurology', 'Block B');

-- Insert sample users (matching the authentication data from the image)
INSERT INTO users (id, email, first_name, last_name, age, gender, phone_number, role) VALUES
    -- Founder
    ('ccd80d1e-3470-4068-a05d-abd0fc694cbd', 'founder@sirlewis.com', 'Burak Sahin', 'Kucuk', 40, 'M', '5319870221', 'founder'),
    
    -- Doctors
    ('9f55931d-8b23-4ddb-a9e3-20ec14eb8666', 'doctor1@sirlewis.com', 'Aysegul', 'Özkaya Eren', 30, 'F', '5245287101', 'doctor'),
    ('66f82da5-cc83-4438-ab9b-dbcf46107fd6', 'doctor2@sirlewis.com', 'Prof. Dr. Aysen', 'Akkaya', 40, 'M', '512389722', 'doctor'),
    ('b5cc5174-779b-484a-93b5-4f28abde0b82', 'doctor3@sirlewis.com', 'Dr. Sarah', 'Johnson', 35, 'F', '5551234567', 'doctor'),
    
    -- Patients
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', 'patient1@sirlewis.com', 'Berat', 'Ozkan', 35, 'M', '5319878790', 'patient'),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', 'patient2@sirlewis.com', 'Emily', 'Davis', 28, 'F', '5551234568', 'patient'),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'patient3@sirlewis.com', 'Michael', 'Brown', 42, 'M', '5551234569', 'patient'),
    
    -- Pharmacist
    ('a468ccdb-bdd3-4c84-bde5-8f74f62e279c', 'pharmacist@sirlewis.com', 'Kevin De', 'Bruyne', 35, 'M', '52418176236', 'pharmacist'),
    
    -- Assistant
    ('dccc86e7-e92e-40d3-96ba-4964b8165924', 'assistant@sirlewis.com', 'Pelin', 'Erkaya', 35, 'F', '52418176237', 'assistant');

-- Insert founder data
INSERT INTO founders (id, salary) VALUES
    ('ccd80d1e-3470-4068-a05d-abd0fc694cbd', 150000.00);

-- Insert doctors data
INSERT INTO doctors (id, department_id, specialty, office_number, experience_years, is_private, salary, private_fee, schedule_start_time, schedule_end_time) VALUES
    ('9f55931d-8b23-4ddb-a9e3-20ec14eb8666', '550e8400-e29b-41d4-a716-446655440001', 'Cardiologist', '301', 5, false, 120000.00, 250.00, '09:00:00', '17:00:00'),
    ('66f82da5-cc83-4438-ab9b-dbcf46107fd6', '550e8400-e29b-41d4-a716-446655440002', 'Neurologist', '302', 10, false, 110000.00, 250.00, '09:00:00', '17:00:00'),
    ('b5cc5174-779b-484a-93b5-4f28abde0b82', '550e8400-e29b-41d4-a716-446655440001', 'Cardiologist', '303', 8, false, 115000.00, 250.00, '09:00:00', '17:00:00');

-- Update departments with head doctors
UPDATE departments SET head_doctor_id = '9f55931d-8b23-4ddb-a9e3-20ec14eb8666' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE departments SET head_doctor_id = '66f82da5-cc83-4438-ab9b-dbcf46107fd6' WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Insert patients data
INSERT INTO patients (id, has_insurance, insurance_provider, balance) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', true, 'BurakSahinInsurance', 0.00),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', true, 'HealthCare Plus', 150.00),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', false, null, 75.00);

-- Insert pharmacist data
INSERT INTO pharmacists (id, pharmacy_location, salary, working_hours) VALUES
    ('a468ccdb-bdd3-4c84-bde5-8f74f62e279c', 'Main Pharmacy', 80000.00, 'Monday-Friday 9AM-5PM');

-- Insert assistant data
INSERT INTO assistants (id, doctor_id, department_id, experience_years, salary, specialization) VALUES
    ('dccc86e7-e92e-40d3-96ba-4964b8165924', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', '550e8400-e29b-41d4-a716-446655440002', 5, 100000.00, 'Neurology Assistant');

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, capacity, hourly_rate, equipment, is_available) VALUES
    ('201', 'Radiology - 1', 2, 50.00, 'Radiolog, Radiology Stuff', true),
    ('202', 'Radiology Pro Plus', 2, 50.00, 'Radiolog, Radiology Stuff, Much more radio', true),
    ('101', 'Blood', 1, 200.00, 'Nurse, Monitor, Blood', true),
    ('301', 'Operating Room - 1', 1, 200.00, 'Ventilator, Monitor, Other Equipments', true),
    ('302', 'Operating Room - 2', 1, 500.00, 'Though this room is empty, it is still a valid room', true),
    ('303', 'Emergency Room - 1', 4, 300.00, 'Stretcher, Equipments', true);

-- Insert sample inventory
INSERT INTO inventory (item_name, category, quantity, minimum_stock, unit_price, supplier, location) VALUES
    ('Iburamin', 'Medication', 100, 10, 1.50, 'SahinCo', 'Main Pharmacy'),
    ('Bandage', 'Medical Supplies', 50, 5, 0.50, 'BurakCo', 'Storage'),
    ('Parol Plus', 'Medication', 80, 10, 2.00, 'SahinCo', 'Main Pharmacy'),
    ('Surgical Gloves', 'Medical Supplies', 200, 20, 0.25, 'MedSupply Co', 'Storage'),
    ('Stethoscope', 'Medical Equipment', 15, 3, 150.00, 'MedTech Inc', 'Equipment Room');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, cost, is_paid, notes) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', '9f55931d-8b23-4ddb-a9e3-20ec14eb8666', '2025-02-15', '10:00:00', 30, 'scheduled', 50.00, false, 'Regular checkup'),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', '2025-02-16', '14:30:00', 45, 'scheduled', 75.00, false, 'Follow-up consultation'),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'b5cc5174-779b-484a-93b5-4f28abde0b82', '2025-02-14', '09:30:00', 30, 'completed', 50.00, true, 'Completed consultation');

-- Insert sample medical records
INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, treatment, medications, allergies, blood_type, height, weight, blood_pressure, notes) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', '9f55931d-8b23-4ddb-a9e3-20ec14eb8666', 'Hypertension', 'High blood pressure, headaches', 'Lifestyle changes, medication', ARRAY['Lisinopril', 'Hydrochlorothiazide'], ARRAY['Penicillin'], 'O+', 175.00, 80.00, '140/90', 'Patient advised to reduce salt intake'),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', 'Migraine', 'Severe headaches, light sensitivity', 'Pain management, trigger avoidance', ARRAY['Sumatriptan', 'Ibuprofen'], ARRAY[]::text[], 'A-', 165.00, 60.00, '120/80', 'Stress-related migraines'),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'b5cc5174-779b-484a-93b5-4f28abde0b82', 'Chest Pain', 'Chest discomfort, shortness of breath', 'Cardiac evaluation, stress test', ARRAY['Aspirin'], ARRAY['Shellfish'], 'B+', 180.00, 90.00, '130/85', 'Stress test scheduled');

-- Insert sample prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions, is_filled) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', '9f55931d-8b23-4ddb-a9e3-20ec14eb8666', 'Lisinopril', '10mg', 'Once daily', '30 days', 'Take with food, monitor blood pressure', false),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', 'Sumatriptan', '50mg', 'As needed', '10 tablets', 'Take at onset of migraine, max 2 per day', false),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'b5cc5174-779b-484a-93b5-4f28abde0b82', 'Aspirin', '81mg', 'Once daily', '90 days', 'Take with food to prevent stomach upset', true);

-- Insert sample bills
INSERT INTO bills (patient_id, appointment_id, amount, description, is_paid) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', (SELECT id FROM appointments WHERE patient_id = 'ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9' LIMIT 1), 50.00, 'Consultation fee', false),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', (SELECT id FROM appointments WHERE patient_id = 'bd95724a-9c7a-4a5b-ab49-424960348224' LIMIT 1), 75.00, 'Specialist consultation', false),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', (SELECT id FROM appointments WHERE patient_id = '5d57a3e4-e442-41a4-a085-0ec46f7e80c3' LIMIT 1), 50.00, 'Consultation fee', true);

-- Insert sample reviews
INSERT INTO reviews (patient_id, doctor_id, rating, comment) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', '9f55931d-8b23-4ddb-a9e3-20ec14eb8666', 5, 'Excellent doctor, very thorough and caring'),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', 4, 'Good consultation, helpful advice'),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'b5cc5174-779b-484a-93b5-4f28abde0b82', 5, 'Professional and knowledgeable, highly recommend');

-- Insert sample financial transactions
INSERT INTO financial_transactions (amount, transaction_type, description) VALUES
    (50.00, 'PAYMENT', 'Patient consultation fee'),
    (75.00, 'PAYMENT', 'Specialist consultation fee'),
    (-120000.00, 'SALARY', 'Monthly salary payment - Dr. Aysegul'),
    (-110000.00, 'SALARY', 'Monthly salary payment - Dr. Aysen'),
    (-80000.00, 'SALARY', 'Monthly salary payment - Pharmacist Kevin'),
    (1500.00, 'INVENTORY', 'Medical supplies purchase'); 