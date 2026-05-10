import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EventCard from './EventCard';
import BettingModal from './BettingModal';
import Leaderboard from './Leaderboard';
import AdminPanel from './AdminPanel';
import toast from 'react-hot-toast';
export default function Dashboard() {
    const { profile } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events');
    useEffect(() => {
        fetchEvents();
    }, []);
    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setEvents(data || []);
        }
        catch (err) {
            console.error('Error fetching events:', err);
            toast.error('Failed to load events');
        }
        finally {
            setLoading(false);
        }
    };
    if (!profile)
        return null;
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100", children: [_jsx("header", { className: "bg-slate-900 border-b border-slate-800 sticky top-0 z-10", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Klarkshi" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-slate-400", children: "Balance" }), _jsxs("p", { className: "text-2xl font-bold text-indigo-400", children: [profile.cp_balance, " CP"] })] })] }), _jsxs("p", { className: "text-slate-400", children: ["@", profile.username] })] }) }), _jsx("div", { className: "bg-slate-900 border-b border-slate-800", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => setActiveTab('events'), className: `py-4 px-4 font-medium border-b-2 transition-colors ${activeTab === 'events'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Open Events" }), _jsx("button", { onClick: () => setActiveTab('leaderboard'), className: `py-4 px-4 font-medium border-b-2 transition-colors ${activeTab === 'leaderboard'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Leaderboard" }), profile?.is_main_admin && (_jsx("button", { onClick: () => setActiveTab('admin'), className: `py-4 px-4 font-medium border-b-2 transition-colors ${activeTab === 'admin'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Admin Panel" }))] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 py-8", children: activeTab === 'events' ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-slate-400", children: "Loading events..." }) })) : events.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-slate-400", children: "No open events yet" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: events.map((event) => (_jsx(EventCard, { event: event, onClick: () => setSelectedEvent(event) }, event.id))) })) })) : activeTab === 'leaderboard' ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsx(Leaderboard, {}) })) : (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsx(AdminPanel, {}) })) }), selectedEvent && (_jsx(BettingModal, { event: selectedEvent, onClose: () => setSelectedEvent(null), onBetPlaced: fetchEvents }))] }));
}
