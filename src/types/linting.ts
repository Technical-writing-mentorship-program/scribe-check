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

export interface StyleGuideOption {
  value: StyleGuide;
  label: string;
  description: string;
}
