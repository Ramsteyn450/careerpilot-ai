import { ResumeTemplateConfig } from '../../../shared/types';

export const SEED_TEMPLATES: ResumeTemplateConfig[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic Clean',
    category: 'Software Developer',
    styleName: 'ATS Classic',
    targetRole: 'General Software Engineer & Enterprise Roles',
    description: 'Clean single-column standard typography optimized for 100% Applicant Tracking System compliance.',
    atsFriendlinessNote: 'High ATS Compatibility: Standard headers, zero columns/tables, high contrast.',
    thumbnailColor: '#4F46E5',
    recommendedFor: ['Software Engineer', 'Backend Developer', 'Enterprise'],
    defaultFont: 'Inter',
    defaultAccent: '#1E293B'
  },
  {
    id: 'modern-professional',
    name: 'Modern Executive Violet',
    category: 'Full-Stack Developer',
    styleName: 'Modern Professional',
    targetRole: 'Full-Stack Engineers & Tech Leads',
    description: 'Sleek layout with electric violet accents, clear section tags, and elegant project highlights.',
    atsFriendlinessNote: 'High ATS Compatibility: Clean semantic markup with modern aesthetic.',
    thumbnailColor: '#7C3AED',
    recommendedFor: ['Full-Stack Developer', 'Tech Lead', 'Staff Engineer'],
    defaultFont: 'Inter',
    defaultAccent: '#7C3AED'
  },
  {
    id: 'minimal-tech',
    name: 'Minimal Monospace Dev',
    category: 'Frontend Developer',
    styleName: 'Minimal',
    targetRole: 'Frontend Developers & Open Source Contributors',
    description: 'High-density, minimalist design inspired by developer portfolios and terminal typography.',
    atsFriendlinessNote: 'Excellent: Crisp hierarchy, compact padding, scannable skill tags.',
    thumbnailColor: '#0EA5E9',
    recommendedFor: ['Frontend Engineer', 'UI Engineer', 'React Specialist'],
    defaultFont: 'Roboto',
    defaultAccent: '#0284C7'
  },
  {
    id: 'data-analytics-pro',
    name: 'Data Science Metricist',
    category: 'Data Science & Analytics',
    styleName: 'Data Analytics',
    targetRole: 'Data Analysts, Data Scientists & ML Engineers',
    description: 'Emphasizes quantitative achievements, statistical tools, metrics, and data pipeline outcomes.',
    atsFriendlinessNote: 'High: Focuses on metrics, tool stacks, and database proficiencies.',
    thumbnailColor: '#10B981',
    recommendedFor: ['Data Analyst', 'Data Scientist', 'BI Developer'],
    defaultFont: 'Inter',
    defaultAccent: '#059669'
  },
  {
    id: 'cloud-architect',
    name: 'Cloud DevOps Sovereign',
    category: 'Cloud Engineer',
    styleName: 'Technical Developer',
    targetRole: 'Cloud Engineers, SREs & DevOps Practitioners',
    description: 'Structured layout emphasizing infrastructure certifications, Kubernetes, AWS, and uptime SLAs.',
    atsFriendlinessNote: 'High ATS Compatibility: Clear certification callouts and architectural tooling.',
    thumbnailColor: '#F59E0B',
    recommendedFor: ['Cloud Engineer', 'DevOps', 'Site Reliability Engineer'],
    defaultFont: 'Inter',
    defaultAccent: '#D97706'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Product Designer',
    category: 'UI/UX Designer',
    styleName: 'Creative Portfolio',
    targetRole: 'UI/UX Designers & Product Managers',
    description: 'Balanced visual rhythm with portfolio links, design systems mastery, and case study metrics.',
    atsFriendlinessNote: 'Moderate: Best suited for design agency reviews and portfolio screening.',
    thumbnailColor: '#EC4899',
    recommendedFor: ['UI/UX Designer', 'Product Designer', 'Design Lead'],
    defaultFont: 'Inter',
    defaultAccent: '#DB2777'
  },
  {
    id: 'clean-corporate',
    name: 'Corporate Executive Prime',
    category: 'Experienced Professional',
    styleName: 'Clean Corporate',
    targetRole: 'Engineering Managers, Directors & VP of Tech',
    description: 'Authoritative, refined layout highlighting organizational scale, budgets, and team growth.',
    atsFriendlinessNote: 'High ATS Compatibility: Standard corporate layout with clean typography.',
    thumbnailColor: '#3B82F6',
    recommendedFor: ['Engineering Manager', 'Director of Engineering', 'VP'],
    defaultFont: 'Merriweather',
    defaultAccent: '#1D4ED8'
  },
  {
    id: 'fresher-starter',
    name: 'Campus Graduate First',
    category: 'Fresher Resume',
    styleName: 'Fresher',
    targetRole: 'Fresh Graduates, Interns & Junior Developers',
    description: 'Prioritizes education, GPA, hackathons, open-source projects, and foundational computer science skills.',
    atsFriendlinessNote: 'High: Designed specifically to showcase academic strength and capstone projects.',
    thumbnailColor: '#6366F1',
    recommendedFor: ['Student', 'Fresher', 'Junior Software Developer'],
    defaultFont: 'Inter',
    defaultAccent: '#4F46E5'
  },
  {
    id: 'cybersecurity-sentinel',
    name: 'Cybersecurity Sentinel',
    category: 'Cybersecurity Analyst',
    styleName: 'Technical Developer',
    targetRole: 'Security Analysts, Penetration Testers & SOC Engineers',
    description: 'Highlighting SIEM tools, compliance standards (SOC2, ISO), vulnerabilities resolved, and certifications.',
    atsFriendlinessNote: 'High ATS Compatibility: Clean layout with security credentials focus.',
    thumbnailColor: '#14B8A6',
    recommendedFor: ['Cybersecurity Analyst', 'Security Engineer', 'SOC Lead'],
    defaultFont: 'Roboto',
    defaultAccent: '#0D9488'
  },
  {
    id: 'academic-researcher',
    name: 'Academic Scholar & Fellow',
    category: 'Academic Resume',
    styleName: 'Academic',
    targetRole: 'Researchers, PhD Candidates & Postdocs',
    description: 'Comprehensive multi-item structure for peer-reviewed papers, lab research, and conferences.',
    atsFriendlinessNote: 'High: Standard academic CV structure with detailed publication records.',
    thumbnailColor: '#8B5CF6',
    recommendedFor: ['Research Scientist', 'PhD Scholar', 'Professor'],
    defaultFont: 'Merriweather',
    defaultAccent: '#6D28D9'
  },
  {
    id: 'two-column-modern',
    name: 'Two-Column Precision',
    category: 'Full-Stack Developer',
    styleName: 'Two-Column Modern',
    targetRole: 'Mid-Senior Engineers in Product Companies',
    description: 'Side navigation rail for skills and contact metadata, with wide right pane for impact bullets.',
    atsFriendlinessNote: 'Good: Clean CSS grid structure compatible with modern parsers.',
    thumbnailColor: '#8B5CF6',
    recommendedFor: ['Web Developer', 'Mobile Engineer', 'Full-Stack'],
    defaultFont: 'Inter',
    defaultAccent: '#6366F1'
  },
  {
    id: 'elegant-monochrome',
    name: 'Elegant Monochrome Minimalist',
    category: 'Career Switcher',
    styleName: 'Elegant Monochrome',
    targetRole: 'Career Switchers & Cross-Functional Leaders',
    description: 'High-contrast black & white typography with timeless editorial spacing and transferable skill spotlights.',
    atsFriendlinessNote: 'Maximum ATS Compatibility: 100% black and white, standard semantic flow.',
    thumbnailColor: '#18181B',
    recommendedFor: ['Career Switcher', 'Consultant', 'Project Manager'],
    defaultFont: 'Inter',
    defaultAccent: '#09090B'
  }
];

