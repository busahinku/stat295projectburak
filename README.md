# SirLewis Hospital Management System

A comprehensive hospital management system with **two implementations**:
1. **Java Console Application** - Original command-line interface
2. **Modern Web Application** - Full-featured web interface with database

## 🎯 What is this project?

This is a **Hospital Management System** that helps hospitals manage:
- **Patients** and their medical records
- **Doctors** and their schedules  
- **Appointments** and scheduling
- **Prescriptions** and medications
- **Billing** and payments
- **Staff** (doctors, assistants, pharmacists)
- **Inventory** (medical supplies)
- **Departments** and organization

## 🏗️ Project Structure

```
📁 burakjava/
├── 📁 src/                          # ☕ JAVA CONSOLE APP
│   ├── Main.java                    # Main console application
│   └── objects/                     # Java classes (Patient, Doctor, etc.)
│       ├── Patient.java
│       ├── Doctor.java
│       ├── Appointment.java
│       └── ... (all hospital objects)
│
└── 📁 hospital-management/          # 🌐 WEB APPLICATION  
    ├── src/app/                     # Next.js web pages
    ├── database/                    # SQL database setup
    └── package.json                 # Web app dependencies
```

## 🚀 Quick Start Guide

### Option 1: Run Java Console App (Simple)
```bash
# Compile and run the Java application
cd src/
javac Main.java
java Main
```
**What you get:** Text-based hospital system that runs in terminal

### Option 2: Run Web Application (Advanced)
```bash
# Setup the modern web interface
cd hospital-management/
npm install
npm run dev
```
**What you get:** Professional web interface with database

## 🌐 Deploy Web App to Internet (Make it Live!)

### 🎯 **Perfect Architecture Choice!**

**You're using the IDEAL modern stack:** 
- **Vercel** (Frontend + API hosting)
- **Supabase** (Database + Authentication)

**Why this is BETTER than Heroku/VPS:**
- ✅ **$0 Cost** - Both have generous free tiers
- ✅ **Zero Server Management** - Everything is serverless
- ✅ **Auto-Scaling** - Handles traffic spikes automatically  
- ✅ **Global Performance** - CDN deployment worldwide
- ✅ **One-Click Deploy** - No complex configuration
- ✅ **Built-in Security** - SSL, database security included

### 🏗️ **Your Serverless Architecture**

```
👤 Users Worldwide
        ↓
🌐 Vercel Global CDN
   ├── Frontend (React/Next.js pages)
   └── Backend (API routes)
        ↓
☁️  Supabase Cloud
   ├── PostgreSQL Database
   ├── Authentication
   └── Real-time Updates
```

**What this means:**
- **No VPS needed** - Vercel handles all server logic
- **No database management** - Supabase handles PostgreSQL
- **No DevOps complexity** - Everything just works
- **Infinite scaling** - From 1 user to 1 million users

### 🤔 **What is Frontend vs Backend? (Super Simple Explanation)**

Think of a restaurant:
- **🎨 Frontend** = The dining room (what customers see and interact with)
- **🍳 Backend** = The kitchen (where the work happens behind the scenes)
- **🗄️ Database** = The pantry (where all ingredients/data are stored)

**In our hospital app:**
- **Frontend** = The website you see (buttons, forms, pages)
- **Backend** = The logic that processes appointments, calculates bills
- **Database** = Where all patient records, appointments are saved

### 🎯 **What You're Deploying**

You're putting your hospital management system **LIVE on the internet** so:
- ✅ Anyone can visit your website URL
- ✅ Doctors can login from anywhere
- ✅ Patients can book appointments online
- ✅ Data is saved permanently in the cloud

### 🚀 **Step-by-Step Deployment (Anyone Can Do This!)**

#### **Phase 1: Setup Your Database (The Storage)**
Your app needs a place to store data. We use **Supabase** (free database in the cloud).

**The database is ALREADY setup!** 🎉 
- URL: `https://ydowlrugvkgdyjoslojn.supabase.co`
- It already has sample patients, doctors, appointments

