# SirLewis Hospital Management System

A comprehensive web-based hospital management system built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Landing Page
- **Modern Hero Section**: Professional landing page with compelling call-to-action
- **Feature Showcase**: Highlights of hospital services and capabilities
- **Responsive Design**: Optimized for all device sizes
- **Professional Branding**: Clean, medical-themed design

### Authentication System
- **Login Modal**: Secure email-based authentication with demo users
- **Registration Modal**: Separate registration flows for patients and doctors
- **Role-Based Access**: Different user types with specific permissions
- **Demo Users**: Pre-configured sample users for testing

### User Registration Types

#### Patient Registration
- Basic information (name, email, password, phone, date of birth)
- Medical information (blood type, allergies, emergency contact)
- Automatic patient profile creation

#### Doctor Registration  
- Basic information (name, email, password, phone, date of birth)
- Professional information (specialty, license number, years of experience)
- Automatic doctor profile creation

### Dashboard System
- **Role-Specific Dashboards**: Customized views for each user type
- **Real-Time Statistics**: Live data from the database
- **Recent Appointments**: Quick overview of upcoming appointments
- **Quick Actions**: Role-based action buttons

## 🛠️ Development Progress

This section outlines the recent development and debugging efforts undertaken to improve the SirLewis Hospital Management System.

### Initial Setup and UI Fixes:
- Corrected the `npm run dev` command execution by navigating to the correct `hospital-management` directory.
- Resolved non-functional quick action buttons on the patient dashboard (`hospital-management/src/app/dashboard/page.tsx`) by implementing `useRouter` for navigation.
- Fixed broken sidebar navigation links in `hospital-management/src/components/ui/sidebar.tsx` by updating `href` paths to include the `/dashboard` prefix (e.g., `/dashboard/appointments`).
- Addressed a `UserRole` import error in `sidebar.tsx` by defining it as a type alias directly within the file.

### Dashboard Page Creation:
- Created several missing placeholder pages for the patient dashboard to enable navigation:
    - `hospital-management/src/app/dashboard/medical-records/page.tsx`
    - `hospital-management/src/app/dashboard/prescriptions/page.tsx`
    - `hospital-management/src/app/dashboard/billing/page.tsx`
    - `hospital-management/src/app/dashboard/reviews/page.tsx`
- Each page was populated with basic structure and placeholder content, mirroring functionality from a reference Java application and utilizing `PatientService` methods.

### Doctor Selection and Data Integrity:
- Investigated and resolved issues with empty doctor selection dropdowns for appointment booking and review submission.
- Debugged the `getAvailableDoctors()` function in `hospital-management/src/lib/patient.ts`.
    - Created test scripts (`debug-doctors.js`, `test-connection.js`, `test-doctors-function.js`) to isolate and identify the root cause.
    - Corrected Supabase credentials for test scripts by referencing `hospital-management/src/lib/supabase.ts`.
    - Discovered and fixed an incorrect foreign key usage in `getAvailableDoctors()`: changed `user_id` to `id` for queries involving the `doctors` and `users` tables.
- Proactively corrected similar `user_id` to `id` issues in `getBalance` and `updateBalance` functions within `hospital-management/src/lib/patient.ts` for consistency with the `patients` table schema.
- Improved error logging across `hospital-management/src/lib/patient.ts` to provide more descriptive error messages (e.g., `error.message` or `String(error)`).

