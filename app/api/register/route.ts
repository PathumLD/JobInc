// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // should be server-side secret
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
