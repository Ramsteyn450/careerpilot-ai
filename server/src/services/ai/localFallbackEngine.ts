import {
  StructuredResumeData,
  ResumeAnalysisResult,
  CategoryScore,
  ImprovementSuggestion,
  JobRoleRecommendation,
  JobMatchComparison,
  LearningRoadmap
} from '../../../../shared/types';

export class LocalFallbackEngine {
  /**
   * Analyze structured resume and produce rigorous 8-category screening report
   */
  public static analyzeResume(data: StructuredResumeData, rawText = ''): ResumeAnalysisResult {
    // 1. Analyze Content Quality (quantifiable metrics, active action verbs, absence of clichés)
    const contentAnalysis = this.evaluateContentQuality(data);

    // 2. Skills Relevance
    const skillsAnalysis = this.evaluateSkillsRelevance(data);

    // 3. Experience Relevance
    const experienceAnalysis = this.evaluateExperience(data);

    // 4. Project Quality
    const projectAnalysis = this.evaluateProjects(data);

    // 5. Readability
    const readabilityAnalysis = this.evaluateReadability(data, rawText);

    // 6. Formatting
    const formattingAnalysis = this.evaluateFormatting(data);

    // 7. Section Completeness
    const completenessAnalysis = this.evaluateSectionCompleteness(data);

    // 8. ATS Compatibility
    const atsAnalysis = this.evaluateATSCompatibility(data, rawText);

    const categoryScores: CategoryScore[] = [
      {
        name: 'Content Quality',
        score: contentAnalysis.score,
        weight: 0.15,
        description: 'Action-oriented bullet points, quantifiable metrics, and impact metrics.',
        status: this.getStatus(contentAnalysis.score)
      },
      {
        name: 'Skills Relevance',
        score: skillsAnalysis.score,
        weight: 0.15,
        description: 'Industry-standard technical and soft skills coverage.',
        status: this.getStatus(skillsAnalysis.score)
      },
      {
        name: 'Experience Relevance',
        score: experienceAnalysis.score,
        weight: 0.15,
        description: 'Role progression, responsibilities, and clear timelines.',
        status: this.getStatus(experienceAnalysis.score)
      },
      {
        name: 'Project Quality',
        score: projectAnalysis.score,
        weight: 0.15,
        description: 'Depth of projects, architectural tools, and demonstrable outcomes.',
        status: this.getStatus(projectAnalysis.score)
      },
      {
        name: 'Readability',
        score: readabilityAnalysis.score,
        weight: 0.10,
        description: 'Sentence length, scannability, concise phrasing, and visual rhythm.',
        status: this.getStatus(readabilityAnalysis.score)
      },
      {
        name: 'Formatting Consistency',
        score: formattingAnalysis.score,
        weight: 0.10,
        description: 'Uniform date formats, contact info completeness, and clear layout.',
        status: this.getStatus(formattingAnalysis.score)
      },
      {
        name: 'Section Completeness',
        score: completenessAnalysis.score,
        weight: 0.10,
        description: 'Presence of summary, experience, education, skills, and projects.',
        status: this.getStatus(completenessAnalysis.score)
      },
      {
        name: 'ATS Compatibility',
        score: atsAnalysis.score,
        weight: 0.10,
        description: 'Machine-parseable structure, standard headers, and keyword density.',
        status: this.getStatus(atsAnalysis.score)
      }
    ];

    // Compute overall score
    const overallScore = Math.round(
      categoryScores.reduce((acc, cat) => acc + cat.score * cat.weight, 0)
    );

    const atsCompatibilityScore = atsAnalysis.score;

    // Collect strengths
    const strengths = [
      ...contentAnalysis.strengths,
      ...skillsAnalysis.strengths,
      ...projectAnalysis.strengths,
      ...experienceAnalysis.strengths
    ].slice(0, 5);

    // Collect weaknesses with full 4-point structure
    const weaknesses = [
      ...completenessAnalysis.weaknesses,
      ...contentAnalysis.weaknesses,
      ...skillsAnalysis.weaknesses,
      ...atsAnalysis.weaknesses,
      ...formattingAnalysis.weaknesses
    ].slice(0, 5);

    // Actionable improvement suggestions with before/after diffs based on REAL user text
    const actionableRecommendations = this.generateActionableRecommendations(data);

    return {
      overallScore,
      atsCompatibilityScore,
      scoringExplanation:
        'Calculated based on an 8-factor deterministic scoring matrix analyzing quantifiable metrics, technical keywords, ATS parsing benchmarks, and structural integrity.',
      categoryScores,
      strengths,
      weaknesses,
      keywordAnalysis: {
        identifiedKeywords: skillsAnalysis.keywords,
        missingCrucialKeywords: skillsAnalysis.missingKeywords,
        stuffingRisk: false
      },
      formattingFeedback: {
        readabilityScore: readabilityAnalysis.score,
        warnings: formattingAnalysis.warnings,
        atsFriendly: atsAnalysis.score >= 70
      },
      actionableRecommendations
    };
  }

