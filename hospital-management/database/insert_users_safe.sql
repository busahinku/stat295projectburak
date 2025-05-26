-- Insert users data safely (handles duplicates)

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
    ('dccc86e7-e92e-40d3-96ba-4964b8165924', 'assistant@sirlewis.com', 'Pelin', 'Erkaya', 35, 'F', '52418176237', 'assistant')
ON CONFLICT (id) DO NOTHING;

-- Insert founder data safely
INSERT INTO founders (id, salary) VALUES
    ('ccd80d1e-3470-4068-a05d-abd0fc694cbd', 150000.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample appointments safely
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, cost, is_paid, notes) VALUES
    ('ac3f8b8c-09ba-4334-9f6b-21c6c557c7b9', '9f55931d-8b23-4ddb-a9e3-20ec14eb8666', '2025-02-15', '10:00:00', 30, 'scheduled', 50.00, false, 'Regular checkup'),
    ('bd95724a-9c7a-4a5b-ab49-424960348224', '66f82da5-cc83-4438-ab9b-dbcf46107fd6', '2025-02-16', '14:30:00', 45, 'scheduled', 75.00, false, 'Follow-up consultation'),
    ('5d57a3e4-e442-41a4-a085-0ec46f7e80c3', 'b5cc5174-779b-484a-93b5-4f28abde0b82', '2025-02-14', '09:30:00', 30, 'completed', 50.00, true, 'Completed consultation')
ON CONFLICT (id) DO NOTHING; 