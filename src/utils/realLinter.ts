import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkLint from 'remark-lint';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkRetext from 'remark-retext';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextSimplify from 'retext-simplify';
import retextReadability from 'retext-readability';
import retextPassive from 'retext-passive';
import { VFile } from 'vfile';
import { LintIssue, StyleGuide, CustomRulesConfig, CustomRule } from '@/types/linting';

// Map VFile message severity to our IssueLevel
const mapSeverity = (fatal?: boolean | null, message?: string): 'error' | 'warning' | 'info' => {
  if (fatal) return 'error';
  if (message?.includes('suggestion') || message?.includes('consider')) return 'info';
  return 'warning';
};

// Create processor for Google style guide (emphasis on clarity and simplicity)
const createGoogleProcessor = () => {
  const retextProcessor = unified()
    .use(retextEnglish)
    .use(retextPassive)
    .use(retextSimplify, { 
      ignore: ['advanced', 'function', 'interface', 'method'] // Keep technical terms
    })
    .use(retextReadability, { age: 14 }) // Google emphasizes readability
    .use(retextEquality, {
      ignore: ['master', 'slave'] // Allow technical terms in context
    });

  return unified()
    .use(remarkParse)
    .use(remarkLint)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkRetext, retextProcessor);
};

// Create processor for Microsoft style guide (technical writing focus)
const createMicrosoftProcessor = () => {
  const retextProcessor = unified()
    .use(retextEnglish)
    .use(retextPassive)
    .use(retextSimplify, {
      ignore: ['function', 'interface', 'implement', 'utilize', 'component']
    })
    .use(retextReadability, { age: 16 })
    .use(retextEquality);

  return unified()
    .use(remarkParse)
    .use(remarkLint)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkRetext, retextProcessor);
};

// Create processor for Red Hat style guide (open source documentation)
const createRedHatProcessor = () => {
  const retextProcessor = unified()
    .use(retextEnglish)
    .use(retextPassive)
    .use(retextSimplify, {
      ignore: ['interface', 'implement', 'function', 'modify']
    })
    .use(retextReadability, { age: 15 })
    .use(retextEquality);

  return unified()
    .use(remarkParse)
    .use(remarkLint)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintMarkdownStyleGuide)
    .use(remarkRetext, retextProcessor);
};

// Create processor for custom/general style guide
const createCustomProcessor = () => {
  const retextProcessor = unified()
    .use(retextEnglish)
    .use(retextPassive)
    .use(retextSimplify)
    .use(retextReadability, { age: 14 })
    .use(retextEquality);

  return unified()
    .use(remarkParse)
    .use(remarkLint)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkRetext, retextProcessor);
};

// Get the appropriate processor based on style guide
const getProcessor = (styleGuide: StyleGuide) => {
  switch (styleGuide) {
    case 'google':
      return createGoogleProcessor();
    case 'microsoft':
      return createMicrosoftProcessor();
    case 'redhat':
      return createRedHatProcessor();
    case 'custom':
    default:
      return createCustomProcessor();
  }
};

// Explain common rules
const explainRule = (ruleId: string): string => {
  const explanations: Record<string, string> = {
    // Remark rules
    'remark-lint:no-duplicate-headings': 'Duplicate headings can confuse readers and navigation tools.',
    'remark-lint:no-heading-punctuation': 'Headings should not end with punctuation like periods or colons.',
    'remark-lint:list-item-indent': 'Consistent list indentation improves readability.',
    'remark-lint:no-undefined-references': 'All reference-style links must be defined.',
    'remark-lint:no-unused-definitions': 'Remove unused link definitions to keep markdown clean.',
    
    // Retext rules
    'retext-passive': 'Active voice is more direct and engaging than passive voice.',
    'retext-simplify': 'Simpler words improve clarity and accessibility.',
    'retext-readability': 'Complex sentences may be difficult for readers to understand.',
    'retext-equality': 'Use inclusive language that respects all people.',
    
    // Default
    'default': 'This issue may affect readability or style consistency.'
  };

  return explanations[ruleId] || explanations['default'];
};

// Apply custom rules to text
const applyCustomRules = (text: string, rules: CustomRule[]): LintIssue[] => {
  const issues: LintIssue[] = [];
  const lines = text.split('\n');

  rules.forEach((rule) => {
    if (!rule.pattern) return;

    lines.forEach((line, lineIndex) => {
      try {
        const regex = new RegExp(rule.pattern, 'gi');
        let match;

        while ((match = regex.exec(line)) !== null) {
          issues.push({
            id: `custom-${rule.name}-${lineIndex}-${match.index}`,
            line: lineIndex + 1,
            column: match.index + 1,
            message: rule.message,
            rule: `custom:${rule.name}`,
            level: rule.level || 'warning',
            suggestion: rule.suggestion,
            explanation: `Custom rule: ${rule.name}`,
          });
        }
      } catch (error) {
        console.error(`Error in custom rule "${rule.name}":`, error);
      }
    });
  });

  return issues;
};

// Main linting function
export const lintMarkdown = async (
  text: string,
  styleGuide: StyleGuide,
  customConfig?: CustomRulesConfig
): Promise<LintIssue[]> => {
  // Use base style guide from custom config if provided
  const effectiveStyleGuide = customConfig?.baseStyleGuide || styleGuide;
  const processor = getProcessor(effectiveStyleGuide === 'custom' ? 'google' : effectiveStyleGuide);
  const vfile = new VFile({ value: text, path: 'document.md' });

  try {
    const tree = processor.parse(vfile);
    await processor.run(tree, vfile);
  } catch (error) {
    console.error('Linting error:', error);
  }

  // Convert VFile messages to LintIssue format
  const issues: LintIssue[] = vfile.messages.map((message, index) => {
    const line = message.line ?? 1;
    const column = message.column ?? 0;
    const ruleId = message.ruleId || message.source || 'unknown';
    
    return {
      id: `${line}-${column}-${ruleId}-${index}`,
      line,
      column,
      message: message.reason,
      rule: ruleId,
      level: mapSeverity(message.fatal, message.reason),
      suggestion: message.expected?.join(', '),
      explanation: explainRule(ruleId),
    };
  });

  // Apply custom rules if provided
  if (customConfig?.rules) {
    const customIssues = applyCustomRules(text, customConfig.rules);
    issues.push(...customIssues);
  }

  // Sort issues by line, then column
  return issues.sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line;
    return a.column - b.column;
  });
};
