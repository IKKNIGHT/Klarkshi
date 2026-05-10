import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
export default function BettingModal({ event, onClose, onBetPlaced }) {
    const { profile, user } = useAuth();
    const [amount, setAmount] = useState('');
    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false);
    const options = event.type === 'yes_no' ? ['Yes', 'No'] : ['Higher', 'Lower'];
    const potentialWinnings = amount ? Math.floor(parseInt(amount) * 2) : 0;
    const handlePlaceBet = async () => {
        if (!user || !profile)
            return;
        if (!amount || !prediction) {
            toast.error('Please enter amount and select a prediction');
            return;
        }
        const betAmount = parseInt(amount);
        if (betAmount > profile.cp_balance) {
            toast.error('Insufficient CP balance');
            return;
        }
        setLoading(true);
        try {
            const { error: betError } = await supabase.from('bets').insert({
                user_id: user.id,
                event_id: event.id,
                amount: betAmount,
                prediction,
            });
            if (betError)
                throw betError;
            const { error: balanceError } = await supabase
                .from('profiles')
                .update({ cp_balance: profile.cp_balance - betAmount })
                .eq('id', user.id);
            if (balanceError)
                throw balanceError;
            toast.success(`Bet placed! You could win ${potentialWinnings} CP`);
            onBetPlaced();
            onClose();
        }
        catch (err) {
            console.error('Error placing bet:', err);
            toast.error('Failed to place bet');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", onClick: onClose, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-800", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: event.title }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2 text-slate-300", children: "Select Prediction" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: options.map((option) => (_jsx("button", { onClick: () => setPrediction(option), className: `py-3 px-4 rounded-lg font-medium transition-colors ${prediction === option
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`, children: option }, option))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2 text-slate-300", children: "Amount (CP)" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), min: "1", max: profile?.cp_balance || 0, className: "w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20", placeholder: "Enter amount" }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: ["Available: ", profile?.cp_balance || 0, " CP"] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-slate-400 mb-1", children: "Potential Winnings" }), _jsxs("p", { className: "text-2xl font-bold text-emerald-400", children: [potentialWinnings, " CP"] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors", children: "Cancel" }), _jsx("button", { onClick: handlePlaceBet, disabled: loading || !prediction || !amount, className: "flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Placing...' : 'Place Bet' })] })] })] }) }));
}
