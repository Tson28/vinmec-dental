import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        const redirects = {
            admin: '/admin',
            doctor: '/doctor',
            patient: '/patient',
        };
        return _jsx(Navigate, { to: redirects[role], replace: true });
    }
    return children;
}
