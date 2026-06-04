import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Terminal as TerminalIcon } from 'lucide-react';
import { resumeData } from '../data/resumeData';
import { DeveloperIllustration } from './DeveloperIllustration';

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

const LinkedinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LeetcodeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.777 9.778a1.38 1.38 0 0 0-.002 1.95l1.9 1.9a1.378 1.378 0 0 0 1.951-.002l7.456-7.457 1.9 1.899c.3.3.695.459 1.096.441a1.08 1.08 0 0 0 .775-.327l1.9-1.9a1.38 1.38 0 0 0 0-1.95l-5.348-5.349A1.375 1.375 0 0 0 13.483 0zm-6.09 14.42a1.378 1.378 0 0 0-1.95 0l-1.9 1.9a1.378 1.378 0 0 0 0 1.95l9.778 9.778c.36.36.88.52 1.381.42a1.378 1.378 0 0 0 .96-.414l9.778-9.778a1.378 1.378 0 0 0 0-1.95l-1.9-1.9a1.378 1.378 0 0 0-1.95 0l-7.46 7.46-1.896-1.898a1.378 1.378 0 0 0-1.95 0z" />
  </svg>
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center bg-grid-dots overflow-hidden">
      {/* Absolute Ambient Teal Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-teal-dark/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Typographical Profile Info */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Avatar Stamp and Badge Container */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 border border-border-muted bg-bg-card p-1 flex items-center justify-center shrink-0">
              <DeveloperIllustration className="w-full h-full text-zinc-400" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-accent-teal/30 bg-accent-teal/5 text-xs font-mono text-accent-teal"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
              </span>
              <span>Available for Full-time Roles</span>
            </motion.div>
          </div>

          {/* Name intro */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xs uppercase tracking-widest font-mono text-zinc-500 mb-2"
          >
            Hi, I'm <span className="text-zinc-300 font-semibold">{resumeData.name}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans"
          >
            I architect high-performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-teal-hover">backend</span> systems.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-sans"
          >
            {resumeData.about}
          </motion.p>

          {/* Social Links & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4 items-center"
          >
            <a
              href={resumeData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-accent-teal transition-colors group"
            >
              <LinkedinIcon size={18} className="group-hover:text-accent-teal transition-colors" />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-accent-teal transition-colors" />
            </a>

            <span className="w-1.5 h-1.5 bg-zinc-700 hidden sm:inline" />

            <a
              href={resumeData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-accent-teal transition-colors group"
            >
              <GithubIcon size={18} className="group-hover:text-accent-teal transition-colors" />
              <span>GitHub</span>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-accent-teal transition-colors" />
            </a>

            <span className="w-1.5 h-1.5 bg-zinc-700 hidden sm:inline" />

            <a
              href={resumeData.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-accent-teal transition-colors group"
            >
              <LeetcodeIcon size={18} className="text-zinc-300 group-hover:text-accent-teal transition-colors" />
              <span>LeetCode</span>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-accent-teal transition-colors" />
            </a>
          </motion.div>
        </div>

        {/* Backend Console / Terminal Widget (strictly 90-degree rectangle corners) */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-none border border-border-muted bg-bg-card shadow-2xl overflow-hidden font-mono text-xs text-zinc-300 w-full max-w-md mx-auto"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-border-muted">
              {/* Window dots remain circles for standard console styling */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <TerminalIcon size={12} />
                <span>bash - system.sh</span>
              </div>
              <div className="w-12" /> {/* spacer */}
            </div>

            {/* Terminal Body */}
            <div className="p-5 space-y-4 leading-normal select-none">
              <div>
                <span className="text-accent-teal">guest@roshanshukla</span>
                <span className="text-zinc-500">:</span>
                <span className="text-accent-teal-dark">~</span>
                <span className="text-zinc-100">$</span>{' '}
                <span className="text-zinc-200">curl -s https://api.roshan.shukla/health</span>
              </div>
              <div className="text-zinc-500 bg-zinc-950/40 p-3 border border-border-muted/30 rounded-none">
                <pre className="text-accent-teal overflow-x-auto whitespace-pre">
{`{
  "status": "healthy",
  "uptime": "99.99%",
  "active_stack": ["Java", "Spring Boot", "Redis"],
  "focus": "Distributed Systems"
}`}
                </pre>
              </div>

              <div className="pt-2">
                <span className="text-accent-teal">guest@roshanshukla</span>
                <span className="text-zinc-500">:</span>
                <span className="text-accent-teal-dark">~</span>
                <span className="text-zinc-100">$</span>{' '}
                <span className="text-zinc-200">cat current_metrics.json</span>
              </div>
              <div className="text-zinc-500 bg-zinc-950/40 p-3 border border-border-muted/30 rounded-none">
                <pre className="text-zinc-400 overflow-x-auto whitespace-pre">
{`{
  "L1_L2_semantic_cache": {
    "hit_rate": "61%",
    "p99_latency": "213ms"
  },
  "event_driven_pipeline": {
    "throughput_multiplier": "250%"
  }
}`}
                </pre>
              </div>

              <div className="flex items-center gap-1 text-zinc-500 pt-2 animate-pulse">
                <span>&gt; Cursor active...</span>
                <span className="w-1.5 h-3 bg-zinc-400 inline-block" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
