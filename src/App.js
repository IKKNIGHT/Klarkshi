import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';
function AppContent() {
    const { user, loading } = useAuth();
    const [authReady, setAuthReady] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            await supabase.auth.getSession();
            setAuthReady(true);
        };
        checkAuth();
    }, []);
    if (!authReady || loading) {
        return (_jsx("div", { className: "min-h-screen bg-slate-950 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading..." })] }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", toastOptions: {
                    style: {
                        background: '#1e293b',
                        color: '#f1f5f9',
                        border: '1px solid #334155',
                    },
                } }), user ? _jsx(Dashboard, {}) : _jsx(Auth, { onAuthSuccess: () => { } })] }));
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(AppContent, {}) }));
}
