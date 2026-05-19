import { Component } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="glass-card rounded-[20px] p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h2 className="heading-sm mb-2">Something went wrong</h2>
            <p className="text-[var(--color-text-muted)] text-sm font-mono mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()}
                className="btn btn-secondary text-xs gap-1.5"
              ><RefreshCw size={13} /> Reload</button>
              <Link to="/" onClick={() => this.setState({ hasError: false, error: null })}
                className="btn btn-primary text-xs gap-1.5"
              ><Home size={13} /> Home</Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
