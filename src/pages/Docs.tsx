import { Card } from "@/components/ui/card";
import { BookOpen, Code, FileText, Settings, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Docs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to use MarkdownLint to improve your documentation and maintain consistent style across your writing.
            </p>
          </div>

          {/* Getting Started */}
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Getting Started</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    MarkdownLint is a web-based tool that helps you write better technical documentation by checking your Markdown files against industry-standard style guides.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Select your preferred style guide from the dropdown</li>
                    <li>Upload a .md file or paste your text directly into the editor</li>
                    <li>Review issues in real-time as you type</li>
                    <li>Preview your corrected document before downloading</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>

          {/* Style Guides */}
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Style Guides</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Google Developer Style Guide</h3>
                    <p className="text-muted-foreground">
                      Emphasizes clarity, consistency, and accessibility. Prefers active voice, simple language, and direct instructions. Best for developer documentation and API references.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Microsoft Writing Style Guide</h3>
                    <p className="text-muted-foreground">
                      Focuses on warm, conversational tone while maintaining professionalism. Encourages inclusive language and user-focused writing. Ideal for user-facing documentation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Red Hat Style Guide</h3>
                    <p className="text-muted-foreground">
                      Prioritizes precision and clarity in technical writing. Emphasizes simplicity and avoiding jargon. Great for enterprise documentation and technical guides.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Custom Rules (Coming Soon)</h3>
                    <p className="text-muted-foreground">
                      Upload your own Vale configuration files (YAML or JSON) to enforce custom style rules specific to your organization or project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Common Rules */}
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Settings className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Common Rules</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Passive Voice Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies sentences using passive voice and suggests active voice alternatives for more direct communication.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Wordiness</h4>
                    <p className="text-sm text-muted-foreground">
                      Flags verbose phrases that can be replaced with simpler alternatives (e.g., "in order to" → "to").
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Readability</h4>
                    <p className="text-sm text-muted-foreground">
                      Checks sentence length and complexity to ensure your content is easy to read and understand.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Style-Specific Rules</h4>
                    <p className="text-sm text-muted-foreground">
                      Each style guide includes additional rules specific to that standard, such as preferred terminology and phrasing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Understanding Issues */}
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Understanding Issues</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">ERROR</span>
                    <p className="text-sm text-muted-foreground flex-1">
                      Critical issues that significantly impact clarity or violate important style rules. Should be addressed immediately.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-warning text-warning-foreground rounded">WARNING</span>
                    <p className="text-sm text-muted-foreground flex-1">
                      Important style violations that should be fixed but don't completely prevent understanding.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">INFO</span>
                    <p className="text-sm text-muted-foreground flex-1">
                      Suggestions for improvement. Consider these to enhance your writing quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Creating Custom Rules */}
          <Card className="p-8 bg-muted/50">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Creating Custom Rules (Coming Soon)</h2>
                <p className="text-muted-foreground mb-4">
                  Want to create your own style rules? Custom rule support will allow you to define organization-specific standards. Rules will be compatible with Vale configuration format:
                </p>
                <div className="bg-editor-bg text-editor-fg p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`extends: existence
message: "Use '%s' instead of '%s'"
level: warning
tokens:
  - utilize: use
  - leverage: use`}</pre>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;
