export const data = {
  name: "Redwan Ahmed Utsab",
  title: "Software Engineer",
  subtitle: "Full-Stack Engineer · ML Integration · Data Science",
  email: "redwanutsab@gmail.com",
  phone: "+8801789160352",
  website: "redwanahmedutsab.github.io",
  links: {
    github: "https://github.com/redwanahmedutsab",
    linkedin: "https://linkedin.com/in/redwanahmedutsab",
    leetcode: "https://leetcode.com/redwanahmedutsab",
    codeforces: "https://codeforces.com/profile/redwanahmedutsab",
  },
  about:
    "I build production-grade full-stack systems and ML-integrated APIs. CS undergrad at UIU majoring in Data Science — I bridge backend engineering with machine learning pipelines, from relational data modeling to real-time inference endpoints.",

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
      items: ["Python", "C/C++", "JavaScript", "Java", "SQL"],
    },
    {
      category: "Backend & Systems",
      items: ["Django", "Django REST Framework", "RESTful API Design", "JWT", "OAuth2", "Celery", "Redis"],
    },
    {
      category: "ML & Data Science",
      items: ["Scikit-Learn", "Pandas", "NumPy", "CNN", "Transformer Models", "Feature Engineering", "Model Serving"],
    },
    {
      category: "Frontend",
      items: ["React JS", "Tailwind CSS", "Axios", "HTML/CSS"],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MySQL", "Schema Design", "Indexing", "Query Optimization"],
    },
    {
      category: "Engineering",
      items: ["System Design", "OOP", "SOLID Principles", "Design Patterns", "Microservices", "CI/CD"],
    },
    {
      category: "Tools & Infrastructure",
      items: ["Git", "Docker", "GitHub Actions", "Linux", "Postman", "Nginx", "Render", "Vercel"],
    },
  ],

  experience: [
    {
      company: "United International University",
      role: "Undergraduate Teaching Assistant",
      sub: "Data Structures & OOP",
      period: "Feb 2025 – Oct 2025",
      location: "Dhaka, Bangladesh",
      bullets: [
        "Scaled lab instruction to 200+ students per semester by designing reusable exercise sets targeting high-frequency misconceptions in tree traversal, recursion, and OOP inheritance patterns.",
        "Reduced average debugging time by introducing a structured fault-isolation framework — students narrowed bugs to root cause 40% faster based on TA observations.",
        "Evaluated 500+ programming submissions per semester against rubrics covering correctness, time complexity, and code quality; maintained <48hr feedback turnaround.",
      ],
    },
  ],

  projects: [
    {
      name: "Proprietor",
      tagline: "Full-Stack Real Estate Platform + ML Integration",
      live: "https://proprietor.vercel.app",
      github: "https://github.com/redwanahmedutsab/Proprietor",
      stack: ["React", "Django REST Framework", "PostgreSQL", "Scikit-Learn", "SSLCommerz", "JWT", "Docker", "GitHub Actions"],
      bullets: [
        "Designed and shipped a production full-stack real estate platform end-to-end — from data modeling and API design to payment integration and cloud deployment.",
        "Decoupled an ML inference pipeline from the core API layer: trained a Scikit-Learn regression model on property attributes, serialized with joblib, and served predictions via /api/predict/ with <200ms response time.",
        "Engineered 25+ REST endpoints with layered authorization — open read, JWT-scoped user actions, owner-only mutations, and admin approval gates via DRF permission classes.",
        "Implemented a full payment lifecycle with SSLCommerz: booking creation → IPN webhook ingestion → server-side hash verification → atomic status update.",
        "Modeled 8 relational entities with FK constraints, cascade rules, and composite indexes — reducing listing query latency by 60% vs. unindexed baseline.",
      ],
    },
    {
      name: "Campusor",
      tagline: "Multi-Module University Campus Platform",
      live: "https://campusor.vercel.app",
      github: "https://github.com/redwanahmedutsab/campusor",
      stack: ["React", "Tailwind CSS", "Django REST Framework", "PostgreSQL", "JWT", "Docker", "GitHub Actions"],
      bullets: [
        "Architected a multi-module campus services platform as four bounded Django apps (Marketplace, Events, Lost & Found, Users) — each owning its models, serializers, and URL namespace.",
        "Designed a shared JWT auth layer with refresh token rotation and role-based access control across all modules without duplicating auth logic.",
        "Built server-side filtering via django-filter, reducing average response payload by 70% vs. client-side filtering.",
        "Delivered a fully responsive React 18 SPA with Tailwind CSS and Axios interceptors for silent token refresh.",
      ],
    },
  ],

  research: [
    {
      title: "Optimized Transformer Architecture for Long Sequences",
      type: "Undergraduate Thesis",
      org: "UIU CS Department",
      bullets: [
        "Proposed selective attention span constraints to reduce per-layer compute from O(n²) to O(n log n) for sequences >512 tokens.",
        "Benchmarked against vanilla transformer baseline — achieved comparable accuracy with measurable FLOPs and memory reduction across 3 sequence length configurations.",
      ],
    },
    {
      title: "Real-Time CCTV Threat Detection",
      type: "Computer Vision Research",
      org: "",
      bullets: [
        "Built a CNN-based suspicious activity pipeline achieving 94% detection accuracy on a multi-scene CCTV dataset.",
        "Profiled and eliminated preprocessing bottlenecks — reduced per-frame latency by 35% through batch normalization tuning.",
      ],
    },
    {
      title: "Non-Invasive Diabetes Detection from Fingertip Video",
      type: "Computer Vision Project",
      org: "",
      bullets: [
        "Designed a PPG feature extraction pipeline from fingertip video frames for glycemic pattern classification.",
        "Selected final classifier by optimizing recall over precision to minimize false negatives in a medical screening context.",
      ],
    },
  ],

  awards: [
    { year: "2023", rank: "1st / 72 Teams", event: "Database Management System Competition, UIU" },
    { year: "2024", rank: "1st Runner-Up / 56 Teams", event: "System Analysis & Design Competition, UIU" },
    { year: "2025", rank: "2nd Runner-Up / 29 Teams", event: "Thesis & Project Competition, UIU" },
    { year: "2024", rank: "1st / 50+ Participants", event: "Pathao Quiz Competition, UIU" },
  ],

  cp: [
    "Solved 300+ problems on LeetCode and 170+ on Codeforces — consistent focus on dynamic programming, graph algorithms (BFS/DFS/Dijkstra), binary search, and sliding window patterns.",
    "Active rated contestant on Codeforces; emphasis on worst-case complexity analysis and constraint-driven algorithm selection.",
  ],
};
