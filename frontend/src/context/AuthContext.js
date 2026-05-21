import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [role, setRole] = useState(() => localStorage.getItem('role'));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        }
        catch {
            return null;
        }
    });
    const login = (t, r, u) => {
        localStorage.setItem('token', t);
        localStorage.setItem('role', r);
        localStorage.setItem('user', JSON.stringify(u));
        setToken(t);
        setRole(r);
        setUser(u);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setToken(null);
        setRole(null);
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { token, role, user, login, logout, isAuthenticated: !!token }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
