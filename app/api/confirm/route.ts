import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json({ error: "Invalid confirmation link." }, { status: 400 });
  }

  // Find the subscriber by email and token
  const subscriber = await prisma.subscriber.findUnique({ where: { email } });

  if (!subscriber || subscriber.confirmToken !== token) {
    return NextResponse.json({ error: "Invalid or expired confirmation link." }, { status: 400 });
  }

  if (subscriber.isConfirmed) {
    return NextResponse.json({ message: "Your email is already confirmed!" });
  }

  // Confirm the subscriber
  await prisma.subscriber.update({
    where: { email },
    data: {
      isConfirmed: true,
      confirmToken: null,
    },
  });

  // You can return a JSON message, or redirect to a thank you page
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/confirm?success=1`);
}
