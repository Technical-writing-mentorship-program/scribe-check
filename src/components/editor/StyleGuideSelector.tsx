import { StyleGuide, StyleGuideOption } from "@/types/linting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const styleGuides: StyleGuideOption[] = [
  {
    value: "google",
    label: "Google Developer",
    description: "Google's developer documentation style guide - clear, consistent, accessible",
  },
  {
    value: "microsoft",
    label: "Microsoft Writing",
    description: "Microsoft's style guide - warm, conversational, and inclusive",
  },
  {
    value: "redhat",
    label: "Red Hat",
    description: "Red Hat's documentation style guide - open, helpful, and precise",
  },
  {
    value: "custom",
    label: "Custom Rules",
    description: "Upload your own style guide configuration (coming soon)",
  },
];

interface StyleGuideSelectorProps {
  value: StyleGuide;
  onChange: (value: StyleGuide) => void;
}

const StyleGuideSelector = ({ value, onChange }: StyleGuideSelectorProps) => {
  const selectedGuide = styleGuides.find((g) => g.value === value);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="style-guide" className="text-sm font-medium text-foreground">
        Style Guide
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as StyleGuide)}>
        <SelectTrigger id="style-guide" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {styleGuides.map((guide) => (
            <SelectItem key={guide.value} value={guide.value} disabled={guide.value === "custom"}>
              <div className="flex items-center justify-between w-full">
                <span>{guide.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">{guide.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedGuide && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">{selectedGuide.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default StyleGuideSelector;
