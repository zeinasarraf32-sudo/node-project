# QuickCare

## Project Name

**QuickCare – Medical Appointment Platform**

## Problem

Sometimes it is hard for patients to find the right doctor and book an appointment.

They may not know which doctor is available or which specialty they need.

QuickCare makes this process easier and faster.

The patient can find doctors, choose a doctor, select a date and time, and book an appointment.

## Target User

The main user of QuickCare is the patient.

The patient can find doctors, view doctor information, book appointments, and view saved appointments.

We also have an Admin page to manage doctors and patients.

## MVP Features

### 1. Browse and Search Doctors

The patient can see available doctors and search for doctors.

The patient can see information such as:

- Name
- Specialty
- Location
- Price
- Availability

### 2. View Doctor Information

The patient can view doctor information before booking an appointment.

This helps the patient choose a suitable doctor.

### 3. Book an Appointment

The patient can choose a doctor, a date, and an available time.

Then the patient can confirm the appointment.

The system prevents booking the same doctor at the same date and time twice.

Past dates cannot be booked.

### 4. View Appointments

The patient can see appointments after booking.

The appointment is saved in the database.

If the page is refreshed, the appointment is still there.

### 5. AI Assistant

QuickCare also has an AI Assistant.

The patient can write a health question or symptoms.

The AI can give general advice about which type of doctor may be suitable.

The AI does not give a medical diagnosis.

## Other Features

QuickCare also includes:

- Patient Login and Signup
- Patient Dashboard
- Patient Profile
- Admin Doctor Management
- Admin Patient Management

## Core User Flow

The main patient flow is:

```text
Browse Doctors
→ Select Doctor
→ Choose Date and Time
→ Confirm Appointment
→ Appointment Success
→ View Appointments
```

The appointment is saved in Supabase PostgreSQL.

The appointment stays in the database after refreshing the page.

## Tech Stack

We used:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Axios
- Zod
- Prisma 7
- Supabase PostgreSQL
- OpenAI API
- GPT-4o-mini
- Vercel

## How the Project Works

The frontend is built with Next.js and React.

When the user needs data, the frontend sends a request to the API.

For example:

```text
Frontend
→ API
→ Prisma
→ Supabase PostgreSQL
```

For booking:

```text
Patient chooses doctor
→ chooses date and time
→ confirms appointment
→ API checks the data
→ Prisma saves the appointment
→ Supabase PostgreSQL stores the data
```

We use Zod to check the data before saving it.

## Database

We use Supabase PostgreSQL as our database.

The main models are:

- Patient
- Doctor
- Appointment

An Appointment is connected to one Patient and one Doctor.

We use Prisma to connect the API with the database.

The database models and relations are defined in:

```text
prisma/schema.prisma
```

The data is saved in the database, so it stays there after refreshing the page.

The system also prevents the same doctor from being booked at the same date and time twice.

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

The appointments API can also filter appointments by patient, doctor, or date.

### AI Assistant

```text
POST /api/chat
```

The AI API checks the messages before sending them to the OpenAI API.

## Application Routes

```text
/                       Home
/login                  Login and Signup
/doctors                Browse Doctors
/booking/[doctorId]     Book Appointment
/appointment-success    Booking Success
/appointment-confirmed  View Appointments
/dashboard              Patient Dashboard
/profile                Patient Profile
/AIassistant            AI Assistant
/admin                   Admin Dashboard
/admin/doctors/add       Add Doctor
```

## Validation

We use Zod to check API data before saving it in the database.

The application handles different states such as:

- Loading
- Error
- Empty
- Success
- Not Found
- Form Validation

The booking system also checks for problems such as:

- Missing information
- Wrong patient ID
- Wrong doctor ID
- Booking a past date
- Booking an already reserved time

If the data is wrong, the API returns an error and does not create an invalid appointment.

## Environment Variables

The project needs these environment variables:

```env
DATABASE_URL=
DIRECT_URL=
OPENAI_API_KEY=
```

`DATABASE_URL` and `DIRECT_URL` are used for the Supabase PostgreSQL database.

`OPENAI_API_KEY` is used for the AI Assistant.

The real secret values should not be uploaded to GitHub.

The project includes a `.env.example` file with the variable names only.

## Local Setup

First install the packages:

```bash
npm install
```

Then generate Prisma Client:

```bash
npx prisma generate
```

Then run the project:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

To check the production build:

```bash
npm run build
```

## Team Members

- Malek Hamzeh
- Zeina Sarraf
- Abdulrahman Al-Kreir

## Project Links

**Figma:**  
..........

**GitHub:**  
https://github.com/zeinasarraf32-sudo/node-project

**Vercel:**  
[Add Vercel Production link]

## Testing

We tested the main parts of the project.

We checked that:

- Doctors are loaded from the database.
- The patient can select an active doctor.
- The patient can choose a future date.
- The patient can choose an available time.
- The patient can book an appointment.
- The appointment is saved in the database.
- The appointment stays after refreshing the page.
- Past dates cannot be booked.
- A booked time cannot be booked again.
- Wrong API data is rejected.
- Not Found pages do not crash the application.
- Admin can add doctors.
- Admin can edit doctors.
- Admin can delete doctors.
- Admin can manage patients.
- Login and Signup work correctly.

## AI Assistant

QuickCare has an AI Assistant.

The patient can send a health question or symptoms.

The AI can:

- Give general health guidance
- Suggest the type of doctor that may be suitable
- Avoid giving a medical diagnosis
- Tell the patient to get urgent help for emergency symptoms
- Avoid inventing doctor names or appointment information

The AI depends on the OpenAI API and available API credits.

The main appointment booking system works independently from the AI Assistant.

## Deployment

The project is deployed using Vercel.

The Vercel project needs these environment variables:

```text
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
```

Database passwords and API keys must stay private.

They should not be exposed using `NEXT_PUBLIC_`.

After deployment, we tested the production website and checked that the main booking flow works correctly.

## Known Limitations

QuickCare is still an MVP, so some parts can be improved.

Current limitations include:

- Login security is still simple.
- Password hashing is not implemented yet.
- The AI depends on OpenAI API credits.
- Doctors cannot fully manage their schedules yet.
- Appointment rescheduling is not available yet.
- Some optional profile information is not saved in the database.

## Next Step

In the future, we want to add:

- Better login security
- Secure password hashing
- Doctor schedule management
- Appointment rescheduling
- Email notifications
- Better AI guidance
- More profile data
- More automated testing

## Conclusion

QuickCare is a Full-Stack medical appointment project.

The patient can find a doctor, choose a date and time, and book an appointment.

We connected the frontend to the API, used Prisma with Supabase PostgreSQL, and saved real data in the database.

The main goal of the project is to make the full booking process work from the frontend to the database.

```text
User Interface
→ API
→ Validation
→ Prisma
→ PostgreSQL
→ Saved Data
→ Vercel Deployment
```