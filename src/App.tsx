import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SimulatorWorkspace } from './components/SimulatorWorkspace';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { ArchitectureDeepDive } from './components/ArchitectureDeepDive';

function App() {
  const [activeSim, setActiveSim] = useState<'none' | 'symptomwise' | 'reddit' | 'both'>('none');
  const [view, setView] = useState<'home' | 'deep-dive'>('home');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="bg-bg-dark text-theme-text font-sans min-h-screen relative selection:bg-accent-teal/20 selection:text-theme-text pt-16">
      {/* Fixed Header */}
      <Navbar view={view} setView={setView} />
      
      {view === 'home' ? (
        <>
          {/* Viewport Above Fold: Hero Section (Full Width) */}
          <header className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center px-6 md:px-12 xl:px-16 border-b-2 border-border-muted bg-grid-dots">
            <HeroSection setActiveSim={setActiveSim} setView={setView} />
          </header>
          
          {/* Core Portfolio Content (Full Width Sections) */}
          <StatsSection />
          <ExperienceSection activeSim={activeSim} setActiveSim={setActiveSim} />
          <SimulatorWorkspace activeSim={activeSim} setActiveSim={setActiveSim} />
          <ProjectsSection activeSim={activeSim} setActiveSim={setActiveSim} />
          <SkillsSection />
          <EducationSection />
          <ContactSection />
        </>
      ) : (
        <ArchitectureDeepDive setView={setView} />
      )}
    </div>
  );
}

export default App;
