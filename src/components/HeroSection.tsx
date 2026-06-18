import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play, Activity } from 'lucide-react';
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
    <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039 0.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396 -2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" />
  </svg>
);

interface HeroSectionProps {
  setActiveSim: (val: 'none' | 'symptomwise' | 'reddit' | 'both') => void;
  setView: (val: 'home' | 'deep-dive') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveSim, setView }) => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center bg-grid-dots overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Typographical Profile Info */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Status Badge */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none border-2 border-border-muted bg-bg-card text-xs font-mono text-theme-text shadow-brutalist-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
              </span>
              <span className="font-bold">Seeking Full-time SDE Roles</span>
            </motion.div>
          </div>

          {/* Name intro */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xs uppercase tracking-widest font-mono text-theme-text-muted mb-2"
          >
            Hi, I'm <span className="text-theme-text font-bold">{resumeData.name}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-theme-text leading-tight font-sans"
          >
            I architect high-performance <span className="underline decoration-2 decoration-accent-teal">backend</span> systems.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-theme-text-muted leading-relaxed font-sans"
          >
            {resumeData.about}
          </motion.p>

          {/* Primary & Secondary Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button
              onClick={() => {
                setActiveSim('both');
                setTimeout(() => {
                  document.getElementById('simulator-workspace')?.scrollIntoView({ behavior: 'smooth' });
                }, 120);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-theme-text text-bg-dark border-2 border-border-muted font-mono font-bold text-xs hover:opacity-90 transition-all active:scale-95 shadow-brutalist cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              <span>Launch Simulator Workspace</span>
            </button>

            <button
              onClick={() => {
                setView('deep-dive');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800 text-theme-text border-2 border-border-muted font-mono font-bold text-xs transition-all active:scale-95 shadow-brutalist cursor-pointer"
            >
              <Activity size={14} />
              <span>Architecture Deep Dive</span>
            </button>
          </motion.div>

          {/* Social Links & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 flex flex-wrap gap-4 items-center"
          >
            <a
              href={resumeData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-theme-text hover:text-accent-teal transition-all group"
            >
              <LinkedinIcon size={18} />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} className="text-theme-text-muted group-hover:text-accent-teal" />
            </a>

            <span className="w-1.5 h-1.5 bg-border-muted hidden sm:inline" />

            <a
              href={resumeData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-theme-text hover:text-accent-teal transition-all group"
            >
              <GithubIcon size={18} />
              <span>GitHub</span>
              <ArrowUpRight size={14} className="text-theme-text-muted group-hover:text-accent-teal" />
            </a>

            <span className="w-1.5 h-1.5 bg-border-muted hidden sm:inline" />

            <a
              href={resumeData.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-theme-text hover:text-accent-teal transition-all group"
            >
              <LeetcodeIcon size={18} />
              <span>LeetCode</span>
              <ArrowUpRight size={14} className="text-theme-text-muted group-hover:text-accent-teal" />
            </a>
          </motion.div>
        </div>

        {/* Backend Console Widget (strictly 90-degree rectangle corners) */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-none border-2 border-border-muted bg-[#0d0e12] shadow-brutalist-lg overflow-hidden font-mono text-xs text-zinc-300 w-full max-w-md mx-auto"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-[#1f2026]">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-bold text-[10px]">
                  <span className="text-[#27c93f]">bash</span>
                  <span className="text-zinc-500"> - </span>
                  <span className="text-[#ffbd2e]">system.sh</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#27c93f] animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-500 font-mono">HEALTH_CHECK</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 space-y-4 leading-normal select-none">
              <div>
                <span className="text-[#27c93f] font-bold">guest@roshanshukla</span>
                <span className="text-zinc-500">:</span>
                <span className="text-[#ffbd2e] font-bold">~</span>
                <span className="text-zinc-400 font-bold">$</span>{' '}
                <span className="text-[#38bdf8]">curl</span> <span className="text-zinc-100">-s https://api.roshan.shukla/health</span>
              </div>
              <div className="text-zinc-300 bg-[#13151b] p-3 border border-[#1f2026] rounded-none">
                <pre className="overflow-x-auto whitespace-pre font-bold">
                  <span className="text-zinc-400">{'{'}</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"status"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"seeking_sde_roles"</span><span className="text-zinc-400">,</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"uptime"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"99.99%"</span><span className="text-zinc-400">,</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"active_stack"</span><span className="text-zinc-400">:</span> <span className="text-zinc-400">[</span><span className="text-[#ce9178]">"Java"</span><span className="text-zinc-400">,</span> <span className="text-[#ce9178]">"Spring Boot"</span><span className="text-zinc-400">,</span> <span className="text-[#ce9178]">"Redis"</span><span className="text-zinc-400">]</span><span className="text-zinc-400">,</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"focus"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"Backend Systems"</span>{"\n"}
                  <span className="text-zinc-400">{'}'}</span>
                </pre>
              </div>

              <div className="pt-2">
                <span className="text-[#27c93f] font-bold">guest@roshanshukla</span>
                <span className="text-zinc-500">:</span>
                <span className="text-[#ffbd2e] font-bold">~</span>
                <span className="text-zinc-400 font-bold">$</span>{' '}
                <span className="text-[#38bdf8]">cat</span> <span className="text-zinc-100">current_metrics.json</span>
              </div>
              <div className="text-zinc-300 bg-[#13151b] p-3 border border-[#1f2026] rounded-none">
                <pre className="overflow-x-auto whitespace-pre font-bold">
                  <span className="text-zinc-400">{'{'}</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"L1_L2_semantic_cache"</span><span className="text-zinc-400">:</span> <span className="text-zinc-400">{'{'}</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">"hit_rate"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"61%"</span><span className="text-zinc-400">,</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">"p99_latency"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"213ms"</span>{"\n"}
                  {"  "}<span className="text-zinc-400">{'}'}</span><span className="text-zinc-400">,</span>{"\n"}
                  {"  "}<span className="text-[#9cdcfe]">"event_driven_pipeline"</span><span className="text-zinc-400">:</span> <span className="text-zinc-400">{'{'}</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">"throughput_multiplier"</span><span className="text-zinc-400">:</span> <span className="text-[#ce9178]">"250%"</span>{"\n"}
                  {"  "}<span className="text-zinc-400">{'}'}</span>{"\n"}
                  <span className="text-zinc-400">{'}'}</span>
                </pre>
              </div>

              <div className="flex items-center gap-1 text-zinc-500 pt-2 animate-pulse font-bold">
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
