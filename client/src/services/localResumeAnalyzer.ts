import { StructuredResumeData } from '../../../shared/types';

export interface CategoryScore {
  name: string;
  score: number;
  weight: number;
  description: string;
  status: 'critical' | 'needs-improvement' | 'good' | 'excellent';
}

export interface RecommendationItem {
  id: string;
  category: string;
  section: 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'formatting';
  issue: string;
  whyItMatters: string;
  howToImprove: string;
  concreteExample?: string;
  originalText?: string;
  suggestedText?: string;
}

export interface RoleRecommendation {
  roleTitle: string;
  compatibilityScore: number;
  matchLevel: 'High' | 'Moderate' | 'Emerging';
  matchingSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  sectionsToStrengthen: string[];
  suggestedNextSteps: string[];
}

export interface LocalAnalysisResult {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  summaryVerdict: string;
  categories: CategoryScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: RecommendationItem[];
  roleRecommendations: RoleRecommendation[];
}

export class LocalResumeAnalyzer {
  public static analyze(data: StructuredResumeData, rawText: string): LocalAnalysisResult {
    // 1. Content Quality (Weight: 20%)
    const content = this.evalContentQuality(data, rawText);

    // 2. Section Completeness (Weight: 15%)
    const completeness = this.evalCompleteness(data);

    // 3. Skills Relevance (Weight: 20%)
    const skills = this.evalSkills(data);

    // 4. Experience & Project Descriptions (Weight: 20%)
    const expProj = this.evalExperienceAndProjects(data);

    // 5. Readability (Weight: 10%)
    const readability = this.evalReadability(rawText);

    // 6. Formatting & ATS Parsing Compatibility (Weight: 15%)
    const formatting = this.evalFormattingAndATS(data, rawText);

    const categories: CategoryScore[] = [
      {
        name: 'Content Quality',
        score: content.score,
        weight: 20,
        description: 'Action verbs, professional tone, and depth of accomplishments.',
        status: this.getStatus(content.score)
      },
      {
        name: 'Section Completeness',
        score: completeness.score,
        weight: 15,
        description: 'Coverage of fundamental sections: Contact, Summary, Experience, Education, Skills, and Projects.',
        status: this.getStatus(completeness.score)
      },
      {
        name: 'Skills Relevance',
        score: skills.score,
        weight: 20,
        description: 'Density, categorization, and market relevance of technical and professional competencies.',
        status: this.getStatus(skills.score)
      },
      {
        name: 'Experience & Project Descriptions',
        score: expProj.score,
        weight: 20,
        description: 'Result-oriented bullet points, quantifiable metrics, and tool mentions.',
        status: this.getStatus(expProj.score)
      },
      {
        name: 'Readability',
        score: readability.score,
        weight: 10,
        description: 'Sentence length, clarity, bullet structure, and absence of generic fluff.',
        status: this.getStatus(readability.score)
      },
      {
        name: 'Formatting & ATS Parsing Compatibility',
        score: formatting.score,
        weight: 15,
        description: 'Standard section headings, scannable layout, and contact data structure.',
        status: this.getStatus(formatting.score)
      }
    ];

    const overallScore = Math.round(
      categories.reduce((acc, cat) => acc + (cat.score * cat.weight) / 100, 0)
    );

    const grade =
      overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : 'D';

    const strengths: string[] = [
      ...content.strengths,
      ...completeness.strengths,
      ...skills.strengths,
      ...expProj.strengths,
      ...formatting.strengths
    ].slice(0, 6);

    const weaknesses: string[] = [
      ...content.weaknesses,
      ...completeness.weaknesses,
      ...skills.weaknesses,
      ...expProj.weaknesses,
      ...formatting.weaknesses
    ].slice(0, 6);

    const recommendations: RecommendationItem[] = [
      ...content.recs,
      ...completeness.recs,
      ...skills.recs,
      ...expProj.recs,
      ...formatting.recs
    ];

    const roleRecommendations = this.evalRoleRecommendations(data);

    const summaryVerdict =
      overallScore >= 80
        ? 'Strong resume with competitive ATS compliance. Targeted polishing of quantifiable outcomes will maximize interview callbacks.'
        : overallScore >= 65
        ? 'Good baseline resume. Enhancing quantifiable results, expanding technical keyword density, and refining bullet point action verbs will notably boost your score.'
        : 'Resume needs structural and content improvements. Several key sections and quantifiable achievements should be strengthened for modern ATS parsers.';

    return {
      overallScore,
      grade,
      summaryVerdict,
      categories,
      strengths,
      weaknesses,
      recommendations,
      roleRecommendations
    };
  }

