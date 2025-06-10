import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import JobList from "@/components/job-list";


export default function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4">
        <HeroCarousel />
        <JobList />
      </main>
    </div>
  );
}