'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import JobCard, { Job } from "./job-card";
import { getFingerprint } from "@/lib/getFingerprint";
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";

const mockJobs: Job[] = [
   {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    type: "Full-time",
    postedAt: "2024-06-01",
    description: "Build and maintain UI components using React and TypeScript."
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataWorks",
    location: "New York, NY",
    type: "Full-time",
    postedAt: "2024-05-28",
    description: "Develop scalable APIs and services with Node.js and PostgreSQL."
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelPerfect",
    location: "San Francisco, CA",
    type: "Part-time",
    postedAt: "2024-06-03",
    description: "Design user interfaces and experiences for web and mobile apps."
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudSync",
    location: "Remote",
    type: "Full-time",
    postedAt: "2024-05-30",
    description: "Automate deployments and manage cloud infrastructure (AWS)."
  },
  {
    id: 5,
    title: "QA Tester",
    company: "QualityFirst",
    location: "Austin, TX",
    type: "Part-time",
    postedAt: "2024-06-02",
    description: "Test web applications and write automated test scripts."
  },
  {
    id: 6,
    title: "Mobile App Developer",
    company: "Appify",
    location: "Remote",
    type: "Full-time",
    postedAt: "2024-05-27",
    description: "Develop cross-platform mobile apps using React Native."
  },
  {
    id: 7,
    title: "Product Manager",
    company: "InnovateX",
    location: "Boston, MA",
    type: "Full-time",
    postedAt: "2024-06-04",
    description: "Lead product development and coordinate between teams."
  },
  {
    id: 8,
    title: "Technical Writer",
    company: "DocuMentor",
    location: "Remote",
    type: "Part-time",
    postedAt: "2024-05-29",
    description: "Create and maintain technical documentation for APIs."
  },
  {
    id: 9,
    title: "Full Stack Developer",
    company: "StackFlow",
    location: "Chicago, IL",
    type: "Full-time",
    postedAt: "2024-06-01",
    description: "Work on both frontend and backend of web applications."
  },
  {
    id: 10,
    title: "Data Scientist",
    company: "InsightAI",
    location: "Remote",
    type: "Full-time",
    postedAt: "2024-05-31",
    description: "Analyze data and build predictive models using Python."
  },
  {
    id: 11,
    title: "Support Engineer",
    company: "HelpDeskPro",
    location: "Denver, CO",
    type: "Part-time",
    postedAt: "2024-06-03",
    description: "Assist customers and troubleshoot technical issues."
  },
  {
    id: 12,
    title: "Security Analyst",
    company: "SecureNet",
    location: "Remote",
    type: "Full-time",
    postedAt: "2024-05-30",
    description: "Monitor and improve application and network security."
  },
  {
    id: 13,
    title: "Machine Learning Engineer",
    company: "MLWorks",
    location: "Seattle, WA",
    type: "Full-time",
    postedAt: "2024-06-02",
    description: "Deploy and optimize machine learning models in production."
  },
  {
    id: 14,
    title: "Business Analyst",
    company: "BizInsight",
    location: "Remote",
    type: "Part-time",
    postedAt: "2024-05-28",
    description: "Analyze business processes and recommend improvements."
  },
  {
    id: 15,
    title: "Web Designer",
    company: "CreativeWeb",
    location: "Los Angeles, CA",
    type: "Full-time",
    postedAt: "2024-06-04",
    description: "Design modern and responsive websites for clients."
  },
  {
    id: 16,
    title: "Product Manager",
    company: "FuelBack",
    location: "Colombo, SL",
    type: "Full-time",
    postedAt: "2025-04-04",
    description: "Lead product development and coordinate between teams."
  },
  {
    id: 17,
    title: "QA Engineer",
    company: "Quali - ty",
    location: "Austin, TX",
    type: "Part-time",
    postedAt: "2024-06-02",
    description: "Test web applications and write automated test scripts."
  },
  {
    id: 18,
    title: "Automation Engineer(Testing)",
    company: "Autonomous Tech",
    location: "Austin, TX",
    type: "Part-time",
    postedAt: "2024-06-02",
    description: "Test web applications and write automated test scripts."
  },
];