  private static getStatus(score: number): 'critical' | 'needs-improvement' | 'good' | 'excellent' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'critical';
  }

  // 1. Content Quality
  private static evalContentQuality(data: StructuredResumeData, _rawText: string) {
    let score = 50;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    const actionVerbs = [
      'developed', 'engineered', 'architected', 'implemented', 'designed', 'led', 'delivered',
      'spearheaded', 'optimized', 'reduced', 'increased', 'managed', 'created', 'built', 'resolved'
    ];

    let actionVerbCount = 0;
    const allHighlights = [
      ...(data.experience || []).flatMap((e) => e.highlights),
      ...(data.projects || []).flatMap((p) => p.highlights)
    ];

    allHighlights.forEach((h) => {
      if (actionVerbs.some((v) => new RegExp(`\\b${v}\\b`, 'i').test(h))) {
        actionVerbCount++;
      }
    });

    if (actionVerbCount >= 5) {
      score += 25;
      strengths.push(`Strong active tone with ${actionVerbCount} high-impact action verbs across experience bullets.`);
    } else if (actionVerbCount >= 2) {
      score += 15;
    } else {
      weaknesses.push('Bullet points lean on passive descriptions rather than direct action verbs.');
      recs.push({
        id: 'rec-action-verbs',
        category: 'Content Quality',
        section: 'experience',
        issue: 'Weak action verb usage in work experience bullets.',
        whyItMatters: 'Hiring managers and ATS algorithms look for candidate-driven action rather than passive task lists.',
        howToImprove: 'Begin every bullet point with a decisive past-tense action verb like "Architected", "Spearheaded", or "Optimized".',
        concreteExample: 'Instead of "Responsible for website performance", write "Optimized frontend bundles, reducing initial page load times."'
      });
    }

    if (data.summary && data.summary.length > 50) {
      score += 20;
      strengths.push('Includes a dedicated professional summary providing immediate context on your background.');
    } else {
      weaknesses.push('Missing or very short professional summary.');
      recs.push({
        id: 'rec-summary',
        category: 'Content Quality',
        section: 'summary',
        issue: 'Lacks a compelling 2-3 sentence executive profile or summary.',
        whyItMatters: 'A well-crafted summary establishes your primary domain expertise and value proposition within 6 seconds.',
        howToImprove: 'Draft a concise 2-sentence summary detailing your core role, key technical stack, and engineering philosophy.',
        concreteExample: 'Passionate Full-Stack Developer with experience in React, Node.js, and distributed cloud services. Dedicated to writing clean, maintainable code in collaborative agile environments.',
        originalText: data.summary || '',
        suggestedText: 'Software Engineer skilled in modern web architecture, responsive user interface design, and scalable backend services. Committed to writing robust, maintainable code in collaborative agile environments.'
      });
    }

    return { score: Math.min(100, score), strengths, weaknesses, recs };
  }

  // 2. Section Completeness
  private static evalCompleteness(data: StructuredResumeData) {
    let score = 20;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    if (data.contact.email && (data.contact.phone || data.contact.location)) {
      score += 15;
      strengths.push('Complete contact information with reachable email and phone/location.');
    } else {
      weaknesses.push('Contact information is missing an email, phone number, or location.');
    }

    if (data.summary) score += 15;
    if (data.skills?.technical && data.skills.technical.length > 0) score += 15;
    if (data.experience && data.experience.length > 0) score += 15;
    if (data.education && data.education.length > 0) score += 10;
    if (data.projects && data.projects.length > 0) score += 10;

    if (data.projects && data.projects.length > 0) {
      strengths.push(`Showcases ${data.projects.length} dedicated engineering/academic projects.`);
    } else {
      weaknesses.push('No dedicated projects section found.');
      recs.push({
        id: 'rec-projects-needed',
        category: 'Section Completeness',
        section: 'projects',
        issue: 'Missing a dedicated projects section.',
        whyItMatters: 'Projects prove hands-on application of your skills beyond job titles.',
        howToImprove: 'Add 1-2 major projects detailing the technologies used, your core contributions, and the final deliverable.'
      });
    }

    return { score: Math.min(100, score), strengths, weaknesses, recs };
  }

  // 3. Skills Relevance
  private static evalSkills(data: StructuredResumeData) {
    let score = 40;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    const tech = data.skills?.technical || [];
    const tools = data.skills?.tools || [];

    if (tech.length >= 6) {
      score += 35;
      strengths.push(`Diverse technical stack highlighting ${tech.length} verified technologies.`);
    } else if (tech.length >= 3) {
      score += 20;
    } else {
      weaknesses.push('Low technical keyword density (< 3 technical skills listed).');
      recs.push({
        id: 'rec-skills-density',
        category: 'Skills Relevance',
        section: 'skills',
        issue: 'Limited technical skill keywords listed in dedicated section.',
        whyItMatters: 'ATS keyword filters screen candidate resumes based on specific technical proficiencies.',
        howToImprove: 'List all languages, frameworks, databases, and libraries you have hands-on experience with.'
      });
    }

    if (tools.length >= 2 || (data.skills?.soft && data.skills.soft.length >= 2)) {
      score += 25;
      strengths.push('Balanced profile covering both core languages and workflow developer tooling.');
    }

    return { score: Math.min(100, score), strengths, weaknesses, recs };
  }

  // 4. Experience & Project Descriptions
  private static evalExperienceAndProjects(data: StructuredResumeData) {
    let score = 45;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    const allBullets = [
      ...(data.experience || []).flatMap((e) => e.highlights),
      ...(data.projects || []).flatMap((p) => p.highlights)
    ];

    const metricBullets = allBullets.filter((b) => /\d+%|\b\d+\s*(?:ms|seconds|minutes|users|requests|records|X|fold)\b|\$\d+/i.test(b));

    if (metricBullets.length >= 2) {
      score += 35;
      strengths.push(`Contains ${metricBullets.length} bullet points with quantifiable data and measurable results.`);
    } else {
      weaknesses.push('Lack of quantifiable metrics or numerical evidence in work and project bullets.');
      recs.push({
        id: 'rec-metrics',
        category: 'Experience & Projects',
        section: 'experience',
        issue: 'Bullet points describe duties without measuring outcome or impact.',
        whyItMatters: 'Top recruiters favor bullets showing business value (e.g. latency reduced, user adoption, speed improvements).',
        howToImprove: 'Whenever possible, include real percentages, time savings, or scale to ground your achievements.',
        concreteExample: 'Instead of "Worked on database queries", write "Refactored SQL queries, reducing report generation latency."'
      });
    }

    // Check project tool callouts
    const projectsWithTools = (data.projects || []).filter((p) => p.toolsUsed && p.toolsUsed.length > 0);
    if (projectsWithTools.length > 0) {
      score += 20;
    }

    return { score: Math.min(100, score), strengths, weaknesses, recs };
  }

  // 5. Readability
  private static evalReadability(rawText: string) {
    let score = 75;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const avgLineLength = lines.reduce((acc, l) => acc + l.length, 0) / (lines.length || 1);

    if (avgLineLength >= 20 && avgLineLength <= 90) {
      score += 15;
      strengths.push('Consistent bullet length and comfortable scannability for human reviewers.');
    } else if (avgLineLength > 120) {
      score -= 15;
      weaknesses.push('Several paragraphs or bullet points are overly dense and difficult to scan.');
    }

    return { score: Math.min(100, Math.max(30, score)), strengths, weaknesses, recs };
  }

  // 6. Formatting & ATS Parsing Compatibility
  private static evalFormattingAndATS(data: StructuredResumeData, rawText: string) {
    let score = 55;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recs: RecommendationItem[] = [];

    const standardHeadings = ['experience', 'education', 'skills', 'projects'];
    let headingsFound = 0;
    standardHeadings.forEach((h) => {
      if (new RegExp(`\\b${h}\\b`, 'i').test(rawText)) headingsFound++;
    });

    if (headingsFound >= 3) {
      score += 30;
      strengths.push('Uses standard, universally recognized section headers that parse cleanly in all ATS systems.');
    } else {
      weaknesses.push('Non-standard or missing core headings, which can cause parsers to misclassify data.');
      recs.push({
        id: 'rec-ats-headings',
        category: 'Formatting & ATS',
        section: 'formatting',
        issue: 'Core section headings might not follow standard ATS terminology.',
        whyItMatters: 'Applicant Tracking Systems use heading text to categorize your work history and education.',
        howToImprove: 'Use standard heading titles: "Work Experience", "Education", "Technical Skills", and "Projects".'
      });
    }

    if (data.contact.email && data.contact.phone) {
      score += 15;
    }

    return { score: Math.min(100, score), strengths, weaknesses, recs };
  }

  // Role Recommendations Engine
  public static evalRoleRecommendations(data: StructuredResumeData): RoleRecommendation[] {
    const tech = (data.skills?.technical || []).map((s) => s.toLowerCase());
    const tools = (data.skills?.tools || []).map((s) => s.toLowerCase());
    const allSkills = new Set([...tech, ...tools]);

    const rolesConfig = [
      {
        title: 'Full-Stack Developer',
        coreSkills: ['react', 'node.js', 'typescript', 'javascript', 'postgresql', 'mongodb', 'docker', 'rest api', 'sql'],
        optionalSkills: ['express', 'next.js', 'git', 'aws', 'graphql'],
        suggestedNextSteps: [
          'Highlight full-stack projects showing both UI components and server-side data models.',
          'Emphasize database schema design and REST/GraphQL API integration in your experience bullets.'
        ]
      },
      {
        title: 'Frontend Developer',
        coreSkills: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind css', 'next.js', 'vue'],
        optionalSkills: ['jest', 'vite', 'webpack', 'figma', 'redux'],
        suggestedNextSteps: [
          'Showcase responsive web apps demonstrating clean state management and accessibility (WCAG).',
          'Highlight experience with modern build tools (Vite, Tailwind CSS, component libraries).'
        ]
      },
      {
        title: 'Backend Developer',
        coreSkills: ['node.js', 'express', 'python', 'java', 'sql', 'postgresql', 'mongodb', 'docker', 'rest api'],
        optionalSkills: ['redis', 'kafka', 'aws', 'spring boot', 'fastapi', 'microservices'],
        suggestedNextSteps: [
          'Detail server architecture, API response times, and database indexing optimizations.',
          'Highlight unit and integration testing pipelines to prove backend reliability.'
        ]
      },
      {
        title: 'Data Analyst & BI Specialist',
        coreSkills: ['sql', 'python', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'powerbi', 'postgresql'],
        optionalSkills: ['r', 'excel', 'snowflake', 'bigquery', 'data visualization'],
        suggestedNextSteps: [
          'Describe real business insights derived from exploratory data analysis and dashboards.',
          'Include dataset sizes (e.g. analyzed 500K records) to demonstrate data handling capabilities.'
        ]
      },
      {
        title: 'Cloud & DevOps Engineer',
        coreSkills: ['docker', 'kubernetes', 'aws', 'linux', 'ci/cd', 'terraform', 'git', 'gcp'],
        optionalSkills: ['ansible', 'prometheus', 'grafana', 'python', 'bash'],
        suggestedNextSteps: [
          'Spotlight cloud accreditations (AWS Certified, CKA) and automated deployment pipelines.',
          'Document infrastructure-as-code scripts and zero-downtime container deployments.'
        ]
      },
      {
        title: 'Cybersecurity Analyst',
        coreSkills: ['linux', 'python', 'wireshark', 'splunk', 'soc 2', 'incident response', 'nist'],
        optionalSkills: ['burp suite', 'metasploit', 'nessus', 'iso 27001', 'git'],
        suggestedNextSteps: [
          'Emphasize threat intelligence, vulnerability assessments, and compliance adherence.',
          'Highlight verified security credentials (CompTIA Security+, CEH, CISSP).'
        ]
      },
      {
        title: 'UI/UX & Product Designer',
        coreSkills: ['figma', 'design systems', 'wireframing', 'user research', 'prototyping', 'css', 'html'],
        optionalSkills: ['adobe xd', 'react', 'tailwind css', 'usability testing'],
        suggestedNextSteps: [
          'Include a clear portfolio link displaying interactive Figma prototypes and design case studies.',
          'Detail user research methodologies and usability testing metrics.'
        ]
      }
    ];

    const results: RoleRecommendation[] = [];

    for (const r of rolesConfig) {
      const matched = r.coreSkills.filter((s) => allSkills.has(s) || Array.from(allSkills).some((userS) => userS.includes(s) || s.includes(userS)));
      const missing = r.coreSkills.filter((s) => !matched.includes(s));

      const matchPercent = Math.min(
        95,
        Math.max(25, Math.round((matched.length / r.coreSkills.length) * 80 + 15))
      );

      const relevantProjects = (data.projects || [])
        .filter((p) => (p.toolsUsed || []).some((t) => r.coreSkills.includes(t.toLowerCase())))
        .map((p) => p.title);

      const sectionsToStrengthen: string[] = [];
      if (missing.length > 2) sectionsToStrengthen.push('Technical Skills Section');
      if (relevantProjects.length === 0) sectionsToStrengthen.push('Projects Demonstrating ' + r.title);
      if (matched.length > 0) sectionsToStrengthen.push('Executive Summary Alignment');

      results.push({
        roleTitle: r.title,
        compatibilityScore: matchPercent,
        matchLevel: matchPercent >= 75 ? 'High' : matchPercent >= 50 ? 'Moderate' : 'Emerging',
        matchingSkills: matched.map((s) => s.toUpperCase()),
        missingSkills: missing.slice(0, 4).map((s) => s.toUpperCase()),
        relevantProjects: relevantProjects.length > 0 ? relevantProjects : ['Add relevant project for ' + r.title],
        sectionsToStrengthen,
        suggestedNextSteps: r.suggestedNextSteps
      });
    }

    return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
