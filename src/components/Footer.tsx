import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <p className="text-xs text-muted-foreground text-center mb-4">
          This information is for reference purposes only and does not constitute legal advice.
          Always verify with your local municipality before beginning any project.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>·</span>
          <a href="mailto:support@towncenter.io" className="hover:text-foreground transition-colors">support@towncenter.io</a>
        </div>
        <p className="text-xs text-muted-foreground text-center">© 2026 TownCenter. All rights reserved.</p>
      </div>
    </footer>
  );
}
