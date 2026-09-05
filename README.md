# QuickCare

QuickCare is a medical appointment platform that helps patients find doctors, book appointments, manage their appointments, and use an AI assistant for general medical guidance.

The application connects a Next.js frontend to real API endpoints and stores core application data persistently in Supabase PostgreSQL using Prisma.

## Problem

Finding the appropriate doctor and booking a medical appointment can be time-consuming and confusing.

QuickCare provides a simple patient flow for browsing doctors, selecting an appointment date and time, confirming a booking, and viewing appointments after they are stored in the database.

The platform also includes an AI assistant that can provide general guidance about the type of specialist a patient may need.

The AI assistant is not intended to provide medical diagnoses or replace professional medical advice.

## MVP Features

- Patient signup and login
- Browse and search doctors
- View doctor information
- Select an appointment date and available time
- Book a medical appointment
- View appointment confirmation
- View upcoming and previous appointments
- Persistent appointment data using PostgreSQL
- Admin doctor and patient management
- AI assistant for general specialist guidance

## Core User Flow

Patient Login / Signup → Browse Doctors → Select Doctor → Choose Date and Time → Enter Appointment Reason → Confirm Appointment → Appointment Success → View Appointments

Appointment data is stored in Supabase PostgreSQL and remains available after refreshing the application.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Axios
- Lucide React

### Backend

- Next.js Route Handlers
- Zod validation
- Prisma 7

### Database

- Supabase PostgreSQL

### AI

- OpenAI API
- GPT-4o-mini

### Deployment

- Vercel

## Database

QuickCare uses Supabase PostgreSQL for persistent application data.

Prisma is used as the ORM between the Next.js API layer and PostgreSQL.

Main database models:

- Patient
- Doctor
- Appointment

The models and their relations are defined in:

```text
prisma/schema.prisma
```

Appointments are connected to both a patient and a doctor.

The appointment model also protects doctor time slots so that the same doctor cannot be booked for the same date and time more than once.

## API Routes

### Authentication

```text
POST /api/auth/login
POST /api/auth/signup
```

### Doctors

```text
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/[id]
DELETE /api/doctors/[id]
```

### Patients

```text
GET    /api/patients
PUT    /api/patients/[id]
DELETE /api/patients/[id]
```

### Patient Profile

```text
/api/patient/profile
```

### Appointments

```text
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/[id]
DELETE /api/appointments/[id]
```

The appointments GET endpoint can also be used with query parameters such as patient, doctor, and appointment date filters.

### AI Assistant

```text
POST /api/chat
```

The AI endpoint validates incoming messages before sending them to the OpenAI API.

## Application Routes

```text
/                       Home
/login                  Patient authentication
/doctors                Browse doctors
/booking/[doctorId]     Book an appointment
/appointment-success    Booking success
/appointment-confirmed  Patient appointments
/dashboard              Patient dashboard
/profile                Patient profile
/AIassistant            AI assistant
/admin                   Admin dashboard
/admin/doctors/add       Add doctor
```

## Validation and Application States

Zod is used to validate API request data before it is written to the database.

The application includes handling for important UI states such as:

- Loading
- Error
- Empty
- Success
- Not Found
- Form validation

The booking flow also prevents invalid appointment requests such as:

- Missing required information
- Invalid patient or doctor identifiers
- Booking dates in the past
- Booking an already reserved doctor time slot

Invalid requests return controlled API responses instead of creating invalid database records.

## Environment Variables

Create a `.env` or `.env.local` file in the project root.

Required environment variable names:

```env
DATABASE_URL=
DIRECT_URL=
OPENAI_API_KEY=
```

`DATABASE_URL` and `DIRECT_URL` are used for the Supabase PostgreSQL connection.

`OPENAI_API_KEY` is used by the AI assistant API route.

Real environment variable values must never be committed to GitHub.

An `.env.example` file is included in the repository with variable names only.

## Local Setup

Clone the repository and move into the project directory.

Install dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The production build should complete successfully before deployment.

## Persistence Test

The main connected booking flow can be tested using the following process:

1. Sign up or log in as a patient.
2. Open the Doctors page.
3. Select an active doctor.
4. Choose an appointment date.
5. Select an available time.
6. Enter the appointment reason.
7. Confirm the appointment.
8. Verify the Appointment Success page.
9. Open My Appointments.
10. Verify that the new appointment appears.
11. Refresh the page.
12. Verify that the appointment still exists.

This confirms that the appointment is persisted in PostgreSQL rather than stored only in frontend state or mock data.

## AI Assistant

QuickCare includes an AI assistant that accepts patient messages and returns general guidance.

The assistant is designed to:

- Provide general health guidance
- Suggest the appropriate type of medical specialist when relevant
- Avoid presenting itself as a medical diagnosis
- Encourage urgent professional care for emergency symptoms
- Avoid inventing QuickCare doctor names, appointment availability, or database information

The AI implementation depends on a valid OpenAI API key and available API quota.

The main appointment booking flow works independently from the AI service.

## Project Structure

```text
app/
├── (admin)/
├── (patient)/
└── api/

components/
├── admin/
├── assistant/
├── appointment/
├── booking/
├── dashboard/
├── doctors/
├── home/
└── navbar/

interfaces/
lib/
prisma/
```

## Deployment

The application is prepared for deployment using Vercel.

The following environment variables must be configured in the Vercel project:

```text
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
```

Database credentials and API keys must remain server-side and must not be exposed through `NEXT_PUBLIC_` environment variables.

After deployment, the production application should be tested in a private/incognito browser window.

## Current Limitations

- Authentication is implemented as a simplified MVP authentication system.
- Password hashing and a complete production authentication/session solution are not yet implemented.
- AI responses depend on OpenAI API availability and quota.
- Appointment rescheduling is not currently part of the implemented MVP.
- Some optional profile information is not part of the persistent database schema.

## Future Improvements

- Secure password hashing
- Production-grade session authentication
- Doctor-managed availability schedules
- Appointment rescheduling
- Email appointment notifications
- Improved AI-assisted specialist guidance
- Additional profile persistence
- Extended automated testing

## Project Goal

The goal of QuickCare is to demonstrate a complete full-stack product flow:

```text
User Interface
→ API
→ Validation
→ Prisma
→ PostgreSQL
→ Persistent Data
→ Production Deployment
```

The primary focus of the MVP is a reliable end-to-end patient appointment booking experience.