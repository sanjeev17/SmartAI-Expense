import React from "react";

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // log to console for now — could be sent to analytics
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-xl w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred. You can reload the page to continue.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  // try a soft refresh — reloading the page
                  try {
                    window.location.reload();
                  } catch {
                    // fallback
                    window.location.href = "/";
                  }
                }}
                className="inline-flex items-center px-4 py-2 rounded bg-primary text-white"
              >
                Reload
              </button>
            </div>
            <details className="mt-4 text-left text-xs text-muted-foreground">
              <summary>Technical details</summary>
              <pre className="whitespace-pre-wrap">{this.state.error ? (this.state.error.stack || String(this.state.error)) : "No error details"}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
