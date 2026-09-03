import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany();
    return NextResponse.json({ status: 200, data: doctors });
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch doctors",  
    });
  }
}  

