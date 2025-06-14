import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const pending = await prisma.pendingUser.findUnique({ where: { email: cleanEmail } });
    if (!pending || pending.otp !== cleanOtp) {
      return NextResponse.json({ error: 'Invalid OTP', email: cleanEmail, otp: cleanOtp }, { status: 400 });
    }
    

    // Move to User table
    await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
        role: pending.role,
      },
    });

    console.log('Verifying:', { email, otp, pending });

    // Delete from PendingUser
    await prisma.pendingUser.delete({ where: { email } });

    return NextResponse.json({ message: 'Email verified' });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}