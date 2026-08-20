import Link from "next/link";

interface BookingPageProps {
  params: Promise<{
    doctorId: string;
  }>;
}

export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { doctorId } = await params;

  return (
    <div>
      <h1>Book Appointment</h1>

      <p>Doctor ID: {doctorId}</p>

      <Link href="/appointment-confirmed">
        Confirm Appointment
      </Link>
    </div>
  );
}