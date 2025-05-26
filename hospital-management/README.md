# Hospital Management System

A modern, web-based hospital management system built with Next.js, TypeScript, Tailwind CSS, and Supabase. This system provides comprehensive functionality for managing hospital operations including appointments, patient records, staff management, and billing.

## Features

### 🏥 Multi-Role Dashboard
- **Founder**: Complete hospital oversight, staff management, financial reports
- **Doctor**: Patient management, appointments, medical records, prescriptions
- **Patient**: Appointment booking, medical history, billing, reviews
- **Pharmacist**: Inventory management, prescription fulfillment
- **Assistant**: Doctor support, appointment scheduling

### 📋 Core Functionality
- **Appointment Management**: Schedule, reschedule, and track appointments
- **Medical Records**: Comprehensive patient health records
- **Prescription System**: Digital prescription management
- **Billing & Payments**: Automated billing with payment tracking
- **Inventory Management**: Medical supplies and equipment tracking
- **Staff Management**: Employee records and department organization
- **Reviews & Ratings**: Patient feedback system
- **Financial Reporting**: Revenue tracking and financial analytics

### 🎨 Modern UI/UX
- Responsive design for all devices
- Role-based navigation with collapsible sidebar
- Real-time data updates
- Modern card-based layout
- Intuitive user interface

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom email-based authentication
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hospital-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ydowlrugvkgdyjoslojn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3dscnVndmtnZHlqb3Nsb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTI1NzUsImV4cCI6MjA2Mzc2ODU3NX0.Nm1CnvAA77ATmiOWYgK2NfwVlvSG5flKrBG9t1fQoes
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3dscnVndmtnZHlqb3Nsb2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MjU3NSwiZXhwIjoyMDYzNzY4NTc1fQ.6w63OueV5f9lrg08fNaeTJLIM_0Zhe_U2szbbPqOg2I
```

### 4. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the schema creation script:
   ```sql
   -- Copy and paste the contents of database/schema.sql
   ```
4. Run the sample data script:
   ```sql
   -- Copy and paste the contents of database/sample_data.sql
   ```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sample Users

The system comes with pre-configured sample users for testing:

| Role | Email | Description |
|------|-------|-------------|
| Founder | founder@sirlewis.com | Full system access, staff management |
| Doctor | doctor1@sirlewis.com | Cardiologist - Aysegul Özkaya Eren |
| Doctor | doctor2@sirlewis.com | Neurologist - Prof. Dr. Aysen Akkaya |
| Patient | patient1@sirlewis.com | Berat Ozkan |
| Patient | patient2@sirlewis.com | Emily Davis |
| Patient | patient3@sirlewis.com | Michael Brown |
| Pharmacist | pharmacist@sirlewis.com | Kevin De Bruyne |
| Assistant | assistant@sirlewis.com | Pelin Erkaya |

## Project Structure

```
hospital-management/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── dashboard/          # Dashboard pages
│   │   └── page.tsx           # Login page
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utilities and configurations
│       ├── auth.ts            # Authentication logic
│       ├── supabase.ts        # Database client
│       └── utils.ts           # Helper functions
├── database/
│   ├── schema.sql             # Database schema
│   └── sample_data.sql        # Sample data
└── README.md
```

## Database Schema

The system uses a PostgreSQL database with the following main tables:

- **users**: Base user information
- **doctors**: Doctor-specific data
- **patients**: Patient-specific data
- **appointments**: Appointment scheduling
- **medical_records**: Patient health records
- **prescriptions**: Medication prescriptions
- **departments**: Hospital departments
- **inventory**: Medical supplies
- **bills**: Billing and payments
- **reviews**: Patient feedback

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Features by Role

### 👑 Founder Dashboard
- Hospital overview and analytics
- Staff management (hire/fire)
- Department management
- Financial reports and revenue tracking
- System-wide statistics

### 👨‍⚕️ Doctor Dashboard
- Patient list and medical records
- Appointment management
- Prescription writing
- Medical record updates
- Patient reviews

### 👤 Patient Dashboard
- Appointment booking and history
- Medical records viewing
- Prescription tracking
- Bill payments
- Doctor reviews

### 💊 Pharmacist Dashboard
- Inventory management
- Prescription fulfillment
- Stock level monitoring
- Supplier management

### 👩‍💼 Assistant Dashboard
- Doctor support
- Appointment scheduling
- Patient communication
- Administrative tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and Supabase
