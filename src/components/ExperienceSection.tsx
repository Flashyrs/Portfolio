import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Server, Zap } from 'lucide-react';
import { resumeData } from '../data/resumeData';

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="experience" className="py-24 border-b border-border-muted relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
            <span>01 // HISTORY</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
            Professional Experience
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl">
            A track record of engineering backend systems, optimizing databases, and scaling asynchronous data pipelines.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left: Tab Selectors (strictly rounded-none) */}
          <div className="md:col-span-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-l border-border-muted pb-px md:pb-0 scrollbar-none">
            {resumeData.experience.map((exp, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-none md:flex-initial text-left px-5 py-4 border-b-2 md:border-b-0 md:border-l-2 font-mono text-xs font-medium transition-all outline-none whitespace-nowrap md:whitespace-normal rounded-none cursor-pointer ${
                  activeTab === index
                    ? 'border-accent-teal text-white bg-accent-teal/5'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/30'
                }`}
              >
                <div className="font-semibold text-sm mb-0.5">{exp.company}</div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{exp.duration}</div>
              </button>
            ))}
          </div>

          {/* Right: Job Details Content */}
          <div className="md:col-span-8 min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Title and Duration */}
                <div>
                  <h3 className="text-xl font-bold text-white font-sans flex flex-wrap items-center gap-2">
                    <span>{resumeData.experience[activeTab].role}</span>
                    <span className="text-accent-teal font-mono text-sm">@ {resumeData.experience[activeTab].company}</span>
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <Calendar size={14} />
                    <span>{resumeData.experience[activeTab].duration}</span>
                  </div>
                </div>

                {/* Core Focus Block (strictly rounded-none) */}
                <div className="p-4 rounded-none bg-zinc-900/40 border border-border-muted/50 text-xs sm:text-sm text-zinc-300 font-mono flex gap-3 items-start">
                  <Server size={18} className="text-accent-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-500">Core Focus: </span>
                    {resumeData.experience[activeTab].coreFocus}
                  </div>
                </div>

                {/* Detailed Contribution Bullets */}
                <ul className="space-y-3.5">
                  {resumeData.experience[activeTab].bullets.map((bullet, index) => (
                    <li key={index} className="flex gap-3 text-sm text-zinc-400 leading-relaxed font-sans">
                      <ChevronRight size={16} className="text-accent-teal shrink-0 mt-1" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Performance impact metrics grid (strictly rounded-none) */}
                <div className="pt-6 border-t border-border-muted">
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                    Key Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {resumeData.experience[activeTab].metrics.map((metric, index) => (
                      <div key={index} className="p-4 rounded-none border border-border-muted/50 bg-bg-card flex flex-col justify-center">
                        <div className="font-mono text-lg sm:text-xl font-bold text-white flex items-center gap-1">
                          <Zap size={14} className="text-accent-teal" />
                          <span>{metric.value}</span>
                        </div>
                        <div className="mt-1 text-[10px] sm:text-xs font-medium text-zinc-500">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
