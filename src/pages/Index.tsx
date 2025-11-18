import { useState, useEffect } from "react";
import { Download, Eye, FileText, Wand2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import IssuesPanel from "@/components/editor/IssuesPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import StyleGuideSelector from "@/components/editor/StyleGuideSelector";
import EnglishVariantSelector from "@/components/editor/EnglishVariantSelector";
import CustomRulesUpload from "@/components/editor/CustomRulesUpload";
import { LintIssue, StyleGuide, CustomRulesConfig, EnglishVariant } from "@/types/linting";
import { lintMarkdown } from "@/utils/realLinter";

const SAMPLE_TEXT = `# Getting Started with MarkdownLint

This tool was created for the purpose of helping you write better documentation. Please click on the style guide dropdown to select your preferred rules.

Due to the fact that passive voice was being used in many documents, we recommend that active voice is utilized instead.

At this point in time, you can upload your markdown files or paste text directly. In order to see issues, simply start typing.

## Features

- Real-time linting
- Multiple style guides
- Detailed explanations
- Export corrected files

Please ensure that you follow the guidelines provided by your chosen style guide.`;

const Index = () => {
  const [content, setContent] = useState(SAMPLE_TEXT);
  const [styleGuide, setStyleGuide] = useState<StyleGuide>("google");
  const [englishVariant, setEnglishVariant] = useState<EnglishVariant>("us");
  const [customConfig, setCustomConfig] = useState<CustomRulesConfig | undefined>(undefined);
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [activeTab, setActiveTab] = useState("issues");
  const [highlightedIssue, setHighlightedIssue] = useState<string | null>(null);
  const [showAutoFixDialog, setShowAutoFixDialog] = useState(false);
  const [autoFixCount, setAutoFixCount] = useState(0);

  // Lint on content, style guide, or custom rules change
  useEffect(() => {
    let isCancelled = false;
    
    const runLinting = async () => {
      if (content.trim()) {
        const newIssues = await lintMarkdown(content, styleGuide, customConfig, englishVariant);
        if (!isCancelled) {
          setIssues(newIssues);
        }
      } else {
        setIssues([]);
      }
    };

    runLinting();

    return () => {
      isCancelled = true;
    };
  }, [content, styleGuide, customConfig, englishVariant]);

  const handleCustomRulesLoaded = (config: CustomRulesConfig) => {
    setCustomConfig(config);
    setStyleGuide("custom");
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "corrected-document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const handleExportJSON = () => {
    const reportData = {
      exportDate: new Date().toISOString(),
      totalIssues: issues.length,
      errorCount: issues.filter(i => i.level === "error").length,
      warningCount: issues.filter(i => i.level === "warning").length,
      infoCount: issues.filter(i => i.level === "info").length,
      styleGuide,
      issues: issues.map(issue => ({
        line: issue.line,
        level: issue.level,
        rule: issue.rule,
        message: issue.message,
        suggestion: issue.suggestion || null,
        explanation: issue.explanation || null,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lint-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON report downloaded!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const lineHeight = 7;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Markdown Lint Report", margin, yPosition);
    yPosition += 15;

    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Style Guide: ${styleGuide}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Total Issues: ${issues.length}`, margin, yPosition);
    yPosition += lineHeight;

    const errorCount = issues.filter(i => i.level === "error").length;
    const warningCount = issues.filter(i => i.level === "warning").length;
    const infoCount = issues.filter(i => i.level === "info").length;

    doc.text(`Errors: ${errorCount} | Warnings: ${warningCount} | Info: ${infoCount}`, margin, yPosition);
    yPosition += 15;

    // Issues
    if (issues.length === 0) {
      doc.text("No issues found. Great work!", margin, yPosition);
    } else {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Issues", margin, yPosition);
      yPosition += 10;

      issues.forEach((issue, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        
        // Issue header
        const levelColor: [number, number, number] = issue.level === "error" ? [220, 38, 38] : 
                          issue.level === "warning" ? [234, 179, 8] : [59, 130, 246];
        doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
        doc.text(`${index + 1}. Line ${issue.line} - ${issue.level.toUpperCase()}`, margin, yPosition);
        yPosition += lineHeight;

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        
        // Rule
        doc.setFontSize(9);
        doc.text(`Rule: ${issue.rule}`, margin + 5, yPosition);
        yPosition += lineHeight;

        // Message
        const messageLines = doc.splitTextToSize(issue.message, pageWidth - 2 * margin - 5);
        messageLines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += lineHeight;
        });

        // Suggestion
        if (issue.suggestion) {
          doc.setFont("helvetica", "italic");
          doc.text("Suggestion:", margin + 5, yPosition);
          yPosition += lineHeight;
          const suggestionLines = doc.splitTextToSize(issue.suggestion, pageWidth - 2 * margin - 10);
          suggestionLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, margin + 10, yPosition);
            yPosition += lineHeight;
          });
          doc.setFont("helvetica", "normal");
        }

        yPosition += 5; // Space between issues
      });
    }

    doc.save(`lint-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF report downloaded!");
  };

  const handleIssueClick = (issueId: string) => {
    setHighlightedIssue(issueId);
    setTimeout(() => {
      setHighlightedIssue(null);
    }, 3000);
  };

  const handleAutoFixClick = () => {
    const fixableIssues = issues.filter(issue => issue.suggestion);
    
    if (fixableIssues.length === 0) {
      toast.error("No auto-fixable issues found");
      return;
    }
    
    setAutoFixCount(fixableIssues.length);
    setShowAutoFixDialog(true);
  };

  const handleAutoFixConfirm = () => {
    // Get all issues with suggestions, sorted by line number (descending)
    const fixableIssues = issues
      .filter(issue => issue.suggestion)
      .sort((a, b) => b.line - a.line);

    let updatedContent = content;
    const lines = updatedContent.split("\n");

    // Apply fixes from bottom to top to avoid line number shifts
    fixableIssues.forEach(issue => {
      if (issue.line > 0 && issue.line <= lines.length && issue.suggestion) {
        const currentLine = lines[issue.line - 1];
        
        // Try to extract the problematic word from the message
        const wordMatch = issue.message.match(/['`"]([^'`"]+)['`"]/);
        if (wordMatch) {
          const problematicWord = wordMatch[1];
          const firstSuggestion = issue.suggestion.split(',')[0].trim();
          
          // Replace the problematic word with the first suggestion
          lines[issue.line - 1] = currentLine.replace(
            new RegExp(`\\b${problematicWord}\\b`, 'gi'),
            firstSuggestion
          );
        } else {
          // Fallback: if we can't extract the word, use the full suggestion
          lines[issue.line - 1] = issue.suggestion;
        }
      }
    });

    updatedContent = lines.join("\n");
    setContent(updatedContent);
    setShowAutoFixDialog(false);
    toast.success(`Fixed ${fixableIssues.length} issue${fixableIssues.length > 1 ? 's' : ''}`);
  };

  const handleFixIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue || !issue.suggestion) return;

    const lines = content.split("\n");
    if (issue.line > 0 && issue.line <= lines.length) {
      const currentLine = lines[issue.line - 1];
      
      // Try to extract the problematic word from the message (e.g., "Unexpected 'regarding'" -> "regarding")
      const wordMatch = issue.message.match(/['`"]([^'`"]+)['`"]/);
      if (wordMatch) {
        const problematicWord = wordMatch[1];
        const firstSuggestion = issue.suggestion.split(',')[0].trim();
        
        // Replace the problematic word with the first suggestion
        const fixedLine = currentLine.replace(
          new RegExp(`\\b${problematicWord}\\b`, 'gi'),
          firstSuggestion
        );
        
        lines[issue.line - 1] = fixedLine;
      } else {
        // Fallback: if we can't extract the word, just replace the whole line
        lines[issue.line - 1] = issue.suggestion;
      }
      
      setContent(lines.join("\n"));
      toast.success("Issue fixed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="border-b border-border bg-card">
          <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 sm:py-0 px-3 md:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <StyleGuideSelector value={styleGuide} onChange={setStyleGuide} />
              <EnglishVariantSelector value={englishVariant} onChange={setEnglishVariant} />
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAutoFixClick}
                disabled={issues.filter(i => i.suggestion).length === 0}
                className="flex-1 sm:flex-none"
              >
                <Wand2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Auto-fix ({issues.filter(i => i.suggestion).length})</span>
                <span className="sm:hidden">Fix</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")} className="flex-1 sm:flex-none">
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <FileDown className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export Report</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default" size="sm" onClick={handleDownload} className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex-1 container px-3 md:px-4 py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            {/* Custom Rules Upload - Show when custom style guide is selected */}
            {styleGuide === "custom" && (
              <CustomRulesUpload 
                onRulesLoaded={handleCustomRulesLoaded}
                hasRules={!!customConfig}
                currentConfig={customConfig}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
              {/* Left: Editor */}
              <div className="rounded-lg border border-editor-border overflow-hidden shadow-lg min-h-[400px] lg:min-h-0">
                <MarkdownEditor
                  content={content}
                  onChange={setContent}
                  issues={issues}
                  onFileUpload={handleFileUpload}
                  highlightedIssueId={highlightedIssue}
                />
              </div>

              {/* Right: Issues/Preview */}
              <div className="rounded-lg border border-border overflow-hidden shadow-lg min-h-[400px] lg:min-h-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="issues" className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm">
                      <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>Issues ({issues.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm">
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="issues" className="flex-1 m-0">
                    <IssuesPanel 
                      issues={issues} 
                      onIssueClick={handleIssueClick}
                      onFixIssue={handleFixIssue}
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="flex-1 m-0 p-3 md:p-4">
                    <PreviewPanel content={content} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={showAutoFixDialog} onOpenChange={setShowAutoFixDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Auto-fix?</AlertDialogTitle>
            <AlertDialogDescription>
              This will automatically fix {autoFixCount} issue{autoFixCount > 1 ? 's' : ''} in your document. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAutoFixConfirm}>Apply Fixes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
