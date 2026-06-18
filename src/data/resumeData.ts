export interface Project {
  title: string;
  summary: string;
  stack: string[];
  bullets: string[];
  demoUrl?: string;
  githubUrl: string;
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
  };
  about: string;
  stats: {
    value: string;
    label: string;
    subtext: string;
  }[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  honors: string[];
  leadership: string[];
}

export const resumeData: ResumeData = {
  name: "Roshan Shukla",
  role: "Backend-focused Software Engineer",
  location: "Bengaluru, Karnataka",
  email: "roshanshuklayt@gmail.com",
  phone: "+91 70072 92406",
  links: {
    github: "https://github.com/Flashyrs",
    linkedin: "https://www.linkedin.com/in/flashyrs/",
    leetcode: "https://leetcode.com/u/flashy_rs/"
  },
  about: "I am a backend software engineer specializing in building scalable, low-latency distributed systems, microservices architectures, and high-performance backend services. My expertise spans Java, Spring Boot, Python, Redis, Docker, and AWS. I have a proven track record of designing scalable APIs, asynchronous processing pipelines, and event-driven architectures that deliver measurable improvements in latency, throughput, and system reliability. I am deeply passionate about backend system architecture, data structures, algorithms, and practical AI infrastructure engineering.",
  stats: [
    {
      value: "500+",
      label: "DSA Problems Solved",
      subtext: "LeetCode & GeeksforGeeks"
    },
    {
      value: "1784",
      label: "Peak LeetCode Rating",
      subtext: "Top 8% globally"
    },
    {
      value: "213ms",
      label: "p99 Latency",
      subtext: "Down from 1.2s via L1/L2 Cache"
    },
    {
      value: "99.9%",
      label: "System Availability",
      subtext: "Sustained during 3x spikes"
    }
  ],
  experience: [
    {
      company: "SymptomWise Pvt. Ltd.",
      role: "Founding Software Engineer",
      duration: "Oct 2025 - Jan 2026",
      coreFocus: "Built a secure, logical multi-tenant healthcare AI assistant platform utilizing thread-local request contexts and resource-constrained LLM inference pipelines.",
      bullets: [
        "Architected logical multi-tenancy at zero additional cloud cost by storing active tenant contexts in thread-local storage and overriding Django's ORM manager with a custom filter, preventing cross-tenant leaks.",
        "Guarded local LLM inference under GPU/RAM constraints via a threaded worker pool and bounded dynamic priority queue featuring aging and intelligent load shedding to prevent VRAM crashes.",
        "Engineered an in-memory two-tier cache (L1 exact match, L2 semantic symptom signature key format NEG/SEV/SYM) that bypassed the GPU for repeated queries, reducing latency to under 2ms.",
        "Built a stateful WhatsApp triage state machine via Twilio, integrated with a regex-based multi-stage safety pipeline that instantly bypassed AI processing for emergency symptoms (score >= 5)."
      ],
      metrics: [
        { label: "Cache Hit Rate", value: "61%" },
        { label: "p99 Latency", value: "213ms" },
        { label: "Availability", value: "99.9%" }
      ]
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
      githubUrl: "https://github.com/Flashyrs/intervYou"
    },
    {
      title: "Automated Reddit Stories Generative AI Pipeline",
      stack: ["Python", "PyTorch", "Whisper", "Bark TTS", "Gemini API", "Playwright", "FFmpeg", "Telegram Bot API"],
      summary: "An automated multimedia content production infrastructure that converts textual data streams into synchronized, narrated videos.",
      bullets: [
        "Engineered a multi-stage Python automation pipeline using PyTorch for local voice synthesis (Suno Bark) and sub-word speech-to-text alignment (OpenAI Whisper).",
        "Designed a dynamic GPU memory profiling system using GPUtil to monitor CUDA VRAM utilization and implement automated CPU fallback mechanisms during CUDA OOM exceptions.",
        "Optimized deep learning inference runtime via a custom NLTK-tokenized text chunking parser (60-word limit) and audio speed scaling (1.3x) via raw buffer manipulations.",
        "Implemented GPU-accelerated video rendering wrapping FFmpeg subprocesses with H.264 NVENC hardware encoding, vertical cropping (9:16), and dynamic SubStation Alpha subtitle overlays.",
        "Built a remote telemetry control server using the Telegram Bot API and process heuristics (psutil) to trigger pipelines, toggle execution stages, and tail live log files."
      ],
      githubUrl: "https://github.com/Flashyrs/reddit-stories"
    }
  ],
  skills: [
    {
      category: "Languages",
      skills: ["Java", "Python", "SQL", "C", "C++"]
    },
    {
      category: "Backend & Cloud",
      skills: ["Spring Boot", "Microservices", "REST APIs", "AWS", "Docker", "CI/CD", "GitHub Actions"]
    },
    {
      category: "Databases & Caching",
      skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis (Pub/Sub, Message Queues, Semantic Caching)"]
    },
    {
      category: "Architecture & Systems",
      skills: ["Distributed Systems", "Low-Latency Design", "Event-Driven Architecture", "Systems Design", "Concurrent Programming", "Multithreading", "Design Patterns", "Object-Oriented Design"]
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering (AI/ML Specialization)",
      institution: "Buddha Institute of Technology, Gorakhpur (Affiliated with AKTU, UP)",
      timeline: "Nov 2022 - Jun 2026",
      gpa: "CGPA 8.0/10"
    }
  ],
  certifications: [
    { name: "Microsoft Generative AI", issuer: "Microsoft" },
    { name: "Machine Learning", issuer: "IIT BHU" },
    { name: "AWS ML Foundations", issuer: "AWS" }
  ],
  honors: [
    "Competitive Programming: Achieved a peak LeetCode Contest Rating of 1784 (Top 8% globally); solved over 500 data structures and algorithms problems.",
    "TechYuva Hackathons: 2-time Runner Up competing cross-functionally against 50+ engineering cohorts."
  ],
  leadership: [
    "IEEE Student Branch Secretary: Managed resource scheduling, established engineering roadmaps, and spearheaded technical events for over 15 peer engineers."
  ]
};
