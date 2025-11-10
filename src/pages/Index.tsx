import { useState, useEffect } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import IssuesPanel from "@/components/editor/IssuesPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import StyleGuideSelector from "@/components/editor/StyleGuideSelector";
import CustomRulesUpload from "@/components/editor/CustomRulesUpload";
import { LintIssue, StyleGuide, CustomRulesConfig } from "@/types/linting";
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
  const [customConfig, setCustomConfig] = useState<CustomRulesConfig | undefined>(undefined);
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [activeTab, setActiveTab] = useState("issues");

  // Lint on content, style guide, or custom rules change
  useEffect(() => {
    let isCancelled = false;
    
    const runLinting = async () => {
      if (content.trim()) {
        const newIssues = await lintMarkdown(content, styleGuide, customConfig);
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
  }, [content, styleGuide, customConfig]);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border bg-card">
          <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 sm:h-14 sm:py-0 px-3 md:px-4">
            <StyleGuideSelector value={styleGuide} onChange={setStyleGuide} />
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")} className="flex-1 sm:flex-none">
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
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
                    <IssuesPanel issues={issues} />
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
    </div>
  );
};

export default Index;
