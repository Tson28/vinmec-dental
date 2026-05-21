import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-surface-50 flex items-center justify-center p-8", children: _jsxs("div", { className: "card max-w-md text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "font-display font-bold text-xl text-surface-900 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-surface-500 mb-4", children: this.state.error?.message || 'An unexpected error occurred' }), _jsx("button", { onClick: () => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }, className: "btn-primary", children: "Go to Dashboard" })] }) }));
        }
        return this.props.children;
    }
}
