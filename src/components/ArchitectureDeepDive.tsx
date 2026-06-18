import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Cpu, 
  Database, 
  Server, 
  ShieldAlert, 
  Terminal, 
  Zap, 
  GitMerge, 
  Activity, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ArchitectureDeepDiveProps {
  setView: (val: 'home' | 'deep-dive') => void;
}

type NodeKey = 'twilio' | 'gateway' | 'context' | 'safety' | 'cache' | 'queue' | 'workers' | 'llm';

export const ArchitectureDeepDive: React.FC<ArchitectureDeepDiveProps> = ({ setView }) => {
  const [activeNode, setActiveNode] = useState<NodeKey>('cache');
  const [loadScenario, setLoadScenario] = useState<'optimized' | 'unoptimized'>('optimized');
  const [activeTradeoff, setActiveTradeoff] = useState<number>(0);

  const nodeDetails: Record<NodeKey, {
    title: string;
    sub: string;
    description: string;
    metrics: { label: string; value: string }[];
    failureMitigation: string;
    tag: string;
  }> = {
    twilio: {
      title: 'WhatsApp Webhook (Twilio)',
      sub: 'Async Webhook Ingest Layer',
      description: 'Receives asynchronous HTTP POST request streams from Twilio webhooks whenever a patient submits symptom descriptions on WhatsApp. Standardized status response is returned instantly to keep webhook sockets open and free.',
      metrics: [
        { label: 'Ingest Latency', value: '12ms' },
        { label: 'HTTP Status', value: '200 OK' },
        { label: 'Format', value: 'JSON payload' }
      ],
      failureMitigation: 'Twilio retries requests if latency exceeds 15s. We decoupled ingestion from processing by dumping tasks to Redis queue instantly, acknowledging the webhook in under 15ms. Redis hashes provide deduplication.',
      tag: 'INGESTION'
    },
    gateway: {
      title: 'API Gateway & Rate Limiter',
      sub: 'Security & Traffic Controller',
      description: 'Performs token-bucket rate limiting (configured to maximum 5 requests/second per IP/Phone) to prevent bot spamming and Denial of Service (DoS) attacks on expensive GPU resources.',
      metrics: [
        { label: 'Auth Check', value: '<2ms' },
        { label: 'Rate Limit Window', value: '1s' },
        { label: 'Token Capacity', value: '10' }
      ],
      failureMitigation: 'If rate limits are breached, requests are dropped at the door returning a custom HTTP 429 payload, saving valuable CPU cycles.',
      tag: 'SECURITY'
    },
    context: {
      title: 'Multi-Tenant Context Manager',
      sub: 'Thread-Local Middleware Isolation',
      description: 'Injects request context markers containing user/tenant meta-data. Binds dynamic attributes (e.g. database schema filters) onto active threads using thread-local storage blocks.',
      metrics: [
        { label: 'Binding Latency', value: '<1ms' },
        { label: 'Cost Overhead', value: '$0' },
        { label: 'Safety Index', value: 'High' }
      ],
      failureMitigation: 'Thread-local variables can bleed into subsequent requests if connection pools reuse threads. We enforce context garbage collection inside a global try-finally middleware block.',
      tag: 'MIDDLEWARE'
    },
    safety: {
      title: 'Regex Emergency Triage Filter',
      sub: 'Zero-GPU Immediate Routing Bypass',
      description: 'Scans raw incoming texts for high-priority emergency key-phrases (e.g., "chest pain", "severe bleeding", "heart attack"). Automatically flags matching requests and routes them straight to physical clinical triage, bypassing AI processing.',
      metrics: [
        { label: 'Regex Run Time', value: '<5ms' },
        { label: 'Trigger Score', value: '>= 5' },
        { label: 'SLA Priority', value: 'Immediate' }
      ],
      failureMitigation: 'Redundant matching rules cover phonetic variations. The fallback is configured to default a questionable match to high priority rather than dropping it.',
      tag: 'SAFETY'
    },
    cache: {
      title: 'Two-Tier L1/L2 Semantic Cache',
      sub: 'Intelligent Query De-duplicator',
      description: 'First, L1 checks Redis for raw text exact matches (responses in under 2ms). On a miss, L2 converts symptoms into structured flags (e.g. NEG/SEV/SYM) and checks for matching medical triage histories in Redis.',
      metrics: [
        { label: 'Hit Rate (Avg)', value: '61%' },
        { label: 'L1 Latency', value: '<2ms' },
        { label: 'L2 Latency', value: '12ms' }
      ],
      failureMitigation: 'Stale caches are guarded with a 24-hour Time-to-Live (TTL). Dynamic eviction triggers if Redis memory spikes beyond 85% capacity.',
      tag: 'PERFORMANCE'
    },
    queue: {
      title: 'Bounded Priority Queue with Aging',
      sub: 'System Memory Safeguard',
      description: 'Maintains incoming request lines when GPU workers are fully occupied. The queue is capped at a strict capacity of 50 requests to protect VRAM. Sorts tasks dynamically by emergency levels, adding aging multipliers to prevent routine starvation.',
      metrics: [
        { label: 'Capacity Cap', value: '50 slots' },
        { label: 'Aging Multiplier', value: '+0.5/sec' },
        { label: 'Shedding Cap', value: '100%' }
      ],
      failureMitigation: 'If the queue reaches 50, the load-shedder drops the lowest priority requests and triggers webhook alerts (system busy), avoiding catastrophic VRAM crashes.',
      tag: 'CONCURRENCY'
    },
    workers: {
      title: 'Threaded GPU Worker Pool',
      sub: 'Concurrency & Resource Manager',
      description: 'Manages dynamic worker threads accessing CUDA GPU threads. Limits parallel execution slots to prevent hardware thrashing and VRAM fragmentation.',
      metrics: [
        { label: 'Optimal Threads', value: '2 threads' },
        { label: 'Mutex Locks', value: 'Active' },
        { label: 'VRAM Buffer', value: '25%' }
      ],
      failureMitigation: 'If worker locks hang, thread watchdogs kill zombie pipelines after 25s, freeing CUDA memory handles.',
      tag: 'COMPUTE'
    },
    llm: {
      title: 'Local LLM Inference Engine',
      sub: 'VRAM-Optimized GPU Inference',
      description: 'Executes generative NLP algorithms on the patient symptoms, outputting triage guides. Runs on a localized RTX 3050 GPU using model quantization (4-bit).',
      metrics: [
        { label: 'Base GPU Latency', value: '350ms' },
        { label: 'CPU Fallback', value: '1600ms' },
        { label: 'Model Format', value: 'GGUF Q4' }
      ],
      failureMitigation: 'On CUDA Out-Of-Memory (OOM) triggers, request scheduling delegates task pipelines to a secondary CPU worker thread pool, maintaining uptime at a latency compromise.',
      tag: 'CORE AI'
    }
  };

  const tradeoffs = [
    {
      title: 'Logical Multi-Tenancy vs Physical Database Isolation',
      details: 'Roshan implemented logical multi-tenancy at $0 infrastructure cost. By storing context tenant IDs in thread-local storage and dynamically overriding Django ORM query scopes, databases are segregated logically. While physical database instances (separate PostgreSQL nodes) provide strict isolation, logical segregation eliminated AWS RDS base fees, fitting founding startup budgets.',
      impact: 'Saved $150+/month base database fees; required rigorous middleware middleware context flush filters to guarantee safety.'
    },
    {
      title: 'Two-Tier Cache Strategy (Exact vs Semantic)',
      details: 'Raw LLM processing takes ~350ms. L1 Exact Match caches raw query strings, which only yield a 15% hit rate. L2 Semantic Cache parses semantic symptom shapes (categorizing NEG/SEV/SYM signatures) and achieves a 61% hit rate. This semantic abstraction shifts processing from heavy GPU tensor mathematics to lightning-fast Redis lookups.',
      impact: 'p99 latency dropped from 1.2s to 213ms. 61% of requests bypass GPU compute entirely.'
    },
    {
      title: 'Queue Scheduling: First-In-First-Out vs Bounded Priority with Aging',
      details: 'Under spikes, a simple FIFO queue causes emergency triage pipelines to wait behind routine diagnostic checkups. Implementing a Priority Queue ensures emergency triggers execute first. However, during high spikes, routine queries suffered infinite starvation. Introducing an Aging Multiplier (+0.5 priority score per second in queue) balances latency SLA rules.',
      impact: 'Emergency latency guaranteed under 250ms; routine queries met the 180ms SLA under 95% load conditions.'
    },
    {
      title: 'Inference Infrastructure: GPU CUDA vs CPU Thread Pools',
      details: 'Running deep learning inference locally on client devices or budget cloud GPU boxes (RTX 3050, 8GB VRAM) requires careful memory bounds. Quantized models (GGUF 4-bit) limit VRAM footprint to 4.2GB, leaving buffer space. To prevent CUDA memory bottlenecks, the worker thread pool count was capped at 2. An automated failover routes traffic to a Python CPU thread pool if VRAM crosses 90%.',
      impact: '100% service uptime during synthetic surges, with CPU failovers handling traffic overflows at a 4.5x latency penalty.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090a0d] py-12 px-6 md:px-12 xl:px-16 text-zinc-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1f2026] pb-6">
          <div className="space-y-2">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-xs font-mono font-bold text-accent-teal hover:text-accent-teal-hover transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <ArrowLeft size={14} />
              <span>BACK TO PORTFOLIO</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text font-sans tracking-tight">
              Systems Architecture Deep Dive
            </h1>
            <p className="text-xs font-mono text-zinc-500">
              Technical Design Specification &bull; SymptomWise AI Infrastructure &bull; FAANG Review Standards
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold text-green-400 bg-green-950/35 border border-green-800 px-2.5 py-1">
              Production Verified SLA: 99.9% Availability
            </span>
          </div>
        </div>

        {/* 1. VISUAL INTERACTIVE ARCHITECTURE DIAGRAM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Interactive Diagram Canvas (Col 7) */}
          <div className="lg:col-span-7 p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f2026] mb-6 font-mono text-[10px] text-zinc-500">
              <span className="font-bold flex items-center gap-1.5"><Layers size={10} className="text-accent-teal" /> PIPELINE TOPOLOGY MAP</span>
              <span>CLICK NODES TO INSPECT ENGINE</span>
            </div>

            {/* Topology Flow Canvas */}
            <div className="flex flex-col gap-6 items-center relative py-4">
              
              {/* Row 1: Entry Gateways */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {/* Node 1: Twilio */}
                <button 
                  onClick={() => setActiveNode('twilio')}
                  className={`p-3 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'twilio' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Zap size={10} className="text-accent-teal" />
                    <span>1. Ingestion</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">Twilio API Ingress</div>
                  {activeNode === 'twilio' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>

                {/* Node 2: Gateway */}
                <button 
                  onClick={() => setActiveNode('gateway')}
                  className={`p-3 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'gateway' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Lock size={10} className="text-accent-teal" />
                    <span>2. API Gate</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">Rate Limiting</div>
                  {activeNode === 'gateway' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>

                {/* Node 3: Context Middleware */}
                <button 
                  onClick={() => setActiveNode('context')}
                  className={`p-3 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'context' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Server size={10} className="text-accent-teal" />
                    <span>3. Middleware</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">Multi-Tenant Thread</div>
                  {activeNode === 'context' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>
              </div>

              {/* Connecting line */}
              <div className="h-6 w-0.5 bg-zinc-800 border-dashed" />

              {/* Row 2: Optimization Layers */}
              <div className="grid grid-cols-2 gap-8 w-[80%]">
                {/* Node 4: Safety Bypass */}
                <button 
                  onClick={() => setActiveNode('safety')}
                  className={`p-3.5 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'safety' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <ShieldAlert size={11} className="text-red-500" />
                    <span>4. Safety Triage</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">Immediate Regex Bypass</div>
                  {activeNode === 'safety' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>

                {/* Node 5: Cache Layer */}
                <button 
                  onClick={() => setActiveNode('cache')}
                  className={`p-3.5 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'cache' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Database size={11} className="text-accent-teal" />
                    <span>5. Cache (L1/L2)</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">61% Redis Hit Rate</div>
                  {activeNode === 'cache' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>
              </div>

              {/* Connecting line */}
              <div className="h-6 w-0.5 bg-zinc-800 border-dashed" />

              {/* Row 3: Load Manager */}
              <div className="w-[60%]">
                {/* Node 6: Priority Queue */}
                <button 
                  onClick={() => setActiveNode('queue')}
                  className={`p-3.5 border-2 text-center w-full transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'queue' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Terminal size={11} className="text-accent-teal" />
                    <span>6. Bounded Priority Queue</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">Capacity=50 &bull; Task Aging Active</div>
                  {activeNode === 'queue' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>
              </div>

              {/* Connecting line */}
              <div className="h-6 w-0.5 bg-zinc-800 border-dashed" />

              {/* Row 4: Inference Engine */}
              <div className="grid grid-cols-2 gap-8 w-[80%]">
                {/* Node 7: Worker threads */}
                <button 
                  onClick={() => setActiveNode('workers')}
                  className={`p-3.5 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'workers' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <GitMerge size={11} className="text-accent-teal" />
                    <span>7. Worker Pool</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">2 Threads &bull; Mutex Lock</div>
                  {activeNode === 'workers' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>

                {/* Node 8: CUDA LLM */}
                <button 
                  onClick={() => setActiveNode('llm')}
                  className={`p-3.5 border-2 text-center transition-all relative cursor-pointer outline-none rounded-none ${
                    activeNode === 'llm' 
                      ? 'border-accent-teal bg-[#0c2e40] text-theme-text font-black shadow-brutalist-sm scale-[1.03]' 
                      : 'border-zinc-800 bg-[#13151b] hover:border-zinc-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                    <Cpu size={11} className="text-accent-teal" />
                    <span>8. GPU LLM Inference</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 font-mono">RTX 3050 &bull; CPU Fallback</div>
                  {activeNode === 'llm' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-teal rotate-45" />}
                </button>
              </div>

            </div>
          </div>

          {/* Right Block: Node Inspector details (Col 5) */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist flex flex-col justify-between min-h-[460px] relative"
              >
                {/* Accent strip */}
                <div className="h-1.5 w-full bg-accent-teal absolute top-0 left-0" />

                <div className="space-y-6 pt-3">
                  {/* Category Tag */}
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-black uppercase bg-accent-light text-theme-text border border-border-muted px-2 py-0.5">
                      {nodeDetails[activeNode].tag}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">
                      Node Spec {Object.keys(nodeDetails).indexOf(activeNode) + 1} of 8
                    </span>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-zinc-100 font-sans tracking-tight">
                      {nodeDetails[activeNode].title}
                    </h3>
                    <p className="text-xs text-accent-teal font-mono font-semibold">
                      {nodeDetails[activeNode].sub}
                    </p>
                  </div>

                  {/* Core Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                    {nodeDetails[activeNode].description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-[#090a0d] p-3 border border-[#1f2026] rounded-none">
                    {nodeDetails[activeNode].metrics.map((m, i) => (
                      <div key={i} className="text-center font-mono">
                        <div className="text-[7.5px] uppercase text-zinc-500 font-bold">{m.label}</div>
                        <div className="text-xs text-zinc-100 font-black mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Failure Mitigation */}
                  <div className="space-y-2 border-t border-dashed border-[#1f2026] pt-4">
                    <h4 className="text-[9px] font-mono text-red-400 font-extrabold uppercase flex items-center gap-1.5">
                      <ShieldAlert size={12} />
                      <span>Failure Mode & Mitigation</span>
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {nodeDetails[activeNode].failureMitigation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#1f2026] pt-4 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold">SYSTEM_SCHEDULER: OK</span>
                  <div className="flex gap-1">
                    {Object.keys(nodeDetails).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveNode(key as NodeKey)}
                        className={`w-2.5 h-2.5 rounded-none border transition-colors cursor-pointer outline-none ${
                          activeNode === key ? 'bg-accent-teal border-accent-teal' : 'bg-transparent border-zinc-800'
                        }`}
                        title={nodeDetails[key as NodeKey].title}
                      />
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* 2. INTERACTIVE LOAD TESTING GRAPH & METRICS SECTION */}
        <div className="p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist space-y-6">
          
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2026] pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 font-sans flex items-center gap-2">
                <Activity size={18} className="text-accent-teal" />
                <span>Synthetic Load Testing (100 Requests Burst)</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Interactive verification of the RTX 3050 GPU under severe traffic spikes. Compare configurations.
              </p>
            </div>

            {/* Toggle Scenario Buttons */}
            <div className="flex gap-2 font-mono">
              <button
                onClick={() => setLoadScenario('optimized')}
                className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none shadow-brutalist-sm active:scale-95 ${
                  loadScenario === 'optimized'
                    ? 'bg-theme-text text-bg-dark border-border-muted font-black'
                    : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
                }`}
              >
                With Cache & Triage (Optimized)
              </button>
              <button
                onClick={() => setLoadScenario('unoptimized')}
                className={`px-3 py-1.5 rounded-none font-mono text-[10px] font-bold border-2 transition-all cursor-pointer outline-none shadow-brutalist-sm active:scale-95 ${
                  loadScenario === 'unoptimized'
                    ? 'bg-red-950 text-red-200 border-red-800 hover:bg-red-900'
                    : 'bg-bg-card text-theme-text border-border-muted hover:bg-accent-light'
                }`}
              >
                Raw FIFO No Cache (Unoptimized)
              </button>
            </div>
          </div>

          {/* Simulation Graph Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Graph Canvas (Col 8) */}
            <div className="lg:col-span-8 space-y-2">
              <div className="relative w-full aspect-[21/9] bg-[#090a0d] border border-[#1f2026] overflow-hidden p-4 select-none">
                
                {/* SLA Target Line overlay indicator */}
                <div className="absolute top-[35%] left-0 w-full border-t border-dashed border-red-500/35 z-0 flex justify-end pr-4 pointer-events-none">
                  <span className="text-[7.5px] font-mono font-bold text-red-400 uppercase tracking-wider bg-[#090a0d] px-1 translate-y-[-5px]">SLA Threshold (180ms)</span>
                </div>

                {/* SVG Polyline drawing based on Scenario state */}
                <svg viewBox="0 0 700 240" className="w-full h-full z-10 relative overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="180" x2="700" y2="180" stroke="#1f2026" strokeWidth="0.8" />
                  <line x1="0" y1="120" x2="700" y2="120" stroke="#1f2026" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="700" y2="60" stroke="#1f2026" strokeWidth="0.8" />
                  
                  {/* Scenario specific graph drawing */}
                  {loadScenario === 'optimized' ? (
                    <>
                      {/* Latency line (Cyan) */}
                      <path
                        d="M0,210 L30,205 L60,208 L90,212 L120,200 L150,195 L180,210 L210,204 L240,208 L270,185 L300,192 L330,201 L360,206 L390,210 L420,205 L450,209 L480,200 L510,195 L540,211 L570,205 L600,208 L630,210 L660,204 L700,206"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        className="transition-all duration-500"
                      />
                      {/* Interactive nodes points */}
                      <circle cx="270" cy="185" r="4" fill="#38bdf8" className="animate-pulse" />
                      <circle cx="480" cy="200" r="4" fill="#38bdf8" className="animate-pulse" />
                    </>
                  ) : (
                    <>
                      {/* Latency line (Red, exploding & crashing) */}
                      <path
                        d="M0,210 L30,190 L60,180 L90,165 L120,150 L150,135 L180,120 L210,95 L240,80 L270,72 L300,55 L330,40 L360,35 L390,32 L400,25 L410,20 L420,10 L430,210 L700,210"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        className="transition-all duration-500"
                      />
                      {/* System Crash marker */}
                      <circle cx="420" cy="10" r="5" fill="#ef4444" className="animate-ping" />
                      <circle cx="420" cy="10" r="3.5" fill="#ef4444" />
                      <text x="430" y="30" fill="#ef4444" fontFamily="monospace" fontSize="8.5" fontWeight="bold">SYSTEM CRASH (CUDA OOM @ REQUEST 45)</text>
                    </>
                  )}
                  
                  {/* Axis labels */}
                  <text x="5" y="232" fill="#52525b" fontFamily="monospace" fontSize="8">Request Ingress Stream (0 &rarr; 100)</text>
                  <text x="5" y="15" fill="#52525b" fontFamily="monospace" fontSize="8">Average Latency (ms)</text>
                  <text x="660" y="175" fill="#52525b" fontFamily="monospace" fontSize="8">180ms Target</text>
                </svg>
                
                {/* Indicator text tags */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[8px] font-mono font-bold bg-[#0d0e12] border border-[#1f2026] p-2">
                  <div className="flex items-center gap-1">
                    <span className={`h-1.5 w-4 inline-block ${loadScenario === 'optimized' ? 'bg-[#38bdf8]' : 'bg-red-500'}`} />
                    <span>Average Latency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-4 border-t border-dashed border-red-500/50 inline-block" />
                    <span>SLA Guard</span>
                  </div>
                </div>

              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 font-bold px-2">
                <span>0s (Start)</span>
                <span>Peak Load Spike (40s - 75s)</span>
                <span>100s (End)</span>
              </div>
            </div>

            {/* Metrics Breakdown Cards (Col 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 border border-[#1f2026] bg-[#090a0d] space-y-3">
                <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase">Load Performance SLA Results</span>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium font-sans">p99 Latency SLA</span>
                    <span className={`font-mono font-extrabold ${loadScenario === 'optimized' ? 'text-green-500' : 'text-red-500'}`}>
                      {loadScenario === 'optimized' ? '213ms' : '1200ms+'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Active Throughput Capacity</span>
                    <span className={`font-mono font-extrabold ${loadScenario === 'optimized' ? 'text-green-500' : 'text-red-500'}`}>
                      {loadScenario === 'optimized' ? '45 req/sec' : '11 req/sec'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium font-sans">VRAM Utilization (Peak)</span>
                    <span className={`font-mono font-extrabold ${loadScenario === 'optimized' ? 'text-zinc-100' : 'text-red-500 animate-pulse font-black'}`}>
                      {loadScenario === 'optimized' ? '82% VRAM' : '100% OOM!'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Successful Completions</span>
                    <span className="font-mono font-extrabold text-zinc-100">
                      {loadScenario === 'optimized' ? '100 / 100' : '45 / 100 (Crashed)'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1f2026]">
                  {loadScenario === 'optimized' ? (
                    <div className="p-2.5 bg-green-950/20 border border-green-800 text-[10px] leading-normal text-green-400 font-sans font-medium flex gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-green-500" />
                      <div>
                        <strong>Optimal SLA Met:</strong> By utilizing the 61% Redis Cache and twilio regex bypass checks, the GPU is protected from queue builds. Latencies flatlined under SLA limits.
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-red-950/25 border border-red-900 text-[10px] leading-normal text-red-400 font-sans font-medium flex gap-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-500 animate-pulse" />
                      <div>
                        <strong>VRAM Stack Crash:</strong> Unoptimized pipeline floods GPU CUDA context, piling requests. VRAM overflow triggers CUDA Address allocator fault, crashing server at request 45.
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 3. DESIGN TRADEOFFS SECTION */}
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-zinc-100 font-sans flex items-center gap-2">
              <BookOpen size={20} className="text-accent-teal" />
              <span>Core Architectural Tradeoffs & Decisions</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Analyzing alternatives, constraints, and engineering decisions discussed during Amazon-style reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tradeoff Tabs selector (Col 4) */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-l border-border-muted pb-px lg:pb-0 scrollbar-none gap-1">
              {tradeoffs.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTradeoff(idx)}
                  className={`text-left px-5 py-4 border-b-2 lg:border-b-0 lg:border-l-2 font-mono text-xs font-semibold transition-all outline-none rounded-none cursor-pointer flex justify-between items-center whitespace-nowrap lg:whitespace-normal ${
                    activeTradeoff === idx
                      ? 'border-accent-teal text-theme-text bg-accent-light'
                      : 'border-transparent text-theme-text-muted hover:text-theme-text hover:bg-bg-secondary/40'
                  }`}
                >
                  <span className="truncate max-w-[200px] lg:max-w-none">{t.title.split(':')[0]}</span>
                  <ChevronRight size={14} className={`hidden lg:block transition-transform ${activeTradeoff === idx ? 'translate-x-1 text-accent-teal' : 'text-transparent'}`} />
                </button>
              ))}
            </div>

            {/* Tradeoff Details Display (Col 8) */}
            <div className="lg:col-span-8 p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist min-h-[260px] flex flex-col justify-between relative">
              <div className="h-1.5 w-full bg-accent-teal absolute top-0 left-0" />
              
              <div className="space-y-4 pt-2">
                <h4 className="text-lg font-bold text-zinc-100 font-sans">
                  {tradeoffs[activeTradeoff].title}
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed font-medium">
                  {tradeoffs[activeTradeoff].details}
                </p>
              </div>

              <div className="mt-6 p-3 bg-[#090a0d] border border-border-muted flex gap-3 items-start rounded-none">
                <Zap size={16} className="text-accent-teal shrink-0 mt-0.5" />
                <div className="text-[11px] font-mono text-zinc-300">
                  <span className="text-zinc-500 font-bold uppercase">Tradeoff Impact: </span>
                  {tradeoffs[activeTradeoff].impact}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FAANG MEETING LESSONS & REVIEWS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1f2026] pt-12">
          
          {/* Box 1: Production Outage Failure Scenarios */}
          <div className="p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist relative space-y-4">
            <h3 className="text-base font-mono font-black text-red-400 uppercase flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>Edge Case Outages & Self-Healing</span>
            </h3>
            
            <div className="space-y-4 text-xs font-sans leading-relaxed text-zinc-400">
              <div className="space-y-1">
                <strong className="text-zinc-200">1. Twilio Retry Webhook Storm</strong>
                <p>
                  WhatsApp user spikes send message events repeatedly. Twilio webhooks timeout at 15s. If processing takes 16s, Twilio retries, double-triggering the queue, causing VRAM exhaustion.
                  <br />
                  <span className="text-[#38bdf8] font-mono text-[10px] font-bold">Solution:</span> Handled via Redis setnx checks (idempotency key based on Twilio SMS Msg ID) with 5-minute expire TTL.
                </p>
              </div>

              <div className="space-y-1 border-t border-[#1f2026] pt-3">
                <strong className="text-zinc-200">2. Thread-Local Variable Bleeding</strong>
                <p>
                  Because Python and Django recycle server WSGI worker threads, thread-local requests parameters (like current active Tenant UUID) persist inside recycled threads. This could leak clinical patient files to cross tenants.
                  <br />
                  <span className="text-[#38bdf8] font-mono text-[10px] font-bold">Solution:</span> Wrapped the entire API routing flow inside middleware with strict `finally: context.clear()` garbage collection filters.
                </p>
              </div>
            </div>
          </div>

          {/* Box 2: Systems Lessons Learned (FAANG reviews focus) */}
          <div className="p-6 border-2 border-border-muted bg-[#0d0e12] rounded-none shadow-brutalist relative space-y-4">
            <h3 className="text-base font-mono font-black text-accent-teal uppercase flex items-center gap-2">
              <Cpu size={16} />
              <span>Lessons Learned & System Benchmarks</span>
            </h3>

            <div className="space-y-4 text-xs font-sans leading-relaxed text-zinc-400 font-medium">
              <div className="space-y-1">
                <strong className="text-zinc-200">1. Metrics-Driven Optimization</strong>
                <p>
                  Rigorous profiling showed that 82% of LLM latencies were spent on raw text tensor encoding in VRAM. Rather than deploying bigger GPU servers, implementing L1/L2 Redis semantic bypass caches reduced operational spend by 61%. Optimize resource alignment before throwing compute at it.
                </p>
              </div>

              <div className="space-y-1 border-t border-[#1f2026] pt-3">
                <strong className="text-zinc-200">2. Graceful Degraded States (CPU Failover)</strong>
                <p>
                  High spikes will eventually breach physical limits. Instead of hard crashes, architecting a CPU worker fallback queue degrades the user experience (from 213ms response to 1.6s) but maintains 100% availability during server outages.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-center border-t border-[#1f2026] pt-12 pb-6">
          <button
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-theme-text text-bg-dark border-2 border-border-muted font-mono font-bold text-xs hover:opacity-90 transition-all active:scale-95 shadow-brutalist cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Close Deep Dive & Return to Portfolio</span>
          </button>
        </div>

      </div>
    </div>
  );
};
