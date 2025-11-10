import { useEffect, useRef, useState } from "react";
import { LintIssue, IssueLevel } from "@/types/linting";
import { Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { calculateReadabilityScore, getReadabilityLabel } from "@/utils/readability";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  issues: LintIssue[];
  onFileUpload: (file: File) => void;
  highlightedIssueId?: string | null;
}

const MAX_WORDS = 1500;

const MarkdownEditor = ({ content, onChange, issues, onFileUpload, highlightedIssueId }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const { toast } = useToast();

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount(content);
  const isOverLimit = wordCount > MAX_WORDS;
  const readabilityScore = calculateReadabilityScore(content);
  const readabilityInfo = getReadabilityLabel(readabilityScore);

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

  const highlightedIssue = highlightedIssueId 
    ? issues.find(issue => issue.id === highlightedIssueId)
    : null;

  // Scroll to highlighted issue
  useEffect(() => {
    if (highlightedIssue && textareaRef.current) {
      const lines = content.split("\n");
      const lineHeight = 24; // approximate line height
      const scrollTarget = (highlightedIssue.line - 1) * lineHeight;
      textareaRef.current.scrollTop = scrollTarget;
    }
  }, [highlightedIssue, content]);

  const lines = content.split("\n");

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 md:p-4 border-b border-editor-border bg-editor-bg">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <h2 className="text-xs md:text-sm font-semibold text-editor-fg">Markdown Editor</h2>
          <span className={`text-xs ${isOverLimit ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            {wordCount} / {MAX_WORDS} words
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 md:gap-1.5 text-xs hover:opacity-80 transition-opacity">
                <span className="text-muted-foreground hidden sm:inline">Readability:</span>
                <span className="text-muted-foreground sm:hidden">Read:</span>
                <span className={`font-semibold ${readabilityInfo.color}`}>
                  {readabilityScore}
                </span>
                <Info className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Score: {readabilityScore} - {readabilityInfo.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">{readabilityInfo.description}</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="font-medium">Score ranges:</p>
                  <div className="space-y-0.5">
                    <p><span className="font-medium">90-100:</span> Very easy</p>
                    <p><span className="font-medium">80-89:</span> Easy</p>
                    <p><span className="font-medium">70-79:</span> Fairly easy</p>
                    <p><span className="font-medium">60-69:</span> Standard</p>
                    <p><span className="font-medium">50-59:</span> Fairly difficult</p>
                    <p><span className="font-medium">30-49:</span> Difficult</p>
                    <p><span className="font-medium">0-29:</span> Very difficult</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
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
            className="bg-secondary hover:bg-secondary/80 flex-1 sm:flex-none text-xs"
          >
            <Upload className="h-3.5 w-3.5 md:h-4 md:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Upload .md</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-editor-bg">
        <div className="flex">
          {/* Editor with highlight overlay */}
          <div className="flex-1 relative">
            {/* Highlight overlay with badges - behind textarea */}
            <div className="absolute inset-0 p-4 pointer-events-none overflow-hidden z-0">
              <div 
                className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ transform: `translateY(-${scrollTop}px)` }}
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
                  
                  const isHighlighted = lineIssues.some(issue => issue.id === highlightedIssueId);
                  
                  return (
                    <div key={idx} className="relative">
                      {hasIssues && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`
                              inline-flex items-center justify-center 
                              w-6 h-6 rounded-full mr-3
                              ${isHighlighted 
                                ? 'bg-primary animate-pulse' 
                                : 'bg-[hsl(var(--issue-highlight-border))]'
                              }
                              text-xs font-bold
                              cursor-help
                              ${issueColor}
                              transition-all duration-300
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
            <div className="relative z-10 p-3 md:p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onScroll={handleScroll}
                className="w-full min-h-[300px] md:min-h-[400px] bg-transparent text-editor-fg resize-none focus:outline-none leading-relaxed font-mono text-xs md:text-sm pl-8 md:pl-10"
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
