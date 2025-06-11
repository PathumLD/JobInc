import JobView, { Job } from "@/components/shared/job-view";

// Replace this with your real data fetching logic
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    description: "Build modern UIs with React.",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSoft",
    location: "New York",
    description: "Work on scalable APIs.",
    type: "Part-time",
  },
  // ...more jobs
];

export default function JobViewPage({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === Number(params.id));
  if (!job) return <div className="text-center mt-10">Job not found.</div>;
  return <JobView job={job} />;
}