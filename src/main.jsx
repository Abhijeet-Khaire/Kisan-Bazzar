import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Import App - if this import fails, the script dies here.
import App from "./App";

console.log("Debug: App module imported successfully");

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red', border: '2px solid red', margin: 20 }}>
                    <h1>Something went wrong in the App component.</h1>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    console.log("Debug: Attempting to render App via ErrorBoundary");
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
