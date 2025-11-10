import { Heart, Linkedin, Globe, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by
            <a
              href="https://wisdom-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors hover-scale"
            >
              Wisdom Nwokocha
            </a>
          </span>
          
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/joklinztech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
              <span className="font-medium">LinkedIn</span>
            </a>
            <span className="text-border">•</span>
            <a
              href="https://twitter.com/Joklinztech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
              aria-label="Twitter Profile"
            >
              <Twitter className="h-5 w-5" />
              <span className="font-medium">Twitter</span>
            </a>
            <span className="text-border">•</span>
            <a
              href="https://github.com/wise4rmgod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">GitHub</span>
            </a>
            <span className="text-border">•</span>
            <a
              href="https://wisdom-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover-scale"
              aria-label="Portfolio Website"
            >
              <Globe className="h-5 w-5" />
              <span className="font-medium">Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
