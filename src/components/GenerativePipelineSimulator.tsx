import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Film, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';

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
  const [renderedVideoPath, setRenderedVideoPath] = useState('');
  
  // Subtitle sync animation state
  const [syncWord, setSyncWord] = useState('');
  const [syncTime, setSyncTime] = useState(0);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll logs (Direct scroll modification to avoid scrolling the main page window)
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

  // Dynamic canvas background loop (Subway Surfers vs Minecraft Parkour)
  useEffect(() => {
    if (pipelineState !== 'success') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    // --- Subway Surfers State Variables ---
    let surferX = 0;
    let surferTargetX = 0;
    let surferY = 0;
    let surferJumpTicks = 0;
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

      if (videoBackground === 'surfers') {
        // --- DRAW SUBWAY SURFERS ---
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.35, '#1e1b4b');
        skyGrad.addColorStop(0.7, '#2d063b');
        skyGrad.addColorStop(1, '#020617');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center horizon point
        const hX = canvas.width / 2;
        const hY = canvas.height * 0.4;

        // Tracks (converging lines)
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        const lanes = [-1, 0, 1];
        lanes.forEach((lane) => {
          ctx.beginPath();
          ctx.moveTo(hX + lane * 6, hY);
          ctx.lineTo(hX + lane * 45, canvas.height);
          ctx.stroke();
        });

        // Rails sleepers sliding down
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

        // Draw trains/obstacles
        trainObstacles.forEach((obs) => {
          obs.z -= 4;
          if (obs.z <= 0) {
            obs.z = 250;
            obs.lane = Math.floor(Math.random() * 3) - 1; // pick new random lane
          }

          const scale = (250 - obs.z) / 250;
          if (scale > 0) {
            const y = hY + (canvas.height - hY) * scale;
            const x = hX + obs.lane * 28 * scale;
            const trainW = 18 * scale;
            const trainH = 30 * scale;

            ctx.fillStyle = obs.color;
            ctx.fillRect(x - trainW / 2, y - trainH, trainW, trainH);

            // Windows on train
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(x - trainW * 0.3, y - trainH * 0.7, trainW * 0.2, trainH * 0.2);
            ctx.fillRect(x + trainW * 0.1, y - trainH * 0.7, trainW * 0.2, trainH * 0.2);
          }
        });

        // Lane swapping trigger
        if (frameCount % 70 === 0) {
          surferTargetX = (Math.floor(Math.random() * 3) - 1) * 25;
        }
        surferX += (surferTargetX - surferX) * 0.12;

        // Jump physics trigger
        if (frameCount % 85 === 0 && surferJumpTicks === 0) {
          surferJumpTicks = 24;
        }
        if (surferJumpTicks > 0) {
          surferJumpTicks--;
          surferY = Math.sin((surferJumpTicks / 24) * Math.PI) * 20;
        } else {
          surferY = 0;
        }

        // Draw surfer player
        const pX = hX + surferX;
        const pY = canvas.height * 0.85 - surferY;

        // Board shadow / Board
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(pX, pY + 3, 8, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Surfer stick figure
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(pX, pY - 12, 4, 0, Math.PI * 2); // Head
        ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(pX - 2.5, pY - 8, 5, 8); // Shirt
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(pX - 2, pY, 4, 3); // Pants/Legs

      } else {
        // --- DRAW MINECRAFT PARKOUR ---
        // Sky
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun & clouds
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(15, 15, 12, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(35, 25, 25, 6);
        ctx.fillRect(8, 45, 30, 8);

        // Converging horizon
        const hX = canvas.width / 2;
        const hY = canvas.height * 0.55;

        // Grass/Dirt blocks sliding down
        mcBlocks.forEach((block) => {
          block.z -= 2.5;
          if (block.z <= 0) {
            block.z = 240;
            block.x = (Math.random() - 0.5) * 60;
            block.y = 80 + Math.random() * 25;
          }

          const scale = 25 / (block.z + 25);
          const x = hX + block.x * scale;
          const y = hY + block.y * scale;
          const bw = 35 * scale;
          const bh = 35 * scale;

          // Dirt bottom
          ctx.fillStyle = '#7c2d12';
          ctx.fillRect(x - bw / 2, y, bw, bh);

          // Grass top
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(x - bw / 2, y, bw, bh * 0.3);

          // Grid wireframe look
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x - bw / 2, y, bw, bh);
        });

        // Swinging block arm (lower right)
        const armSwing = Math.sin(frameCount * 0.12) * 3.5;
        const armX = canvas.width * 0.65 + armSwing;
        const armY = canvas.height * 0.75 + Math.abs(armSwing);

        ctx.fillStyle = '#d97706'; // Skin
        ctx.fillRect(armX, armY, 25, 45);
        ctx.fillStyle = '#047857'; // Green sleeve
        ctx.fillRect(armX - 4, armY + 12, 12, 15);

        // Holding a pickaxe/sword (simple block line)
        ctx.strokeStyle = '#94a3b8'; // Iron blade
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(armX + 8, armY + 4);
        ctx.lineTo(armX - 6 - armSwing, armY - 12);
        ctx.stroke();

        ctx.strokeStyle = '#78350f'; // Handle
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(armX + 6, armY + 6);
        ctx.lineTo(armX + 11, armY + 11);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pipelineState, videoBackground]);

  const addLog = (text: string, type: LogLine['type'] = 'info') => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  const getSubredditPost = () => {
    switch (subreddit) {
      case 'r/TwoSentenceHorror':
        return {
          title: "I always thought my cat was staring at a blank wall.",
          body: "Then I noticed the wall was breathing.",
          words: ["I", "always", "thought", "my", "cat", "was", "staring", "at", "a", "blank", "wall.", "Then", "I", "noticed", "the", "wall", "was", "breathing."]
        };
      case 'r/Showerthoughts':
        return {
          title: "Your keys travel further than your car does.",
          body: "Since they are in your pocket even when walking.",
          words: ["Your", "keys", "travel", "further", "than", "your", "car", "does.", "Since", "they", "are", "in", "your", "pocket", "even", "when", "walking."]
        };
      default:
        return {
          title: "What's a minor thing that can ruin a whole day?",
          body: "Stepping on a wet patch immediately after putting fresh socks on.",
          words: ["What's", "a", "minor", "thing", "that", "can", "ruin", "a", "whole", "day?", "Stepping", "on", "a", "wet", "patch", "immediately", "after", "putting", "fresh", "socks", "on."]
        };
    }
  };

  // Run simulation
  const startPipeline = async () => {
    setPipelineState('running');
    setActiveStage('fetch');
    setLogs([]);
    setRenderProgress(0);

    const post = getSubredditPost();

    addLog('[SYSTEM] Starting Automated Video Render Pipeline...', 'info');
    await new Promise((r) => setTimeout(r, 600));

    // STAGE 1: FETCH
    addLog(`[FETCH] Querying Reddit API for ${subreddit}...`, 'info');
    await new Promise((r) => setTimeout(r, 800));
    addLog(`[FETCH] Success! Title: "${post.title.substring(0, 35)}..."`, 'success');
    addLog(`[FETCH] Tokenizer (NLTK): Parsing text stream into max 60-word video segments.`, 'info');
    await new Promise((r) => setTimeout(r, 600));

    // STAGE 2: VOICE SYNTHESIS (Suno Bark)
    setActiveStage('voice');
    addLog('[BARK] Allocating VRAM context for voice synthesis...', 'info');
    await new Promise((r) => setTimeout(r, 600));

    // Trigger OOM Crash condition: Voice Accel GPU + Whisper Large + FFmpeg GPU = 50 + 20 + 25 + 15 = 110% VRAM!
    const wouldCrash = voiceAccel === 'gpu' && whisperModel === 'large' && ffmpegAccel === 'gpu';

    if (voiceAccel === 'gpu') {
      addLog('[BARK] Suno Bark model loaded into CUDA VRAM. Generating wave buffer...', 'info');
    } else {
      addLog('[BARK] Suno Bark model running on CPU fallback thread. Speed: 0.4x (Processing latency doubled)...', 'warn');
    }

    const voiceDelay = voiceAccel === 'gpu' ? 1200 : 2500;
    await new Promise((r) => setTimeout(r, voiceDelay));

    if (wouldCrash) {
      // Crash!
      addLog('[CRITICAL] CUDA OUT OF MEMORY (OOM) EXCEPTION on Device 0 (RTX 3050)!', 'error');
      addLog('[CRITICAL] Failed to allocate 2.44 GB of continuous memory address block.', 'error');
      addLog('[CRITICAL] Video compilation aborted to prevent hardware stall.', 'error');
      setVram(100);
      setPipelineState('crashed');
      setActiveStage(null);
      return;
    }

    addLog('[BARK] Voice synthesis completed. Buffer size: 2.1MB, Sample Rate: 24kHz.', 'success');

    // STAGE 3: WHISPER ALIGNMENT
    setActiveStage('align');
    addLog(`[WHISPER] Ingesting speech audio and tokenizing with Whisper (${whisperModel})...`, 'info');
    
    // Simulate words highlighting in the logs
    const alignDelay = whisperModel === 'large' ? 1500 : 800;
    await new Promise((r) => setTimeout(r, alignDelay / 2));
    addLog(`[WHISPER] Sub-word phonetic mapping finished. Outputting timestamp tokens.`, 'info');
    await new Promise((r) => setTimeout(r, alignDelay / 2));
    addLog(`[WHISPER] Alignment sync successful. Mapped ${post.words.length} words to timeline.`, 'success');

    // STAGE 4: PLAYWRIGHT UI CAPTURE
    setActiveStage('playwright');
    addLog('[PLAYWRIGHT] Initializing headless Chromium instance...', 'info');
    await new Promise((r) => setTimeout(r, 800));
    addLog('[PLAYWRIGHT] Emulating viewport: 1080x1920 (TikTok 9:16 aspect ratio).', 'info');
    addLog(`[PLAYWRIGHT] Capturing selector: #reddit-post-card-container`, 'info');
    await new Promise((r) => setTimeout(r, 800));
    addLog('[PLAYWRIGHT] DOM snapshot saved to: temp/post_ui_snapshot.png', 'success');

    // STAGE 5: FFMEG RENDER COMPOSITION
    setActiveStage('ffmpeg');
    addLog('[FFMPEG] Initializing H.264 video encoder stream...', 'info');
    await new Promise((r) => setTimeout(r, 600));

    if (ffmpegAccel === 'gpu') {
      addLog('[FFMPEG] Enforcing NVENC Hardware acceleration (-c:v h264_nvenc)...', 'success');
    } else {
      addLog('[FFMPEG] CPU Software Encoding fallback (-c:v libx264). Render speed low...', 'warn');
    }

    const totalFrames = 300;
    const renderingInterval = ffmpegAccel === 'gpu' ? 40 : 120;

    for (let frame = 30; frame <= totalFrames; frame += 30) {
      await new Promise((r) => setTimeout(r, renderingInterval));
      const percentage = Math.round((frame / totalFrames) * 100);
      setRenderProgress(percentage);
      addLog(
        `[ffmpeg] frame= ${frame}/${totalFrames} fps= ${ffmpegAccel === 'gpu' ? 48 : 12} q=21.5 size= ${Math.round(frame * 1.2)}MB time=00:00:${Math.round(frame / 30).toString().padStart(2, '0')}.12 speed=${ffmpegAccel === 'gpu' ? '1.62x' : '0.41x'}`,
        'process'
      );
    }

    addLog('[FFMPEG] Composite rendering complete. Audio multiplexing finished.', 'success');
    addLog('[SYSTEM] Automated Reddit Video generation fully completed!', 'success');
    
    setRenderedVideoPath(`build/output_${subreddit.replace('/', '_')}_story.mp4`);
    setPipelineState('success');
    setActiveStage(null);

    // Run subtitle preview timer loop
    let idx = 0;
    const words = post.words;
    const subtitleTimer = setInterval(() => {
      if (idx < words.length) {
        setSyncWord(words[idx]);
        setSyncTime(idx);
        idx++;
      } else {
        idx = 0;
      }
    }, 450);

    // Keep reference to clear it when state transitions
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
      
      {/* macOS Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-[#1f2026]">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-bold text-[10px]">
            <span className="text-[#27c93f]">bash</span>
            <span className="text-zinc-500"> - </span>
            <span className="text-[#ffbd2e]">reddit_render.sh</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${pipelineState === 'running' ? 'bg-[#27c93f] animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-bold text-zinc-500 font-mono">VIDEO PIPELINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        
        {/* Left: Configuration & Controls (Col span 4) */}
        <div className="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-[#1f2026] space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Pipeline Configurations</span>
            <h4 className="text-zinc-100 font-black text-[11px] uppercase">Automated Gen-AI Video</h4>
          </div>

          {/* Subreddit Option */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">1. INGESTION SUBREDDIT</label>
            <select
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value as any)}
              disabled={pipelineState === 'running'}
              className="w-full bg-[#13151b] text-zinc-200 border border-[#1f2026] p-1.5 rounded-none font-bold text-xs outline-none cursor-pointer focus:border-accent-teal"
            >
              <option value="r/AskReddit">r/AskReddit (Daily Stories)</option>
              <option value="r/TwoSentenceHorror">r/TwoSentenceHorror (Creepy)</option>
              <option value="r/Showerthoughts">r/Showerthoughts (Trivia)</option>
            </select>
          </div>

          {/* Suno Bark Option */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">2. SUNO BARK GENERATOR</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setVoiceAccel('gpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${voiceAccel === 'gpu' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                GPU (Suno Bark)
              </button>
              <button
                onClick={() => setVoiceAccel('cpu')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${voiceAccel === 'cpu' ? 'border-amber-500 text-amber-500 bg-amber-950/20' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                CPU Fallback
              </button>
            </div>
          </div>

          {/* OpenAI Whisper Model */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">3. WHISPER ALIGNMENT</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setWhisperModel('base')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${whisperModel === 'base' ? 'border-[#38bdf8] text-[#38bdf8] bg-[#0c2e40]/40' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Base Model (Low RAM)
              </button>
              <button
                onClick={() => setWhisperModel('large')}
                disabled={pipelineState === 'running'}
                className={`py-1 text-[10px] font-bold border transition-colors cursor-pointer rounded-none outline-none ${whisperModel === 'large' ? 'border-[#ffbd2e] text-[#ffbd2e] bg-amber-950/20' : 'border-[#1f2026] bg-[#13151b] hover:border-zinc-700'}`}
              >
                Large Model (+25% VRAM)
              </button>
            </div>
          </div>

          {/* FFmpeg Video Renderer */}
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 font-bold block">4. FFMPEG GRAPHICS ENCODER</label>
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
                <span>Run Ingestion Pipeline</span>
              </button>
            )}

            {pipelineState === 'running' && (
              <div className="w-full py-2 bg-[#13151b] text-zinc-500 font-bold flex items-center justify-center gap-2 border border-[#1f2026] select-none">
                <div className="h-2 w-2 border-2 border-zinc-500 border-t-transparent animate-spin rounded-full" />
                <span>Rendering Video...</span>
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
              <span className="text-zinc-500 font-mono uppercase">CUDA VRAM:</span>
              <span className={vram >= 90 ? 'text-red-500 animate-pulse font-black' : vram >= 75 ? 'text-amber-500 font-bold' : 'text-[#38bdf8]'}>
                {vram}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-none overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${vram >= 90 ? 'bg-red-500' : vram >= 75 ? 'bg-amber-500' : 'bg-[#38bdf8]'}`}
                style={{ width: `${vram}%` }}
              />
            </div>
            {vram >= 80 && pipelineState === 'running' && (
              <div className="text-[9px] text-amber-500 animate-pulse flex items-center gap-1 font-bold">
                <AlertTriangle size={10} />
                <span>Warning: VRAM Allocation near limit!</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Terminal Output & Logs (Col span 5) */}
        <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-[#1f2026] flex flex-col justify-between h-[340px]">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Live Telemetry Terminal</span>
            <div ref={logContainerRef} className="overflow-y-auto h-[290px] space-y-1.5 pr-1 font-mono text-[10px] leading-relaxed scrollbar-thin">
              {logs.length === 0 && (
                <div className="text-zinc-600 italic select-none pt-4">
                  $ Waiting for process initialization...
                  <br />
                  $ Configure settings and run the ingestion pipeline.
                </div>
              )}
              {logs.map((log, index) => {
                let colorClass = 'text-zinc-400';
                if (log.type === 'success') colorClass = 'text-[#27c93f] font-bold';
                if (log.type === 'warn') colorClass = 'text-amber-500 font-bold';
                if (log.type === 'error') colorClass = 'text-red-500 font-black';
                if (log.type === 'process') colorClass = 'text-zinc-500';

                return (
                  <div key={index} className={colorClass}>
                    {log.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Render Preview/SLA Verification (Col span 3) */}
        <div className="md:col-span-3 p-4 bg-[#090a0d] flex flex-col justify-center items-center text-center space-y-4">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block self-start">Renderer Output</span>

          <AnimatePresence mode="wait">
            
            {/* IDLE state */}
            {pipelineState === 'idle' && (
              <motion.div
                key="idle-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-3"
              >
                <Film size={32} className="text-zinc-600 animate-pulse" />
                <div className="text-[10px] text-zinc-500 leading-normal max-w-[150px]">
                  Output display. Trigger ingestion to preview compiled vertical video.
                </div>
              </motion.div>
            )}

            {/* CRASHED state */}
            {pipelineState === 'crashed' && (
              <motion.div
                key="crashed-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 space-y-3"
              >
                <AlertTriangle size={36} className="text-red-500 animate-bounce" />
                <span className="text-red-500 font-extrabold text-[11px] uppercase">GPU PIPELINE STALLED</span>
                <p className="text-[9px] text-zinc-400 max-w-[150px] leading-relaxed">
                  RTX 3050 hit 100% VRAM constraint. Disable GPU acceleration options or enable CPU fallback to allow execution.
                </p>
              </motion.div>
            )}

            {/* RUNNING state */}
            {pipelineState === 'running' && (
              <motion.div
                key="running-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center space-y-4"
              >
                {/* Pipeline visual diagram flow */}
                <div className="space-y-1.5 w-full">
                  <div className={`p-1.5 border text-center transition-all ${activeStage === 'fetch' ? 'border-[#38bdf8] bg-[#0c2e40]/20 text-[#38bdf8] font-bold' : 'border-[#1f2026] text-zinc-600'}`}>
                    1. API Fetch & Chunk
                  </div>
                  <div className={`p-1.5 border text-center transition-all ${activeStage === 'voice' ? 'border-[#38bdf8] bg-[#0c2e40]/20 text-[#38bdf8] font-bold' : 'border-[#1f2026] text-zinc-600'}`}>
                    2. Suno Bark voice synthesis
                  </div>
                  <div className={`p-1.5 border text-center transition-all ${activeStage === 'align' ? 'border-[#38bdf8] bg-[#0c2e40]/20 text-[#38bdf8] font-bold' : 'border-[#1f2026] text-zinc-600'}`}>
                    3. OpenAI Whisper align
                  </div>
                  <div className={`p-1.5 border text-center transition-all ${activeStage === 'playwright' ? 'border-[#38bdf8] bg-[#0c2e40]/20 text-[#38bdf8] font-bold' : 'border-[#1f2026] text-zinc-600'}`}>
                    4. Playwright card snapshot
                  </div>
                  <div className={`p-1.5 border text-center transition-all ${activeStage === 'ffmpeg' ? 'border-[#27c93f] bg-[#0d2e1b]/40 text-[#27c93f] font-bold' : 'border-[#1f2026] text-zinc-600'}`}>
                    5. FFmpeg compile ({renderProgress}%)
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS state: Synchronized mobile vertical video simulator preview */}
            {pipelineState === 'success' && (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center space-y-3"
              >
                {/* 9:16 Tiktok Frame */}
                <div className="relative w-[130px] h-[220px] border-2 border-zinc-700 bg-black overflow-hidden shadow-md flex flex-col justify-between p-3 select-none">
                  
                  {/* Canvas for dynamic video backdrop gameplay loop */}
                  <canvas 
                    ref={canvasRef} 
                    width={130} 
                    height={220} 
                    className="absolute inset-0 z-0 w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/85 to-transparent z-[5] pointer-events-none" />

                  {/* Reddit UI Post Card overlay inside 9:16 frame */}
                  <div className="relative z-10 bg-[#1a1a1b] p-2 border border-zinc-800 rounded-none space-y-1 text-left w-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center text-[7px] font-black text-white font-sans">r</span>
                      <span className="text-[7px] text-zinc-400 font-bold">{subreddit}</span>
                    </div>
                    <div className="text-[7.5px] text-zinc-100 font-black leading-snug">
                      {currentPost.title}
                    </div>
                    <div className="text-[6.5px] text-zinc-400 leading-snug">
                      {currentPost.body.substring(0, 35)}...
                    </div>
                  </div>

                  {/* Synchronized flashing big subtitle keyframe */}
                  <div className="relative z-10 flex-grow flex justify-center items-center py-4">
                    <motion.div
                      key={syncWord}
                      initial={{ scale: 0.8, opacity: 0.7 }}
                      animate={{ scale: 1.15, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="text-yellow-400 text-sm font-black uppercase tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/40 px-2 py-0.5"
                    >
                      {syncWord || currentPost.words[0]}
                    </motion.div>
                  </div>

                  {/* Simulated timeline scrubber */}
                  <div className="relative z-10 w-full bg-zinc-800 h-0.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${(syncTime / currentPost.words.length) * 100}%` }}
                    />
                  </div>

                </div>

                <div className="space-y-1">
                  <div className="text-[9px] text-[#27c93f] font-bold flex items-center gap-1 justify-center">
                    <CheckCircle2 size={10} />
                    <span>Active Preview</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 max-w-[140px] leading-relaxed">
                    Speech-to-text synchronized. Output: <span className="text-zinc-400 select-all font-mono text-[7px] block mt-0.5">{renderedVideoPath}</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
