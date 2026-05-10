import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export default function EventCard({ event, onClick }) {
    const isYesNo = event.type === 'yes_no';
    const options = isYesNo ? ['Yes', 'No'] : ['Higher', 'Lower'];
    return (_jsxs(motion.div, { whileHover: { y: -5 }, whileTap: { scale: 0.98 }, onClick: onClick, className: "bg-slate-900 rounded-lg border border-slate-800 p-6 cursor-pointer hover:border-indigo-500 transition-colors", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-slate-100", children: event.title }), _jsx("p", { className: "text-slate-400 text-sm mb-4", children: event.description }), _jsx("div", { className: "flex gap-2 mb-4", children: options.map((option) => (_jsx("span", { className: "px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300", children: option }, option))) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-slate-500", children: event.end_date
                            ? new Date(event.end_date).toLocaleDateString()
                            : 'No deadline' }), _jsx("button", { className: "px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors", children: "Place Bet" })] })] }));
}
