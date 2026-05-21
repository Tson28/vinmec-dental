import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'patient' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authApi.register(form);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-dental-900 via-dental-800 to-mint-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md animate-slide-up", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "inline-flex w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 items-center justify-center text-white text-2xl mb-3", children: "\uD83E\uDDB7" }), _jsx("h1", { className: "font-display font-bold text-2xl text-white", children: "VinaMec" })] }), _jsxs("div", { className: "bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8", children: [_jsx("h2", { className: "font-display font-bold text-2xl text-surface-900 mb-1", children: "Create Account" }), _jsx("p", { className: "text-surface-500 text-sm mb-6", children: "Join VinaMec Dental Care System" }), error && _jsxs("div", { className: "mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600", children: ["\u26A0\uFE0F ", error] }), success && _jsx("div", { className: "mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-600", children: "\u2705 Registered successfully! Redirecting..." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Full Name" }), _jsx("input", { name: "name", type: "text", className: "input", placeholder: "Nguy\u1EC5n V\u0103n A", value: form.name, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email" }), _jsx("input", { name: "email", type: "email", className: "input", placeholder: "you@example.com", value: form.email, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Phone" }), _jsx("input", { name: "phone", type: "tel", className: "input", placeholder: "0901234567", value: form.phone, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Password" }), _jsx("input", { name: "password", type: "password", className: "input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: form.password, onChange: handleChange, required: true, minLength: 6 })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Role" }), _jsxs("select", { name: "role", className: "input", value: form.role, onChange: handleChange, children: [_jsx("option", { value: "patient", children: "Patient" }), _jsx("option", { value: "doctor", children: "Doctor" })] })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: loading || success, children: loading ? 'Creating account...' : 'Create Account' })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-surface-500", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-dental-600 font-semibold hover:text-dental-700", children: "Sign in" })] })] })] }) }));
}
