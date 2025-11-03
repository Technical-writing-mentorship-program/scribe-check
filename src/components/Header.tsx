import { Link, useLocation } from "react-router-dom";
import { FileText, BookOpen, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">MarkdownLint</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Editor</span>
          </Link>
          <Link
            to="/docs"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/docs" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Docs</span>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-4">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
