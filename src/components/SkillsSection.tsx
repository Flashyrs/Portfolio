import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Network } from 'lucide-react';
import { resumeData } from '../data/resumeData';

const categoryIcons: Record<string, React.ReactNode> = {
  "Languages": <Terminal className="text-accent-teal" size={18} />,
  "Backend & Cloud": <Cpu className="text-accent-teal" size={18} />,
  "Databases & Caching": <Database className="text-accent-teal" size={18} />,
  "Architecture & Systems": <Network className="text-accent-teal" size={18} />
};

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-24 border-b-2 border-border-muted relative">
      <div className="w-full px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
            <span>03 // EXPERTISE</span>
          </div>
          <h2 className="text-3xl font-bold text-theme-text tracking-tight font-sans">
            Technical Stack
          </h2>
          <p className="mt-2 text-sm text-theme-text-muted max-w-xl">
            My core technical toolset spans high-performance runtime environments, modern databases, cloud infrastructure, and low-latency systems design.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.skills.map((skillCat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-none border-2 border-border-muted bg-bg-card flex flex-col gap-6 shadow-brutalist"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 border-b border-border-muted/50 pb-4">
                <div className="p-2 rounded-none bg-bg-secondary border border-border-muted">
                  {categoryIcons[skillCat.category] || <Terminal size={18} />}
                </div>
                <h3 className="font-mono text-sm font-bold text-theme-text">
                  {skillCat.category}
                </h3>
              </div>

              {/* Skills Tags List (strictly rounded-none) */}
              <div className="flex flex-wrap gap-2.5">
                {skillCat.skills.map((skill, skillIdx) => (
                  <motion.span
                    key={skillIdx}
                    whileHover={{ scale: 1.03, borderColor: 'var(--theme-accent)' }}
                    className="px-3.5 py-1.5 rounded-none border border-border-muted bg-accent-light font-mono text-xs text-theme-text font-bold cursor-default transition-all flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-none bg-accent-teal" />
                    <span>{skill}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
