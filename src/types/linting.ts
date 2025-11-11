export type IssueLevel = "error" | "warning" | "info";

export interface LintIssue {
  id: string;
  line: number;
  column: number;
  message: string;
  rule: string;
  level: IssueLevel;
  suggestion?: string;
  explanation?: string;
}

export type StyleGuide = "google" | "microsoft" | "redhat" | "custom";

export type EnglishVariant = "us" | "uk" | "au" | "in";

export interface StyleGuideOption {
  value: StyleGuide;
  label: string;
  description: string;
}

export interface CustomRule {
  name: string;
  pattern?: string;
  message: string;
  level?: IssueLevel;
  suggestion?: string;
  ignoreWords?: string[];
  maxReadabilityAge?: number;
}

export interface CustomRulesConfig {
  baseStyleGuide: Exclude<StyleGuide, "custom">;
  rules: CustomRule[];
}
