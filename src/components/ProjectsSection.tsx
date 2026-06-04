import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, ArrowUpRight } from 'lucide-react';
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

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-24 border-b border-border-muted relative bg-bg-card/10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
            <span>02 // PORTFOLIO</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
            Technical Projects
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl">
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
              className="group rounded-none border border-border-muted bg-bg-card flex flex-col justify-between overflow-hidden hover:border-accent-teal/60 transition-colors"
            >
              {/* Card Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-none bg-zinc-900 border border-border-muted text-accent-teal group-hover:text-white transition-colors">
                    <Code2 size={20} />
                  </div>
                  
                  {/* Action Links */}
                  <div className="flex items-center gap-3.5">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon size={18} />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-accent-teal transition-colors font-sans">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                    {project.summary}
                  </p>
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2.5 py-1 rounded-none bg-zinc-900/80 border border-border-muted/60 font-mono text-[10px] font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Technical Achievements list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Key Technical Achievements
                  </h4>
                  <ul className="space-y-2.5">
                    {project.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-none bg-accent-teal shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Decorator */}
              <div className="h-1 w-full bg-gradient-to-r from-accent-teal to-accent-teal-dark opacity-10 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}

          {/* Banner Card: Explore other repos on Github */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-none border border-dashed border-border-muted hover:border-accent-teal/40 transition-colors bg-bg-card/40 flex flex-col sm:flex-row justify-between items-center gap-6"
          >
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white font-sans">
                Looking for more of my work?
              </h3>
              <p className="text-xs text-zinc-400 font-sans max-w-xl leading-relaxed">
                I maintain multiple other open-source repositories covering data structures, algorithm implementations, and backend system utilities.
              </p>
            </div>
            <a
              href={resumeData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-none bg-accent-teal hover:bg-accent-teal-hover text-xs font-bold text-zinc-950 transition-all active:scale-95 shrink-0"
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
