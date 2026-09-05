# QuickCare Assistant

QuickCare Assistant is a medical appointment platform that helps patients find doctors and book appointments through a simple and user-friendly experience.

The application connects the frontend to a real backend API and stores appointment data persistently in Supabase PostgreSQL using Prisma.

## Problem

Finding the right doctor and booking a medical appointment can be time-consuming and confusing.

QuickCare Assistant provides patients with a simple flow for finding doctors, selecting an appointment date and time, booking an appointment, and managing their appointments.

## MVP Features

1. Patient authentication
2. Browse and search doctors
3. Book a medical appointment
4. View appointment confirmation and details
5. View and manage patient appointments

## Core User Flow

Find Doctor → Select Doctor → Choose Date and Time → Confirm Appointment → Success → View Appointments → View Details

Appointment data is stored in PostgreSQL and remains available after refreshing the application.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js API Routes
- TanStack React Query
- Axios
- Zod
- Prisma 7
- Supabase PostgreSQL
- Vercel

## Database

The application uses Supabase PostgreSQL as the database.

Prisma is used as the ORM between the API layer and PostgreSQL.

Main database models:

- Patient
- Doctor
- DoctorSchedule
- Appointment
- DoctorReview
- AiConversation

## API Routes

### Appointments

- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/[id]`
- `DELETE /api/appointments/[id]`

### Doctors

- `GET /api/doctors`
- `POST /api/doctors`
- `PUT /api/doctors/[id]`
- `DELETE /api/doctors/[id]`

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/signup`

## Validation and UI States

Zod is used to validate appointment data before it is stored in the database.

The main user flow includes:

- Loading State
- Error State
- Empty State
- Success State
- Not Found State
- Form Validation

Invalid requests return controlled API error responses instead of being inserted into the database.

## Environment Variables

Create a `.env` file in the project root.

Required environment variables:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_BASE_URL=
```

Do not commit real database credentials to GitHub.

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Then open the application at:

`http://localhost:3000`

## Production Build

Before deployment, run:

```bash
npm run build
```

## Deployment

The application is deployed using Vercel.

Production database environment variables must be configured in Vercel.

## Persistence Test

To verify the main connected flow:

1. Log in as a patient.
2. Open the Doctors page.
3. Select a doctor.
4. Choose a date and time.
5. Confirm the appointment.
6. Verify the Success page.
7. Open My Appointments.
8. Refresh the page.
9. Verify that the appointment still exists.
10. Open Appointment Details.

This confirms that appointment data is persisted in PostgreSQL rather than stored as mock frontend data.

## Project Structure

```text
app/
  api/
    appointments/
    auth/
    doctors/

components/
interfaces/
lib/
prisma/
```

## Current Limitations

- Authentication is implemented as a simplified MVP authentication flow.
- Some secondary dashboard and admin content may use static presentation data.
- The main production MVP focuses on the patient appointment booking flow.

## Future Improvements

- Secure password hashing and session-based authentication
- Doctor availability management
- Appointment rescheduling
- Improved AI doctor recommendations
- Email and appointment notifications