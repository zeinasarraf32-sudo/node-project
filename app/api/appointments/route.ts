import { NextResponse } from "next/server";

let appointments = [
  {
    id: 1,
    patientName: "John Doe",
    doctorName: "Dr. Ahmad",
    date: "2026-09-01",
    time: "10:00",
    status: "Pending",
  },
];

// GET: Retrieve all appointments
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: appointments,
    },
    { status: 200 }
  );
}

// POST: Create a new appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { patientName, doctorName, date, time } = body;

    if (!patientName || !doctorName || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          message: "All appointment fields are required",
        },
        { status: 400 }
      );
    }

    const newAppointment = {
      id: appointments.length + 1,
      patientName,
      doctorName,
      date,
      time,
      status: "Pending",
    };

    appointments.push(newAppointment);

    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully",
        data: newAppointment,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request data",
      },
      { status: 400 }
    );
  }
}