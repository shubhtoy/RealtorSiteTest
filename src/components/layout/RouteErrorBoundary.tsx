import { Component } from "react";
import { Button } from "@/components/ui/button";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("RouteErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex w-[min(1140px,92vw)] flex-col items-center justify-center gap-4 py-24 text-center">
          <h1 className="font-display text-2xl tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. Please try
            again or navigate to a different page.
          </p>
          <Button variant="default" size="lg" onClick={this.handleRetry}>
            Retry
          </Button>
        </main>
      );
    }

    return this.props.children;
  }
}
