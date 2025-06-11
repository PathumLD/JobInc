'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-white shadow">
      <div className="text-2xl font-bold">Job Portal</div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push('/register')}>Sign Up</Button>
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
    </header>
  );
}