#### **Phase 2: Deploy to Vercel (Make It Live)**

**What is Vercel?** Think of it as a free hosting service that puts your website on the internet.

**Super Easy Steps:**

1. **🔑 Create Accounts (Free)**
   ```bash
   # You need these two free accounts:
   # 1. GitHub account (to store your code)
   # 2. Vercel account (to host your website)
   ```

2. **📤 Upload Your Code to GitHub**
   ```bash
   # Navigate to your project
   cd hospital-management/
   
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Hospital Management System"
   
   # Create new repository on GitHub.com and push
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

3. **🚀 Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - **IMPORTANT:** Set these environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://ydowlrugvkgdyjoslojn.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3dscnVndmtnZHlqb3Nsb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTI1NzUsImV4cCI6MjA2Mzc2ODU3NX0.Nm1CnvAA77ATmiOWYgK2NfwVlvSG5flKrBG9t1fQoes
     ```
   - Click "Deploy"
   - Wait 2-3 minutes ⏰

4. **🎉 Your Website is LIVE!**
   - You'll get a URL like: `https://your-project.vercel.app`
   - Share this URL with anyone in the world!

#### **Phase 3: Test Your Live Website**

Visit your live URL and login with these accounts:

| Role | Email | Password | What You Can Test |
|------|-------|----------|------------------|
| 👑 **Founder** | founder@sirlewis.com | password123 | Manage entire hospital |
| 👨‍⚕️ **Doctor** | doctor1@sirlewis.com | password123 | See patients, write prescriptions |
| 👤 **Patient** | patient1@sirlewis.com | password123 | Book appointments, pay bills |
| 💊 **Pharmacist** | pharmacist@sirlewis.com | password123 | Manage inventory |

### 🔄 **Complete Workflow (What Happens When Someone Uses Your App)**

```
👤 Patient visits your website
      ↓
🌐 Frontend (your website) loads
      ↓
🔑 Patient logs in
      ↓
📝 Patient books appointment
      ↓
⚡ Backend processes the request
      ↓
🗄️ Database saves the appointment
      ↓
📧 Doctor sees new appointment in their dashboard
      ↓
💰 After appointment, bill is generated
      ↓
💳 Patient pays online
      ↓
💵 Doctor's earnings are updated automatically
```

### 🛠️ **What Each Part Does**

| Component | What It Is | What It Does |
|-----------|------------|--------------|
| **Frontend** | Your website pages | Shows buttons, forms, dashboards |
| **Backend** | Server logic | Processes appointments, calculates bills |
| **Database** | Data storage | Saves patients, doctors, appointments |
| **Vercel** | Hosting service | Makes your website available 24/7 |
| **Supabase** | Database service | Stores all your hospital data |

### 🎯 **Why This is Impressive**

When deployed, you have:
- ✅ **Professional Hospital System** running live on internet
- ✅ **Real-time Updates** - When patient pays, doctor earnings update instantly
- ✅ **Multi-user System** - Multiple people can use it simultaneously
- ✅ **Secure Authentication** - Each user type has different permissions
- ✅ **Mobile Responsive** - Works on phones, tablets, computers
- ✅ **Cloud Database** - Data is backed up and secure

### 🆘 **Troubleshooting**

**If deployment fails:**
1. Check environment variables are copied exactly
2. Make sure you're in `hospital-management/` folder
3. Verify GitHub repository has all files
4. Check Vercel build logs for errors

**If website doesn't work:**
1. Try different browsers
2. Check if sample users can login
3. Look at browser console for errors (F12 key)

## 💻 Technology Stack

### Java Console Application
- **Language:** Java
- **Storage:** In-memory (no database)
- **Interface:** Command-line text interface
- **Users:** Sample users hard-coded in Main.java

### Web Application  
- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Styling:** Tailwind CSS (modern responsive design)
- **Database:** Supabase (PostgreSQL in the cloud)
- **Authentication:** Email-based login system
- **Deployment:** Vercel-ready

## 👥 Sample Users (Both Apps)

