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
      coreFocus: "Built the technical foundation for a multi-tenant healthcare AI assistant platform, implementing strict tenant isolation and advanced caching patterns.",
      bullets: [
        "Architected an L1/L2 semantic caching system for LLM inference pipelines utilizing Redis, driving a 61% cache hit rate and drastically cutting p99 latency from 1.2s down to 213ms.",
        "Designed and decoupled an asynchronous request path to isolate GPU inference workloads from cache hits, eliminating resource contention and safeguarding low-latency execution under heavy concurrent traffic.",
        "Bulletproofed system reliability by implementing semaphore-based load shedding and circuit breaker mechanisms, sustaining 99.9% availability during simulated 3x traffic spikes."
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
      stack: ["Next.js", "Node.js", "Redis Pub/Sub", "WebRTC", "Docker", "Judge0"],
      summary: "A production-grade collaborative workspace supporting concurrent code editing, secure multi-language code execution, and low-latency audio/video communication.",
      bullets: [
        "Built a highly responsive real-time synchronization engine leveraging Redis Pub/Sub and Yjs CRDTs for collaborative editing, keeping p50 latency under 110ms across 50+ concurrent active sessions.",
        "Guaranteed structural data integrity with CRDT-based state synchronization, achieving 0% message loss and seamless sub-1s state recovery for dropped/reconnecting clients.",
        "Sandboxed untrusted multi-language code execution workflows using Docker containers and Judge0 across 20+ programming languages while enforcing strict host OS security isolation."
      ],
      demoUrl: "https://interv-you.vercel.app/",
      githubUrl: "https://github.com/Flashyrs/intervYou"
    },
    {
      title: "Automated Reddit to YouTube Content Pipeline",
      stack: ["Python", "FFmpeg", "Whisper", "Bark TTS", "Telegram Bot API", "SQLite"],
      summary: "An automated multimedia content production infrastructure that converts textual data streams into synchronized, narrated videos.",
      bullets: [
        "Engineered an end-to-end Python automation workflow utilizing FFmpeg and OpenAI's Whisper to parse text, generate precise subtitle alignments, and render video assets, cutting manual editing overhead by 90%.",
        "Designed a lightweight, SQLite-backed deduplication tracking engine to monitor processed raw assets, ensuring complete execution reliability while completely eliminating duplicate compute costs."
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
