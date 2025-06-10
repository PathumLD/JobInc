'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Login successful');
      setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect to dashboard or home page
      }, 1000);
      localStorage.setItem('token', data.token); // You can use cookies or localStorage
    } else {
      setMessage(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Login</Button>
      {message && <div className="text-green-500 text-sm">{message}</div>}

      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google")}
        className="w-full mt-2"
      >
        Sign in with Google
      </Button>
    </form>
  );
}