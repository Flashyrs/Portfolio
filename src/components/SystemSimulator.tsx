import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

interface RequestItem {
  id: string;
  type: 'routine' | 'urgent' | 'emergency';
  priority: number; // 1: Emergency, 2: Urgent, 3: Routine
  enqueueTime: number;
  completedTime?: number;
  processingTime?: number;
}

export const SystemSimulator: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'booting' | 'playing' | 'crashed' | 'success'>('idle');
  const [crashReason, setCrashReason] = useState<'OOM' | 'QUEUE_OVERFLOW' | null>(null);
  const [bootCountdown, setBootCountdown] = useState(3);
  const [isLaunched, setIsLaunched] = useState(false);

  const [cacheEnabled, setCacheEnabled] = useState(false);
  const [triageBypassEnabled, setTriageBypassEnabled] = useState(false);
  const [queueAgingEnabled, setQueueAgingEnabled] = useState(false);
  const [workersCount, setWorkersCount] = useState<1 | 2 | 3>(1);

  const [renderStats, setRenderStats] = useState({
    processedCount: 0,
    queue: [] as RequestItem[],
    activeWorkers: [] as RequestItem[],
    latencyStats: [] as number[],
    vram: 0,
    logs: [] as string[]
  });

  const simStateRef = useRef({
    processedCount: 0,
    queue: [] as RequestItem[],
    activeWorkers: [] as RequestItem[],
    latencyStats: [] as number[],
    vram: 70,
    logs: [] as string[],
    requestIndex: 0,
    lastRequestTime: 0,
    nextRequestDelay: 1500
  });

  const totalTarget = 100;

  const startBootPhase = () => {
    setGameState('booting');
    setCrashReason(null);
    setBootCountdown(3);
    
    simStateRef.current = {
      processedCount: 0,
      queue: [],
      activeWorkers: [],
      latencyStats: [],
      vram: 70,
      logs: ['[SYSTEM] Initializing LLM Inference Pipeline...', '[SYSTEM] Status: Bounded Queue capacity = 5. VRAM Limit = 100%'],
      requestIndex: 0,
      lastRequestTime: 0,
      nextRequestDelay: 1500
    };

    setRenderStats({
      processedCount: 0,
      queue: [],
      activeWorkers: [],
      latencyStats: [],
      vram: 70,
      logs: simStateRef.current.logs
    });
  };

  useEffect(() => {
    if (gameState !== 'booting') return;

    const bootTimer = setInterval(() => {
      setBootCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(bootTimer);
          setGameState('playing');
          simStateRef.current.lastRequestTime = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(bootTimer);
  }, [gameState]);

  const getNextInterval = (index: number) => {
    if (index < 5) return 1500;
    if (index < 15) return 800;
    if (index < 45) return 400;
    if (index < 75) return 80;   // Spike: Severe load surge! Queue will build up here.
    return 300;                  // Draining phase
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const state = simStateRef.current;
      const newLogs: string[] = [];

      const completed = state.activeWorkers.filter((w) => w.completedTime && w.completedTime <= now);
      const remainingWorkers = state.activeWorkers.filter((w) => !w.completedTime || w.completedTime > now);

      if (completed.length > 0) {
        completed.forEach((w) => {
          const latencyVal = (w.completedTime || now) - w.enqueueTime;
          const qTime = latencyVal - (w.processingTime || 350);
          state.latencyStats.push(latencyVal);
          state.processedCount += 1;
          newLogs.push(`[WORKER] Finished processing ${w.id}. Turnaround: ${latencyVal}ms (GPU: ${w.processingTime || 350}ms, Queue: ${Math.max(0, qTime)}ms).`);
        });
        state.activeWorkers = remainingWorkers;
      }

      const totalGenerated = state.processedCount + state.queue.length + state.activeWorkers.length;
      if (totalGenerated < totalTarget && (now - state.lastRequestTime >= state.nextRequestDelay)) {
        state.requestIndex += 1;
        
        const rand = Math.random();
        let type: 'routine' | 'urgent' | 'emergency';
        let priority: number;

        if (rand < 0.6) {
          type = 'routine';
          priority = 3;
        } else if (rand < 0.85) {
          type = 'urgent';
          priority = 2;
        } else {
          type = 'emergency';
          priority = 1;
        }

        const newReq: RequestItem = {
          id: `REQ-${state.requestIndex}`,
          type,
          priority,
          enqueueTime: now
        };

        newLogs.push(`[REQUEST] Received ${newReq.id} - ${type.toUpperCase()}`);

        if (type === 'routine' && cacheEnabled && Math.random() < 0.61) {
          newLogs.push(`[CACHE] L1/L2 Cache Hit for ${newReq.id}. Returned in 2ms.`);
          state.latencyStats.push(2);
          state.processedCount += 1;
        }
        else if (type === 'emergency' && triageBypassEnabled) {
          newLogs.push(`[SAFETY] Emergency bypass for ${newReq.id}. Routed directly (5ms).`);
          state.latencyStats.push(5);
          state.processedCount += 1;
        }
        else {
          if (type === 'routine' && cacheEnabled) {
            newLogs.push(`[CACHE] Cache Miss for ${newReq.id}. Enqueuing...`);
          }
          state.queue.push(newReq);

          state.queue.sort((a, b) => {
            if (queueAgingEnabled) {
              const ageA = (now - a.enqueueTime) / 1000;
              const ageB = (now - b.enqueueTime) / 1000;
              const scoreA = a.priority - ageA * 0.5;
              const scoreB = b.priority - ageB * 0.5;
              return scoreA - scoreB;
            }
            return a.priority - b.priority;
          });

          if (state.queue.length > 5) {
            setGameState('crashed');
            setCrashReason('QUEUE_OVERFLOW');
            newLogs.push(`[CRITICAL] Queue Overflow! Capacity (> 5) exceeded.`);
            clearInterval(intervalId);
          }
        }

        state.lastRequestTime = now;
        state.nextRequestDelay = getNextInterval(state.requestIndex);
      }

      if (gameState === 'playing' && state.queue.length > 0 && state.activeWorkers.length < workersCount) {
        const availableSlots = workersCount - state.activeWorkers.length;
        const toDispatch = state.queue.slice(0, availableSlots);
        state.queue = state.queue.slice(availableSlots);

        toDispatch.forEach((req) => {
          const pTime = 350 + Math.round((Math.random() - 0.5) * 60); // Jitter: 320ms - 380ms
          req.processingTime = pTime;
          req.completedTime = now + pTime;
          state.activeWorkers.push(req);
          newLogs.push(`[WORKER] Dispatching ${req.id} to GPU...`);
        });
      }

      const baseVram = 70 + state.activeWorkers.length * 10;
      const loadSpike = state.queue.length * 3;
      state.vram = Math.min(100, baseVram + loadSpike);

      if (state.vram >= 100 && gameState === 'playing') {
        setGameState('crashed');
        setCrashReason('OOM');
        newLogs.push(`[CRITICAL] CUDA Out-of-Memory (OOM) Crash! VRAM limit exceeded.`);
        clearInterval(intervalId);
      }

      if (newLogs.length > 0) {
        state.logs = [...newLogs.reverse(), ...state.logs].slice(0, 15);
      }

      setRenderStats({
        processedCount: state.processedCount,
        queue: [...state.queue],
        activeWorkers: [...state.activeWorkers],
        latencyStats: [...state.latencyStats],
        vram: state.vram,
        logs: [...state.logs]
      });

      if (state.processedCount >= totalTarget && gameState === 'playing') {
        clearInterval(intervalId);
        setGameState('success');
      }

    }, 100);

    return () => clearInterval(intervalId);
  }, [gameState, cacheEnabled, triageBypassEnabled, queueAgingEnabled, workersCount]);

  const avgLatency = renderStats.latencyStats.length > 0
    ? Math.round(renderStats.latencyStats.reduce((sum, val) => sum + val, 0) / renderStats.latencyStats.length)
    : 0;

  const p90Val = renderStats.latencyStats.length > 0 
    ? [...renderStats.latencyStats].sort((a, b) => a - b)[Math.floor(renderStats.latencyStats.length * 0.90)] || 0 
    : 0;

  const p99Val = renderStats.latencyStats.length > 0 
    ? [...renderStats.latencyStats].sort((a, b) => a - b)[Math.floor(renderStats.latencyStats.length * 0.99)] || 0 
    : 0;

  const getVictoryRank = () => {
    let score = 0;
    if (cacheEnabled) score += 1;
    if (triageBypassEnabled) score += 1;
    if (queueAgingEnabled) score += 1;
    if (workersCount === 2) score += 1;

    const metSLA = avgLatency <= 180;

    if (!metSLA) {
      return {
        level: "Unranked",
        title: "SLA Violator",
        description: `Your average latency was ${avgLatency}ms, exceeding the 180ms SLA target. The pipeline dropped requests or queued them too long. Tune your config (Caching, Triage Bypass, and Worker count) to lower latency!`
      };
    }

    if (score === 4) {
      return {
        level: "Level IV - Maximum Rank",
        title: "Founding Systems Engineer",
        description: "Perfect implementation! You enabled Caching, Triage, and Queue Aging with exactly 2 workers, achieving optimal average latency. This successfully replicates Roshan's actual systems work at SymptomWise—preventing VRAM OOMs and reducing latency via a 61% Cache Hit Rate and Twilio triage bypass!"
      };
    } else if (score >= 3) {
      return {
        level: "Level III",
        title: "Systems SDE-II",
        description: "Excellent setup. You utilized Caching, Triage, and Queue Aging correctly to meet the SLA. Using more worker slots or slight delays placed you at a solid SDE-2 capacity."
      };
    } else if (score === 2) {
      return {
        level: "Level II",
        title: "Systems SDE-I",
        description: "Good configuration. You used caching/bypass to shield the GPU, but missing queue aging or optimal thread counts limits system throughput under severe traffic spikes."
      };
    } else {
      return {
        level: "Level I",
        title: "Junior Developer",
        description: "System passed, but the configuration is fragile! Spawning threads without queue aging, exact cache matches, or context boundaries is highly prone to production dropouts."
      };
    }
  };

  const victoryRank = getVictoryRank();

  if (!isLaunched) {
    return (
      <div className="w-full flex flex-col justify-center select-none font-mono">
        <div className="p-8 border-2 border-border-muted bg-[#0d0e12] text-zinc-100 rounded-none w-full max-w-xl mx-auto relative overflow-hidden text-xs shadow-brutalist-lg">
          {/* macOS Window Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1f2026] mb-6">
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
            <span className="text-[10px] font-bold text-zinc-500">SIMULATOR_STANDBY</span>
          </div>

          <div className="py-6 flex flex-col justify-center items-center text-center space-y-6">
            <Cpu size={44} className="text-[#38bdf8] animate-pulse" />
            <div className="space-y-3">
              <h3 className="text-zinc-100 font-black text-sm uppercase tracking-tight">SymptomWise LLM Pipeline Simulator</h3>
              <p className="text-[11px] text-zinc-400 max-w-md leading-relaxed">
                Test your systems engineering chops! Simulate live traffic spikes on an RTX 3050. Configure caching, Twilio emergency triage bypass, and worker threads to prevent CUDA OOM crashes and meet the 180ms Average Latency SLA.
              </p>
            </div>
            <button
              onClick={() => setIsLaunched(true)}
              className="px-6 py-2.5 bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-100 rounded-none shadow-[3px_3px_0px_0px_#1f2026] hover:bg-[#38bdf8] hover:text-zinc-950 hover:border-[#38bdf8] hover:shadow-[4px_4px_0px_0px_#0c2e40] transition-all cursor-pointer outline-none"
            >
              Initialize Console & Launch
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center select-none font-mono">
      <div className="p-6 border-2 border-border-muted bg-[#0d0e12] text-zinc-100 rounded-none w-full max-w-xl mx-auto relative overflow-hidden text-xs shadow-brutalist-lg">
        
        {/* macOS Window Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2026] mb-4">
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
            <span className={`h-2 w-2 rounded-full ${gameState === 'playing' ? 'bg-[#27c93f] animate-pulse' : 'bg-zinc-600'}`} />
            <span className="text-[10px] font-bold text-zinc-500">LLM PIPELINE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col justify-center items-center text-center space-y-4"
            >
              <Cpu size={44} className="text-[#38bdf8]" />
              <div className="space-y-2">
                <h3 className="text-zinc-100 font-extrabold text-sm uppercase">System Overload Simulator</h3>
                <p className="text-[11px] text-zinc-400 max-w-sm leading-relaxed">
                  Route 100 requests under a <span className="text-zinc-100 font-bold underline decoration-2 decoration-[#38bdf8]">180ms Average Latency SLA</span>. Caching mirrors Roshan's actual production benchmarks: a <span className="text-zinc-100 font-bold">61% Cache Hit Rate</span> and <span className="text-zinc-100 font-bold">350ms GPU Miss Penalty</span>.
                </p>
                <div className="text-[9px] text-zinc-500 font-bold border border-dashed border-zinc-800 p-2 bg-[#13151b] inline-block">
                  SymptomWise Benchmarks: 61% Cache Hit | 350ms GPU Penalty
                </div>
              </div>
              <button
                onClick={startBootPhase}
                className="px-6 py-2.5 bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-100 rounded-none shadow-[3px_3px_0px_0px_#1f2026] hover:bg-[#38bdf8] hover:text-zinc-950 hover:border-[#38bdf8] transition-all flex items-center gap-2 cursor-pointer outline-none"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Simulation</span>
              </button>
            </motion.div>
          )}

          {gameState === 'booting' && (
            <motion.div
              key="booting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col justify-center items-center text-center space-y-4"
            >
              <div className="h-10 w-10 border-4 border-[#38bdf8] border-t-transparent animate-spin rounded-full" />
              <div className="space-y-2">
                <h3 className="text-[#38bdf8] font-extrabold text-sm uppercase tracking-wider">BOOTING SYSTEM PIPELINE</h3>
                <div className="text-[10px] text-zinc-400 space-y-0.5 text-left bg-[#13151b] p-3 border border-zinc-800 max-w-xs font-mono">
                  <div>[BOOT] Allocating worker thread pool...</div>
                  <div>[BOOT] Locking bounded priority queue...</div>
                  <div>[BOOT] SLA Target: Avg Latency &lt; 180ms</div>
                  <div className="text-zinc-200 font-bold mt-2 text-center animate-pulse">
                    LOAD SPIKE IMMINENT IN {bootCountdown}S
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-zinc-500 italic">
                (Configure optimizations below to prepare the pipeline!)
              </div>
            </motion.div>
          )}

          {gameState === 'crashed' && (
            <motion.div
              key="crashed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col justify-center items-center text-center space-y-4"
            >
              <ShieldAlert size={44} className="text-red-500 animate-bounce" />
              <div className="space-y-1">
                <h3 className="text-red-500 font-extrabold text-sm uppercase">SYSTEM CRASHED</h3>
                <p className="text-[11px] text-zinc-400 max-w-sm">
                  {crashReason === 'OOM' 
                    ? 'CUDA Out-of-Memory (OOM)! VRAM reached 100% on the RTX 3050 GPU.' 
                    : 'Queue Overflow! Backlog capacity of 5 requests exceeded.'}
                </p>
              </div>
              <button
                onClick={startBootPhase}
                className="px-6 py-2.5 bg-red-950 text-red-200 hover:bg-red-900 border-2 border-red-800 rounded-none shadow-[3px_3px_0px_0px_#1f2026] transition-colors cursor-pointer outline-none flex items-center gap-2"
              >
                <RotateCcw size={12} />
                <span>Reboot System</span>
              </button>
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 space-y-4"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {avgLatency <= 180 ? (
                  <>
                    <CheckCircle2 size={40} className="text-green-500 animate-pulse" />
                    <h3 className="text-green-500 font-extrabold text-sm uppercase">SIMULATION SUCCESSFUL</h3>
                    <p className="text-[10px] text-zinc-400">
                      You successfully optimized the pipeline and met the SLA!
                    </p>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={40} className="text-red-500 animate-pulse" />
                    <h3 className="text-red-500 font-extrabold text-sm uppercase">SLA VIOLATED</h3>
                    <p className="text-[10px] text-zinc-400">
                      All requests processed, but the average latency exceeded the 180ms SLA target.
                    </p>
                  </>
                )}
              </div>

              <div className="border-2 border-[#1f2026] bg-[#13151b] p-4 rounded-none space-y-2 shadow-brutalist-sm">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-extrabold text-[10px] uppercase text-zinc-400">Performance Rank:</span>
                  <span className={`px-2 py-0.5 font-extrabold text-[9px] uppercase tracking-wider ${avgLatency <= 180 ? 'bg-zinc-100 text-zinc-950' : 'bg-red-950 text-red-200 border border-red-800'}`}>
                    {victoryRank.level}
                  </span>
                </div>
                <div className="text-zinc-100 font-black text-sm uppercase tracking-tight">
                  {victoryRank.title}
                </div>
                <div className="text-[10px] leading-relaxed text-zinc-400 font-sans font-medium">
                  {victoryRank.description}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold">
                <div className="p-2 border border-[#1f2026] bg-[#090a0d]">
                  FINAL AVG LATENCY: <span className={`${avgLatency <= 180 ? 'text-green-500' : 'text-red-500'} font-black`}>{avgLatency}ms</span>
                </div>
                <div className="p-2 border border-[#1f2026] bg-[#090a0d]">
                  FINAL p90 LATENCY: <span className="text-zinc-100 font-black">{p90Val}ms</span>
                </div>
                <div className="p-2 border border-[#1f2026] bg-[#090a0d]">
                  FINAL p99 LATENCY: <span className="text-zinc-100 font-black">{p99Val}ms</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startBootPhase}
                  className="px-6 py-2 bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-100 rounded-none shadow-[3px_3px_0px_0px_#1f2026] hover:bg-[#38bdf8] transition-all cursor-pointer outline-none flex items-center gap-2 text-xs"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Play Again</span>
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden"
            />
          )}

        </AnimatePresence>

        {/* Live stats dashboard, topology and warnings */}
        {(gameState === 'playing' || gameState === 'crashed' || gameState === 'success') && (
          <div className="space-y-5 mt-4 animate-fade-in">
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 border-2 border-[#1f2026] bg-[#090a0d] flex flex-col justify-between">
                <div className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Avg Latency</div>
                <div className="mt-1 font-extrabold text-zinc-100 text-xs">
                  {avgLatency ? `${avgLatency}ms` : '---'}
                </div>
                <div className="text-[8px] text-[#38bdf8] font-bold mt-0.5">SLA &lt; 180ms</div>
              </div>

              <div className="p-2.5 border-2 border-[#1f2026] bg-[#090a0d] flex flex-col justify-between">
                <div className="text-[9px] text-zinc-500 font-bold uppercase font-mono">p99 Latency</div>
                <div className="mt-1 font-extrabold text-zinc-100 text-xs">
                  {p99Val ? `${p99Val}ms` : '---'}
                </div>
                <div className="text-[8px] text-zinc-500 font-bold mt-0.5">Worst cases</div>
              </div>

              <div className="p-2.5 border-2 border-[#1f2026] bg-[#090a0d] flex flex-col justify-between">
                <div className="text-[9px] text-zinc-500 font-bold uppercase font-mono">VRAM Usage</div>
                <div className="mt-1 font-extrabold text-zinc-100 text-xs flex items-center gap-1.5">
                  <span className={renderStats.vram > 80 ? 'text-red-500 font-black animate-pulse' : renderStats.vram > 50 ? 'text-amber-500 font-bold' : 'text-zinc-100'}>
                    {renderStats.vram}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1 mt-1.5 rounded-none overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${renderStats.vram > 80 ? 'bg-red-500' : renderStats.vram > 50 ? 'bg-amber-500' : 'bg-zinc-100'}`}
                    style={{ width: `${renderStats.vram}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 border-2 border-[#1f2026] bg-[#090a0d] flex flex-col justify-between">
                <div className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Processed</div>
                <div className="mt-1 font-extrabold text-zinc-100 text-xs">
                  {renderStats.processedCount} / {totalTarget}
                </div>
                <div className="text-[8px] text-zinc-500 font-bold mt-0.5">Left: {totalTarget - renderStats.processedCount}</div>
              </div>
            </div>

            <div className="p-4 border-2 border-[#1f2026] bg-[#090a0d] rounded-none relative">
              <div className="text-[9px] text-zinc-500 font-bold absolute top-2 right-3 font-mono">TOPOLOGY</div>
              
              <div className="flex flex-col space-y-3 pt-4 pb-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-2.5 border-2 text-center flex flex-col justify-center items-center transition-all ${triageBypassEnabled ? 'border-[#38bdf8]/50 bg-[#0c2e40] text-[#38bdf8] font-bold' : 'border-zinc-800 bg-[#13151b] text-zinc-500 border-dashed'}`}>
                    <div className="text-[9px] font-extrabold">Triage Bypass</div>
                    <div className="text-[8px] mt-0.5">
                      {triageBypassEnabled ? 'AUTO-ROUTING (5ms)' : 'PASS-THROUGH'}
                    </div>
                  </div>

                  <div className={`p-2.5 border-2 text-center flex flex-col justify-center items-center transition-all ${cacheEnabled ? 'border-[#38bdf8]/50 bg-[#0c2e40] text-[#38bdf8] font-bold' : 'border-zinc-800 bg-[#13151b] text-zinc-500 border-dashed'}`}>
                    <div className="text-[9px] font-extrabold">L1/L2 Cache</div>
                    <div className="text-[8px] mt-0.5">
                      {cacheEnabled ? 'HIT ACTIVE (2ms)' : 'BYPASSED'}
                    </div>
                  </div>
                </div>

                <div className="p-3 border-2 border-[#1f2026] bg-[#13151b] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-extrabold text-zinc-200">Bounded Priority Queue</div>
                    <div className="text-[8px] text-zinc-500 font-semibold mt-0.5">
                      Aging: {queueAgingEnabled ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const hasReq = renderStats.queue[idx];
                      return (
                        <div 
                          key={idx}
                          className={`w-4 h-4 border flex items-center justify-center text-[8px] font-mono transition-all ${
                            hasReq 
                              ? hasReq.type === 'emergency' 
                                ? 'border-2 border-red-500 bg-red-950/40 text-red-500 font-extrabold'
                                : hasReq.type === 'urgent'
                                  ? 'border-2 border-amber-500 bg-amber-950/40 text-amber-500 font-extrabold'
                                  : 'border-2 border-zinc-400 bg-zinc-800 text-zinc-200 font-extrabold'
                              : 'border-zinc-800 text-transparent'
                          }`}
                        >
                          {hasReq ? '•' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 border-2 border-[#1f2026] bg-[#13151b]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-extrabold text-zinc-200 flex items-center gap-1.5">
                      <span>GPU Workers</span>
                      <span className="px-1.5 py-0.5 bg-red-950/30 text-red-400 text-[8px] font-black border border-red-500/20">
                        Miss Penalty: 350ms
                      </span>
                    </span>
                    <span className="text-[8px] text-zinc-500 font-bold">Active: {renderStats.activeWorkers.length} / {workersCount}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 3 }).map((_, idx) => {
                      const isUnlocked = idx < workersCount;
                      const isBusy = renderStats.activeWorkers[idx];
                      return (
                        <div 
                          key={idx}
                          className={`p-2 border text-center font-mono text-[9px] flex flex-col justify-center items-center min-h-[44px] transition-all ${
                            !isUnlocked 
                              ? 'border-dashed border-zinc-800 bg-[#0d0e12] text-zinc-700' 
                              : isBusy 
                                ? 'border-2 border-[#38bdf8]/50 bg-[#0c2e40] text-[#38bdf8] font-extrabold animate-pulse' 
                                : 'border border-zinc-800 text-zinc-500 bg-[#13151b]'
                          }`}
                        >
                          <span className="font-extrabold text-[8px]">W{idx + 1}</span>
                          <span className="text-[7px] font-bold mt-0.5">
                            {!isUnlocked ? 'LOCKED' : isBusy ? 'INFERENCE' : 'IDLE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {!cacheEnabled && gameState === 'playing' && (
              <div className="p-2 bg-red-950/20 border-2 border-red-900/40 text-red-400 font-bold text-[9px] text-center leading-normal">
                WARNING: L1/L2 Cache disabled! 100% of routine queries executing full 350ms GPU inference. VRAM OOM or SLA violation imminent.
              </div>
            )}
          </div>
        )}

        {(gameState === 'playing' || gameState === 'booting' || gameState === 'crashed' || gameState === 'success') && (
          <div className="space-y-3 pt-4 border-t-2 border-dashed border-zinc-800 mt-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pipeline Configurations</div>
            
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm hover:bg-[#1a1d26] transition-all ${gameState === 'crashed' || gameState === 'success' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <span className="text-[10px] text-zinc-200 font-bold">L1/L2 Caching</span>
                <input 
                  type="checkbox" 
                  checked={cacheEnabled} 
                  onChange={(e) => setCacheEnabled(e.target.checked)}
                  disabled={gameState === 'crashed' || gameState === 'success'}
                  className="accent-[#38bdf8] h-3.5 w-3.5 border-2 border-zinc-700 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>

              <label className={`flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm hover:bg-[#1a1d26] transition-all ${gameState === 'crashed' || gameState === 'success' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <span className="text-[10px] text-zinc-200 font-bold">Triage Bypass</span>
                <input 
                  type="checkbox" 
                  checked={triageBypassEnabled} 
                  onChange={(e) => setTriageBypassEnabled(e.target.checked)}
                  disabled={gameState === 'crashed' || gameState === 'success'}
                  className="accent-[#38bdf8] h-3.5 w-3.5 border-2 border-zinc-700 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>

              <label className={`flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm hover:bg-[#1a1d26] transition-all ${gameState === 'crashed' || gameState === 'success' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <span className="text-[10px] text-zinc-200 font-bold">Queue Aging</span>
                <input 
                  type="checkbox" 
                  checked={queueAgingEnabled} 
                  onChange={(e) => setQueueAgingEnabled(e.target.checked)}
                  disabled={gameState === 'crashed' || gameState === 'success'}
                  className="accent-[#38bdf8] h-3.5 w-3.5 border-2 border-zinc-700 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>

              <div className="flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm">
                <span className="text-[10px] text-zinc-200 font-bold">Workers Count</span>
                <div className="flex gap-1">
                  {([1, 2, 3] as const).map((num) => {
                    const isDisabled = gameState === 'crashed' || gameState === 'success';
                    return (
                      <button
                        key={num}
                        onClick={() => !isDisabled && setWorkersCount(num)}
                        disabled={isDisabled}
                        className={`w-5 h-5 font-mono text-[9px] border cursor-pointer outline-none font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          workersCount === num 
                            ? 'border-2 border-zinc-400 bg-zinc-100 text-zinc-950 font-extrabold' 
                            : 'border border-zinc-700 text-zinc-400 hover:bg-[#1a1d26] bg-[#13151b]'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'booting' || gameState === 'crashed' || gameState === 'success') && (
          <div className="space-y-1.5 pt-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Telemetry Logs</div>
            <div className="bg-[#090a0d] p-3 border-2 border-[#1f2026] h-28 overflow-y-auto font-mono text-[9px] text-zinc-200 space-y-1 scrollbar-thin">
              {renderStats.logs.map((log, index) => (
                <div key={index} className="truncate">
                  <span className="text-zinc-500 font-semibold">[{new Date().toLocaleTimeString()}]</span>{' '}
                  <span className={
                    log.includes('[CRITICAL]') 
                      ? 'text-red-400 font-extrabold animate-pulse' 
                      : log.includes('[SUCCESS]')
                        ? 'text-green-400 font-extrabold'
                        : log.includes('[SAFETY]')
                          ? 'text-amber-400 font-extrabold'
                          : log.includes('[CACHE]')
                            ? 'text-sky-400 font-bold'
                            : 'text-zinc-300'
                  }>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
