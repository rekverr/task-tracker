import { Component } from "react";
import type { ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-slate-500">
            Refresh the page to continue working.
          </p>
          <button className="btn mt-5" onClick={() => location.reload()}>
            Refresh page
          </button>
        </section>
      </main>
    );
  }
}
