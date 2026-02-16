export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-8 mt-16">
      <div className="flex flex-col items-center gap-2 text-sm text-foreground/50">
        <div className="flex gap-4">
          <a
            href="https://github.com/reselling"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mario-barraza/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:owner@mariobarraza.com"
            className="hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
