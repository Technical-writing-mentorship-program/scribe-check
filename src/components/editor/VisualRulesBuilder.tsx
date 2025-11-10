import { useState } from "react";
import { Plus, Trash2, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CustomRule, CustomRulesConfig, IssueLevel } from "@/types/linting";
import { toast } from "sonner";

interface VisualRulesBuilderProps {
  onSave: (config: CustomRulesConfig) => void;
  initialConfig?: CustomRulesConfig;
}

const SAMPLE_CONFIG: CustomRulesConfig = {
  baseStyleGuide: "google",
  rules: [
    {
      name: "no-lorem-ipsum",
      pattern: "lorem ipsum",
      message: "Replace placeholder 'Lorem Ipsum' text with actual content",
      level: "warning",
      suggestion: "Use real, meaningful content instead of placeholder text"
    },
    {
      name: "avoid-very",
      pattern: "\\bvery\\b",
      message: "Avoid using 'very' - use stronger adjectives instead",
      level: "info",
      suggestion: "Replace with more descriptive words (e.g., 'very good' → 'excellent')"
    },
    {
      name: "check-todo",
      pattern: "TODO|FIXME|XXX",
      message: "TODO/FIXME comment found - resolve before publishing",
      level: "error",
      suggestion: "Complete the task or remove the TODO comment"
    }
  ]
};

const emptyRule: CustomRule = {
  name: "",
  pattern: "",
  message: "",
  level: "warning",
  suggestion: ""
};

const VisualRulesBuilder = ({ onSave, initialConfig }: VisualRulesBuilderProps) => {
  const [baseStyleGuide, setBaseStyleGuide] = useState<"google" | "microsoft" | "redhat">(
    initialConfig?.baseStyleGuide || "google"
  );
  const [rules, setRules] = useState<CustomRule[]>(
    initialConfig?.rules.length ? initialConfig.rules : [{ ...emptyRule }]
  );

  const addRule = () => {
    setRules([...rules, { ...emptyRule }]);
  };

  const removeRule = (index: number) => {
    if (rules.length === 1) {
      toast.error("You must have at least one rule");
      return;
    }
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof CustomRule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const validateAndSave = () => {
    // Validate rules
    const errors: string[] = [];
    
    rules.forEach((rule, index) => {
      if (!rule.name.trim()) {
        errors.push(`Rule ${index + 1}: Name is required`);
      }
      if (!rule.message.trim()) {
        errors.push(`Rule ${index + 1}: Message is required`);
      }
    });

    if (errors.length > 0) {
      toast.error("Validation failed", {
        description: errors.join("; ")
      });
      return;
    }

    const config: CustomRulesConfig = {
      baseStyleGuide,
      rules: rules.filter(rule => rule.name.trim() && rule.message.trim())
    };

    onSave(config);
    toast.success(`Custom rules saved! ${config.rules.length} rules active.`);
  };

  const downloadTemplate = () => {
    const json = JSON.stringify(SAMPLE_CONFIG, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-rules-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const loadTemplate = () => {
    setBaseStyleGuide(SAMPLE_CONFIG.baseStyleGuide);
    setRules([...SAMPLE_CONFIG.rules]);
    toast.success("Sample template loaded!");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button onClick={loadTemplate} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Download className="h-4 w-4 mr-2" />
          Load Sample
        </Button>
        <Button onClick={downloadTemplate} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
        <Button onClick={validateAndSave} variant="default" size="sm" className="flex-1 sm:flex-none">
          <Save className="h-4 w-4 mr-2" />
          Save Rules
        </Button>
      </div>

      {/* Base Style Guide Selection */}
      <Card className="border-primary/20">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="base-guide" className="text-sm font-medium">
              Base Style Guide
            </Label>
            <Select
              value={baseStyleGuide}
              onValueChange={(value) => setBaseStyleGuide(value as "google" | "microsoft" | "redhat")}
            >
              <SelectTrigger id="base-guide">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Developer</SelectItem>
                <SelectItem value="microsoft">Microsoft Writing</SelectItem>
                <SelectItem value="redhat">Red Hat</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Your custom rules will extend this base style guide
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Custom Rules ({rules.length})</h3>
          <Button onClick={addRule} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </Button>
        </div>

        {rules.map((rule, index) => (
          <Card key={index} className="border-muted animate-scale-in">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-muted-foreground">Rule {index + 1}</h4>
                {rules.length > 1 && (
                  <Button
                    onClick={() => removeRule(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor={`rule-name-${index}`} className="text-xs">
                    Rule Name *
                  </Label>
                  <Input
                    id={`rule-name-${index}`}
                    placeholder="e.g., no-lorem-ipsum"
                    value={rule.name}
                    onChange={(e) => updateRule(index, "name", e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label htmlFor={`rule-level-${index}`} className="text-xs">
                    Severity Level
                  </Label>
                  <Select
                    value={rule.level || "warning"}
                    onValueChange={(value) => updateRule(index, "level", value)}
                  >
                    <SelectTrigger id={`rule-level-${index}`} className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pattern */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`rule-pattern-${index}`} className="text-xs">
                    Pattern (RegEx supported)
                  </Label>
                  <Input
                    id={`rule-pattern-${index}`}
                    placeholder="e.g., lorem ipsum or \\bvery\\b"
                    value={rule.pattern || ""}
                    onChange={(e) => updateRule(index, "pattern", e.target.value)}
                    className="text-sm font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Text pattern to match. Leave empty for style-only rules.
                  </p>
                </div>

                {/* Message */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`rule-message-${index}`} className="text-xs">
                    Error Message *
                  </Label>
                  <Textarea
                    id={`rule-message-${index}`}
                    placeholder="Describe what's wrong and why it matters"
                    value={rule.message}
                    onChange={(e) => updateRule(index, "message", e.target.value)}
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>

                {/* Suggestion */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`rule-suggestion-${index}`} className="text-xs">
                    Suggestion (Optional)
                  </Label>
                  <Textarea
                    id={`rule-suggestion-${index}`}
                    placeholder="Provide a helpful fix or alternative"
                    value={rule.suggestion || ""}
                    onChange={(e) => updateRule(index, "suggestion", e.target.value)}
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-2">
        <Button onClick={validateAndSave} variant="default" className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save {rules.length} Rule{rules.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
};

export default VisualRulesBuilder;
