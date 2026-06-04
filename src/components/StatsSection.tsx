import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../data/resumeData';

export const StatsSection: React.FC = () => {
  return (
    <section className="py-12 border-y border-border-muted bg-bg-card/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {resumeData.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4, borderColor: '#14b8a6' }}
              className="p-6 rounded-none border border-border-muted bg-bg-dark/50 flex flex-col justify-center transition-all group relative overflow-hidden"
            >
              {/* Teal gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-baseline gap-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
                  {stat.value}
                </span>
                <span className="text-accent-teal text-lg">.</span>
              </div>
              
              <div className="mt-2 text-sm font-semibold text-zinc-200 font-sans">
                {stat.label}
              </div>
              
              <div className="mt-1 text-xs text-zinc-500 font-mono">
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
