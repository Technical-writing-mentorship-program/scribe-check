import { useEffect, useRef, useState } from "react";
import { LintIssue, IssueLevel } from "@/types/linting";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  issues: LintIssue[];
  onFileUpload: (file: File) => void;
}

const MAX_WORDS = 1500;
const MAX_HEIGHT = 800; // Maximum height in pixels

const MarkdownEditor = ({ content, onChange, issues, onFileUpload }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
    }
  }, [content]);

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount(content);
  const isOverLimit = wordCount > MAX_WORDS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".md")) {
      onFileUpload(file);
    }
  };

  const handleContentChange = (newContent: string) => {
    const newWordCount = getWordCount(newContent);
    
    if (newWordCount > MAX_WORDS) {
      toast({
        title: "Word limit exceeded",
        description: `Maximum ${MAX_WORDS} words allowed. Current: ${newWordCount} words.`,
        variant: "destructive",
      });
      return;
    }
    
    onChange(newContent);
  };

  const getLineIssues = (lineNumber: number) => {
    return issues.filter((issue) => issue.line === lineNumber);
  };

  const lines = content.split("\n");

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-bg">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-editor-fg">Markdown Editor</h2>
          <span className={`text-xs ${isOverLimit ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            {wordCount} / {MAX_WORDS} words
          </span>
        </div>
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

      <div className="flex-1 bg-editor-bg">
        <div className="flex">
          {/* Editor with highlight overlay */}
          <div className="flex-1 relative">
            {/* Highlight overlay with badges - behind textarea */}
            <div className="absolute inset-0 p-4 pointer-events-none z-0">
              <div 
                className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
              >
                {lines.map((line, idx) => {
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
                    <div key={idx} className="relative">
                      {hasIssues && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`
                              inline-flex items-center justify-center 
                              w-6 h-6 rounded-full mr-3
                              bg-[hsl(var(--issue-highlight-border))]
                              text-xs font-bold
                              cursor-help
                              ${issueColor}
                            `}>
                              {idx + 1}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <div className="space-y-2">
                              {lineIssues.map((issue) => (
                                <div key={issue.id} className="text-sm">
                                  <p className="font-semibold">{issue.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Rule: {issue.rule}
                                  </p>
                                  {issue.suggestion && (
                                    <p className="text-xs mt-1">
                                      <span className="font-medium">Suggestion:</span> {issue.suggestion}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <span className="invisible">
                        {line || ' '}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actual textarea - on top, transparent bg */}
            <div className="relative z-10 p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full bg-transparent text-editor-fg resize-none focus:outline-none leading-relaxed font-mono text-sm pl-10 transition-[height] duration-200 ease-in-out overflow-hidden"
                style={{ minHeight: '400px' }}
                placeholder="Paste your Markdown here or upload a file..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default MarkdownEditor;
