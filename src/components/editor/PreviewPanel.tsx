import { Card } from "@/components/ui/card";

interface PreviewPanelProps {
  content: string;
}

const PreviewPanel = ({ content }: PreviewPanelProps) => {
  // Simple markdown-like preview (basic rendering)
  const renderMarkdown = (text: string) => {
    return text
      .split("\n")
      .map((line, idx) => {
        // Headers
        if (line.startsWith("# ")) {
          return <h1 key={idx} className="text-3xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith("## ")) {
          return <h2 key={idx} className="text-2xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith("### ")) {
          return <h3 key={idx} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        
        // Bold and italic
        let processedLine = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/`(.+?)`/g, "<code class='bg-muted px-1 py-0.5 rounded text-sm font-mono'>$1</code>");

        // Empty lines
        if (line.trim() === "") {
          return <br key={idx} />;
        }

        return (
          <p key={idx} className="mb-3" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      });
  };

  return (
    <Card className="h-full overflow-auto p-6">
      <div className="prose prose-sm max-w-none">
        {content ? (
          renderMarkdown(content)
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">Start typing to see preview...</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PreviewPanel;
