export interface Project {
  title: string;
  summary: string;
  stack: string[];
  bullets: string[];
  demoUrl?: string;
  githubUrl: string;
  docsUrl?: string;
  redocUrl?: string;
  youtubeUrl?: string;
  statusUrl?: string;
  badge?: string;
}

export interface LiveProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  githubUrl?: string;
  docsUrl?: string;
  youtubeUrl?: string;
  stack: string[];
  category: 'GenAI & Media' | 'Distributed & Cloud' | 'Realtime & WebRTC' | 'Algorithms & DevTools' | 'IoT & Companions';
  status: 'online' | 'healthy';
  uptime: string;
  latency: string;
  featured?: boolean;
}

export interface OracleInfrastructure {
  provider: string;
  os: string;
  cost: string;
  daemons: { name: string; manager: string; purpose: string; status: string }[];
  networking: {
    proxy: string;
    ssl: string;
    dns: string;
    ports: string;
  };
  kumaUrl: string;
  statusHubUrl: string;
  monitoredServicesCount: number;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  coreFocus: string;
  bullets: string[];
  metrics: { label: string; value: string }[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  timeline: string;
  gpa: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface ResumeData {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    statusPage: string;
  };
  about: string;
  stats: {
    value: string;
    label: string;
    subtext: string;
  }[];
  experience: Experience[];
  projects: Project[];
  liveProjects: LiveProject[];
  oracleInfrastructure: OracleInfrastructure;
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  honors: string[];
  leadership: string[];
}

export const resumeData: ResumeData = {
  name: "Roshan Shukla",
  role: "Backend-focused Software Engineer",
  location: "Gorakhpur, Uttar Pradesh",
  email: "roshanshuklayt@gmail.com",
  phone: "+91 70072 92406",
  links: {
    github: "https://github.com/Flashyrs",
    linkedin: "https://www.linkedin.com/in/flashyrs/",
    leetcode: "https://leetcode.com/u/flashy_rs/",
    statusPage: "https://flashyrs.duckdns.org/status/links"
  },
  about: "I am a backend software engineer specializing in building scalable, low-latency distributed systems, microservices architectures, and high-performance backend services. My expertise spans Java, Spring Boot, Python, Redis, Docker, and AWS. I have a proven track record of designing scalable APIs, asynchronous processing pipelines, and event-driven architectures that deliver measurable improvements in latency, throughput, and system reliability. I am deeply passionate about backend system architecture, data structures, algorithms, and practical AI infrastructure engineering.",
  stats: [
    {
      value: "7 Live Systems",
      label: "Active Cloud Deployments",
      subtext: "Monitored 24/7 via Uptime Kuma"
    },
    {
      value: "600+",
      label: "DSA Problems Solved",
      subtext: "LeetCode & GeeksforGeeks"
    },
    {
      value: "1890",
      label: "Peak LeetCode Rating",
      subtext: "Top 4.84% globally"
    },
    {
      value: "1.2s → 213ms",
      label: "p99 Latency (before/after caching)",
      subtext: "Cached vs LLM Inference"
    }
  ],
  experience: [
    {
      company: "SymptomWise Pvt. Ltd.",
      role: "Founding Software Engineer",
      duration: "Oct 2025 - Jan 2026",
      coreFocus: "Built a secure, logical multi-tenant healthcare AI assistant platform utilizing thread-local request contexts and resource-constrained LLM inference pipelines.",
      bullets: [
        "Architected logical multi-tenancy at zero additional cloud cost by storing active tenant contexts in thread-local storage and overriding Django's ORM manager query scopes to prevent cross-tenant leaks.",
        "Designed a dual-path execution architecture combining semantic caching and LLM inference to reduce redundant inference workloads and optimize GPU compute paths.",
        "Engineered an in-memory two-tier cache (L1 exact match, L2 semantic symptom signature key format NEG/SEV/SYM) to shield the GPU, shifting processing from heavy tensor mathematics to fast Redis lookups.",
        "Built a stateful WhatsApp triage state machine (via Twilio) and webpage chatbot, integrated with deterministic safety triage scoring logic using regex pattern matching to route critical cases in under 5ms.",
        "Guarded local LLM inference under GPU/RAM constraints via a threaded worker pool and bounded dynamic priority queue featuring aging and intelligent load shedding to prevent VRAM crashes.",
        "Load tested the platform under concurrent simulated spikes, verifying high availability, queue bounds, and automated CPU worker failovers under sustained throughput."
      ],
      metrics: []
    },
    {
      company: "GanakGyan Technologies",
      role: "Software Engineering Intern",
      duration: "Jun 2025 - Sep 2025",
      coreFocus: "Optimized backend services and data layers for high-performance geospatial data systems.",
      bullets: [
        "Engineered high-throughput RESTful APIs via Java Spring Boot for a core geospatial engine; optimized MongoDB compound indexes to slash average query execution times by 35%.",
        "Executed rigorous load testing and root-cause analysis to isolate and resolve thread-pool starvation bugs under peak traffic conditions.",
        "Accelerated shipping cycles by building automated CI/CD deployment pipelines using GitHub Actions, reducing manual deployment errors by 20%."
      ],
      metrics: [
        { label: "Query Optimization", value: "35%" },
        { label: "Deployment Errors", value: "-20%" },
        { label: "Engine Stack", value: "Spring Boot" }
      ]
    },
    {
      company: "Karyanest LLP",
      role: "Software Engineering Intern",
      duration: "Feb 2025 - Apr 2025",
      coreFocus: "Monolith refactoring, system modernization, and asynchronous event-driven pipelines.",
      bullets: [
        "Successfully refactored a legacy, tightly coupled Java Spring Boot monolith into modular, decoupled microservices, massively improving fault isolation and enabling independent team deployments.",
        "Built a high-performance asynchronous event-driven ingestion pipeline powered by Spring Boot and Redis message queues, successfully multiplying overall system throughput by 250%.",
        "Standardized system observability by implementing centralized logging, monitoring, and tracing toolsets, cutting production Mean Time to Detection (MTTD) by more than 40%."
      ],
      metrics: [
        { label: "System Throughput", value: "+250%" },
        { label: "MTTD Reduction", value: "40%+" },
        { label: "Architecture", value: "Microservices" }
      ]
    }
  ],
  projects: [
    {
      title: "IntervYou: Real-Time Collaborative Interview Platform",
      stack: ["Next.js", "Supabase", "Yjs CRDT", "Monaco Editor", "WebRTC", "Prisma", "PostgreSQL", "Redis", "Judge0"],
      summary: "A production-grade collaborative workspace supporting concurrent code editing, secure multi-language code execution, and low-latency audio/video communication.",
      bullets: [
        "Coordinated conflict-free live document editing in Monaco Editor using client-side Yjs CRDTs mapped over Supabase channels with cursor-throughput debouncing (<10 msgs/sec).",
        "Established a dual-PeerConnection WebRTC topology for independent, dynamic bandwidth and congestion control allocations between webcam streams and high-resolution screen sharing.",
        "Designed a two-tier state replication architecture utilizing Redis cache-aside storage (1s debounced writes, 24h TTL) and Postgres DB snapshots, combined with optimistic concurrency control.",
        "Integrated Judge0 API code execution with 25-second AbortController timeout guards to execute untrusted code in secure sandboxes without locking Next.js API threads.",
        "Constructed a custom Java reflection-based test harness compiler that polyfills JSON parsing, executing dynamic test suites in sandboxed environments with zero external dependencies."
      ],
      demoUrl: "https://interv-you.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/intervYou",
      badge: "Production Live"
    },
    {
      title: "NarrateLoop: Autonomous Reddit-to-Video GenAI Pipeline",
      stack: ["Python 3.12", "FastAPI", "FFmpeg (NVENC)", "Edge-TTS", "PyTorch", "Whisper", "Gemini 2.0", "Oracle Cloud", "systemd", "DuckDNS"],
      summary: "A 24/7 autonomous multimodal content generation engine and media backend deployed on Oracle Cloud VM, converting community stories into GPU-rendered short-form videos with automated YouTube distribution.",
      bullets: [
        "Built a 24/7 autonomous multimodal GenAI pipeline deployed on Oracle Cloud Linux, orchestrating Reddit extraction, Gemini NLP metadata cleansing, and scheduled multi-slot YouTube publishing with zero human touch.",
        "Designed a self-healing 3-tier ingestion failover matrix (PRAW OAuth → Datacenter Token Negotiation → RSS2JSON proxy) achieving 100% extraction reliability on cloud IPs where raw requests are blocked.",
        "Implemented GPU-accelerated video rendering via FFmpeg NVENC (h264_nvenc) with sub-pixel overlay placement, floating card alpha transitions, and dynamic word-synchronized ASS/SSA karaoke subtitle highlighting.",
        "Developed a contextual NLP heuristic model parsing self-identification and partner tags to dynamically assign accurate male/female neural voices and tuned +25% baseline pacing (+18% to +25% per genre).",
        "Constructed a high-performance FastAPI telemetry portal exposing interactive OpenAPI Swagger /docs, ReDoc reference, video artifact downloads, and dual Linux systemd daemon supervisors with psutil concurrency locks."
      ],
      demoUrl: "https://narrateloop.duckdns.org",
      docsUrl: "https://narrateloop.duckdns.org/docs",
      redocUrl: "https://narrateloop.duckdns.org/redoc",
      githubUrl: "https://github.com/Flashyrs/narrateloop",
      youtubeUrl: "https://www.youtube.com/@NarrateLoop",
      badge: "Production Live"
    },
    {
      title: "JobNotification & Automated Scraping Infrastructure",
      stack: ["Next.js 14", "TypeScript", "Cheerio", "Workday/Greenhouse/HCM APIs", "Oracle Cloud VM", "PM2", "Neon Postgres", "Telegram Bot API"],
      summary: "An automated, zero-browser-quota recruiting intelligence platform and 24/7 numeric ID prober scraping verified Indian SDE opportunities and dispatching instant alerts to Telegram.",
      bullets: [
        "Engineered a multi-engine scraper suite supporting 26+ native company endpoints (Workday, Greenhouse, SmartRecruiters, Oracle HCM, Cheerio) with zero headless browser overhead.",
        "Developed a 24/7 Amazon numeric ID prober daemon running on Oracle Cloud Linux under PM2, cycling through 8-digit calibrated requisition pools (AUTA 105/104 and Standard 30x) with database cursor state protection.",
        "Built an eligibility filter engine enforcing Indian location gating, AUTA/SDE keyword matching, and degree-or-experience clause evaluation to guarantee zero spam dispatch.",
        "Created an instant Telegram alert dispatcher and 24-hour executive digest pipeline backed by Neon Serverless Postgres, with health and uptime continuously monitored via Uptime Kuma."
      ],
      demoUrl: "https://flashyrs-jobnotify.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/JobNotification",
      statusUrl: "https://flashyrs.duckdns.org/status/links",
      badge: "24/7 Daemon Active"
    }
  ],
  liveProjects: [
    {
      id: "narrateloop",
      title: "NarrateLoop",
      tagline: "Autonomous Reddit-to-Video GenAI Pipeline & Developer Portal",
      description: "24/7 multimodal video engine deployed on Oracle Cloud VM. Ingests Reddit threads via a 3-tier failover matrix, synthesizes Edge-TTS audio with tuned +25% pacing, burns SSA/ASS karaoke subtitles, and composites 60 FPS videos via GPU NVENC.",
      url: "https://narrateloop.duckdns.org",
      docsUrl: "https://narrateloop.duckdns.org/docs",
      githubUrl: "https://github.com/Flashyrs/narrateloop",
      youtubeUrl: "https://www.youtube.com/@NarrateLoop",
      stack: ["Python 3.12", "FastAPI", "FFmpeg NVENC", "Edge-TTS", "Gemini 2.0", "systemd", "DuckDNS"],
      category: "GenAI & Media",
      status: "online",
      uptime: "99.9%",
      latency: "< 75ms",
      featured: true
    },
    {
      id: "jobnotify",
      title: "JobNotification Platform",
      tagline: "Zero-Quota Real-Time Job Scraper & 24/7 Amazon Requisition Prober",
      description: "Recruiting intelligence platform running 26+ native company endpoints (Workday, Greenhouse, SmartRecruiters, Oracle HCM) and a 24/7 Amazon 8-digit numeric ID prober under PM2 on Oracle Cloud VM with instant Telegram alerts.",
      url: "https://flashyrs-jobnotify.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/JobNotification",
      stack: ["Next.js 14", "TypeScript", "Cheerio", "Oracle Cloud VM", "PM2", "Neon Postgres", "Telegram API"],
      category: "Distributed & Cloud",
      status: "online",
      uptime: "100%",
      latency: "< 60ms",
      featured: true
    },
    {
      id: "intervyou",
      title: "Interv-You",
      tagline: "Real-Time Collaborative Coding, WebRTC Media & AI Interview Platform",
      description: "Full-stack collaborative IDE with Yjs CRDTs for sub-10ms conflict-free keystroke synchronization, dual-PeerConnection WebRTC streams for webcam/screen share, Redis distributed mutexes, and Judge0 isolated sandboxes.",
      url: "https://interv-you.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/intervYou",
      stack: ["Next.js", "Supabase", "Yjs CRDT", "WebRTC", "Redis", "PostgreSQL", "Judge0", "Gemini API"],
      category: "Realtime & WebRTC",
      status: "online",
      uptime: "99.8%",
      latency: "< 45ms",
      featured: true
    },
    {
      id: "algolens",
      title: "AlgoLens",
      tagline: "Universal Step-by-Step Algorithm & Data Structure Visualizer",
      description: "Interactive execution visualizer powered by Gemini AI. Allows developers to paste custom algorithm code and inspect variable watchstates, recursion trees, memory allocations, and step-by-step logic traces in real time.",
      url: "https://flashyrs.github.io/AlgoLens/",
      githubUrl: "https://github.com/Flashyrs/AlgoLens",
      stack: ["React", "TypeScript", "Gemini AI API", "Tailwind CSS", "Framer Motion", "GitHub Pages"],
      category: "Algorithms & DevTools",
      status: "online",
      uptime: "100%",
      latency: "< 25ms"
    },
    {
      id: "desktopbuddy",
      title: "DesktopBuddy",
      tagline: "Realtime IoT Companion & Shared Canvas Controller",
      description: "Realtime hardware & desktop companion controller featuring Ably WebSocket channels, Voice Desk TTS synthesis, shared vector canvas synchronization, and dynamic animated expression state bridges.",
      url: "https://flashyrs.github.io/DesktopBuddy/",
      githubUrl: "https://github.com/Flashyrs/DesktopBuddy",
      stack: ["JavaScript", "Ably WebSockets", "HTML5 Canvas", "Web Speech TTS", "GitHub Pages"],
      category: "IoT & Companions",
      status: "online",
      uptime: "100%",
      latency: "< 20ms"
    },
    {
      id: "webrtc-signaling",
      title: "WebRTC Signaling Gateway",
      tagline: "High-Throughput P2P WebSocket Signaling Server",
      description: "Dedicated low-latency WebSocket signaling relay deployed on Render, managing SDP offer/answer negotiations, ICE candidate exchanges, and room presence state for peer-to-peer audio/video streaming.",
      url: "https://webrtc-signalling-x2os.onrender.com/",
      githubUrl: "https://github.com/Flashyrs/intervYou",
      stack: ["Node.js", "WebSockets / ws", "Render Cloud", "WebRTC Protocol"],
      category: "Realtime & WebRTC",
      status: "online",
      uptime: "99.7%",
      latency: "< 40ms"
    },
    {
      id: "portfolio",
      title: "Developer Portfolio",
      tagline: "Interactive Brutalist Portfolio with Live In-Browser Simulators",
      description: "High-performance portfolio built with Vite, React, and Tailwind CSS. Features interactive in-browser GenAI video simulators, multi-tenant caching benchmarks, and interactive system architectural deep dives.",
      url: "https://flashyrs-portfolio.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/Portfolio",
      stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Vercel"],
      category: "Algorithms & DevTools",
      status: "online",
      uptime: "100%",
      latency: "< 15ms"
    }
  ],
  oracleInfrastructure: {
    provider: "Oracle Cloud Infrastructure (OCI) Always Free",
    os: "Ubuntu Linux 22.04 LTS (x86_64)",
    cost: "$0.00 / month (100% Free Tier Architecture)",
    daemons: [
      { name: "amazon-id-prober", manager: "PM2", purpose: "24/7 Amazon 8-digit requisition probe & Telegram dispatch", status: "ONLINE" },
      { name: "narrateloop.service", manager: "systemd", purpose: "Autonomous 3-slot daily Reddit-to-Video generation", status: "ONLINE" },
      { name: "narrateloop-api.service", manager: "systemd", purpose: "FastAPI REST API, Swagger docs & telemetry backend", status: "ONLINE" },
      { name: "uptime-kuma", manager: "Docker", purpose: "Central monitoring hub with 60s health check heartbeats", status: "ONLINE" }
    ],
    networking: {
      proxy: "Nginx HTTP/2 reverse proxy with custom upstream sockets",
      ssl: "Let's Encrypt automated TLS encryption via Certbot",
      dns: "DuckDNS dynamic DNS (flashyrs.duckdns.org, narrateloop.duckdns.org)",
      ports: "TCP 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (Kuma internal)"
    },
    kumaUrl: "https://flashyrs.duckdns.org",
    statusHubUrl: "https://flashyrs.duckdns.org/status/links",
    monitoredServicesCount: 7
  },
  skills: [
    {
      category: "Languages",
      skills: ["Java", "Python", "SQL", "C", "C++"]
    },
    {
      category: "Backend & Cloud",
      skills: ["Spring Boot", "Microservices", "REST APIs", "AWS", "Oracle Cloud (OCI)", "Docker", "CI/CD", "GitHub Actions", "Nginx", "Linux systemd / PM2"]
    },
    {
      category: "Databases & Caching",
      skills: ["PostgreSQL (Neon)", "MongoDB", "MySQL", "Redis (Pub/Sub, Message Queues, Semantic Caching)", "SQLite"]
    },
    {
      category: "Architecture & Systems",
      skills: ["Distributed Systems", "Low-Latency Design", "Event-Driven Architecture", "Systems Design", "Concurrent Programming", "Multithreading", "Design Patterns", "Object-Oriented Design", "WebRTC / CRDTs"]
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering (AI/ML Specialization)",
      institution: "Buddha Institute of Technology, Gorakhpur (Affiliated with AKTU, UP)",
      timeline: "Nov 2022 - Jun 2026",
      gpa: "CGPA 8.09/10"
    }
  ],
  certifications: [
    { name: "Microsoft Generative AI", issuer: "Microsoft" },
    { name: "Machine Learning", issuer: "IIT BHU" },
    { name: "AWS ML Foundations", issuer: "AWS" }
  ],
  honors: [
    "Competitive Programming: Achieved a peak LeetCode Contest Rating of 1890 (Top 4.84% globally); solved over 600 data structures and algorithms problems.",
    "TechYuva 10.0: 2nd Runner-Up among competitive engineering cohorts."
  ],
  leadership: [
    "IEEE Student Branch Secretary: Managed resource scheduling, established engineering roadmaps, and spearheaded technical events for over 15 peer engineers."
  ]
};
