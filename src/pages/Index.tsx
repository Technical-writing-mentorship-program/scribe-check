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
import { LintIssue, StyleGuide } from "@/types/linting";
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
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [activeTab, setActiveTab] = useState("issues");

  // Lint on content or style guide change
  useEffect(() => {
    let isCancelled = false;
    
    const runLinting = async () => {
      if (content.trim()) {
        const newIssues = await lintMarkdown(content, styleGuide);
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
  }, [content, styleGuide]);

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
          <div className="container flex items-center justify-between h-14 px-4">
            <StyleGuideSelector value={styleGuide} onChange={setStyleGuide} />
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="default" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex-1 container px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left: Editor */}
            <div className="rounded-lg border border-editor-border overflow-hidden shadow-lg">
              <MarkdownEditor
                content={content}
                onChange={setContent}
                issues={issues}
                onFileUpload={handleFileUpload}
              />
            </div>

            {/* Right: Issues/Preview */}
            <div className="rounded-lg border border-border overflow-hidden shadow-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="issues" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Issues ({issues.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="issues" className="flex-1 m-0">
                  <IssuesPanel issues={issues} />
                </TabsContent>
                
                <TabsContent value="preview" className="flex-1 m-0 p-4">
                  <PreviewPanel content={content} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
