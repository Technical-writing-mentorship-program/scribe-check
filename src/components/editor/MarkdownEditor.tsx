import { useEffect, useRef, useState } from "react";
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
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Sync scroll between textarea and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

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

      <div className="flex-1 overflow-hidden bg-editor-bg">
        <div className="flex h-full">
          {/* Line numbers */}
          <div 
            ref={lineNumbersRef}
            className="overflow-hidden bg-editor-bg/50 border-r border-editor-border px-3 py-4"
            style={{ userSelect: 'none' }}
          >
            <div className="font-mono text-sm leading-relaxed text-muted-foreground">
              {lines.map((_, idx) => {
                const lineIssues = getLineIssues(idx + 1);
                const hasIssues = lineIssues.length > 0;
                
                let issueColor = "";
                if (hasIssues) {
                  const highestLevel: IssueLevel = lineIssues.reduce<IssueLevel>((prev, curr) => {
                    if (curr.level === "error") return "error";
                    if (prev === "error") return prev;
                    if (curr.level === "warning") return "warning";
                    return prev;
                  }, "info");
                  
                  issueColor = highestLevel === "error" 
                    ? "text-issue-error" 
                    : highestLevel === "warning" 
                    ? "text-issue-warning" 
                    : "text-issue-info";
                }
                
                return (
                  <div
                    key={idx}
                    className={`text-right pr-2 ${hasIssues ? `font-semibold ${issueColor}` : ''}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Editor */}
          <div className="flex-1 overflow-auto p-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleScroll}
              className="w-full min-h-[500px] bg-transparent text-editor-fg resize-none focus:outline-none leading-relaxed font-mono text-sm"
              placeholder="Paste your Markdown here or upload a file..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
