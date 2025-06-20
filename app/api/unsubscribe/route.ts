import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email) {
    return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 400 });
  }

  // Find the subscriber by email
  const subscriber = await prisma.subscriber.findUnique({ where: { email } });

  if (!subscriber) {
    return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 400 });
  }

  // Delete the subscriber
  await prisma.subscriber.delete({ where: { email } });

  // You can return a JSON message, or redirect to a goodbye page
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribed`);
}