| Role | Username | Password | What They Can Do |
|------|----------|----------|------------------|
| **Founder** | founder | founder | Manage entire hospital, hire/fire staff |
| **Doctor** | doctor | doctor | See patients, write prescriptions, manage appointments |
| **Patient** | patient | patient | Book appointments, view medical records, pay bills |
| **Pharmacist** | pharmacist | pharmacist | Manage inventory, fulfill prescriptions |
| **Assistant** | assistant | assistant | Help doctors, schedule appointments |

## 🎮 How to Use

### Java Console App
1. Run `java Main`
2. Choose: Login (1) or Register (2)
3. Login with sample users above
4. Navigate menus based on your role

### Web Application
1. Go to `http://localhost:3000`
2. Click "Sign In" 
3. Use email format: `founder@sirlewis.com` (password: `password123`)
4. Access role-specific dashboard

## 📋 What Each Role Can Do

### 👑 Founder (Hospital Owner)
- View hospital statistics and revenue
- Hire/fire doctors and staff
- Create departments
- Generate financial reports
- Manage the entire hospital

### 👨‍⚕️ Doctor  
- View and manage patients
- Schedule and manage appointments
- Write prescriptions
- Update medical records
- Set consultation fees (if private practice)

### 👤 Patient
- Book appointments with doctors
- View medical history and records
- See prescriptions and medications
- Pay bills and view billing history
- Write reviews for doctors

### 💊 Pharmacist
- Manage medication inventory
- Add/remove stock
- View and fulfill prescriptions
- Track medication availability

### 👩‍💼 Assistant
- Help doctors with scheduling
- Manage appointment bookings
- Handle administrative tasks
- Support doctor workflow

## 🔧 Setup Instructions

### For Java App (Beginner-Friendly)
```bash
# Make sure Java is installed
java -version

# Navigate to project
cd src/

# Compile 
javac Main.java

# Run
java Main
```

### For Web App (Requires Setup)
```bash
# Navigate to web app
cd hospital-management/

# Install dependencies
npm install

# Create environment file
# Add your Supabase credentials to .env.local

# Setup database
# Run SQL scripts in database/ folder in Supabase

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🆚 Java vs Web Version

| Feature | Java Console | Web Application |
|---------|-------------|-----------------|
| **Interface** | Text-based terminal | Modern web interface |
| **Data Storage** | In-memory only | PostgreSQL database |
| **Users** | Sample data in code | Real user registration |
| **Accessibility** | Command-line only | Any web browser |
| **Deployment** | Run locally | Deploy to web |
| **Learning Curve** | Easy to understand | More complex setup |

## 📚 Learning Purposes

This project demonstrates:
- **Object-Oriented Programming** (Java classes)
- **Full-Stack Web Development** (Next.js + Database)
- **Healthcare System Design**
- **User Role Management**
- **Database Design** and relationships
- **Modern UI/UX** principles

## 🎓 Educational Value

### For Java Learners:
- See real-world class design
- Understand inheritance and polymorphism
- Learn about system architecture

### For Web Developers:
- Modern React/Next.js patterns
- Database integration with Supabase
- Authentication and authorization
- Responsive design with Tailwind

## 🚀 Deployment

### Java App
- Just run the `.java` files on any machine with Java installed

### Web App  
- Deploy to Vercel (recommended)
- Or any hosting platform supporting Node.js
- Requires Supabase database setup

## 📄 File Overview

### Key Java Files:
- `src/Main.java` - Main application with all functionality
- `src/objects/Patient.java` - Patient class and methods  
- `src/objects/Doctor.java` - Doctor class and methods
- `src/objects/Appointment.java` - Appointment management

### Key Web Files:
- `hospital-management/src/app/page.tsx` - Landing page
- `hospital-management/src/app/dashboard/` - Dashboard pages
- `hospital-management/database/schema.sql` - Database structure

---

**Built by:** Burak Sahin Kucuk  
**Purpose:** Hospital Management System with dual implementation  
**Tech:** Java + Next.js + TypeScript + Supabase 