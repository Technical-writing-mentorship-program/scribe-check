import { EnglishVariant } from "@/types/linting";
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

interface EnglishVariantOption {
  value: EnglishVariant;
  label: string;
  description: string;
}

const englishVariants: EnglishVariantOption[] = [
  {
    value: "us",
    label: "US English",
    description: "American English spelling and conventions (color, organize, center)",
  },
  {
    value: "uk",
    label: "UK English",
    description: "British English spelling and conventions (colour, organise, centre)",
  },
  {
    value: "au",
    label: "Australian English",
    description: "Australian English spelling and conventions (similar to British with local variations)",
  },
  {
    value: "in",
    label: "Indian English",
    description: "Indian English spelling and conventions (British-influenced with local usage)",
  },
];

interface EnglishVariantSelectorProps {
  value: EnglishVariant;
  onChange: (value: EnglishVariant) => void;
}

const EnglishVariantSelector = ({ value, onChange }: EnglishVariantSelectorProps) => {
  const selectedVariant = englishVariants.find((v) => v.value === value);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="english-variant" className="text-sm font-medium text-foreground">
        English Variant
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as EnglishVariant)}>
        <SelectTrigger id="english-variant" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {englishVariants.map((variant) => (
            <SelectItem key={variant.value} value={variant.value}>
              <div className="flex items-center justify-between w-full">
                <span>{variant.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">{variant.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedVariant && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">{selectedVariant.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default EnglishVariantSelector;