export const SEED_JOBS = [
  {
    title: 'Senior Full-Stack Engineer (React & Node)',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    location: 'San Francisco, CA',
    workMode: 'hybrid',
    experienceLevel: 'Senior',
    salaryRange: '$165,000 - $210,000',
    employmentType: 'Full-time',
    description: 'Join our developer platform team to build world-class payment APIs, developer tools, and reactive dashboard experiences used by millions of merchants worldwide.',
    requirements: [
      '5+ years building production full-stack systems with TypeScript, React, and Node.js.',
      'Deep understanding of database modeling, transaction management, and PostgreSQL optimization.',
      'Proven experience building developer-facing APIs with low latency and high availability.'
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST API', 'Redis'],
    source: 'verified',
    applicationUrl: 'https://stripe.com/jobs'
  },
  {
    title: 'Frontend Platform Engineer',
    company: 'Linear',
    companyLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
    location: 'Remote (Worldwide)',
    workMode: 'remote',
    experienceLevel: 'Mid',
    salaryRange: '$140,000 - $185,000',
    employmentType: 'Full-time',
    description: 'Help craft the fastest, most delightful project management software in the world. You will work on real-time synchronization, fluid 60fps animations, and keyboard-first user interfaces.',
    requirements: [
      '3+ years crafting high-performance client-side applications with React and TypeScript.',
      'Mastery of CSS, responsive layouts, web animations, and keyboard shortcut event listeners.',
      'Obsession with user experience speed, sub-100ms interactions, and accessibility.'
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'Next.js', 'Git'],
    source: 'verified',
    applicationUrl: 'https://linear.app/careers'
  },
  {
    title: 'Backend Systems Engineer',
    company: 'Datadog',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
    location: 'New York, NY',
    workMode: 'hybrid',
    experienceLevel: 'Senior',
    salaryRange: '$170,000 - $220,000',
    employmentType: 'Full-time',
    description: 'Build high-throughput telemetry ingestion services handling trillions of metrics and trace logs every single day with fault-tolerant distributed pipelines.',
    requirements: [
      'Expertise in Go, Python, or Node.js backend systems.',
      'Hands-on experience with Kafka, Redis, or distributed message brokers.',
      'Solid foundations in concurrency, networking protocols, and Linux performance tuning.'
    ],
    skills: ['Node.js', 'Go', 'Kafka', 'Redis', 'Docker', 'Kubernetes', 'PostgreSQL'],
    source: 'verified',
    applicationUrl: 'https://datadoghq.com/careers'
  },
  {
    title: 'Junior Software Engineer (Fresher / 0-2 yrs)',
    company: 'Vercel',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop',
    location: 'Remote (US/Canada)',
    workMode: 'remote',
    experienceLevel: 'Entry',
    salaryRange: '$95,000 - $125,000',
    employmentType: 'Full-time',
    description: 'Exciting entry-level opportunity for talented recent graduates or early-career developers. Work on developer tooling, edge computing platforms, and open-source ecosystems.',
    requirements: [
      'B.S. in Computer Science or equivalent demonstrated coding ability.',
      'Strong proficiency in JavaScript, TypeScript, and modern HTML/CSS.',
      'Enthusiasm for open source, modern web standards, and developer productivity.'
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Git', 'HTML5', 'CSS3', 'Node.js'],
    source: 'verified',
    applicationUrl: 'https://vercel.com/careers'
  },
  {
    title: 'Cloud DevOps & SRE Engineer',
    company: 'Cloudflare',
    companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop',
    location: 'Austin, TX',
    workMode: 'onsite',
    experienceLevel: 'Mid',
    salaryRange: '$135,000 - $175,000',
    employmentType: 'Full-time',
    description: 'Maintain and scale edge infrastructure across 300+ cities globally. Automate containerized deployments and optimize multi-cloud failover strategies.',
    requirements: [
      '3+ years managing production Linux, Docker, and Kubernetes clusters.',
      'Infrastructure as Code experience with Terraform or Pulumi.',
      'Strong scripting abilities in Python, Bash, or Go.'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Git', 'Python'],
    source: 'verified',
    applicationUrl: 'https://cloudflare.com/careers'
  },
  {
    title: 'Data Analyst / BI Specialist',
    company: 'Spotify',
    companyLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    location: 'Boston, MA',
    workMode: 'hybrid',
    experienceLevel: 'Mid',
    salaryRange: '$115,000 - $150,000',
    employmentType: 'Full-time',
    description: 'Analyze music streaming patterns, podcast listener retention, and create executive-ready Tableau and SQL dashboards guiding product strategy.',
    requirements: [
      'Expert SQL proficiency with complex window functions and joins.',
      'Experience modeling data in BigQuery, Snowflake, or PostgreSQL.',
      'Demonstrated dashboard storytelling ability in Tableau or Power BI.'
    ],
    skills: ['SQL', 'Python', 'Pandas', 'PostgreSQL', 'Excel', 'Problem Solving'],
    source: 'verified',
    applicationUrl: 'https://spotify.com/jobs'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Anthropic',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop',
    location: 'San Francisco, CA',
    workMode: 'hybrid',
    experienceLevel: 'Senior',
    salaryRange: '$220,000 - $320,000',
    employmentType: 'Full-time',
    description: 'Work at the frontier of AI alignment, model evaluation, and large-scale training pipelines for next-generation foundation models.',
    requirements: [
      'Strong research or engineering background in deep learning, NLP, or LLMs.',
      'Proficiency in PyTorch, distributed training (DeepSpeed, Megatron), and Python.',
      'Experience optimizing GPU kernels and low-latency inference pipelines.'
    ],
    skills: ['Python', 'PyTorch', 'Docker', 'Linux', 'Git', 'System Design'],
    source: 'verified',
    applicationUrl: 'https://anthropic.com/careers'
  },
  {
    title: 'QA Automation Engineer',
    company: 'Shopify',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=100&h=100&fit=crop',
    location: 'Remote (Anywhere)',
    workMode: 'remote',
    experienceLevel: 'Mid',
    salaryRange: '$110,000 - $145,000',
    employmentType: 'Full-time',
    description: 'Build end-to-end automated testing pipelines for merchant checkout and inventory services handling billions of dollars in Black Friday transactions.',
    requirements: [
      'Experience authoring automated end-to-end test suites using Playwright, Cypress, or Selenium.',
      'Solid proficiency with TypeScript, JavaScript, and CI/CD pipelines.',
      'Knowledge of REST and GraphQL API testing methodologies.'
    ],
    skills: ['TypeScript', 'JavaScript', 'Jest', 'CI/CD', 'Git', 'REST API'],
    source: 'verified',
    applicationUrl: 'https://shopify.com/careers'
  }
];
