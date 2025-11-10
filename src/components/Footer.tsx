import { Heart } from "lucide-react";

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
