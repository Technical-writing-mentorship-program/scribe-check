import { useRef } from "react";
import { Upload, FileJson, FileCode, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomRulesConfig } from "@/types/linting";
import yaml from "js-yaml";
import { toast } from "sonner";

interface CustomRulesUploadProps {
  onRulesLoaded: (config: CustomRulesConfig) => void;
  hasRules: boolean;
}

const CustomRulesUpload = ({ onRulesLoaded, hasRules }: CustomRulesUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isYaml = file.name.endsWith(".yml") || file.name.endsWith(".yaml");
    const isJson = file.name.endsWith(".json");

    if (!isYaml && !isJson) {
      toast.error("Invalid file type. Please upload a YAML or JSON file.");
      return;
    }

    try {
      const text = await file.text();
      let config: CustomRulesConfig;

      if (isYaml) {
        config = yaml.load(text) as CustomRulesConfig;
      } else {
        config = JSON.parse(text);
      }

      // Validate the config structure
      if (!config.baseStyleGuide || !config.rules || !Array.isArray(config.rules)) {
        throw new Error("Invalid config structure. Must include baseStyleGuide and rules array.");
      }

      if (!["google", "microsoft", "redhat"].includes(config.baseStyleGuide)) {
        throw new Error("baseStyleGuide must be 'google', 'microsoft', or 'redhat'.");
      }

      onRulesLoaded(config);
      toast.success(`Custom rules loaded! Using ${config.baseStyleGuide} as base with ${config.rules.length} custom rules.`);
    } catch (error) {
      console.error("Error parsing custom rules:", error);
      toast.error(`Failed to load custom rules: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <FileCode className="h-5 w-5" />
          Custom Rules Configuration
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Upload a YAML or JSON file to define your custom linting rules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasRules && (
          <Alert className="bg-success/10 border-success/20">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-xs md:text-sm">
              Custom rules active! Upload a new file to replace them.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".yml,.yaml,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="default"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Rules File
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileJson className="h-4 w-4" />
            <span>.yml, .yaml, .json</span>
          </div>
        </div>

        <div className="space-y-3 text-xs md:text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-medium">Configuration Format:</p>
              <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                <pre>{`{
  "baseStyleGuide": "google",
  "rules": [
    {
      "name": "no-lorem",
      "pattern": "lorem ipsum",
      "message": "Replace placeholder text",
      "level": "warning",
      "suggestion": "Use real content"
    }
  ]
}`}</pre>
              </div>
            </div>
          </div>

          <div className="space-y-2 pl-6 text-muted-foreground">
            <p><strong className="text-foreground">baseStyleGuide:</strong> Choose 'google', 'microsoft', or 'redhat' as your foundation</p>
            <p><strong className="text-foreground">rules:</strong> Array of custom rules to add</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">name:</strong> Rule identifier (required)</li>
              <li><strong className="text-foreground">pattern:</strong> Text pattern to match (optional, regex supported)</li>
              <li><strong className="text-foreground">message:</strong> Error message to display (required)</li>
              <li><strong className="text-foreground">level:</strong> 'error', 'warning', or 'info' (default: 'warning')</li>
              <li><strong className="text-foreground">suggestion:</strong> Suggested fix (optional)</li>
              <li><strong className="text-foreground">ignoreWords:</strong> Words to ignore in base checks (optional)</li>
              <li><strong className="text-foreground">maxReadabilityAge:</strong> Target reading age (12-18, optional)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomRulesUpload;