### Appointment System Fixes:
- Addressed failures in appointment creation.
    - Used a test script (`test-appointment-creation.js`) to diagnose the issue.
    - The error "Could not find the 'appointment_id' column of 'appointments'" was identified.
    - Modified the `addAppointment` function in `hospital-management/src/lib/patient.ts`:
        - Removed the erroneous insertion of `appointment_id` (as it's database-generated).
        - Added the missing `duration_minutes` field, defaulting to 30.
        - Ensured the database-generated `id` is correctly mapped to `appointmentId` in the returned appointment object.
    - Corrected `getAppointments` to use `apt.id` for `appointmentId`.
    - Confirmed the fix with `test-appointment-creation-fixed.js`.

### Review System Fixes:
- Resolved failures in review creation.
    - Used a test script (`test-review-creation.js`) to diagnose the issue.
    - The error "Could not find the 'review_date' column of 'reviews'" was identified; the table uses `created_at`.
    - Modified the `writeReview` function in `hospital-management/src/lib/patient.ts` to use `created_at` instead of `review_date`.
    - Updated `getAllReviews` to order by `created_at` and correctly map `review.created_at` to `reviewDate`.
    - Confirmed the fix with `test-review-creation-fixed.js`.

### Appointment Display in UI:
- Investigated and fixed an issue where newly created appointments were not displaying doctor names correctly in the UI (showing "Dr. " and "scheduled for passed ones also").
- Debugged the `getAppointments` function in `hospital-management/src/lib/patient.ts` using `test-appointment-display.js`.
    - The error "column doctors_1.department does not exist" was found because the `doctors` table uses `department_id`.
    - Refactored `getAppointments`:
        - Simplified the initial query to fetch core appointment data.
        - Added subsequent queries to fetch related doctor user information (from `users`) and doctor-specific details (like `specialty`, `department_id` from `doctors`).
        - Manually combined these data sources in JavaScript to construct the complete `Appointment` objects with accurate doctor details (name, specialty, department).
    - Confirmed the fix with `test-appointment-display-fixed.js`.

### Current Focus:
- Addressing remaining UI issues with doctor name display in the appointments list, despite backend fixes showing correct data retrieval in test scripts.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Run the SQL scripts in the `database/` folder in your Supabase SQL editor
   - First run `schema.sql` to create tables
   - Then run `sample_data.sql` to insert demo data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Demo Users

The system comes with pre-configured demo users for testing:

| Email | Role | Name | Password |
|-------|------|------|----------|
| founder@sirlewis.com | Founder | Burak Sahin Kucuk | password123 |
| doctor1@sirlewis.com | Doctor | Dr. Aysegul Özkaya Eren | password123 |
| doctor2@sirlewis.com | Doctor | Prof. Dr. Aysen Akkaya | password123 |
| patient1@sirlewis.com | Patient | Berat Ozkan | password123 |
| pharmacist@sirlewis.com | Pharmacist | Kevin De Bruyne | password123 |
| assistant@sirlewis.com | Assistant | Pelin Erkaya | password123 |

## 🏗️ Project Structure

```
hospital-management/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginModal.tsx
│   │   │   └── RegisterModal.tsx
│   │   └── ui/                # UI components
│   └── lib/
│       ├── auth.ts            # Authentication logic
│       ├── supabase.ts        # Database client
│       └── utils.ts           # Utility functions
├── database/                   # SQL scripts
│   ├── schema.sql
│   └── sample_data.sql
└── public/                    # Static assets
```

## 🔐 Authentication Flow

### Login Process
1. User clicks "Sign In" on landing page
2. Login modal opens with email/password form
3. Demo users can be selected for quick testing
4. Successful login redirects to role-specific dashboard

### Registration Process
1. User clicks "Get Started" or "Sign up here"
2. Registration modal opens with user type selection
3. User chooses between Patient or Doctor registration
4. Form adapts to show role-specific fields
5. Account creation and automatic login

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional medical theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Modals**: Smooth animations and transitions
- **Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Icons**: Lucide React
- **Authentication**: Custom email-based system
- **Deployment**: Vercel-ready

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with collapsible navigation
- **Mobile**: Touch-optimized interface with mobile-first design

## 🔄 Next Steps

1. **Enhanced Authentication**: Implement proper password hashing and JWT tokens
2. **Email Verification**: Add email confirmation for new registrations
3. **Password Reset**: Implement forgot password functionality
4. **Social Login**: Add Google/Facebook authentication options
5. **Advanced Validation**: Enhanced form validation and error handling

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**SirLewis Hospital Management System** - Transforming healthcare management with modern web technology. 