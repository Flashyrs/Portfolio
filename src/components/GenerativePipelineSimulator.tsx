import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface LogLine {
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'process';
}

export const GenerativePipelineSimulator: React.FC = () => {
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'crashed' | 'success'>('idle');
  const [activeStage, setActiveStage] = useState<'fetch' | 'voice' | 'align' | 'playwright' | 'ffmpeg' | null>(null);
  
  // Configurations
  const [subreddit, setSubreddit] = useState<'r/AskReddit' | 'r/TwoSentenceHorror' | 'r/Showerthoughts'>('r/AskReddit');
  const [voiceAccel, setVoiceAccel] = useState<'gpu' | 'cpu'>('gpu');
  const [whisperModel, setWhisperModel] = useState<'base' | 'large'>('base');
  const [ffmpegAccel, setFfmpegAccel] = useState<'gpu' | 'cpu'>('gpu');
  const [videoBackground, setVideoBackground] = useState<'surfers' | 'minecraft'>('surfers');

  // Runtime Stats
  const [vram, setVram] = useState(50);
  const [renderProgress, setRenderProgress] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  
  // Subtitle sync animation state
  const [syncWord, setSyncWord] = useState('');

  const logContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const videoBackgroundRef = useRef(videoBackground);

  // Sync background state changes to mutable ref immediately
  useEffect(() => {
    videoBackgroundRef.current = videoBackground;
  }, [videoBackground]);

  // Direct container scroll to prevent window-level browser page scrolling
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // VRAM calculation based on configs
  useEffect(() => {
    let currentVram = 50; // Base system overhead
    if (pipelineState === 'running') {
      if (activeStage === 'voice' && voiceAccel === 'gpu') currentVram += 20;
      if (activeStage === 'align' && whisperModel === 'large') currentVram += 25;
      if (activeStage === 'ffmpeg' && ffmpegAccel === 'gpu') currentVram += 15;
    }
    setVram(currentVram);
  }, [activeStage, voiceAccel, whisperModel, ffmpegAccel, pipelineState]);

  // Clean up animation loop if component is unmounted
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const canvasCallbackRef = (canvas: HTMLCanvasElement | null) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    // --- Subway Surfers State Variables ---
    let trackOffset = 0;
    const trainObstacles = [
      { lane: -1, z: 200, color: '#f87171' },
      { lane: 1, z: 400, color: '#60a5fa' }
    ];

    // --- Minecraft State Variables ---
    const mcBlocks = [] as { x: number; y: number; z: number }[];
    for (let i = 0; i < 12; i++) {
      mcBlocks.push({
        x: (Math.random() - 0.5) * 80,
        y: 110 + (Math.random() - 0.5) * 20,
        z: i * 25
      });
    }

    const draw = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentBg = videoBackgroundRef.current;

      if (currentBg === 'surfers') {
        // --- DRAW SUBWAY SURFERS ---
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.35, '#1e1b4b');
        skyGrad.addColorStop(0.7, '#2d063b');
        skyGrad.addColorStop(1, '#020617');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const hX = canvas.width / 2;
        const hY = canvas.height * 0.4;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        const lanes = [-1, 0, 1];
        lanes.forEach((lane) => {
          ctx.beginPath();
          ctx.moveTo(hX + lane * 6, hY);
          ctx.lineTo(hX + lane * 45, canvas.height);
          ctx.stroke();
        });

        trackOffset += 3.5;
        if (trackOffset >= 30) trackOffset = 0;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let offset = trackOffset; offset < canvas.height - hY; offset += 20) {
          const ratio = offset / (canvas.height - hY);
          const y = hY + offset;
          const w = 45 * ratio;
          ctx.beginPath();
          ctx.moveTo(hX - w, y);
          ctx.lineTo(hX + w, y);
          ctx.stroke();
        }

        trainObstacles.forEach((obs) => {
          obs.z -= 4;
          if (obs.z <= 0) {
            obs.z = 250;
            obs.lane = Math.floor(Math.random() * 3) - 1;
          }

          const scale = (250 - obs.z) / 250;
          if (scale > 0) {
            const y = hY + (canvas.height - hY) * scale;
            const x = hX + obs.lane * 28 * scale;
            const boxW = 18 * scale;
            const boxH = 26 * scale;

            ctx.fillStyle = obs.color;
            ctx.fillRect(x - boxW / 2, y - boxH, boxW, boxH);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - boxW / 2, y - boxH, boxW, boxH);
          }
        });

        // Surfer character
        const charY = canvas.height * 0.88;
        const charX = hX;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(charX, charY - 14, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(charX - 4, charY - 9, 8, 10);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(charX - 6, charY + 1, 12, 3);

      } else {
        // --- DRAW MINECRAFT ---
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const mH = canvas.height * 0.45;
        const mX = canvas.width / 2;

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, mH, canvas.width, canvas.height - mH);

        mcBlocks.forEach((block) => {
          block.z -= 1.5;
          if (block.z <= 0) {
            block.z = 280;
            block.x = (Math.random() - 0.5) * 90;
            block.y = 110 + (Math.random() - 0.5) * 20;
          }

          const scale = (280 - block.z) / 280;
          if (scale > 0) {
            const sX = mX + block.x * scale;
            const sY = mH + (block.y - 110) * scale + (canvas.height - mH) * scale * 0.8;
            const bSize = 14 * scale;

            ctx.fillStyle = '#10b981';
            ctx.fillRect(sX, sY, bSize, bSize * 0.3);

            ctx.fillStyle = '#78350f';
            ctx.fillRect(sX, sY + bSize * 0.3, bSize, bSize * 0.7);

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(sX, sY, bSize, bSize);
          }
        });

        const charX = mX;
        const charY = canvas.height * 0.78 + Math.sin(frameCount * 0.15) * 4;

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(charX - 4, charY - 8, 8, 9);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(charX - 3, charY - 14, 6, 6);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const addLog = (text: string, type: LogLine['type'] = 'info') => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  const getSubredditPost = () => {
    switch (subreddit) {
      case 'r/AskReddit':
        return {
          title: "What's an engineering truth that no one wants to admit?",
          author: "u/CodeCrafter",
          upvotes: "34.2k",
          comments: "4.1k",
          text: "Most production systems are held together by robust error boundaries, aggressive semantic caching, and engineers who care deeply about observability.",
          words: ["Most", "production", "systems", "are", "held", "together", "by", "robust", "error", "boundaries,", "aggressive", "semantic", "caching,", "and", "engineers", "who", "care", "deeply", "about", "observability."]
        };
      case 'r/TwoSentenceHorror':
        return {
          title: "I turned off the server thinking it was obsolete.",
          author: "u/SysAdminGhost",
          upvotes: "18.9k",
          comments: "820",
          text: "When the lights in the entire building went out, I realized the heartbeat daemon wasn't running on our server—it was running inside me.",
          words: ["When", "the", "lights", "in", "the", "entire", "building", "went", "out,", "I", "realized", "the", "heartbeat", "daemon", "wasn't", "running", "on", "our", "server—it", "was", "running", "inside", "me."]
        };
      case 'r/Showerthoughts':
        return {
          title: "Writing clean code is like writing clean essays.",
          author: "u/DeepThinker",
          upvotes: "45.1k",
          comments: "2.3k",
          text: "If you need a 10-page manual to explain your 20 lines of code, the issue isn't the reader—it's the abstraction.",
          words: ["If", "you", "need", "a", "10-page", "manual", "to", "explain", "your", "20", "lines", "of", "code,", "the", "issue", "isn't", "the", "reader—it's", "the", "abstraction."]
        };
    }
  };

  const startPipeline = async () => {
    setPipelineState('running');
    setActiveStage('fetch');
    setLogs([]);
    setRenderProgress(0);

    const post = getSubredditPost();

    addLog('[SYSTEM] Initializing NarrateLoop Autonomous Ingestion Engine...', 'info');
    await new Promise((r) => setTimeout(r, 500));

    // STAGE 1: 3-TIER INGESTION MATRIX
    addLog(`[INGEST] 3-Tier Reddit Matrix: PRAW API → OAuth Token Negotiation → RSS2JSON Proxy...`, 'info');
    await new Promise((r) => setTimeout(r, 700));
    addLog(`[INGEST] Success! Extracted story from ${subreddit} (100% cloud pass)`, 'success');
    addLog(`[NLP / GEMINI] Contextual NLP: Identified narrator gender tag & sanitized markdown formatting.`, 'info');
    await new Promise((r) => setTimeout(r, 500));

    // STAGE 2: NEURAL TTS SYNTHESIS (Edge-TTS + Bark Fallback)
    setActiveStage('voice');
    addLog('[VOICE] Synthesizing neural speech with +25% tuned pacing...', 'info');
    await new Promise((r) => setTimeout(r, 500));

    const wouldCrash = voiceAccel === 'gpu' && whisperModel === 'large' && ffmpegAccel === 'gpu';

    if (voiceAccel === 'gpu') {
      addLog('[VOICE] Edge-TTS / Bark CUDA stream allocated. WebSocket streaming active...', 'info');
    } else {
      addLog('[VOICE] Running CPU fallback synthesis thread. Pace: +25% (Latency doubled)...', 'warn');
    }

    const voiceDelay = voiceAccel === 'gpu' ? 1000 : 2000;
    await new Promise((r) => setTimeout(r, voiceDelay));

    if (wouldCrash) {
      addLog('[CRITICAL] CUDA OUT OF MEMORY (OOM) EXCEPTION on Device 0!', 'error');
      addLog('[CRITICAL] GPU VRAM allocation exceeded 100% buffer threshold.', 'error');
      addLog('[CRITICAL] Video compilation aborted to safeguard hardware.', 'error');
      setVram(100);
      setPipelineState('crashed');
      setActiveStage(null);
      return;
    }

    addLog('[VOICE] Neural audio synthesized (24kHz, +25% pacing, 0-drift stream).', 'success');

    // STAGE 3: WORD-LEVEL TIMESTAMP ALIGNMENT
    setActiveStage('align');
    addLog(`[ALIGN] Extracting sub-millisecond word timestamps directly from WebSocket stream...`, 'info');
    
    const alignDelay = whisperModel === 'large' ? 1200 : 600;
    await new Promise((r) => setTimeout(r, alignDelay / 2));
    addLog(`[ALIGN] Dynamic ASS/SSA karaoke styling generated (&H0000FFFF yellow / &H000000FF red).`, 'info');
    await new Promise((r) => setTimeout(r, alignDelay / 2));
    addLog(`[ALIGN] Aligned ${post.words.length} words with 100% boundary synchronization.`, 'success');

    // STAGE 4: UI CARD RENDER & FLOATING SNAPSHOT
    setActiveStage('playwright');
    addLog('[COMPOSITOR] Generating high-contrast floating Reddit UI card...', 'info');
    await new Promise((r) => setTimeout(r, 600));
    addLog('[COMPOSITOR] Applying alpha transition (fade=t=out:st=2.6:d=0.4)...', 'info');
    await new Promise((r) => setTimeout(r, 600));
    addLog('[COMPOSITOR] Dynamic 1.0s thumbnail snapshot saved to: thumb_idx.png', 'success');

    // STAGE 5: FFMPEG NVENC HARDWARE RENDERING
    setActiveStage('ffmpeg');
    addLog('[FFMPEG] Initializing GPU NVENC Hardware Encoder (-c:v h264_nvenc)...', 'info');
    await new Promise((r) => setTimeout(r, 500));

    if (ffmpegAccel === 'gpu') {
      addLog('[FFMPEG] NVENC acceleration active. Vertical 9:16 crop & ASS subtitle burn-in...', 'success');
    } else {
      addLog('[FFMPEG] CPU Software Fallback (-c:v libx264 ultrafast)...', 'warn');
    }

    const totalFrames = 300;
    const renderingInterval = ffmpegAccel === 'gpu' ? 35 : 100;

    for (let frame = 30; frame <= totalFrames; frame += 30) {
      await new Promise((r) => setTimeout(r, renderingInterval));
      const percentage = Math.round((frame / totalFrames) * 100);
      setRenderProgress(percentage);
      addLog(
        `[ffmpeg] frame= ${frame}/${totalFrames} fps= ${ffmpegAccel === 'gpu' ? 58 : 14} q=20.0 size= ${Math.round(frame * 1.1)}MB time=00:00:${Math.round(frame / 30).toString().padStart(2, '0')}.20 speed=${ffmpegAccel === 'gpu' ? '2.14x' : '0.45x'}`,
        'process'
      );
    }

    addLog('[FFMPEG] Composite rendering complete. Audio multiplexing finished in <18s.', 'success');
    addLog('[DISTRIBUTION] Scheduled 3 daily slots (10:00, 16:00, 21:00 IST) via YouTube Data API v3.', 'success');
    addLog('[TELEMETRY] Broadcasted render status & artifact download links to Telegram CLI bot.', 'success');
    
    setPipelineState('success');
    setActiveStage(null);

    // Subtitle preview loop
    let idx = 0;
    const words = post.words;
    const subtitleTimer = setInterval(() => {
      if (idx < words.length) {
        setSyncWord(words[idx]);
        idx++;
      } else {
        idx = 0;
      }
    }, 400);

    (window as any)._subtitleTimerId = subtitleTimer;
  };

  useEffect(() => {
    return () => {
      if ((window as any)._subtitleTimerId) {
        clearInterval((window as any)._subtitleTimerId);
      }
    };
  }, []);

  const resetPipeline = () => {
    if ((window as any)._subtitleTimerId) {
      clearInterval((window as any)._subtitleTimerId);
    }
    setPipelineState('idle');
    setActiveStage(null);
    setLogs([]);
    setVram(50);
    setSyncWord('');
    setRenderProgress(0);
  };

  const currentPost = getSubredditPost();

  return (
    <div className="w-full text-xs font-mono text-zinc-300 bg-[#0d0e12] border-2 border-border-muted overflow-hidden shadow-brutalist-lg">
      
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-[#1f2026]">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-bold text-[10px]">
            <span className="text-[#27c93f]">python3</span>
            <span className="text-zinc-500"> - </span>
            <span className="text-[#ffbd2e]">narrateloop_engine.py</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${pipelineState === 'running' ? 'bg-[#27c93f] animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-bold text-accent-teal font-mono">NARRATELOOP 24/7 DAEMON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        
        {/* Left: Configuration & Controls (Col span 4) */}
        <div className="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-[#1f2026] space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Pipeline Configurations</span>
            <h4 className="text-zinc-100 font-black text-[11px] uppercase">NarrateLoop GenAI Video Engine</h4>
          </div>

          {/* Subreddit Option */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">1. 3-TIER INGESTION SOURCE</label>
            <select
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value as any)}
              disabled={pipelineState === 'running'}
              className="w-full bg-[#13151b] text-zinc-200 border border-[#1f2026] p-1.5 rounded-none font-bold text-xs outline-none cursor-pointer focus:border-accent-teal"
            >
              <option value="r/AskReddit">r/AskReddit (Daily Stories - 550 Words)</option>
              <option value="r/TwoSentenceHorror">r/TwoSentenceHorror (Creepy Drama)</option>
              <option value="r/Showerthoughts">r/Showerthoughts (Philosophical)</option>
            </select>
          </div>

          {/* Speech Synthesis Model */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">2. NEURAL TTS ENGINE (+25% PACE)</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setVoiceAccel('gpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${voiceAccel === 'gpu' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Edge-TTS (Tuned)
              </button>
              <button
                onClick={() => setVoiceAccel('cpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${voiceAccel === 'cpu' ? 'border-amber-500 text-amber-500 bg-amber-950/20' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                CPU Bark (Slow)
              </button>
            </div>
          </div>

          {/* Subtitle Alignment */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">3. SUBTITLE ENGINE (.ASS KARAOKE)</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setWhisperModel('base')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${whisperModel === 'base' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Edge WS Timestamps
              </button>
              <button
                onClick={() => setWhisperModel('large')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${whisperModel === 'large' ? 'border-[#ffbd2e] text-[#ffbd2e] bg-amber-950/20' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Whisper Large (High VRAM)
              </button>
            </div>
          </div>

          {/* FFmpeg Video Renderer */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">4. FFMPEG COMPOSITOR</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setFfmpegAccel('gpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${ffmpegAccel === 'gpu' ? 'border-[#27c93f] text-[#27c93f] bg-[#0d2e1b]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                NVENC GPU H.264
              </button>
              <button
                onClick={() => setFfmpegAccel('cpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${ffmpegAccel === 'cpu' ? 'border-[#1f2026] text-zinc-400 bg-[#13151b]' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                CPU libx264 (Slow)
              </button>
            </div>
          </div>

          {/* Backdrop Gameplay Selection */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">5. BACKDROP GAMEPLAY LOOP</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setVideoBackground('surfers')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${videoBackground === 'surfers' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Subway Surfers
              </button>
              <button
                onClick={() => setVideoBackground('minecraft')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${videoBackground === 'minecraft' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Minecraft Parkour
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#1f2026] space-y-2">
            {pipelineState === 'idle' && (
              <button
                onClick={startPipeline}
                className="w-full py-2 bg-zinc-100 hover:bg-[#38bdf8] text-zinc-950 font-black flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-none outline-none"
              >
                <Play size={12} fill="currentColor" />
                <span>Execute NarrateLoop Pipeline</span>
              </button>
            )}

            {pipelineState === 'running' && (
              <div className="w-full py-2 bg-[#13151b] text-zinc-500 font-bold flex items-center justify-center gap-2 border border-[#1f2026] select-none">
                <div className="h-2 w-2 border-2 border-zinc-500 border-t-transparent animate-spin rounded-full" />
                <span>Rendering Multimodal Video...</span>
              </div>
            )}

            {(pipelineState === 'crashed' || pipelineState === 'success') && (
              <button
                onClick={resetPipeline}
                className="w-full py-2 bg-[#1f2026] hover:bg-zinc-800 text-zinc-100 font-bold flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer transition-colors rounded-none outline-none"
              >
                <RotateCcw size={12} />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>

          {/* VRAM Monitor */}
          <div className="p-3 border border-[#1f2026] bg-[#090a0d] space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-zinc-400">CUDA VRAM BUFFER:</span>
              <span className={vram > 95 ? 'text-red-500 animate-pulse' : vram > 75 ? 'text-amber-400' : 'text-[#27c93f]'}>
                {vram}% (RTX 3050)
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#13151b] overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${vram > 95 ? 'bg-red-500' : vram > 75 ? 'bg-amber-400' : 'bg-[#27c93f]'}`} 
                style={{ width: `${Math.min(vram, 100)}%` }}
              />
            </div>
            {vram > 95 && (
              <span className="text-[9px] text-red-400 block pt-0.5 font-bold">
                WARNING: High memory pressure. Risk of CUDA OOM.
              </span>
            )}
          </div>

        </div>

        {/* Center: Stage Flow & Logs (Col span 5) */}
        <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-[#1f2026] flex flex-col justify-between space-y-4">
          
          {/* Pipeline Stages Tracker */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Autonomous Pipeline Stages</span>
            <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
              {[
                { id: 'fetch', label: '1. Ingest' },
                { id: 'voice', label: '2. TTS +25%' },
                { id: 'align', label: '3. ASS Sync' },
                { id: 'playwright', label: '4. UI Alpha' },
                { id: 'ffmpeg', label: '5. NVENC' }
              ].map((st) => (
                <div
                  key={st.id}
                  className={`p-1.5 text-center border ${
                    activeStage === st.id
                      ? 'border-[#38bdf8] bg-[#0c2e40] text-[#38bdf8] animate-pulse'
                      : logs.some((l) => l.text.includes(st.id.toUpperCase()))
                      ? 'border-[#27c93f] bg-[#0d2e1b] text-[#27c93f]'
                      : 'border-[#1f2026] bg-[#13151b] text-zinc-600'
                  }`}
                >
                  {st.label}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Console Logs */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#1f2026] text-[9px] text-zinc-500 font-bold">
              <span>NARRATELOOP LIVE TERMINAL</span>
              <span>{logs.length} events logged</span>
            </div>
            <div 
              ref={logContainerRef}
              className="flex-1 bg-[#090a0d] p-2.5 overflow-y-auto max-h-[260px] space-y-1 font-mono text-[10px]"
            >
              {logs.length === 0 && (
                <span className="text-zinc-600 italic">
                  Press 'Execute NarrateLoop Pipeline' to simulate Reddit story ingestion, neural voice synthesis, and NVENC GPU video compositing...
                </span>
              )}
              {logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed ${
                    log.type === 'error' ? 'text-red-400 font-bold' :
                    log.type === 'warn' ? 'text-amber-400 font-bold' :
                    log.type === 'success' ? 'text-[#27c93f]' :
                    log.type === 'process' ? 'text-zinc-400' : 'text-zinc-300'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* Render progress bar */}
          {renderProgress > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-zinc-400">NVENC RENDER:</span>
                <span className="text-[#38bdf8]">{renderProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#13151b] overflow-hidden">
                <div 
                  className="h-full bg-[#38bdf8] transition-all duration-100" 
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Right: 9:16 Video Player Preview Mockup (Col span 3) */}
        <div className="md:col-span-3 p-4 flex flex-col items-center justify-center bg-[#090a0d]">
          <div className="w-full max-w-[170px] aspect-[9/16] bg-[#000] border-2 border-zinc-700 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Live Animated Canvas (Subway Surfers / Minecraft) */}
            <canvas
              ref={canvasCallbackRef}
              width={170}
              height={302}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* In-Frame Reddit Overlay Card (Floating UI) */}
            <div className="relative z-10 p-2 m-2 bg-[#13151b]/95 border border-zinc-700 space-y-1 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff4500]" />
                <span className="text-[7px] text-zinc-400 font-bold">{subreddit}</span>
              </div>
              <p className="text-[8px] font-bold text-zinc-100 leading-tight line-clamp-2">
                {currentPost.title}
              </p>
            </div>

            {/* Word-Synchronized ASS/SSA Subtitle Karaoke Preview */}
            <div className="relative z-10 p-2 mb-4 text-center">
              {syncWord ? (
                <div className="inline-block px-2 py-1 bg-black/80 border border-yellow-400/50 backdrop-blur-sm animate-fade-in">
                  <span className="text-[12px] font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wide">
                    {syncWord}
                  </span>
                </div>
              ) : (
                <span className="text-[7px] text-zinc-500 font-bold bg-black/60 px-1 py-0.5">
                  [ASS/SSA Karaoke Subtitles]
                </span>
              )}
            </div>

            {/* Video Controls Decorator */}
            <div className="relative z-10 p-1.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center text-[7px] text-zinc-400">
              <span>1080x1920 (9:16)</span>
              <span className="text-[#38bdf8] font-bold">60 FPS</span>
            </div>

          </div>

          <span className="text-[8px] font-mono text-zinc-500 pt-2 text-center">
            Word-Synchronized ASS Karaoke & Alpha UI Fade
          </span>
        </div>

      </div>

    </div>
  );
};
