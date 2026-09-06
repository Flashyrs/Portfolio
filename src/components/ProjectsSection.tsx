import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Code2, 
  ArrowUpRight, 
  Play, 
  Terminal, 
  BookOpen, 
  Activity,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { resumeData } from '../data/resumeData';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface ProjectsSectionProps {
  activeSim: 'none' | 'symptomwise' | 'reddit' | 'both';
  setActiveSim: (val: 'none' | 'symptomwise' | 'reddit' | 'both') => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ activeSim, setActiveSim }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const allExpanded = resumeData.projects.every((_, idx) => !!expandedCards[idx]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedCards({});
    } else {
      const all: Record<number, boolean> = {};
      resumeData.projects.forEach((_, idx) => {
        all[idx] = true;
      });
      setExpandedCards(all);
    }
  };

  return (
    <section id="projects" className="py-24 border-b-2 border-border-muted relative bg-bg-card/30">
      <div className="w-full px-6 md:px-12 xl:px-16 space-y-12">
        
        {/* Section Heading & Global Collapse/Expand Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
              <span>02 // FEATURED SYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight font-sans">
              Technical Architectures & Flagship Projects
            </h2>
            <p className="mt-2 text-sm text-theme-text-muted max-w-2xl font-sans">
              Core backend engineering platforms demonstrating conflict-free CRDT synchronization, autonomous multimodal video compositing, and 24/7 automated scraping daemons.
            </p>
          </div>

          <button
            onClick={toggleAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-border-muted text-xs font-mono font-bold text-theme-text shadow-brutalist-sm transition-all active:scale-95 shrink-0 cursor-pointer outline-none"
          >
            {allExpanded ? <Minimize2 size={13} className="text-accent-teal" /> : <Maximize2 size={13} className="text-accent-teal" />}
            <span>{allExpanded ? 'Collapse All Details' : 'Expand All Details'}</span>
          </button>
        </div>

        {/* Projects Grid (Unexpanded compact by default, with expandable bullets) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {resumeData.projects.map((project, index) => {
            const isNarrateLoop = project.title.toLowerCase().includes('narrateloop') || project.title.toLowerCase().includes('reddit');
            const isExpanded = !!expandedCards[index];
            
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-none border-2 border-border-muted bg-bg-card flex flex-col justify-between overflow-hidden shadow-brutalist hover:scale-[1.01] transition-all h-full"
              >
                {/* Card Main Area */}
                <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col">
                  
                  {/* Top Bar with Icon & Action Links */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-2 rounded-none bg-bg-secondary border border-border-muted text-accent-teal group-hover:text-accent-teal transition-colors">
                      <Code2 size={18} />
                    </div>
                    
                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {project.statusUrl && (
                        <a
                          href={project.statusUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-text-muted hover:text-green-500 transition-colors"
                          title="View Uptime Status"
                        >
                          <Activity size={16} />
                        </a>
                      )}
                      {project.docsUrl && (
                        <a
                          href={project.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-text-muted hover:text-accent-teal transition-colors"
                          title="OpenAPI Swagger Docs (/docs)"
                        >
                          <BookOpen size={16} />
                        </a>
                      )}
                      {project.youtubeUrl && (
                        <a
                          href={project.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-text-muted hover:text-red-500 transition-colors"
                          title="YouTube Production Channel"
                        >
                          <YoutubeIcon size={16} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-text-muted hover:text-accent-teal transition-colors"
                          title="View GitHub Repository"
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-text-muted hover:text-accent-teal transition-colors"
                          title="View Live Platform"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {project.badge && (
                        <span className="px-2 py-0.5 font-mono text-[9px] font-bold border border-green-600/40 bg-green-950/20 text-green-500 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {project.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-theme-text group-hover:text-accent-teal transition-colors font-sans leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-theme-text-muted leading-relaxed font-sans">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="px-2 py-0.5 rounded-none bg-accent-light border border-border-muted/30 font-mono text-[9px] font-medium text-theme-text group-hover:border-border-muted/60 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Technical Achievements List & Simulator */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expanded-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="space-y-4 pt-3 border-t border-border-muted/30 overflow-hidden"
                      >
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-mono text-theme-text-muted uppercase tracking-wider font-bold">
                            Key Technical Achievements
                          </h4>
                          <ul className="space-y-2">
                            {project.bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="text-xs text-theme-text-muted leading-relaxed flex items-start gap-2 font-sans">
                                <span className="w-1.5 h-1.5 rounded-none bg-accent-teal shrink-0 mt-1.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Collapsible Simulator Trigger for NarrateLoop */}
                        {isNarrateLoop && (
                          <div className="pt-3 border-t border-border-muted/20 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <Terminal size={12} className="text-accent-teal" />
                                <span className="text-[9px] font-mono font-bold text-theme-text uppercase">
                                  NarrateLoop Simulator
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const isOpened = activeSim === 'reddit' || activeSim === 'both';
                                  setActiveSim(isOpened ? 'none' : 'reddit');
                                  if (!isOpened) {
                                    setTimeout(() => {
                                      document.getElementById('simulator-workspace')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 120);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-none font-mono text-[9px] font-bold border transition-all cursor-pointer outline-none flex items-center gap-1 shadow-brutalist-sm active:scale-95 ${
                                  (activeSim === 'reddit' || activeSim === 'both')
                                    ? 'bg-theme-text text-bg-dark border-border-muted'
                                    : 'bg-accent-light text-theme-text border-border-muted hover:bg-accent-teal hover:text-white'
                                }`}
                              >
                                <Play size={8} fill={(activeSim === 'reddit' || activeSim === 'both') ? 'none' : 'currentColor'} />
                                <span>{(activeSim === 'reddit' || activeSim === 'both') ? 'Close Sim' : 'Launch Sim'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Card Actions Footer */}
                <div className="p-6 sm:p-7 pt-0 space-y-3 mt-auto">
                  
                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full py-2 px-3 rounded-none font-mono text-[10px] font-bold border border-border-muted bg-bg-secondary hover:bg-accent-light text-theme-text transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none shadow-brutalist-sm active:scale-[0.98]"
                  >
                    <span>{isExpanded ? 'Collapse Architecture Details' : 'Expand Architecture Details'}</span>
                    {isExpanded ? (
                      <ChevronUp size={12} className="text-accent-teal" />
                    ) : (
                      <ChevronDown size={12} className="text-accent-teal" />
                    )}
                  </button>

                  <div className="pt-2 border-t border-border-muted/20 flex items-center justify-between">
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-accent-teal hover:underline"
                      >
                        <span>Open Live App</span>
                        <ArrowUpRight size={12} />
                      </a>
                    ) : <span />}

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-theme-text-muted hover:text-theme-text"
                    >
                      <GithubIcon size={14} />
                      <span>Source</span>
                    </a>
                  </div>

                  {/* Bottom Accent Decorator */}
                  <div className="h-0.5 w-full bg-accent-teal opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
