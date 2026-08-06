export const profile = {
  name: 'Aditya Sharma',
  handle: 'ADITYA_SHARMA',
  university: 'University of Waterloo',
  year: '2A',
  program: 'Computer Engineering',
  degree: 'B.A.Sc., Computer Engineering',
  gradDate: 'Apr 2030',
  tagline: 'Building systems. Breaking assumptions.',
  location: 'Waterloo, ON',
  phone: '(647) 710-5714',
  email: 'a753shar@uwaterloo.ca',
  links: {
    linkedin: 'https://linkedin.com/in/',
    github: 'https://github.com/',
    portfolio: 'https://adityasharma.dev',
  },
  favMusic: {
    title: 'Loser',
    artist: 'Tame Impala',
    album: 'Deadbeat',
    src: '/audio/loser.mp3',
  },
}

export type TimelineKind =
  | 'identity'
  | 'education'
  | 'experience'
  | 'project'
  | 'skills'
  | 'leadership'
  | 'contact'

export type TimelineItem = {
  id: string
  kind: TimelineKind
  /** Sort key YYYY-MM */
  date: string
  dateLabel: string
  title: string
  org: string
  period?: string
  detail?: string
  bullets?: string[]
  tags?: string[]
  links?: { label: string; href: string; primary?: boolean }[]
  /** Project showcase hero */
  image?: string
  imageAlt?: string
}

