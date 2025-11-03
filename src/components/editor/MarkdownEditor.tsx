import { useEffect, useRef } from "react";
import { LintIssue, IssueLevel } from "@/types/linting";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  issues: LintIssue[];
  onFileUpload: (file: File) => void;
}

const MarkdownEditor = ({ content, onChange, issues, onFileUpload }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".md")) {
      onFileUpload(file);
    }
  };

  const getLineIssues = (lineNumber: number) => {
    return issues.filter((issue) => issue.line === lineNumber);
  };

  const lines = content.split("\n");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-bg">
        <h2 className="text-sm font-semibold text-editor-fg">Markdown Editor</h2>
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-secondary hover:bg-secondary/80"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload .md
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-editor-bg p-4">
        <div className="relative font-mono text-sm">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[500px] bg-transparent text-editor-fg resize-none focus:outline-none leading-relaxed"
            placeholder="Paste your Markdown here or upload a file..."
            spellCheck={false}
          />
          
          {/* Issue markers overlay */}
          <div className="absolute top-0 left-0 w-full pointer-events-none">
            {lines.map((line, idx) => {
              const lineIssues = getLineIssues(idx + 1);
              if (lineIssues.length === 0) return null;

              const highestLevel: IssueLevel = lineIssues.reduce<IssueLevel>((prev, curr) => {
                if (curr.level === "error") return "error";
                if (prev === "error") return prev;
                if (curr.level === "warning") return "warning";
                return prev;
              }, "info");

              return (
                <div
                  key={idx}
                  className={`h-[1.5rem] border-l-4 ${
                    highestLevel === "error"
                      ? "border-issue-error"
                      : highestLevel === "warning"
                      ? "border-issue-warning"
                      : "border-issue-info"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