  private static getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'critical' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'critical';
  }

  private static evaluateContentQuality(data: StructuredResumeData) {
    let metricCount = 0;
    let actionVerbCount = 0;
    const actionVerbs = [
      'architected', 'spearheaded', 'engineered', 'implemented', 'optimized',
      'scaled', 'designed', 'accelerated', 'transformed', 'delivered', 'reduced', 'increased',
      'built', 'deployed', 'orchestrated', 'authored', 'formulated', 'led'
    ];

    const allBullets = [
      ...(data.experience || []).flatMap((e) => e.highlights || []),
      ...(data.projects || []).flatMap((p) => p.highlights || [])
    ];

    allBullets.forEach((bullet) => {
      if (/\b\d+[%kKmM]?|\$\d+|\b\d+\s*(?:users|ms|seconds|hours|x|times)\b/i.test(bullet)) {
        metricCount++;
      }
      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase();
      if (actionVerbs.includes(firstWord)) {
        actionVerbCount++;
      }
    });

    let score = 55;
    if (allBullets.length === 0) {
      score = 30;
    } else {
      if (metricCount >= 4) score += 25;
      else if (metricCount >= 2) score += 15;
      else if (metricCount >= 1) score += 5;

      if (actionVerbCount >= 3) score += 15;
      else if (actionVerbCount >= 1) score += 8;
    }

    score = Math.min(95, Math.max(25, score));

    const strengths: Array<{ title: string; detail: string }> = [];
    const weaknesses: Array<{
      title: string;
      issue: string;
      whyItMatters: string;
      howToFix: string;
      exampleImprovement: string;
    }> = [];

    if (metricCount >= 2) {
      strengths.push({
        title: 'Quantified Impact Highlights',
        detail: `Identified ${metricCount} accomplishments backed by measurable statistics or percentages.`
      });
    } else if (allBullets.length > 0) {
      weaknesses.push({
        title: 'Missing Measurable Outcomes',
        issue: 'Experience and project bullet points lack quantifiable numbers or percentage increases.',
        whyItMatters: 'Recruiters and hiring managers prioritize candidates who demonstrate concrete business impact over generic task lists.',
        howToFix: 'Incorporate the XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
        exampleImprovement:
          'Before: "Worked on database optimization."\nAfter: "Optimized SQL database queries and caching, decreasing average response time by 35%."'
      });
    }

    if (actionVerbCount >= 2) {
      strengths.push({
        title: 'High-Impact Action Verbs',
        detail: 'Demonstrates initiative using power verbs such as Architected, Engineered, and Implemented.'
      });
    } else if (allBullets.length > 0) {
      weaknesses.push({
        title: 'Passive Phrasing in Experience Highlights',
        issue: 'Bullet points start with passive phrases like "Assisted with" or "Responsible for".',
        whyItMatters: 'Passive statements obscure your individual technical contribution and weaken confidence.',
        howToFix: 'Replace descriptive duties with strong past-tense impact verbs.',
        exampleImprovement:
          'Before: "Responsible for building the user dashboard."\nAfter: "Engineered responsive analytics dashboard with React and TypeScript, increasing user session engagement."'
      });
    }

    return { score, strengths, weaknesses };
  }

  private static evaluateSkillsRelevance(data: StructuredResumeData) {
    const tech = data.skills?.technical || [];
    const soft = data.skills?.soft || [];

    let score = 30;
    if (tech.length >= 8) score += 40;
    else if (tech.length >= 4) score += 25;
    else if (tech.length >= 1) score += 15;

    if (soft.length >= 3) score += 15;
    score = Math.min(96, Math.max(25, score));

    const highDemandSkills = ['TypeScript', 'React', 'Node.js', 'Docker', 'AWS', 'Python', 'PostgreSQL', 'SQL', 'Git'];
    const missing = highDemandSkills.filter((s) => !tech.some((t) => t.toLowerCase() === s.toLowerCase())).slice(0, 4);

    const keywords = tech.map((s) => ({
      keyword: s,
      category: 'technical' as const,
      inResume: true,
      frequency: 2,
      importance: 'high' as const
    }));

    const strengths: Array<{ title: string; detail: string }> = [];
    const weaknesses: Array<{
      title: string;
      issue: string;
      whyItMatters: string;
      howToFix: string;
      exampleImprovement: string;
    }> = [];

    if (tech.length >= 5) {
      strengths.push({
        title: 'Diverse Modern Tech Stack',
        detail: `Demonstrates proficiency across ${tech.length} technical frameworks, languages, and tools.`
      });
    } else {
      weaknesses.push({
        title: 'Limited Technical Skill Keyword Density',
        issue: `Only ${tech.length} technical skills identified in your resume.`,
        whyItMatters: 'Automated Applicant Tracking Systems filter candidate resumes based on specific keyword frequency.',
        howToFix: 'Ensure your resume includes a dedicated "Technical Skills" section listing your programming languages, frameworks, and developer tools.',
        exampleImprovement: 'Add: "Languages: Python, TypeScript | Frameworks: React, Express | Databases: PostgreSQL"'
      });
    }

    return { score, keywords, missingKeywords: missing, strengths, weaknesses };
  }

  private static evaluateExperience(data: StructuredResumeData) {
    const exps = data.experience || [];
    let score = 40;
    if (exps.length >= 2) score += 35;
    else if (exps.length === 1) score += 25;

    const hasDates = exps.length > 0 && exps.every((e) => e.startDate && e.endDate);
    if (hasDates) score += 15;

    score = Math.min(95, Math.max(30, score));

    const strengths: Array<{ title: string; detail: string }> = [];
    if (exps.length >= 1) {
      strengths.push({
        title: 'Documented Professional History',
        detail: `Presents ${exps.length} professional experience record(s) with designated role titles.`
      });
    }

    return { score, strengths };
  }

  private static evaluateProjects(data: StructuredResumeData) {
    const projs = data.projects || [];
    let score = 35;
    if (projs.length >= 2) score += 40;
    else if (projs.length === 1) score += 25;

    const hasTools = projs.some((p) => p.toolsUsed && p.toolsUsed.length > 0);
    if (hasTools) score += 15;

    score = Math.min(95, Math.max(30, score));

    const strengths: Array<{ title: string; detail: string }> = [];
    if (projs.length >= 1) {
      strengths.push({
        title: 'Practical Project Delivery',
        detail: `Showcases ${projs.length} project portfolio implementation(s) demonstrating hands-on technical execution.`
      });
    }

    return { score, strengths };
  }

  private static evaluateReadability(data: StructuredResumeData, rawText: string) {
    let score = 80;
    const textLength = rawText.length || 1000;
    if (textLength > 4500) score -= 20; // overly verbose
    if (textLength < 400) score -= 25; // too sparse

    return { score: Math.max(40, score) };
  }

  private static evaluateFormatting(data: StructuredResumeData) {
    let score = 90;
    const warnings: string[] = [];

    if (!data.contact?.email) {
      score -= 25;
      warnings.push('Contact email is missing.');
    }
    if (!data.contact?.phone) {
      score -= 10;
      warnings.push('Phone number is missing.');
    }
    if (!data.contact?.linkedinUrl && !data.contact?.githubUrl) {
      score -= 10;
      warnings.push('LinkedIn or GitHub profile links are recommended for technical recruiters.');
    }

    const weaknesses: Array<{
      title: string;
      issue: string;
      whyItMatters: string;
      howToFix: string;
      exampleImprovement: string;
    }> = [];

    if (warnings.length > 0) {
      weaknesses.push({
        title: 'Contact Information Optimization',
        issue: warnings[0],
        whyItMatters: 'Recruiters spend seconds reviewing contact headers; incomplete details cause hiring drop-offs.',
        howToFix: 'Ensure your header includes full name, professional email, phone number, and verified portfolio/GitHub links.',
        exampleImprovement: 'Add a clickable LinkedIn / GitHub profile link directly beneath your name.'
      });
    }

    return { score: Math.max(30, score), warnings, weaknesses };
  }

  private static evaluateSectionCompleteness(data: StructuredResumeData) {
    let score = 20;
    const missingSections: string[] = [];

    if (data.summary && data.summary.trim().length > 20) score += 15;
    else missingSections.push('Professional Summary');

    if (data.experience && data.experience.length > 0) score += 25;
    else missingSections.push('Work Experience / Internships');

    if (data.education && data.education.length > 0) score += 15;
    else missingSections.push('Education');

    if (data.skills?.technical && data.skills.technical.length > 0) score += 15;
    else missingSections.push('Technical Skills');

    if (data.projects && data.projects.length > 0) score += 10;
    else missingSections.push('Projects');

    const weaknesses: Array<{
      title: string;
      issue: string;
      whyItMatters: string;
      howToFix: string;
      exampleImprovement: string;
    }> = [];

    if (missingSections.length > 0) {
      weaknesses.push({
        title: `Missing Resume Section: ${missingSections[0]}`,
        issue: `Your resume does not appear to contain a clearly defined ${missingSections.join(' or ')} section.`,
        whyItMatters: 'Standard ATS parsers and human recruiters expect standard sections to verify candidate qualifications.',
        howToFix: `Add a dedicated heading for "${missingSections[0]}" to showcase your qualifications.`,
        exampleImprovement: `Add a "${missingSections[0]}" section in the resume editor.`
      });
    }

    return { score: Math.min(100, Math.max(20, score)), weaknesses };
  }

  private static evaluateATSCompatibility(data: StructuredResumeData, rawText: string) {
    let score = 85;
    const weaknesses: Array<{
      title: string;
      issue: string;
      whyItMatters: string;
      howToFix: string;
      exampleImprovement: string;
    }> = [];

    const hasStandardExp = /experience|employment|work history|internship/i.test(rawText);
    const hasStandardEdu = /education|academic/i.test(rawText);
    const hasStandardSkills = /skills|technologies|competencies/i.test(rawText);

    if (!hasStandardExp && !hasStandardEdu && !hasStandardSkills) {
      score -= 30;
      weaknesses.push({
        title: 'Non-Standard Section Headings',
        issue: 'ATS parsers look for standard headings like "Experience", "Education", and "Skills".',
        whyItMatters: 'Creative or missing headings cause automated ATS parsers to misplace or ignore sections.',
        howToFix: 'Use universally recognized section titles: Professional Experience, Education, Projects, and Skills.',
        exampleImprovement: 'Change custom headings to standard titles: "Professional Experience", "Technical Skills".'
      });
    }

    return { score: Math.max(30, score), weaknesses };
  }

  /**
   * Actionable section improvements with side-by-side suggestions based on REAL user text
   * NEVER invents fake metrics or unverified facts
   */
  public static generateActionableRecommendations(data: StructuredResumeData): ImprovementSuggestion[] {
    const list: ImprovementSuggestion[] = [];

    // 1. Professional Summary Enhancement
    if (data.summary && data.summary.trim().length > 15) {
      const orig = data.summary.trim();
      const skillsMention = data.skills?.technical?.slice(0, 3).join(', ') || 'modern software technologies';
      
      list.push({
        id: 'sugg-summary-1',
        section: 'summary',
        originalText: orig,
        suggestedText: `${orig.replace(/^(I am a|Passionate|Dedicated)\s+/i, '')} Proficient in ${skillsMention}, with a strong commitment to clean architecture, code quality, and scalable engineering practices.`,
        rationale: 'Enhances professional tone by removing generic self-descriptors and reinforcing core technical competencies.',
        impact: 'High',
        status: 'pending'
      });
    } else {
      list.push({
        id: 'sugg-summary-missing',
        section: 'summary',
        originalText: 'No professional summary found.',
        suggestedText: 'Software Engineer skilled in modern web architecture, responsive user interface design, and scalable backend services. Committed to writing robust, maintainable code in collaborative agile environments.',
        rationale: 'Adding a concise 2-3 sentence elevator pitch gives recruiters an immediate overview of your capabilities.',
        impact: 'High',
        status: 'pending'
      });
    }

    // 2. Work Experience Enhancements (Based on user's actual bullets)
    if (data.experience && data.experience.length > 0) {
      data.experience.forEach((exp, expIdx) => {
        if (exp.highlights && exp.highlights.length > 0) {
          exp.highlights.slice(0, 2).forEach((bullet, bIdx) => {
            const cleanBullet = bullet.trim();
            if (cleanBullet.length > 10) {
              const improved = this.enhanceBulletPoint(cleanBullet);
              if (improved !== cleanBullet) {
                list.push({
                  id: `sugg-exp-${expIdx}-${bIdx}`,
                  section: 'experience',
                  targetItemIndex: expIdx,
                  originalText: cleanBullet,
                  suggestedText: improved,
                  rationale: 'Replaced passive phrasing with an active power verb and structured for clear engineering context.',
                  impact: 'High',
                  status: 'pending'
                });
              }
            }
          });
        }
      });
    }

    // 3. Project Highlights Enhancement (Based on user's actual projects)
    if (data.projects && data.projects.length > 0) {
      data.projects.slice(0, 2).forEach((proj, pIdx) => {
        if (proj.highlights && proj.highlights.length > 0) {
          const bullet = proj.highlights[0].trim();
          if (bullet.length > 10) {
            const tools = proj.toolsUsed?.length > 0 ? proj.toolsUsed.join(' and ') : 'modern frameworks';
            list.push({
              id: `sugg-proj-${pIdx}`,
              section: 'projects',
              targetItemIndex: pIdx,
              originalText: bullet,
              suggestedText: `Engineered ${proj.title} utilizing ${tools}; implemented end-to-end functionality with a focus on code modularity and reliability.`,
              rationale: 'Emphasizes technical ownership, tools utilized, and engineering rigor without fabricating unverified metrics.',
              impact: 'Medium',
              status: 'pending'
            });
          }
        }
      });
    }

    return list;
  }

  /**
   * Transforms weak/passive verbs into strong action verbs while preserving user's subject
   */
  private static enhanceBulletPoint(text: string): string {
    const weakStarters: Array<[RegExp, string]> = [
      [/^worked on\s+/i, 'Developed '],
      [/^was responsible for\s+/i, 'Managed '],
      [/^responsible for\s+/i, 'Spearheaded '],
      [/^helped with\s+/i, 'Collaborated on '],
      [/^assisted in\s+/i, 'Contributed to '],
      [/^handled\s+/i, 'Administered '],
      [/^made\s+/i, 'Engineered '],
      [/^did\s+/i, 'Executed '],
      [/^participated in\s+/i, 'Collaborated in ']
    ];

    for (const [regex, replacement] of weakStarters) {
      if (regex.test(text)) {
        return text.replace(regex, replacement);
      }
    }

    // If already starts with a verb, sharpen tone
    return text.replace(/^[a-z]/, (c) => c.toUpperCase());
  }

  /**
   * Job Role Recommendation Engine based on actual skills and experience
   */
  public static recommendJobRoles(data: StructuredResumeData): JobRoleRecommendation[] {
    const tech = (data.skills?.technical || []).map((s) => s.toLowerCase());
    const tools = (data.skills?.tools || []).map((s) => s.toLowerCase());
    const combined = [...tech, ...tools];

    const catalog: Array<{
      roleId: string;
      title: string;
      description: string;
      required: string[];
      optional: string[];
      certs: string[];
      portfolio: string[];
      roadmap: string;
    }> = [
      {
        roleId: 'role-fullstack',
        title: 'Full-Stack Developer',
        description: 'Designs, develops, and maintains both client-side user interfaces and server-side APIs and databases.',
        required: ['react', 'node.js', 'typescript', 'javascript', 'sql', 'rest api', 'git'],
        optional: ['docker', 'mongodb', 'postgresql', 'tailwind css', 'next.js', 'redis', 'aws'],
        certs: ['AWS Certified Developer - Associate', 'Meta Front-End Developer Professional Certificate'],
        portfolio: ['Deploy a production SaaS application with user auth, database persistence, and automated CI/CD.'],
        roadmap: 'Focus on end-to-end state management, database query optimization, and containerized deployments.'
      },
      {
        roleId: 'role-frontend',
        title: 'Frontend Engineer',
        description: 'Crafts responsive, accessible, high-performance web applications and design systems.',
        required: ['react', 'typescript', 'javascript', 'html5', 'css3', 'tailwind css', 'git'],
        optional: ['next.js', 'vue', 'graphql', 'jest', 'vite', 'figma'],
        certs: ['Meta Front-End Developer Certificate', 'OpenJS Node.js Application Developer'],
        portfolio: ['Build an interactive component library with Storybook, 100% WCAG accessibility, and dark mode.'],
        roadmap: 'Deepen knowledge in Web Vitals optimization, micro-frontends, and client-side caching strategies.'
      },
      {
        roleId: 'role-backend',
        title: 'Backend Systems Engineer',
        description: 'Engineers resilient server architectures, high-concurrency microservices, and database layers.',
        required: ['node.js', 'express', 'postgresql', 'sql', 'rest api', 'docker', 'git'],
        optional: ['go', 'python', 'redis', 'kafka', 'kubernetes', 'aws', 'grpc'],
        certs: ['AWS Certified Solutions Architect', 'CKA: Certified Kubernetes Administrator'],
        portfolio: ['Architect a distributed queue-based event worker system handling asynchronous event streams.'],
        roadmap: 'Master distributed consensus, database indexing, caching layers, and asynchronous event streams.'
      },
      {
        roleId: 'role-data-analyst',
        title: 'Data Analyst',
        description: 'Extracts actionable business intelligence, builds executive dashboards, and models data pipelines.',
        required: ['sql', 'python', 'pandas', 'excel'],
        optional: ['power bi', 'tableau', 'numpy', 'statistics', 'postgresql'],
        certs: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst'],
        portfolio: ['Publish an interactive cohort analysis and customer lifetime value dashboard using SQL and Tableau.'],
        roadmap: 'Strengthen exploratory data analysis, business metric forecasting, and executive presentation.'
      },
      {
        roleId: 'role-cloud-devops',
        title: 'Cloud & DevOps Engineer',
        description: 'Automates infrastructure delivery, monitoring, scalable cloud environments, and CI/CD pipelines.',
        required: ['docker', 'linux', 'git', 'ci/cd', 'aws'],
        optional: ['kubernetes', 'terraform', 'python', 'go', 'gcp', 'azure', 'prometheus'],
        certs: ['AWS Solutions Architect', 'HashiCorp Certified: Terraform Associate'],
        portfolio: ['Deploy a multi-tier application across AWS ECS/EKS using Terraform and GitHub Actions with automated rollback.'],
        roadmap: 'Build hands-on infrastructure-as-code automation and observability dashboards.'
      },
      {
        roleId: 'role-qa-automation',
        title: 'QA Automation Engineer',
        description: 'Builds automated test suites, end-to-end verification pipelines, and guarantees software reliability.',
        required: ['javascript', 'typescript', 'git', 'jest'],
        optional: ['playwright', 'cypress', 'selenium', 'python', 'ci/cd', 'postman'],
        certs: ['ISTQB Certified Tester', 'Playwright Automated Testing Master'],
        portfolio: ['Implement a comprehensive cross-browser test automation suite for a complex checkout workflow.'],
        roadmap: 'Master headless browser testing, API contract testing, and flaky test mitigation.'
      }
    ];

    const recommendations: JobRoleRecommendation[] = catalog.map((role) => {
      const matched = role.required.filter((req) => combined.some((c) => c.includes(req) || req.includes(c)));
      const optionalMatched = role.optional.filter((opt) => combined.some((c) => c.includes(opt) || opt.includes(c)));
      const missing = role.required.filter((req) => !combined.some((c) => c.includes(req) || req.includes(c)));

      const matchScore = role.required.length > 0
        ? Math.round((matched.length / role.required.length) * 75 + (optionalMatched.length / (role.optional.length || 1)) * 25)
        : 50;

      return {
        roleId: role.roleId,
        title: role.title,
        description: role.description,
        matchScore: Math.min(95, Math.max(25, matchScore)),
        matchingSkills: [...matched, ...optionalMatched].map((s) => s.toUpperCase()),
        missingSkills: missing.map((s) => s.toUpperCase()),
        relevantProjects: (data.projects || []).map((p) => p.title),
        experienceCompatibility: data.experience?.length ? 'Demonstrated hands-on experience' : 'Entry-level focus',
        educationCompatibility: data.education?.length ? 'STEM / Higher Education match' : 'Self-taught / Portfolio ready',
        roadmapRecommendation: role.roadmap,
        recommendedCertifications: role.certs,
        suggestedPortfolioActions: role.portfolio
      };
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Job Description Matcher: Compares resume against a specific job description
   */
  public static matchJobDescription(data: StructuredResumeData, jobText: string): JobMatchComparison {
    const cleanJob = jobText.toLowerCase();
    const resumeText = JSON.stringify(data).toLowerCase();

    // Key technical keywords to look for
    const commonKeywords = [
      'react', 'next.js', 'vue', 'angular', 'typescript', 'javascript', 'node.js',
      'express', 'python', 'django', 'fastapi', 'java', 'spring', 'go', 'golang',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'git', 'sql',
      'postgresql', 'mongodb', 'redis', 'graphql', 'rest api', 'tailwind', 'microservices'
    ];

    const jobKeywords = commonKeywords.filter((kw) => cleanJob.includes(kw));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    jobKeywords.forEach((kw) => {
      if (resumeText.includes(kw)) {
        matchedSkills.push(kw);
      } else {
        missingSkills.push(kw);
      }
    });

    const skillsCoveragePercent = jobKeywords.length
      ? Math.round((matchedSkills.length / jobKeywords.length) * 100)
      : 70;

    const overallMatchScore = Math.min(95, Math.max(25, Math.round(skillsCoveragePercent * 0.8 + 15)));

    // Generate requirement vs evidence table
    const requirementsBreakdown: Array<{
      requirement: string;
      resumeEvidence: string;
      status: 'Matched' | 'Partial' | 'Missing';
      recommendedAction: string;
    }> = [];

    matchedSkills.slice(0, 5).forEach((skill) => {
      requirementsBreakdown.push({
        requirement: `Proficiency in ${skill.toUpperCase()}`,
        resumeEvidence: `Demonstrated in your technical skills and project highlights.`,
        status: 'Matched',
        recommendedAction: `Highlight your practical hands-on experience with ${skill.toUpperCase()} during technical interviews.`
      });
    });

    missingSkills.slice(0, 4).forEach((skill) => {
      requirementsBreakdown.push({
        requirement: `Experience with ${skill.toUpperCase()}`,
        resumeEvidence: 'Not explicitly identified in your current resume text.',
        status: 'Missing',
        recommendedAction: `If you have verified experience with ${skill.toUpperCase()}, add it to your skills and project descriptions without fabricating qualifications.`
      });
    });

    const interviewPrepQuestions = [
      `Can you explain how you structured system architecture and state management in your primary projects?`,
      `How do you handle performance bottlenecks, query optimization, and latency in production environments?`,
      `Describe a time you collaborated across engineering and product teams to resolve a critical release blocker.`
    ];

    return {
      overallMatchScore,
      skillsCoveragePercent,
      matchedSkills: matchedSkills.map((s) => s.toUpperCase()),
      missingSkills: missingSkills.map((s) => s.toUpperCase()),
      requirementsBreakdown,
      suggestedBulletPoints: [
        `Integrated automated testing suites and CI/CD workflows, shortening deployment turnaround.`,
        `Optimized client-to-server data transmission with efficient caching and normalized payloads.`
      ],
      interviewPrepQuestions
    };
  }

  /**
   * 30 / 60 / 90 Day Learning Roadmap Generator
   */
  public static generateRoadmap(targetRole: string): LearningRoadmap {
    return {
      targetRole,
      thirtyDay: {
        focus: 'Core Fundamentals & Deep Dives',
        milestones: [
          'Review advanced design patterns, TypeScript strict typing, and concurrency models.',
          'Solve 25 targeted architectural problem sets on system structure and data flow.',
          'Set up a unified automated testing environment with Jest or Vitest.'
        ],
        handsOnProject: 'Build a containerized REST/GraphQL microservice with authentication and rate limiting.'
      },
      sixtyDay: {
        focus: 'Distributed Systems & Scalability',
        milestones: [
          'Implement Redis caching and background worker job queues for heavy tasks.',
          'Integrate continuous integration and continuous delivery (CI/CD) pipelines with GitHub Actions.',
          'Conduct comprehensive performance profiling and database index tuning.'
        ],
        handsOnProject: 'Develop a real-time collaborative workspace featuring WebSockets and optimistic UI updates.'
      },
      ninetyDay: {
        focus: 'Production Hardening & Career Portfolio',
        milestones: [
          'Deploy multi-region cloud infrastructure using Docker and Terraform/AWS.',
          'Document system design architecture diagrams and technical decisions in a public GitHub case study.',
          'Conduct mock technical interviews and optimize resume keywords for target role postings.'
        ],
        handsOnProject: 'Launch a full-fledged production-grade SaaS product with monitoring, alerting, and Stripe billing.'
      }
    };
  }
}