/** Scroll deck — one glass panel at a time */
export const timeline: TimelineItem[] = [
  {
    id: 'identity',
    kind: 'identity',
    date: '2026-01',
    dateLabel: 'READ.ME',
    title: profile.name,
    org: `${profile.university} · ${profile.year} · ${profile.program}`,
    period: `${profile.degree} · Expected ${profile.gradDate}`,
    detail: profile.tagline,
    bullets: [
      `${profile.location} · ${profile.email} · ${profile.phone}`,
      'Coursework: Data Structures & Algorithms, Object-Oriented Programming, Digital Logic Design, Microcontrollers, Calculus, Linear Algebra',
    ],
    tags: ['Profile', 'Education', 'Waterloo', profile.year],
    links: [
      { label: 'GitHub', href: profile.links.github },
      { label: 'LinkedIn', href: profile.links.linkedin },
      { label: 'Portfolio', href: profile.links.portfolio },
    ],
  },
  {
    id: 'exp-netdynamic',
    kind: 'experience',
    date: '2026-05',
    dateLabel: 'MAY 26',
    title: 'Software Engineer Intern',
    org: 'NetDynamic Inc.',
    period: 'May 2026 – Present · Mississauga, ON',
    bullets: [
      'Built an agentic AI pipeline generating FastAPI-ready integration configs from plain-language requests in 5–10 seconds, sandboxed and auto-integrated after validation against predefined checks and config, removing the need for hand-written integration code',
      'Designed a robust two-layer self-healing system for broken API integrations, using LLM-driven inspection to auto-correct mapping errors',
      'Prototyped a lightweight markdown-based memory architecture inspired by Google\'s OKF to improve retrieval and cut token usage by 24%',
    ],
    tags: ['AI', 'FastAPI', 'LLM', 'Internship'],
  },
  {
    id: 'exp-patry',
    kind: 'experience',
    date: '2026-01',
    dateLabel: 'JAN 26',
    title: 'AI Workflow Fellowship',
    org: 'Patry Group',
    period: 'Jan 2026 – Mar 2026 · Waterloo, ON',
    bullets: [
      'Shipped a production n8n agentic pipeline with custom JavaScript/Node.js nodes automating end-to-end tenant maintenance intake, replacing a 6 to 8 hour/week manual process',
      'Engineered an LLM-powered classification layer via Claude API for reliable urgency and trade-type extraction across 51 real-world requests',
      'Implemented a Firestore-backed audit trail with automated duplicate detection and contractor matching across 10 contractors',
    ],
    tags: ['n8n', 'Claude', 'Firestore', 'Automation'],
  },
  {
    id: 'exp-meraki',
    kind: 'experience',
    date: '2025-05',
    dateLabel: 'MAY 25',
    title: 'Software Engineer Intern',
    org: 'Meraki Projects',
    period: 'May 2025 – Aug 2025 · Remote',
    bullets: [
      'Deployed a FastAPI inference service with structured JSON handling and downstream tool integration for real-time automated defect triage',
      'Built 5 interactive pages and 30+ React components for an end-to-end inspection tracking flow used daily by manufacturing staff',
      'Architected 10+ Node.js API endpoints handling CRUD operations for manufacturing records and package data, ensuring seamless data integration across the inspection system',
    ],
    tags: ['FastAPI', 'React', 'Node.js', 'Internship'],
  },
  {
    id: 'proj-aero',
    kind: 'project',
    date: '2025-03',
    dateLabel: 'PROJ',
    title: 'Aero Visual — Airfoil ML & Flow Simulation',
    org: 'PyTorch · Three.js · JavaScript',
    image: '/projects/aero-visual.png',
    imageAlt: 'CFD streamline visualization over a Formula 1 car wireframe',
    bullets: [
      'Built a machine learning model predicting airfoil lift and drag from geometric shape parameters, trained on nearly 3,000 real airfoils',
      'Outperformed a linear baseline (Cl R² = 0.96) with a PyTorch neural network, validated with airfoil-grouped splitting to prevent data leakage',
      'Built a real-time 3D flow visualization engine (Three.js) combining a horseshoe vortex model with a source-panel solver, integrating the trained neural network\'s exported weights into a live JavaScript inference pipeline to drive streamline rendering from actual model predictions',
    ],
    tags: ['PyTorch', 'Three.js', 'ML', 'Simulation'],
    links: [
      { label: 'Live Demo', href: 'https://aero-visual.vercel.app/', primary: true },
    ],
  },
  {
    id: 'proj-quorum',
    kind: 'project',
    date: '2025-06',
    dateLabel: 'PROJ',
    title: 'QUORUM — Multi-Agent Hedge Fund Simulator',
    org: 'Python · FastAPI · React · OpenRouter · yfinance · Alpaca',
    bullets: [
      'Architected a FastAPI backend running 5 AI agents with distinct trading strategies against live market data, with a React frontend that triggers a live debate feed whenever agents take conflicting positions on the same ticker, and Alpaca broker integration toggling between simulation and live paper trading',
    ],
    tags: ['FastAPI', 'React', 'Agents', 'Finance'],
    links: [{ label: 'GitHub', href: profile.links.github }],
  },
  {
    id: 'proj-fpga',
    kind: 'project',
    date: '2025-01',
    dateLabel: 'PROJ',
    title: 'FPGA Robotic Arm Controller',
    org: 'Verilog · FPGA · DE1-SoC · ModelSim',
    bullets: [
      'Designed a 3-state-machine robotic arm controller in Verilog on a DE1-SoC FPGA coordinating transport, extension, and grapple subsystems',
      'Implemented a bidirectional shift register for step-wise arm extension with safety interlock logic triggering a FAULT state on unsafe extension',
      'Mitigated metastability on asynchronous inputs using two-stage synchronizers clocked at 50MHz, validated via ModelSim waveform simulation',
    ],
    tags: ['Verilog', 'FPGA', 'Hardware'],
    links: [{ label: 'GitHub', href: profile.links.github }],
  },
  {
    id: 'skills',
    kind: 'skills',
    date: '2026-02',
    dateLabel: 'SKILLS',
    title: 'Technical Skills',
    org: 'Stack & Tooling',
    bullets: [
      'Languages: Python, JavaScript, TypeScript, C/C++, SQL',
      'Machine Learning: PyTorch, TensorFlow, Computer Vision (OpenCV), RAG, Vector Databases, LangChain, LangGraph',
      'Frameworks & Tools: FastAPI, Flask, React, Node.js, Next.js, Git, REST APIs',
      'Data: Pandas, NumPy, Unstructured Data Processing, JSON Parsing, ETL Pipelines',
    ],
    tags: ['Python', 'React', 'ML', 'Systems'],
  },
  {
    id: 'leadership',
    kind: 'leadership',
    date: '2025-08',
    dateLabel: 'LEAD',
    title: 'Leadership & Activities',
    org: 'Hackathons · Scholarships',
    bullets: [
      'UN Hackathon for Betterment of Life — 3rd Place: built a healthcare access platform for underserved communities (50+ teams)',
      'ChessHacks Hackathon — built an AI-powered chess analysis and training tool',
      'Presidential Scholarship, University of Waterloo — awarded for academic excellence at time of admission',
    ],
    tags: ['Hackathons', 'Leadership', 'Award'],
  },
]
