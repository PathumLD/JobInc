import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Token is valid and not expired
    // ...your logic here...
    return NextResponse.json({ message: 'Protected data', user: decoded });
  } catch (err) {
    return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 });
  }
}