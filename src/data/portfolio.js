export const data = {
  name: "Redwan Ahmed Utsab",
  title: "Software Engineer (Backend) · AI/ML Engineer",
  subtitle: "LLM & Agentic AI · RAG Pipelines · Multi-Agent Systems",
  email: "redwanutsab@gmail.com",
  phone: "+8801789160352",
  website: "redwanahmedutsab.vercel.app",
  links: {
    github: "https://github.com/redwanahmedutsab",
    linkedin: "https://linkedin.com/in/redwanahmedutsab",
    leetcode: "https://leetcode.com/redwanahmedutsab",
    codeforces: "https://codeforces.com/profile/redwanahmedutsab",
  },
  about:
    "Backend engineer and AI/ML practitioner specializing in production-grade LLM agentic systems and scalable REST APIs. I've built agentic RAG pipelines (EfficientAgent, CareerMind) using LangGraph orchestration, fine-tuned DistilBERT/MiniLM models, and Groq-served LLaMA inference — cutting latency 60–100× over standard API providers. I ship full-stack platforms on microservices architecture with Docker, AWS EC2, and GitHub Actions CI/CD, with a research background in Transformer efficiency (O(n²) → O(n log n)) and multimodal NLP/CV.",

  education: {
    institution: "United International University",
    degree: "B.Sc. Computer Science & Engineering",
    major: "Major: Data Science",
    cgpa: "3.69 / 4.00",
    location: "Dhaka, Bangladesh",
  },

  skills: [
    {
      category: "Languages",
      items: ["Python", "C/C++", "JavaScript", "SQL"],
    },
    {
      category: "Backend & APIs",
      items: ["Django", "Django REST Framework", "FastAPI", "REST API Design", "JWT", "OAuth2", "Celery", "Redis", "WebSocket", "Webhook", "gRPC", "Microservices", "Event-Driven Architecture"],
    },
    {
      category: "AI / ML / LLM",
      items: ["LangChain", "LangGraph", "RAG", "Vector Databases", "ChromaDB", "pgvector", "Prompt Engineering", "Agentic AI", "Multi-Agent Systems", "Tool-Calling Agents", "Groq API", "OpenAI API", "Hugging Face Transformers", "BERT/DistilBERT", "Sentence Embeddings (MiniLM)", "NLP", "CNN", "Scikit-Learn", "Model Fine-Tuning", "ONNX", "MLOps"],
    },
    {
      category: "Databases & Storage",
      items: ["PostgreSQL", "Redis", "Schema Design", "Composite Indexing", "Query Optimization", "Full-Text Search"],
    },
    {
      category: "DSA",
      items: ["Arrays", "Trees", "Heaps", "Hash Tables", "Graphs (BFS/DFS/Dijkstra)", "Greedy", "Dynamic Programming", "Sliding Window", "Binary Search"],
    },
    {
      category: "Frontend",
      items: ["React.js", "Next.js", "Tailwind CSS", "Axios"],
    },
    {
      category: "DevOps & Tools",
      items: ["Docker", "Kubernetes (basics)", "GitHub Actions", "CI/CD", "Git", "Linux", "Nginx", "AWS EC2 (basics)", "Postman", "Vercel", "Render"],
    },
    {
      category: "Practices",
      items: ["System Design", "SOLID Principles", "Design Patterns", "OOP", "Scalability", "Observability", "API Documentation", "pytest"],
    },
  ],

  experience: [
    {
      company: "AI Engineering Firm — Confidential",
      role: "Junior AI Engineer",
      sub: "Promoted from Trainee AI Engineer, Jul 2026",
      period: "Feb 2026 – Present",
      location: "Dhaka, Bangladesh",
      bullets: [
        "Build LLM-powered microservices with LangChain and RAG pipelines: ingest documents into ChromaDB, embed with Hugging Face models, and serve contextual Q&A endpoints at sub-500ms latency.",
        "Design agentic AI workflows with LangGraph: multi-step tool-calling agents with persistent memory, web search and code execution tools, and Pydantic-structured output for autonomous multi-turn task completion.",
        "Engineer scalable REST APIs with Django REST Framework and FastAPI: PostgreSQL schemas with composite indexing, JWT/OAuth2 with RBAC, Celery task queues, and Redis caching; deploy via Docker and GitHub Actions CI/CD to AWS EC2 with Nginx.",
      ],
    },
    {
      company: "United International University",
      role: "Undergraduate Teaching Assistant",
      sub: "Data Structures & OOP",
      period: "Feb 2025 – Oct 2025",
      location: "Dhaka, Bangladesh",
      bullets: [
        "Instructed 200+ students per semester in core CS fundamentals (trees, graphs, DP, OOP); designed reusable exercise sets adopted across 3 sections, reducing average debugging time by 40% and improving midterm pass rate by 15%.",
        "Graded 500+ programming submissions per semester with under 48-hour turnaround; rated 4.8/5.0 in end-of-semester evaluations.",
      ],
    },
  ],

  projects: [
    {
      name: "EfficientAgent",
      tagline: "Token-Aware Agentic Document Intelligence System",
      live: "https://efficient-agent.vercel.app",
      github: "https://github.com/redwanahmedutsab/EfficientAgent",
      stack: ["LangGraph", "Groq/LLaMA 3", "Fine-Tuned DistilBERT", "ChromaDB", "FastAPI", "React", "Docker", "AWS EC2"],
      bullets: [
        "Designed a 6-node LangGraph agent (classify → plan → retrieve → extract → web-search → synthesize) that routes queries by complexity to Groq-served LLaMA 3.1-8B or 3.3-70B, cutting inference latency 60–100× vs. standard API providers.",
        "Fine-tuned a DistilBERT classifier (exported to ONNX for 3–5× faster CPU inference) for query-complexity routing and a MiniLM embedding model on domain document pairs, powering a ChromaDB RAG pipeline with streaming SSE responses to a React UI.",
      ],
    },
    {
      name: "CareerMind",
      tagline: "AI-Powered Career Intelligence System",
      live: "https://career-mind-app.vercel.app/login",
      github: "https://github.com/redwanahmedutsab/CareerMind",
      stack: ["LangGraph", "RAG", "ChromaDB", "Scikit-Learn", "FastAPI", "React", "JWT", "Docker"],
      bullets: [
        "Built a full agentic pipeline that parses resumes, retrieves matching jobs via ChromaDB RAG, and scores candidate-job fit with a trained Scikit-Learn classifier, generating an automated career intelligence report end-to-end.",
        "Implemented JWT/bcrypt authentication with role-based access (user/admin) and Swagger-documented REST endpoints; deployed a decoupled architecture (React/Vite frontend on Vercel, FastAPI backend on Render) served by Groq LLaMA inference on the free tier.",
      ],
    },
    {
      name: "Proprietor",
      tagline: "Full-Stack Real Estate Platform + ML Integration",
      live: "https://proprietor.vercel.app",
      github: "https://github.com/redwanahmedutsab/Proprietor",
      stack: ["React", "Django REST Framework", "FastAPI", "PostgreSQL", "Scikit-Learn", "SSLCommerz", "Docker"],
      bullets: [
        "Engineered 25+ REST API endpoints with layered authorization (JWT, RBAC, owner-only mutations); modeled 8 relational entities with composite indexes, cutting listing query latency by 60% and supporting 3× traffic growth.",
        "Decoupled an MLOps inference pipeline: trained a Scikit-Learn regression model, versioned with joblib, served via /api/predict/ at under 200ms; implemented full SSLCommerz payment lifecycle with 100% branch-coverage integration tests.",
      ],
    },
    {
      name: "Campusor",
      tagline: "Multi-Module University Campus Platform",
      live: "https://campusor.vercel.app",
      github: "https://github.com/redwanahmedutsab/campusor",
      stack: ["React", "Django REST Framework", "WebSocket", "Next.js", "PostgreSQL", "Docker"],
      bullets: [
        "Architected a multi-module platform as four bounded Django apps (Users, Marketplace, Events, Lost & Found) with a shared JWT auth layer (refresh token rotation, RBAC) serving all modules with zero auth-logic duplication.",
        "Integrated an LLM-powered onboarding assistant that guides first-time users through platform features and FAQs in natural language, reducing new-user drop-off; added querystring-driven server-side filtering (django-filter), cutting response payload by 70%.",
      ],
    },
  ],

  research: [
    {
      title: "Optimized Transformer Architecture for Long Sequences",
      type: "Manuscript Under Review",
      org: "UIU",
      bullets: [
        "Proposed selective attention span constraints reducing per-layer complexity from O(n²) to O(n log n), directly applicable to efficient LLM inference and context-window scaling.",
        "Benchmarked across 3 sequence length configurations with measurable FLOPs and memory reduction at comparable NLP task accuracy.",
      ],
    },
    {
      title: "Natural Language Driven Circuit Design System",
      type: "Conference Paper (Under Review)",
      org: "UIU",
      bullets: [
        "Co-authored a multimodal NLP + Computer Vision pipeline accepting natural language circuit design commands and generating circuit diagrams end-to-end in under 2 seconds.",
        "Fine-tuned a BERT-based intent classifier and NER model to extract circuit components and topology from free-form instructions; achieved 94% classification accuracy on the held-out test set.",
      ],
    },
  ],

  awards: [
    { year: "2023", rank: "1st Place", event: "Database Management System Competition, UIU" },
    { year: "2024", rank: "1st Place", event: "System Analysis & Design Competition, UIU" },
    { year: "2025", rank: "1st Runner-Up", event: "Thesis Presentation Competition, UIU" },
    { year: "2024", rank: "1st Place", event: "Pathao Quiz Championship, UIU" },
  ],

  cp: [
    "Solved 400+ problems on LeetCode across dynamic programming, graph algorithms (BFS/DFS/Dijkstra), binary search, and sliding window techniques — reflecting strong DSA fundamentals.",
  ],
};
