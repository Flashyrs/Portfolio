import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';

function App() {
  return (
    <div className="bg-bg-dark text-zinc-400 font-sans min-h-screen relative selection:bg-accent-indigo/30 selection:text-white">
      {/* Fixed Header */}
      <Navbar />
      
      {/* Content Sections */}
      <main>
        <HeroSection />
        <StatsSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
