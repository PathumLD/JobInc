'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '@/components/employee/dashboard/dashboard-content';

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <DashboardContent />;
}