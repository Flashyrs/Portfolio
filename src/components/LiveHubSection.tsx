import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Activity, 
  Server, 
  Radio, 
  ArrowUpRight,
  BookOpen,
  Layers,
  Sparkles,
  Globe
} from 'lucide-react';
import { resumeData } from '../data/resumeData';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
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

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
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

type FilterCategory = 'ALL' | 'GenAI & Media' | 'Distributed & Cloud' | 'Realtime & WebRTC' | 'Algorithms & DevTools' | 'IoT & Companions';

export const LiveHubSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('ALL');
  const infra = resumeData.oracleInfrastructure;

  const categories: FilterCategory[] = [
    'ALL',
    'GenAI & Media',
    'Distributed & Cloud',
    'Realtime & WebRTC',
    'Algorithms & DevTools',
    'IoT & Companions'
  ];

  const filteredProjects = selectedCategory === 'ALL'
    ? resumeData.liveProjects.filter(p => p.id !== 'desktopbuddy')
    : resumeData.liveProjects.filter(p => p.category === selectedCategory);

  return (
    <section id="live-projects" className="py-24 border-b-2 border-border-muted relative bg-bg-dark">
      <div className="w-full px-6 md:px-12 xl:px-16 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
              <Radio size={14} className="animate-pulse" />
              <span>03 // PRODUCTION ECOSYSTEM & DEPLOYMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight font-sans">
              Live Projects & Cloud Infrastructure
            </h2>
            <p className="mt-2 text-sm text-theme-text-muted max-w-2xl font-sans">
              Production cloud services and 24/7 background daemons actively deployed across Oracle Cloud VM, Vercel, and GitHub Pages. Monitored continuously via Uptime Kuma with automated health check heartbeats.
            </p>
          </div>

          {/* Quick Uptime Station Trigger */}
          <a
            href={infra.statusHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-border-muted text-xs font-mono font-bold text-theme-text shadow-brutalist transition-all active:scale-95 shrink-0"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span>Uptime Kuma Station</span>
            <ArrowUpRight size={14} className="text-accent-teal" />
          </a>
        </div>

        {/* Oracle Cloud VM Infrastructure Blueprint Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-none border-2 border-border-muted bg-bg-card shadow-brutalist overflow-hidden"
        >
          {/* Card Titlebar */}
          <div className="px-6 py-4 border-b-2 border-border-muted bg-bg-secondary flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-accent-light border border-border-muted text-accent-teal">
                <Server size={18} />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-theme-text block uppercase tracking-wider">
                  Oracle Cloud Infrastructure (OCI Always Free)
                </span>
                <span className="font-mono text-[11px] text-theme-text-muted">
                  Ubuntu 22.04 LTS (x86_64) • 24/7 PM2 & systemd Daemons
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-green-950/20 border border-green-600/40 text-green-500 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                99.9% Cloud Uptime
              </span>
              <span className="px-2.5 py-1 bg-accent-light border border-border-muted/30 text-theme-text font-mono text-[10px] font-bold">
                Cost: {infra.cost}
              </span>
            </div>
          </div>

          {/* Infrastructure Body */}
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {infra.daemons.map((daemon, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-bg-dark border-2 border-border-muted/60 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-accent-teal">
                        {daemon.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 border border-border-muted/40 bg-bg-card text-theme-text-muted">
                        {daemon.manager}
                      </span>
                    </div>
                    <p className="text-xs text-theme-text-muted font-sans leading-relaxed">
                      {daemon.purpose}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-green-500 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>STATUS: {daemon.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cloud Networking & Monitoring Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-border-muted/40">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-theme-text-muted font-bold block">
                  Reverse Proxy & SSL
                </span>
                <p className="text-xs text-theme-text font-sans">
                  {infra.networking.proxy} • {infra.networking.ssl}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-theme-text-muted font-bold block">
                  Dynamic DNS Routing
                </span>
                <p className="text-xs text-theme-text font-sans">
                  {infra.networking.dns}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-theme-text-muted font-bold block">
                  Live Status Hub
                </span>
                <a 
                  href={infra.statusHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-accent-teal hover:underline flex items-center gap-1 font-bold"
                >
                  <span>flashyrs.duckdns.org/status/links</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-border-muted pb-4">
          <span className="text-xs font-mono font-bold text-theme-text-muted mr-2 flex items-center gap-1.5">
            <Layers size={14} />
            <span>FILTER:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-none font-mono text-[11px] font-bold border-2 transition-all cursor-pointer outline-none shadow-brutalist-sm active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-theme-text text-bg-dark border-border-muted'
                  : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 7 Live Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group rounded-none border-2 border-border-muted bg-bg-card flex flex-col justify-between overflow-hidden shadow-brutalist hover:scale-[1.01] transition-all"
              >
                {/* Project Card Content */}
                <div className="p-6 space-y-5">
                  
                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                        {project.status} • {project.latency}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 font-mono text-[9px] font-semibold border border-border-muted/30 bg-bg-secondary text-theme-text-muted">
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-theme-text group-hover:text-accent-teal transition-colors font-sans flex items-center justify-between">
                      <span>{project.title}</span>
                      {project.featured && (
                        <Sparkles size={14} className="text-accent-teal shrink-0" />
                      )}
                    </h3>
                    <p className="text-xs font-mono text-accent-teal font-medium">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-theme-text-muted font-sans leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.stack.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="px-2 py-0.5 font-mono text-[9px] bg-accent-light border border-border-muted/20 text-theme-text"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="pt-4 border-t border-border-muted/20 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Launch Live Link Button */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-text text-bg-dark hover:opacity-90 border-2 border-border-muted font-mono font-bold text-[11px] shadow-brutalist-sm transition-all active:scale-95"
                    >
                      <Globe size={12} />
                      <span>Launch App</span>
                      <ArrowUpRight size={12} />
                    </a>

                    {/* Secondary Action Links */}
                    <div className="flex items-center gap-2">
                      {project.docsUrl && (
                        <a
                          href={project.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-border-muted text-theme-text-muted hover:text-accent-teal hover:border-accent-teal transition-colors"
                          title="OpenAPI Swagger /docs"
                        >
                          <BookOpen size={14} />
                        </a>
                      )}
                      {project.youtubeUrl && (
                        <a
                          href={project.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-border-muted text-theme-text-muted hover:text-red-500 hover:border-red-500 transition-colors"
                          title="YouTube Production Channel"
                        >
                          <YoutubeIcon size={14} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-border-muted text-theme-text-muted hover:text-accent-teal hover:border-accent-teal transition-colors"
                          title="View GitHub Repository"
                        >
                          <GithubIcon size={14} />
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Bottom Strip */}
                  <div className="h-0.5 w-full bg-accent-teal opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Monitoring & Status Bar Banner */}
        <div className="p-6 md:p-8 rounded-none border-2 border-border-muted bg-bg-card/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brutalist-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-light border border-border-muted text-accent-teal shrink-0">
              <Activity size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-mono text-theme-text uppercase tracking-wide">
                Live Status Station & Heartbeat Telemetry
              </h4>
              <p className="text-xs text-theme-text-muted font-sans max-w-xl leading-relaxed">
                All 7 services, Neon database connection pools, and external company APIs are pinged every 60 seconds by our Uptime Kuma instance with automated SSL certificate validation.
              </p>
            </div>
          </div>

          <a
            href={infra.statusHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-theme-text text-bg-dark hover:opacity-90 border-2 border-border-muted text-xs font-mono font-bold transition-all active:scale-95 shadow-brutalist shrink-0"
          >
            <span>View Live Status Page</span>
            <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};
