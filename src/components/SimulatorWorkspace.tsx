import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemSimulator } from './SystemSimulator';
import { GenerativePipelineSimulator } from './GenerativePipelineSimulator';
import { Columns, EyeOff, LayoutGrid } from 'lucide-react';

interface SimulatorWorkspaceProps {
  activeSim: 'none' | 'symptomwise' | 'reddit' | 'both';
  setActiveSim: (val: 'none' | 'symptomwise' | 'reddit' | 'both') => void;
}

export const SimulatorWorkspace: React.FC<SimulatorWorkspaceProps> = ({ activeSim, setActiveSim }) => {
  const isVisible = activeSim !== 'none';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          id="simulator-workspace"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full bg-[#090a0d] border-b-2 border-border-muted overflow-hidden py-12 relative"
        >
          <div className="w-full px-6 md:px-12 xl:px-16 space-y-6">
            
            {/* Title & Unified Tabs Control Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2026] pb-4">
              <div className="flex items-center gap-3">
                {/* macOS control dots */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="font-mono text-xs font-bold pl-2">
                  <span className="text-[#27c93f]">bash</span>
                  <span className="text-zinc-500"> - </span>
                  <span className="text-[#ffbd2e]">developer_workspace.sh</span>
                </div>
              </div>

              {/* Workspace Navigation Tabs (Brutalist style) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveSim('symptomwise')}
                  className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none shadow-brutalist-sm active:scale-95 ${
                    activeSim === 'symptomwise'
                      ? 'bg-theme-text text-bg-dark border-border-muted'
                      : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
                  }`}
                >
                  SymptomWise LLM
                </button>
                <button
                  onClick={() => setActiveSim('reddit')}
                  className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none shadow-brutalist-sm active:scale-95 ${
                    activeSim === 'reddit'
                      ? 'bg-theme-text text-bg-dark border-border-muted'
                      : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
                  }`}
                >
                  Reddit Video Gen
                </button>
                <button
                  onClick={() => setActiveSim('both')}
                  className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none flex items-center gap-1.5 shadow-brutalist-sm active:scale-95 ${
                    activeSim === 'both'
                      ? 'bg-theme-text text-bg-dark border-border-muted'
                      : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
                  }`}
                >
                  <Columns size={10} />
                  <span>Split View</span>
                </button>
                <button
                  onClick={() => setActiveSim('none')}
                  className="px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 border-red-800 bg-red-950/20 text-red-400 hover:bg-red-950 hover:text-red-200 transition-all cursor-pointer outline-none flex items-center gap-1.5 shadow-brutalist-sm active:scale-95"
                >
                  <EyeOff size={10} />
                  <span>Close Workspace</span>
                </button>
              </div>
            </div>

            {/* Simulators Mount Area */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                
                {/* 1. Split View (Both side-by-side) */}
                {activeSim === 'both' && (
                  <motion.div
                    key="split-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full max-w-7xl mx-auto"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <LayoutGrid size={12} className="text-accent-teal" />
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                          SymptomWise Pipeline Simulation
                        </h4>
                      </div>
                      <SystemSimulator />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <LayoutGrid size={12} className="text-accent-teal" />
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                          Reddit Gen-AI Video Ingestion
                        </h4>
                      </div>
                      <GenerativePipelineSimulator />
                    </div>
                  </motion.div>
                )}

                {/* 2. SymptomWise Pipeline Only */}
                {activeSim === 'symptomwise' && (
                  <motion.div
                    key="symptomwise-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-xl mx-auto space-y-3"
                  >
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        SymptomWise Pipeline Simulation
                      </h4>
                      <button
                        onClick={() => setActiveSim('reddit')}
                        className="text-[9px] font-mono text-[#38bdf8] hover:underline cursor-pointer"
                      >
                        Try Reddit Gen &rarr;
                      </button>
                    </div>
                    <SystemSimulator />
                  </motion.div>
                )}

                {/* 3. Reddit Ingestion Pipeline Only */}
                {activeSim === 'reddit' && (
                  <motion.div
                    key="reddit-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-4xl mx-auto space-y-3"
                  >
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        Reddit Gen-AI Video Ingestion
                      </h4>
                      <button
                        onClick={() => setActiveSim('symptomwise')}
                        className="text-[9px] font-mono text-[#38bdf8] hover:underline cursor-pointer"
                      >
                        &larr; Try SymptomWise Sim
                      </button>
                    </div>
                    <GenerativePipelineSimulator />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
