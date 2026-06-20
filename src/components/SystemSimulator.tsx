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
  isCpu?: boolean;
  source?: 'web' | 'whatsapp';
  symptom?: string;
}

const SYMPTOMS_ROUTINE = [
  "Mild headache in temples",
  "Stuffy nose and mild cough",
  "Slight lower back muscle strain",
  "Dry itchy throat"
];
const SYMPTOMS_URGENT = [
  "High fever of 103F with chills",
  "Sharp lower right abdominal pain",
  "Migraine with visual aura",
  "Persistent vomiting for 12 hours"
];
const SYMPTOMS_EMERGENCY = [
  "Crushing chest pain radiating to left arm",
  "Sudden slurred speech and numbness",
  "Severe shortness of breath and choking",
  "Anaphylaxis airway closing"
];

export const SystemSimulator: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'booting' | 'playing' | 'crashed' | 'success'>('idle');
  const [crashReason, setCrashReason] = useState<'OOM' | 'QUEUE_OVERFLOW' | null>(null);
  const [bootCountdown, setBootCountdown] = useState(3);
  const [isLaunched, setIsLaunched] = useState(false);

  const [cacheEnabled, setCacheEnabled] = useState(false);
  const [triageBypassEnabled, setTriageBypassEnabled] = useState(false);
  const [queueAgingEnabled, setQueueAgingEnabled] = useState(false);
  const [cpuFallbackEnabled, setCpuFallbackEnabled] = useState(true);
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
    nextRequestDelay: 1500,
    cacheStore: new Set<string>()
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
      logs: ['[SYSTEM] Initializing LLM Inference Pipeline...', '[SYSTEM] Status: Bounded Queue capacity = 50. VRAM Limit = 100%'],
      requestIndex: 0,
      lastRequestTime: 0,
      nextRequestDelay: 1500,
      cacheStore: new Set<string>()
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
    if (index < 75) return 120;   // Spike: Severe load surge! Queue will build up here.
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
          const defaultPTime = w.isCpu ? 3000 : 680;
          const qTime = latencyVal - (w.processingTime || defaultPTime);
          state.latencyStats.push(latencyVal);
          state.processedCount += 1;
          const unitLabel = w.isCpu ? 'CPU' : 'GPU';
          newLogs.push(`[WORKER] Finished processing ${w.id} on ${unitLabel}. Turnaround: ${latencyVal}ms (${unitLabel}: ${w.processingTime || defaultPTime}ms, Queue: ${Math.max(0, qTime)}ms).`);
          if (w.symptom) {
            state.cacheStore.add(w.symptom);
          }
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

        const source = Math.random() < 0.5 ? 'web' : 'whatsapp';
        
        // Choose symptom description
        let symptom = "";
        const isRepeated = Math.random() < 0.85;
        if (isRepeated) {
          const pool = type === 'routine' ? SYMPTOMS_ROUTINE : type === 'urgent' ? SYMPTOMS_URGENT : SYMPTOMS_EMERGENCY;
          const rIndex = Math.floor(Math.random() * pool.length);
          symptom = pool[rIndex];
        } else {
          symptom = `Unique symptom report #${state.requestIndex}`;
        }


        const newReq: RequestItem = {
          id: `REQ-${state.requestIndex}`,
          type,
          priority,
          enqueueTime: now,
          source,
          symptom
        };

        const channelLabel = source === 'web' ? 'Web' : 'WhatsApp';
        newLogs.push(`[REQUEST] Received ${newReq.id} (${channelLabel}) - "${symptom}" [${type.toUpperCase()}]`);

        if (type === 'emergency' && triageBypassEnabled) {
          const bypassMsg = source === 'web'
            ? `[SAFETY] Web emergency bypass for ${newReq.id}. Routed directly to emergency services (5ms).`
            : `[SAFETY] WhatsApp emergency bypass for ${newReq.id}. Routed directly to 108/ER listing (5ms).`;
          newLogs.push(bypassMsg);
          state.latencyStats.push(5);
          state.processedCount += 1;
        }
        else {
          let isCacheHit = false;
          if (cacheEnabled && state.cacheStore.has(symptom)) {
            isCacheHit = true;
          }

          if (isCacheHit) {
            // cached requests latency is: 20ms p50 / 213ms p99
            const randLat = Math.random();
            let cacheLatency = 20;
            if (randLat < 0.50) {
              cacheLatency = 18 + Math.round(Math.random() * 4);
            } else if (randLat < 0.99) {
              cacheLatency = 22 + Math.round(Math.random() * 178);
            } else {
              cacheLatency = 213 + Math.round(Math.random() * 17);
            }

            newLogs.push(`[CACHE] L1/L2 Cache Hit for ${newReq.id} ("${symptom}"). Returned in ${cacheLatency}ms.`);
            state.latencyStats.push(cacheLatency);
            state.processedCount += 1;
          } else {
            if (cacheEnabled) {
              newLogs.push(`[CACHE] Cache Miss for ${newReq.id} ("${symptom}"). Enqueuing for full inference...`);
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

            if (state.queue.length > 50) {
              setGameState('crashed');
              setCrashReason('QUEUE_OVERFLOW');
              newLogs.push(`[CRITICAL] Queue Overflow! Capacity (> 50) exceeded.`);
              clearInterval(intervalId);
            }
          }
        }

        state.lastRequestTime = now;
        state.nextRequestDelay = getNextInterval(state.requestIndex);
      }

      if (gameState === 'playing' && state.queue.length > 0) {
        const activeGpuCount = state.activeWorkers.filter(w => !w.isCpu).length;
        const availableGpuSlots = workersCount - activeGpuCount;
        
        // Dispatch to GPU if slots are available and VRAM is under safety threshold
        if (availableGpuSlots > 0 && state.vram < 90) {
          const toDispatchGpu = state.queue.slice(0, availableGpuSlots);
          state.queue = state.queue.slice(availableGpuSlots);
          
          toDispatchGpu.forEach((req) => {
            // GPU miss/inference latency: 680ms p50 / 1.53s p99
            const randLat = Math.random();
            let pTime = 680;
            if (randLat < 0.50) {
              pTime = 650 + Math.round(Math.random() * 60);
            } else if (randLat < 0.99) {
              pTime = 710 + Math.round(Math.random() * 790);
            } else {
              pTime = 1530 + Math.round(Math.random() * 70);
            }
            req.processingTime = pTime;
            req.completedTime = now + pTime;
            req.isCpu = false;
            state.activeWorkers.push(req);
            newLogs.push(`[WORKER] Dispatching ${req.id} to GPU...`);
          });
        }
        // CPU Fallback logic if VRAM threshold is breached
        else if (cpuFallbackEnabled && state.vram >= 90) {
          const toDispatchCpu = state.queue.slice(0, Math.min(state.queue.length, 2));
          state.queue = state.queue.slice(toDispatchCpu.length);
          
          toDispatchCpu.forEach((req) => {
            // CPU failover latency: 3000ms base
            const pTime = 3000 + Math.round((Math.random() - 0.5) * 300); // Jitter: 2850ms - 3150ms
            req.processingTime = pTime;
            req.completedTime = now + pTime;
            req.isCpu = true;
            state.activeWorkers.push(req);
            newLogs.push(`[SAFETY] VRAM threshold (90%) breached. Failover: Routing ${req.id} to CPU worker thread pool (3.0s latency penalty).`);
          });
        }
      }

      // Caching optimizations (quantized KV-caching) reduce baseline VRAM footprint
      const idleVram = cacheEnabled ? 50 : 70;
      // 3 workers on a 6GB GPU exceeds limits and will lead to CUDA OOM
      const workerVramCost = workersCount === 3 ? 20 : 10;
      const activeGpuCount = state.activeWorkers.filter(w => !w.isCpu).length;
      const baseVram = idleVram + activeGpuCount * workerVramCost;
      const loadSpike = state.queue.length * 2;
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
  }, [gameState, cacheEnabled, triageBypassEnabled, queueAgingEnabled, workersCount, cpuFallbackEnabled]);

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
    if (cpuFallbackEnabled) score += 1;
    if (workersCount === 2) score += 1;

    let baseLevel = "";
    let baseTitle = "";
    let baseDesc = "";

    if (score === 5) {
      baseLevel = "Level IV";
      baseTitle = "Founding Systems Engineer";
      baseDesc = "Perfect implementation! You enabled Caching, Triage, Queue Aging, and CPU Fallback failover with exactly 2 workers, achieving optimal average latency. This successfully replicates Roshan's actual systems work at SymptomWise—preventing VRAM OOMs and reducing p99 latency to 213ms via a 61% Cache Hit Rate, safety triage bypass, and failover protection!";
    } else if (score >= 3) {
      baseLevel = "Level III";
      baseTitle = "Systems SDE-II";
      baseDesc = "Excellent setup. You utilized Caching, Triage, and Queue Aging correctly to meet the SLA. Missing some safety configurations or optimal worker scaling kept you at a solid SDE-2 capacity.";
    } else if (score === 2) {
      baseLevel = "Level II";
      baseTitle = "Systems SDE-I";
      baseDesc = "Good configuration. You used caching/bypass to shield the GPU, but missing queue aging, optimal worker bounds, or failover fallbacks limits system throughput under severe traffic spikes.";
    } else {
      baseLevel = "Level I";
      baseTitle = "Junior Developer";
      baseDesc = "System passed, but the configuration is fragile! Spawning threads without queue aging, exact cache matches, or failover boundaries is highly prone to production dropouts.";
    }

    if (gameState === 'crashed') {
      if (crashReason === 'OOM') {
        if (workersCount === 3) {
          return {
            level: "Crash - OOM",
            title: "Naive Scaler (Brute Force SDE)",
            description: "OOM Crash! You tried to run 3 parallel GPU workers on a local 6GB RTX 3050. Throwing more workers at a hardware bottleneck without sizing resource bounds is a classic systems engineering trap. Limit concurrent worker threads to exactly 2 to protect the physical VRAM limit!"
          };
        }
        return {
          level: `${baseLevel} (OOM)`,
          title: `${baseTitle} (CUDA OOM)`,
          description: `VRAM limit reached 100%! While your configuration aligned with ${baseLevel} standards, high concurrency crashed the RTX 3050. Reduce active worker threads or enable L1/L2 caching to shield the GPU.`
        };
      } else {
        return {
          level: `${baseLevel} (Queue Overflow)`,
          title: `${baseTitle} (Queue Overflow)`,
          description: `Backlog capacity of 50 requests exceeded! While your configuration aligned with ${baseLevel} standards, requests queued faster than they could be processed. Enable caching/bypass or optimize workers to drain requests.`
        };
      }
    }

    const metSLA = avgLatency <= 300;

    if (!metSLA) {
      return {
        level: `${baseLevel} (SLA Violated)`,
        title: `${baseTitle} (SLA Violator)`,
        description: `Average latency was ${avgLatency}ms, exceeding the 300ms SLA. While your configuration aligned with ${baseLevel} standards, you need to further optimize cache hit rates, bypass rules, or queue aging to meet the response criteria.`
      };
    }

    return {
      level: baseLevel,
      title: baseTitle,
      description: baseDesc
    };
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
                Test your systems engineering chops! Simulate live traffic spikes on an RTX 3050. Configure caching, emergency triage bypass, and worker threads to prevent CUDA OOM crashes and meet the 300ms Average Latency SLA.
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
                  Route 100 requests under a <span className="text-zinc-100 font-bold underline decoration-2 decoration-[#38bdf8]">300ms Average Latency SLA</span>. Caching mirrors Roshan's actual production benchmarks: a <span className="text-zinc-100 font-bold">61% Cache Hit Rate</span> and <span className="text-zinc-100 font-bold">680ms GPU Miss Penalty</span>.
                </p>
                <div className="text-[9px] text-zinc-500 font-bold border border-dashed border-zinc-800 p-2 bg-[#13151b] inline-block">
                  SymptomWise Benchmarks: 61% Cache Hit | 680ms GPU Penalty
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
                  <div>[BOOT] SLA Target: Avg Latency &lt; 300ms</div>
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
              className="py-4 space-y-4"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldAlert size={40} className="text-red-500 animate-bounce" />
                <h3 className="text-red-500 font-extrabold text-sm uppercase">SYSTEM CRASHED</h3>
                <p className="text-[10px] text-zinc-400">
                  {crashReason === 'OOM' 
                    ? 'CUDA Out-of-Memory (OOM)! VRAM reached 100% on the RTX 3050 GPU.' 
                    : 'Queue Overflow! Backlog capacity of 50 requests exceeded.'}
                </p>
              </div>

              <div className="border-2 border-[#1f2026] bg-[#13151b] p-4 rounded-none space-y-2 shadow-brutalist-sm">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-extrabold text-[10px] uppercase text-zinc-400">Performance Rank:</span>
                  <span className="px-2 py-0.5 font-extrabold text-[9px] uppercase tracking-wider bg-red-950 text-red-200 border border-red-800">
                    {victoryRank.level}
                  </span>
                </div>
                <div className="text-zinc-100 font-black text-sm uppercase tracking-tight text-left">
                  {victoryRank.title}
                </div>
                <div className="text-[10px] leading-relaxed text-zinc-400 font-sans font-medium text-left">
                  {victoryRank.description}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startBootPhase}
                  className="px-6 py-2.5 bg-red-950 text-red-200 hover:bg-red-900 border-2 border-red-800 rounded-none shadow-[3px_3px_0px_0px_#1f2026] transition-colors cursor-pointer outline-none flex items-center gap-2 text-xs"
                >
                  <RotateCcw size={12} />
                  <span>Reboot System</span>
                </button>
              </div>
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
                {avgLatency <= 300 ? (
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
                      All requests processed, but the average latency exceeded the 300ms SLA target.
                    </p>
                  </>
                )}
              </div>

              <div className="border-2 border-[#1f2026] bg-[#13151b] p-4 rounded-none space-y-2 shadow-brutalist-sm">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-extrabold text-[10px] uppercase text-zinc-400">Performance Rank:</span>
                  <span className={`px-2 py-0.5 font-extrabold text-[9px] uppercase tracking-wider ${avgLatency <= 300 ? 'bg-zinc-100 text-zinc-950' : 'bg-red-950 text-red-200 border border-red-800'}`}>
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
                  FINAL AVG LATENCY: <span className={`${avgLatency <= 300 ? 'text-green-500' : 'text-red-500'} font-black`}>{avgLatency}ms</span>
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
                <div className="text-[8px] text-[#38bdf8] font-bold mt-0.5">SLA &lt; 300ms</div>
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
                    <div className="text-[9px] font-extrabold text-zinc-200">Bounded Priority Queue ({renderStats.queue.length}/50)</div>
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
                        Miss Penalty: 680ms
                      </span>
                    </span>
                    <span className="text-[8px] text-zinc-500 font-bold">Active: {renderStats.activeWorkers.filter(w => !w.isCpu).length} / {workersCount}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 3 }).map((_, idx) => {
                      const isUnlocked = idx < workersCount;
                      const isBusy = renderStats.activeWorkers.filter(w => !w.isCpu)[idx];
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
                          <span className="font-extrabold text-[8px]">GPU W{idx + 1}</span>
                          <span className="text-[7px] font-bold mt-0.5">
                            {!isUnlocked ? 'LOCKED' : isBusy ? 'INFERENCE' : 'IDLE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {renderStats.activeWorkers.filter(w => w.isCpu).length > 0 && (
                  <div className="p-3 border-2 border-amber-950 bg-amber-950/15 rounded-none animate-fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-amber-400 flex items-center gap-1.5 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>CPU Failover Workers</span>
                        <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 text-[8px] font-black border border-amber-800/40">
                          SLA Penalty: 1.6s
                        </span>
                      </span>
                      <span className="text-[8px] text-amber-500 font-bold">Active: {renderStats.activeWorkers.filter(w => w.isCpu).length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {renderStats.activeWorkers.filter(w => w.isCpu).map((w, idx) => (
                        <div key={idx} className="px-2 py-1 border border-amber-800/50 bg-amber-950/30 text-amber-300 text-[8px] font-mono select-none">
                          {w.id} (CPU)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!cacheEnabled && gameState === 'playing' && (
              <div className="p-2 bg-red-950/20 border-2 border-red-900/40 text-red-400 font-bold text-[9px] text-center leading-normal">
                WARNING: L1/L2 Cache disabled! 100% of routine queries executing full 680ms GPU inference. VRAM OOM or SLA violation imminent.
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

              <label className={`flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm hover:bg-[#1a1d26] transition-all ${gameState === 'crashed' || gameState === 'success' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <span className="text-[10px] text-zinc-200 font-bold">CPU Fallback</span>
                <input 
                  type="checkbox" 
                  checked={cpuFallbackEnabled} 
                  onChange={(e) => setCpuFallbackEnabled(e.target.checked)}
                  disabled={gameState === 'crashed' || gameState === 'success'}
                  className="accent-[#38bdf8] h-3.5 w-3.5 border-2 border-zinc-700 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>

              <div className="flex items-center justify-between p-2.5 border-2 border-[#1f2026] bg-[#13151b] shadow-brutalist-sm col-span-2">
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
