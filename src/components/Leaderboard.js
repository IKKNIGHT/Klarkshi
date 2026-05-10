import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
export default function Leaderboard() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchLeaderboard();
    }, []);
    const fetchLeaderboard = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('cp_balance', { ascending: false })
                .limit(50);
            if (error)
                throw error;
            setProfiles(data || []);
        }
        catch (err) {
            console.error('Error fetching leaderboard:', err);
            toast.error('Failed to load leaderboard');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-slate-400", children: "Loading leaderboard..." }) }));
    }
    return (_jsxs("div", { className: "max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Top Players" }), _jsx("div", { className: "bg-slate-900 rounded-lg overflow-hidden border border-slate-800", children: _jsx("div", { className: "divide-y divide-slate-800", children: profiles.map((profile, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm", children: index + 1 }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: profile.username }), profile.is_main_admin && (_jsx("p", { className: "text-xs text-indigo-400", children: "Admin" }))] })] }), _jsxs("p", { className: "text-lg font-bold text-emerald-400", children: [profile.cp_balance, " CP"] })] }, profile.id))) }) })] }));
}
