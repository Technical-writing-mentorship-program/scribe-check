import { LintIssue, StyleGuide } from "@/types/linting";

// Mock linting engine - simulates Vale-like linting
export const lintMarkdown = (text: string, styleGuide: StyleGuide): LintIssue[] => {
  const issues: LintIssue[] = [];
  const lines = text.split("\n");

  // Common rules across all style guides
  const passiveVoicePattern = /\b(was|were|is|are|been|being|be)\s+\w+ed\b/gi;
  const wordyPhrases = {
    "in order to": "to",
    "due to the fact that": "because",
    "at this point in time": "now",
    "for the purpose of": "to",
  };

  lines.forEach((line, lineIndex) => {
    // Check for passive voice
    const passiveMatches = line.matchAll(passiveVoicePattern);
    for (const match of passiveMatches) {
      issues.push({
        id: `${lineIndex}-${match.index}-passive`,
        line: lineIndex + 1,
        column: match.index || 0,
        message: "Consider using active voice instead of passive voice",
        rule: "Vale.Passive",
        level: "warning",
        suggestion: "Rewrite using active voice",
        explanation: "Active voice makes your writing more direct and easier to read.",
      });
    }

    // Check for wordy phrases
    Object.entries(wordyPhrases).forEach(([wordy, concise]) => {
      const index = line.toLowerCase().indexOf(wordy.toLowerCase());
      if (index !== -1) {
        issues.push({
          id: `${lineIndex}-${index}-wordy`,
          line: lineIndex + 1,
          column: index,
          message: `Replace "${wordy}" with "${concise}"`,
          rule: "Vale.Wordiness",
          level: "info",
          suggestion: concise,
          explanation: "Concise writing improves readability and clarity.",
        });
      }
    });

    // Style guide specific rules
    if (styleGuide === "google") {
      // Google prefers "Click" over "Click on"
      if (line.toLowerCase().includes("click on")) {
        const index = line.toLowerCase().indexOf("click on");
        issues.push({
          id: `${lineIndex}-${index}-click`,
          line: lineIndex + 1,
          column: index,
          message: 'Use "Click" instead of "Click on"',
          rule: "Google.ClickOn",
          level: "warning",
          suggestion: "Click",
          explanation: "Google style guide prefers direct action verbs.",
        });
      }
    }

    if (styleGuide === "microsoft") {
      // Microsoft discourages "please"
      if (line.toLowerCase().includes("please")) {
        const index = line.toLowerCase().indexOf("please");
        issues.push({
          id: `${lineIndex}-${index}-please`,
          line: lineIndex + 1,
          column: index,
          message: 'Avoid using "please" in instructions',
          rule: "Microsoft.Please",
          level: "info",
          suggestion: "Remove 'please'",
          explanation: "Microsoft style guide considers instructions inherently polite.",
        });
      }
    }

    if (styleGuide === "redhat") {
      // Red Hat prefers "use" over "utilize"
      if (line.toLowerCase().includes("utilize")) {
        const index = line.toLowerCase().indexOf("utilize");
        issues.push({
          id: `${lineIndex}-${index}-utilize`,
          line: lineIndex + 1,
          column: index,
          message: 'Use "use" instead of "utilize"',
          rule: "RedHat.Utilize",
          level: "warning",
          suggestion: "use",
          explanation: "Prefer simple, common words over complex alternatives.",
        });
      }
    }

    // Check for long sentences (> 25 words)
    const words = line.trim().split(/\s+/);
    if (words.length > 25 && line.trim().length > 0) {
      issues.push({
        id: `${lineIndex}-long`,
        line: lineIndex + 1,
        column: 0,
        message: `Sentence may be too long (${words.length} words)`,
        rule: "Vale.Readability",
        level: "info",
        explanation: "Consider breaking long sentences into shorter ones for better readability.",
      });
    }
  });

  return issues;
};
