import React, { Component } from 'react';
import { X } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-50 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Application Error</h2>
          <p className="text-zinc-600 mb-6 max-w-md">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-orange-200"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
