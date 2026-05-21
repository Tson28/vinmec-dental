import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await authApi.login(email, password);
            const { token, role, user } = res.data.data;
            login(token, role, user);
            if (role === "admin")
                navigate("/admin");
            else if (role === "doctor")
                navigate("/doctor");
            else
                navigate("/patient");
        }
        catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-dental-900 via-dental-800 to-mint-900 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [...Array(8)].map((_, i) => (_jsx("div", { className: "absolute w-64 h-64 rounded-full border border-white/5", style: {
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: "translate(-50%,-50%)",
                    } }, i))) }), _jsxs("div", { className: "w-full max-w-md animate-slide-up", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 items-center justify-center text-white text-3xl mb-4", children: "\uD83E\uDDB7" }), _jsx("h1", { className: "font-display font-bold text-3xl text-white", children: "VinaMec" }), _jsx("p", { className: "text-dental-200 text-sm mt-1", children: "Dental Care AI System" })] }), _jsxs("div", { className: "bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8", children: [_jsx("h2", { className: "font-display font-bold text-2xl text-surface-900 mb-1", children: "Welcome back" }), _jsx("p", { className: "text-surface-500 text-sm mb-6", children: "Sign in to your account to continue" }), error && (_jsxs("div", { className: "mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600", children: ["\u26A0\uFE0F ", error] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Email address" }), _jsx("input", { type: "email", className: "input", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Password" }), _jsx("input", { type: "password", className: "input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx("button", { type: "submit", className: "btn-primary w-full mt-2", disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Signing in..."] })) : ("Sign In") })] }), _jsx("div", { className: "mt-6 text-center space-y-2", children: _jsxs("p", { className: "text-sm text-surface-500", children: ["Don't have an account?", " ", _jsx(Link, { to: "/register", className: "text-dental-600 font-semibold hover:text-dental-700", children: "Register" })] }) }), _jsxs("div", { className: "mt-6 p-4 bg-surface-50 rounded-xl", children: [_jsx("p", { className: "text-xs font-bold text-surface-500 uppercase tracking-wider mb-2", children: "Demo Accounts" }), _jsxs("div", { className: "space-y-1 text-xs text-surface-600", children: [_jsxs("p", { children: ["\uD83D\uDD34 ", _jsx("b", { children: "Admin:" }), " admin@vinamec.vn / admin123"] }), _jsxs("p", { children: ["\uD83D\uDD35 ", _jsx("b", { children: "Doctor:" }), " doctor@vinamec.vn / doctor123"] }), _jsxs("p", { children: ["\uD83D\uDFE2 ", _jsx("b", { children: "Patient:" }), " patient@vinamec.vn / patient123"] })] })] })] })] })] }));
}
