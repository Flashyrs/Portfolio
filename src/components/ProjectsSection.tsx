import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, ArrowUpRight, Play, Terminal } from 'lucide-react';
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

interface ProjectsSectionProps {
  activeSim: 'none' | 'symptomwise' | 'reddit' | 'both';
  setActiveSim: (val: 'none' | 'symptomwise' | 'reddit' | 'both') => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ activeSim, setActiveSim }) => {
  return (
    <section id="projects" className="py-24 border-b-2 border-border-muted relative bg-bg-card/30">
      <div className="w-full px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
            <span>02 // PORTFOLIO</span>
          </div>
          <h2 className="text-3xl font-bold text-theme-text tracking-tight font-sans">
            Technical Projects
          </h2>
          <p className="mt-2 text-sm text-theme-text-muted max-w-xl">
            Selected engineering projects demonstrating system design, database optimization, and high-performance backend services.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resumeData.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group rounded-none border-2 border-border-muted bg-bg-card flex flex-col justify-between overflow-hidden shadow-brutalist hover:scale-[1.01] transition-all"
            >
              {/* Card Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-none bg-bg-secondary border border-border-muted text-accent-teal group-hover:text-accent-teal transition-colors">
                    <Code2 size={20} />
                  </div>
                  
                  {/* Action Links */}
                  <div className="flex items-center gap-3.5">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-theme-text-muted hover:text-accent-teal transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon size={18} />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-theme-text-muted hover:text-accent-teal transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-theme-text group-hover:text-accent-teal transition-colors font-sans">
                    {project.title}
                  </h3>
                  <p className="text-sm text-theme-text-muted leading-relaxed font-sans">
                    {project.summary}
                  </p>
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2.5 py-1 rounded-none bg-accent-light border border-border-muted/30 font-mono text-[10px] font-medium text-theme-text group-hover:border-border-muted/60 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Technical Achievements list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">
                    Key Technical Achievements
                  </h4>
                  <ul className="space-y-2.5">
                    {project.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="text-xs text-theme-text-muted leading-relaxed flex items-start gap-2.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-none bg-accent-teal shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Collapsible Gen-AI Pipeline Simulator */}
                {project.title.toLowerCase().includes('reddit') && (
                  <div className="pt-6 border-t-2 border-border-muted/20 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-accent-teal" />
                        <span className="text-[10px] font-mono font-bold text-theme-text uppercase tracking-wider">
                          Interactive Ingestion Pipeline
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
                        className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none flex items-center gap-1.5 shadow-brutalist-sm active:scale-95 ${
                          (activeSim === 'reddit' || activeSim === 'both')
                            ? 'bg-theme-text text-bg-dark border-border-muted'
                            : 'bg-accent-light text-theme-text border-border-muted hover:bg-accent-teal hover:text-white'
                        }`}
                      >
                        <Play size={10} fill={(activeSim === 'reddit' || activeSim === 'both') ? 'none' : 'currentColor'} />
                        <span>{(activeSim === 'reddit' || activeSim === 'both') ? 'Close Workspace' : 'Launch Simulator'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Decorator */}
              <div className="h-1 w-full bg-accent-teal opacity-20 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}

          {/* Banner Card: Explore other repos on Github */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-none border border-dashed border-border-muted hover:border-accent-teal/40 transition-colors bg-bg-card/40 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-brutalist-sm"
          >
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg font-bold text-theme-text font-sans">
                Looking for more of my work?
              </h3>
              <p className="text-xs text-theme-text-muted font-sans max-w-xl leading-relaxed">
                I maintain multiple other open-source repositories covering data structures, algorithm implementations, and backend system utilities.
              </p>
            </div>
            <a
              href={resumeData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-none bg-theme-text hover:opacity-90 text-bg-dark border-2 border-border-muted text-xs font-bold transition-all active:scale-95 shadow-brutalist-sm"
            >
              <GithubIcon size={14} />
              <span>Explore My GitHub Repos</span>
              <ArrowUpRight size={12} />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
