import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Terminal from "@/components/Terminal";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Connect from "@/components/Connect";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SnakeBackground from "@/components/SnakeBackground";
import ResumeModal from "@/components/ResumeModal";

export default function Home() {
  return (
    <>
      <SnakeBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Terminal />
        <About />
        <Skills />
        <Education />
        <Experience />
        <Services />
        <Projects />
        <Connect />
        <Contact />
      </main>
      <Footer />
      <ResumeModal />
    </>
  );
}
