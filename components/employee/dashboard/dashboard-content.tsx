'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmployeeHeader from './header';
import EmployeeSidebar from './sidebar';

// Helper to decode JWT (no external dependency)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  type: string;
};

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    description: 'Build modern UIs with React.',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'DataSoft',
    location: 'New York',
    description: 'Work on scalable APIs.',
    type: 'Part-time',
  },
  // Add more mock jobs as needed
];

export default function DashboardContent() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setUserName(payload?.name || payload?.email || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Filter jobs by search and type
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? job.type === typeFilter : true)
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <EmployeeHeader userName={userName} onLogout={handleLogout} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <EmployeeSidebar typeFilter={typeFilter} setTypeFilter={setTypeFilter} />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Search Bar */}
          <div className="mb-8 flex items-center gap-4">
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-1/2"
            />
            <Button onClick={() => setSearch('')}>Clear</Button>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 && (
              <div className="col-span-full text-center text-gray-500">No jobs found.</div>
            )}
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-gray-700 mb-1">{job.company} — {job.location}</p>
                <p className="text-gray-600 mb-2">{job.type}</p>
                <p className="text-gray-500 mb-4">{job.description}</p>
                <Button>Apply</Button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}