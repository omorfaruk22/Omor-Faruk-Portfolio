import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SnakeBackground from "@/components/SnakeBackground";
import ResumeModal from "@/components/ResumeModal";
import ScrollProgress from "@/components/ScrollProgress";
import AllProjectsClient from "@/components/AllProjectsClient";
import { getPortfolioData } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile, projects } = await getPortfolioData();
  return {
    title: `Projects (${projects.length}) | ${profile.name}`,
    description: `Explore all ${projects.length} web development projects built by ${profile.name}.`,
  };
}

export default function ProjectsPage() {
  return (
    <>
      <ScrollProgress />
      <SnakeBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen">
        <AllProjectsClient />
      </main>
      <Footer />
      <ResumeModal />
    </>
  );
}
