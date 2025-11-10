import { Heart, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://wisdom-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
            >
              <Globe className="h-4 w-4" />
              Wisdom Nwokocha
            </a>
            <span className="text-border">|</span>
            <a
              href="https://www.linkedin.com/in/joklinztech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
