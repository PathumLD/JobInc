'use client';
import { Button } from "@/components/ui/button";

export default function EmployeeHeader({ userName, onLogout }: { userName: string | null, onLogout: () => void }) {
  return (
    <nav className="w-full bg-white shadow px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">Job Dashboard</div>
      <div className="flex items-center gap-4">
        <span className="text-lg">
          {userName ? `Welcome ${userName}` : 'Welcome'}
        </span>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}