export default function JobList() {
  // Controlled input states
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [modeInput, setModeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  // Actual filter states (applied on Search)
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [lastSearch, setLastSearch] = useState<string>("");
  // const [lastType, setLastType] = useState<string>("");
  // const [lastMode, setLastMode] = useState<string>("");
  // const [lastLocation, setLastLocation] = useState<string>("");
  // const [lastCompany, setLastCompany] = useState<string>("");

  useEffect(() => {
    getFingerprint().then(setFingerprint);
  }, []);

  const resetFilters = () => {
    setSearchInput("");
    setTypeInput("");
    setModeInput("");
    setLocationInput("");
    setCompanyInput("");
    setSearch("");
    setTypeFilter("");
    setModeFilter("");
    setLocationFilter("");
    setCompanyFilter("");
  };

  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 0.4,
  };
  const fuse = new Fuse(mockJobs, fuseOptions);

  // Save search/filter history to localStorage and track last search/filter
  useEffect(() => {
    if (fingerprint) {
      const history = JSON.parse(localStorage.getItem(`searchHistory_${fingerprint}`) || "[]");
      if (search || typeFilter || modeFilter || locationFilter || companyFilter) {
        const newEntry = { search, typeFilter, modeFilter, locationFilter, companyFilter, date: new Date().toISOString() };
        const newHistory = [...history, newEntry].slice(-10);
        localStorage.setItem(
          `searchHistory_${fingerprint}`,
          JSON.stringify(newHistory)
        );
        setHasHistory(true);
        setLastSearch(search);
        // setLastType(typeFilter);
        // setLastMode(modeFilter);
        // setLastLocation(locationFilter);
        // setLastCompany(companyFilter);
      } else {
        setHasHistory(history.length > 0);
        if (history.length > 0) {
          const last = history[history.length - 1];
          setLastSearch(last.search);
          // setLastType(last.typeFilter);
          // setLastMode(last.modeFilter);
          // setLastLocation(last.locationFilter);
          // setLastCompany(last.companyFilter);
        }
      }
    }
  }, [search, typeFilter, modeFilter, locationFilter, companyFilter, fingerprint]);

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? job.type === typeFilter : true) &&
      (modeFilter ? job.location.toLowerCase().includes(modeFilter.toLowerCase()) : true) &&
      (locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
      (companyFilter ? job.company.toLowerCase().includes(companyFilter.toLowerCase()) : true)
  );

  // Recommendations: all filters affect the recommended jobs
  const recommendedJobs =
  hasHistory &&
  !search && !typeFilter && !modeFilter && !locationFilter && !companyFilter &&
  lastSearch
    ? fuse
        .search(lastSearch)
        .map((result) => result.item)
    : [];

  // Apply all filters when Search button is clicked
  const handleSearch = () => {
    setSearch(searchInput);
    setTypeFilter(typeInput);
    setModeFilter(modeInput);
    setLocationFilter(locationInput);
    setCompanyFilter(companyInput);
  };

  return (
    <section className="mt-8">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <Input
          placeholder="Search jobs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-1/4"
        />
        <select
          className="border rounded p-2"
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelancing">Freelancing</option>
        </select>
        <select
          className="border rounded p-2"
          value={modeInput}
          onChange={(e) => setModeInput(e.target.value)}
        >
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <Input
          placeholder="Location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="w-1/4"
        />
        <Input
          placeholder="Company"
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          className="w-1/4"
        />

        <Button onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
        
      </div>
      {/* Recommendations */}
      {recommendedJobs.length > 0 && (
        <div className="mb-6 border-2 border-gray-300 rounded-lg p-4">
          <h3 className="font-bold mb-2">Recommended for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No jobs found.</div>
        )}
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}