import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { Resend } from "resend";

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to generate a random token
function generateToken(length = 32) {
  return randomBytes(length).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.isConfirmed) {
        // Update the name even if already confirmed
        await prisma.subscriber.update({
          where: { email },
          data: { firstName, lastName }
        });
        return NextResponse.json({ error: "This email is already subscribed and confirmed. Your name has been updated." }, { status: 409 });
      } else {
        // Update the name and resend confirmation
        await prisma.subscriber.update({
          where: { email },
          data: { 
            firstName, 
            lastName,
            confirmToken: generateToken() // Generate a new token
          }
        });
        try {
          await sendConfirmationEmail(email, firstName, existing.confirmToken!);
          return NextResponse.json({ message: "Please check your email to confirm your subscription." });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          return NextResponse.json({ error: "Failed to send confirmation email. Please try again." }, { status: 500 });
        }
      }
    }

    // Create a new subscriber with a confirmation token
    const confirmToken = generateToken();
    await prisma.subscriber.create({
      data: {
        email,
        firstName,
        lastName,
        confirmToken,
        isConfirmed: false,
      },
    });

    await sendConfirmationEmail(email, firstName, confirmToken);

    return NextResponse.json({ message: "Please check your email to confirm your subscription." });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// Helper to send the confirmation email
async function sendConfirmationEmail(email: string, firstName: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const confirmUrl = `${baseUrl}/api/confirm?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "Quesadilla Fan Club <noreply@quesadillafanclub.com>", // Use your verified sender
    to: email,
    subject: "Confirm your subscription",
    html: `
      <p>Hi ${firstName},</p>
      <p>Thanks for joining the Quesadilla Fan Club mailing list!</p>
      <p>Please <a href="${confirmUrl}">click here to confirm your subscription</a>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
