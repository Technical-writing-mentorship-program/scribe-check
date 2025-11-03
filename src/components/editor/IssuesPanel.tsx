import { useState } from "react";
import { LintIssue, IssueLevel } from "@/types/linting";
import { AlertCircle, AlertTriangle, Info, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface IssuesPanelProps {
  issues: LintIssue[];
}

const IssuesPanel = ({ issues }: IssuesPanelProps) => {
  const [filters, setFilters] = useState<Set<IssueLevel>>(new Set(["error", "warning", "info"]));

  const toggleFilter = (level: IssueLevel) => {
    const newFilters = new Set(filters);
    if (newFilters.has(level)) {
      newFilters.delete(level);
    } else {
      newFilters.add(level);
    }
    setFilters(newFilters);
  };

  const filteredIssues = issues.filter((issue) => filters.has(issue.level));

  const getIssueIcon = (level: IssueLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-accent" />;
    }
  };

  const getIssueBadgeVariant = (level: IssueLevel) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
    }
  };

  const errorCount = issues.filter((i) => i.level === "error").length;
  const warningCount = issues.filter((i) => i.level === "warning").length;
  const infoCount = issues.filter((i) => i.level === "info").length;

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-semibold text-card-foreground">Issues</h2>
          <div className="flex items-center space-x-2 text-xs">
            <Badge variant="destructive" className="px-2 py-0.5">
              {errorCount}
            </Badge>
            <Badge variant="default" className="px-2 py-0.5">
              {warningCount}
            </Badge>
            <Badge variant="secondary" className="px-2 py-0.5">
              {infoCount}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filters.has("error")}
              onCheckedChange={() => toggleFilter("error")}
            >
              Errors
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.has("warning")}
              onCheckedChange={() => toggleFilter("warning")}
            >
              Warnings
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.has("info")}
              onCheckedChange={() => toggleFilter("info")}
            >
              Info
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              {issues.length === 0
                ? "No issues found. Great work!"
                : "No issues match the current filters."}
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                {getIssueIcon(issue.level)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-card-foreground">{issue.message}</p>
                    <Badge variant={getIssueBadgeVariant(issue.level)} className="ml-2">
                      {issue.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Line {issue.line}</span>
                    <span>•</span>
                    <span className="font-mono">{issue.rule}</span>
                  </div>
                  {issue.suggestion && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="text-xs font-medium text-muted-foreground">Suggestion:</p>
                      <p className="text-xs text-foreground mt-1">{issue.suggestion}</p>
                    </div>
                  )}
                  {issue.explanation && (
                    <p className="text-xs text-muted-foreground mt-1">{issue.explanation}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesPanel;
