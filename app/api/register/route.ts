import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user or pending user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingPending = await prisma.pendingUser.findUnique({ where: { email } });
    if (existingUser || existingPending) {
      return NextResponse.json({ error: 'Email already registered or pending confirmation' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Save to PendingUser
    await prisma.pendingUser.create({
      data: { name, email, password: hashedPassword, otp },
    });

    // Send OTP email (use your real SMTP config in production)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Job App" <iamartseeker@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your confirmation code is: ${otp}`,
    });

    return NextResponse.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}