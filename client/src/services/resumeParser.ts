import { StructuredResumeData, ContactInfo, WorkExperienceItem, EducationItem, ProjectItem } from '../../../shared/types';

export class ResumeParser {
  /**
   * Extract raw text from PDF or DOCX file directly in browser memory
   */
  public static async extractTextFromFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    let extractedText = '';

    if (ext === 'pdf') {
      extractedText = await this.extractPdfText(arrayBuffer, file.name);
    } else if (ext === 'docx' || ext === 'doc') {
      extractedText = await this.extractDocxText(arrayBuffer, file.name);
    } else if (ext === 'txt') {
      extractedText = await file.text();
    } else {
      throw new Error(`Unsupported file type: .${ext}. Please upload a PDF (.pdf) or Word document (.docx).`);
    }

    const trimmed = extractedText.replace(/\s+/g, ' ').trim();

    if (trimmed.length < 20) {
      throw new Error(
        'The uploaded document contains no extractable text. It may be a scanned image or password-protected. Please upload a text-based PDF or DOCX file, or use OCR software first.'
      );
    }

    return extractedText;
  }

  private static async extractPdfText(arrayBuffer: ArrayBuffer, fileName: string = 'resume.pdf'): Promise<string> {
    // 1. In-browser PDF.js parsing (zero network, fast, deterministic)
    const pdfjs =
      (window as any).pdfjsLib ||
      (window as any).pdfjsDistBuildPdf ||
      (window as any)['pdfjs-dist/build/pdf'] ||
      (window as any).PDFJS;

    if (pdfjs && pdfjs.getDocument) {
      let loadingTask: any = null;
      try {
        // Enforce worker disable to prevent cross-origin/sandbox hanging promises
        pdfjs.disableWorker = true;
        if (pdfjs.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc = '/libs/pdf.worker.js';
        }

        loadingTask = pdfjs.getDocument({
          data: new Uint8Array(arrayBuffer),
          disableFontFace: true,
          stopAtErrors: false
        });

        // Strict 5-second timeout to prevent indefinite spinner hangs
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('In-browser PDF parser timeout (5s)')), 5000)
        );

        const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          let lastY: number | undefined;
          let pageText = '';
          for (const item of content.items) {
            if (item.transform && (item.transform[5] === lastY || lastY === undefined)) {
              pageText += (item.str || '') + ' ';
            } else {
              pageText += '\n' + (item.str || '') + ' ';
            }
            if (item.transform) lastY = item.transform[5];
          }
          fullText += pageText + '\n';
        }

        if (fullText.trim().length > 10) {
          return fullText;
        }
      } catch (err: any) {
        console.warn('In-browser pdf.js extraction error or timeout, attempting backend fallback:', err);
        try {
          if (loadingTask && typeof loadingTask.destroy === 'function') {
            loadingTask.destroy();
          }
        } catch (_) {}
      }
    }

    // 2. High-speed local backend fallback via /api/parse-resume-text (uses verified pdf-parse)
    try {
      const formData = new FormData();
      formData.append('resume', new Blob([arrayBuffer], { type: 'application/pdf' }), fileName);
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch('/api/parse-resume-text', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(fetchTimeout);
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.text && json.text.trim().length > 10) {
          return json.text;
        }
      }
    } catch (serverErr) {
      console.warn('Backend extraction fallback unavailable or timed out:', serverErr);
    }

    // 3. Direct uncompressed stream chunk reader
    try {
      const decoder = new TextDecoder('latin1');
      const rawStr = decoder.decode(arrayBuffer);
      const textChunks: string[] = [];
      const streamRegex = /stream[\r\n]+([\s\S]*?)endstream/g;
      let match;
      let iterations = 0;
      while ((match = streamRegex.exec(rawStr)) !== null && iterations++ < 50) {
        const chunk = match[1];
        const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
        let tjMatch;
        let tjCount = 0;
        while ((tjMatch = tjRegex.exec(chunk)) !== null && tjCount++ < 100) {
          textChunks.push(tjMatch[1]);
        }
      }
      if (textChunks.length > 5) {
        return textChunks.join(' ');
      }
    } catch (e) {
      // Fallback exhausted
    }

    throw new Error(
      'Could not extract readable text from this PDF document. The document may be an image-only scanned copy or password protected. Please upload a text-based PDF or Word document.'
    );
  }

  private static async extractDocxText(arrayBuffer: ArrayBuffer, fileName: string = 'resume.docx'): Promise<string> {
    // 1. In-browser Mammoth extraction
    const mammoth = (window as any).mammoth;
    if (mammoth && mammoth.extractRawText) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('In-browser DOCX parser timeout (5s)')), 5000)
        );
        const res: any = await Promise.race([
          mammoth.extractRawText({ arrayBuffer }),
          timeoutPromise
        ]);
        if (res && res.value && res.value.trim().length > 10) {
          return res.value;
        }
      } catch (err: any) {
        console.warn('In-browser mammoth error, trying fallback:', err);
      }
    }

    // 2. High-speed local backend fallback via /api/parse-resume-text
    try {
      const formData = new FormData();
      formData.append(
        'resume',
        new Blob([arrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }),
        fileName
      );
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch('/api/parse-resume-text', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(fetchTimeout);
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.text && json.text.trim().length > 10) {
          return json.text;
        }
      }
    } catch (serverErr) {
      console.warn('Backend DOCX fallback unavailable:', serverErr);
    }

    throw new Error(
      'Failed to extract text from Word document. Please ensure it is a valid .docx file containing selectable text, or export it to PDF and upload again.'
    );
  }

  /**
   * Safe keyword matching for programming languages with regex metacharacters (C++, C#, .NET, etc.)
   */
  public static safeMatch(keyword: string, content: string): boolean {
    if (!keyword || !content) return false;

    if (keyword === 'C++') {
      return /(?:^|[^\w+])C\+\+(?=[^\w+]|$)/i.test(content);
    }
    if (keyword === 'C#') {
      return /(?:^|[^\w#])C#(?=[^\w#]|$)/i.test(content);
    }
    if (keyword === '.NET') {
      return /(?:^|[^\w])\.NET(?=[^\w]|$)/i.test(content);
    }
    if (keyword === 'C') {
      return /(?:^|[^\w+])C(?=[^\w+]|$)/i.test(content);
    }

    try {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const startB = /^\w/.test(keyword) ? '\\b' : '(?:^|\\s)';
      const endB = /\w$/.test(keyword) ? '\\b' : '(?=\\s|[.,;:]|$)';
      return new RegExp(`${startB}${escaped}${endB}`, 'i').test(content);
    } catch {
      return content.toLowerCase().includes(keyword.toLowerCase());
    }
  }

  /**
   * Intelligently parses extracted text into structured resume sections
   */
  public static parseStructuredResume(text: string, originalFilename = 'Resume'): StructuredResumeData {
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = cleanText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const contact = this.extractContact(cleanText, lines, originalFilename);
    const summary = this.extractSummary(cleanText);
    const skills = this.extractSkills(cleanText);
    const experience = this.extractExperience(cleanText);
    const education = this.extractEducation(cleanText);
    const projects = this.extractProjects(cleanText);
    const certifications = this.extractCertifications(cleanText);
    const achievements = this.extractAchievements(cleanText);
    const languages = this.extractLanguages(cleanText);

    return {
      contact,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      achievements,
      languages
    };
  }

  private static extractContact(text: string, lines: string[], defaultName: string): ContactInfo {
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([\w-]+)/i);
    const githubMatch = text.match(/(?:github\.com\/|github:\s*)([\w-]+)/i);
    const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([\w-]+\.(?:dev|me|io|com|tech|app))(?:\/)?/i);

    let fullName = '';
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (
        !line.includes('@') &&
        !/\d{5,}/.test(line) &&
        !/resume|curriculum|vitae|page|profile|objective|summary|contact/i.test(line) &&
        line.length > 2 &&
        line.length < 50
      ) {
        fullName = line;
        break;
      }
    }

    if (!fullName) {
      fullName = defaultName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }

    let location = '';
    const locMatch = text.match(
      /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|[A-Z][a-zA-Z\s]+,\s*(?:USA|India|Canada|UK|United Kingdom|Germany|Australia|Singapore))/
    );
    if (locMatch) {
      location = locMatch[0].trim();
    }

    return {
      fullName,
      email,
      phone,
      location: location || '',
      linkedinUrl: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
      githubUrl: githubMatch ? `https://github.com/${githubMatch[1]}` : '',
      portfolioUrl: portfolioMatch ? `https://${portfolioMatch[1]}` : ''
    };
  }

  private static extractSummary(text: string): string {
    const summaryRegex =
      /(?:SUMMARY|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|PROFILE|ABOUT ME|OBJECTIVE|CAREER OBJECTIVE)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|$))/i;
    const match = text.match(summaryRegex);
    if (match && match[1]) {
      const clean = match[1].replace(/\n+/g, ' ').trim();
      if (clean.length > 15) {
        return clean.slice(0, 800);
      }
    }
    return '';
  }

  private static extractSkills(text: string): { technical: string[]; soft: string[]; tools: string[] } {
    const knownTech = [
      'React', 'Next.js', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
      'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'C#', 'C', '.NET',
      'Go', 'Golang', 'Rust', 'PHP', 'Ruby', 'Kotlin', 'Swift', 'PostgreSQL', 'MongoDB', 'MySQL',
      'Redis', 'GraphQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'GCP', 'Azure',
      'CI/CD', 'Git', 'Linux', 'Tailwind CSS', 'HTML5', 'HTML', 'CSS3', 'CSS', 'Jest', 'PyTorch',
      'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'Kafka', 'Terraform', 'Solidity', 'Redux'
    ];

    const knownSoft = [
      'Team Leadership', 'Agile', 'Scrum', 'Communication', 'Problem Solving',
      'Cross-functional Collaboration', 'System Design', 'Code Reviews', 'Mentorship',
      'Critical Thinking', 'Adaptability', 'Time Management', 'Project Management'
    ];

    const knownTools = ['Git', 'GitHub', 'VS Code', 'Postman', 'Jira', 'Figma', 'Linux', 'Vercel', 'Webpack', 'Vite', 'Docker'];

    const skillsRegex = /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|$))/i;
    const skillsMatch = text.match(skillsRegex);
    const searchScope = skillsMatch ? skillsMatch[1] : text;

    const foundTech = knownTech.filter(
      (skill) => this.safeMatch(skill, searchScope) || this.safeMatch(skill, text)
    );
    const foundSoft = knownSoft.filter(
      (skill) => this.safeMatch(skill, searchScope) || this.safeMatch(skill, text)
    );
    const foundTools = knownTools.filter(
      (tool) => this.safeMatch(tool, searchScope) || this.safeMatch(tool, text)
    );

    // Custom skills extraction from explicit skills section
    if (skillsMatch && skillsMatch[1]) {
      const customLines = skillsMatch[1]
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter(Boolean);

      for (const line of customLines) {
        const contentPart = line.includes(':') ? line.split(':')[1] : line;
        const tokens = contentPart.split(/[,|•]/).map((t) => t.trim()).filter((t) => t.length >= 2 && t.length <= 25);
        for (const token of tokens) {
          if (!/\b(experience|worked|projects|responsible|proficient)\b/i.test(token) && !foundTech.includes(token)) {
            if (/^[a-zA-Z0-9#+.\s-]+$/.test(token)) {
              foundTech.push(token);
            }
          }
        }
      }
    }

    return {
      technical: Array.from(new Set(foundTech)),
      soft: Array.from(new Set(foundSoft)),
      tools: Array.from(new Set(foundTools))
    };
  }

  private static extractExperience(text: string): WorkExperienceItem[] {
    const expRegex =
      /(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|INTERNSHIP)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|ACADEMIC|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|PUBLICATIONS|$))/i;
    const match = text.match(expRegex);

    const items: WorkExperienceItem[] = [];

    if (match && match[1]) {
      const expBlock = match[1];
      const chunks = expBlock.split(/\n{2,}/).filter((c) => c.trim().length > 15);

      chunks.forEach((chunk, idx) => {
        const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const header = lines[0] || '';
        const sub = lines[1] || '';

        const bullets = lines
          .slice(1)
          .filter((l) => /^[-•*]|\b\d+%|\bdelivered\b|\bled\b|\bdeveloped\b|\bbuilt\b|\bimplemented\b|\barchitected\b|\bdesigned\b|\bcreated\b/i.test(l))
          .map((b) => b.replace(/^[-•*]\s*/, '').trim());

        const dateMatch = chunk.match(
          /(?:20\d{2}|19\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:20\d{2}|19\d{2})?\s*[-–to\s]+\s*(?:Present|Current|20\d{2}|19\d{2}|[A-Za-z]+\s*20\d{2})/i
        );

        let startDate = '2022';
        let endDate = 'Present';
        if (dateMatch) {
          const parts = dateMatch[0].split(/[-–to]+/i).map((s) => s.trim());
          startDate = parts[0] || '2022';
          endDate = parts[1] || 'Present';
        }

        items.push({
          id: `exp-${idx + 1}`,
          role: header.split(/[-–|at,]/i)[0].trim() || 'Software Engineer',
          company: sub.split(/[-–|,]/i)[0].trim() || header.split(/[-–|at]/i)[1]?.trim() || 'Company',
          startDate,
          endDate,
          current: /present|current/i.test(endDate),
          highlights: bullets.length > 0 ? bullets : [lines.slice(1).join(' ').trim()].filter(Boolean)
        });
      });
    }

    return items;
  }

  private static extractEducation(text: string): EducationItem[] {
    const eduRegex =
      /(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMICS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|$))/i;
    const match = text.match(eduRegex);

    const items: EducationItem[] = [];

    if (match && match[1]) {
      const lines = match[1].split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length > 0) {
        const degreeMatch = match[1].match(/(?:Bachelor|Master|B\.?S\.?|M\.?S\.?|B\.?E\.?|B\.?Tech|Ph\.?D|Associate|Diploma)[\w\s.]+/i);
        const gpaMatch = match[1].match(/(?:GPA|CGPA|Grade)[\s:]*([0-9.]+(?:\s*\/\s*[0-9.]+)?%?)/i);
        const yearMatch = match[1].match(/(?:19|20)\d{2}\s*[-–]\s*(?:19|20)\d{2}|(?:19|20)\d{2}/);

        items.push({
          id: 'edu-1',
          institution: lines[0] || 'University',
          degree: degreeMatch ? degreeMatch[0].trim() : lines[1] || 'Degree',
          startDate: yearMatch ? yearMatch[0].split(/[-–]/)[0]?.trim() : '',
          endDate: yearMatch ? yearMatch[0].split(/[-–]/)[1]?.trim() || yearMatch[0] : '',
          gradeGpa: gpaMatch ? gpaMatch[1] : undefined
        });
      }
    }

    return items;
  }

  private static extractProjects(text: string): ProjectItem[] {
    const projRegex =
      /(?:PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|$))/i;
    const match = text.match(projRegex);

    const items: ProjectItem[] = [];

    if (match && match[1]) {
      const chunks = match[1].split(/\n{2,}/).filter((c) => c.trim().length > 15);
      chunks.forEach((chunk, i) => {
        const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const highlights = lines
          .slice(1)
          .map((l) => l.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean);

        const toolsMatch = chunk.match(/\[(.*?)\]|\((?:Tech|Tools|Stack)[\s:]*(.*?)\)/i);
        const toolsUsed = toolsMatch
          ? (toolsMatch[1] || toolsMatch[2]).split(',').map((s) => s.trim())
          : [];

        items.push({
          id: `proj-${i + 1}`,
          title: lines[0].replace(/[-–|].*$/, '').trim() || `Project ${i + 1}`,
          toolsUsed,
          highlights: highlights.length > 0 ? highlights : [lines[0]]
        });
      });
    }

    return items;
  }

  private static extractCertifications(
    text: string
  ): Array<{ id: string; name: string; issuer: string; year?: string }> {
    const certs: Array<{ id: string; name: string; issuer: string; year?: string }> = [];

    const certRegex =
      /(?:CERTIFICATIONS|LICENSES & CERTIFICATIONS|COURSES & CERTIFICATES)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|ACHIEVEMENTS|$))/i;
    const match = text.match(certRegex);

    if (match && match[1]) {
      const lines = match[1]
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter((l) => l.length > 4);

      lines.slice(0, 5).forEach((line, i) => {
        const yearMatch = line.match(/(?:19|20)\d{2}/);
        certs.push({
          id: `cert-${i + 1}`,
          name: line.replace(/\s*\(?(?:19|20)\d{2}\)?/, '').trim(),
          issuer: 'Verified Credential',
          year: yearMatch ? yearMatch[0] : undefined
        });
      });
    }

    return certs;
  }

  private static extractAchievements(text: string): string[] {
    const achRegex =
      /(?:ACHIEVEMENTS|HONORS & AWARDS|ACCOMPLISHMENTS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|$))/i;
    const match = text.match(achRegex);

    if (match && match[1]) {
      return match[1]
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter((l) => l.length > 5)
        .slice(0, 5);
    }

    return [];
  }

  private static extractLanguages(text: string): string[] {
    const langRegex = /(?:LANGUAGES)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|$))/i;
    const match = text.match(langRegex);

    if (match && match[1]) {
      return match[1]
        .split(/[,\n]/)
        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter((l) => l.length > 2)
        .slice(0, 5);
    }

    return [];
  }
}
