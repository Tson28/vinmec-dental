import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { scoreApi } from "../../services/api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, ArcElement, Filler, Tooltip, Legend, } from "chart.js";
import { Line, Radar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, ArcElement, Filler, Tooltip, Legend);
const MOCK_SCORE = {
    overall: 78,
    gumHealth: 82,
    toothDecay: 70,
    alignment: 88,
    cleanliness: 75,
    history: [
        { date: "Jan", score: 65 },
        { date: "Feb", score: 68 },
        { date: "Mar", score: 72 },
        { date: "Apr", score: 70 },
        { date: "May", score: 74 },
        { date: "Jun", score: 78 },
    ],
};
function ScoreRing({ value, label, color, }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    const textColor = value >= 80
        ? "text-emerald-600"
        : value >= 60
            ? "text-amber-600"
            : "text-red-500";
    return (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("div", { className: "relative w-24 h-24", children: [_jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 88 88", children: [_jsx("circle", { cx: "44", cy: "44", r: r, fill: "none", stroke: "#e2e8f0", strokeWidth: "8" }), _jsx("circle", { cx: "44", cy: "44", r: r, fill: "none", stroke: color, strokeWidth: "8", strokeDasharray: circ, strokeDashoffset: offset, strokeLinecap: "round", style: { transition: "stroke-dashoffset 1s ease" } })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("span", { className: `text-xl font-display font-bold ${textColor}`, children: value }) })] }), _jsx("p", { className: "text-xs font-semibold text-surface-600 text-center", children: label })] }));
}
export default function PatientDentalScore() {
    const [score, setScore] = useState(MOCK_SCORE);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        scoreApi
            .getMine()
            .then((res) => {
            setScore(res.data?.data || res.data || MOCK_SCORE);
        })
            .catch(() => {
            setScore(MOCK_SCORE);
        })
            .finally(() => setLoading(false));
    }, []);
    const overall = score.overall;
    const overallColor = overall >= 80 ? "#10b981" : overall >= 60 ? "#f59e0b" : "#ef4444";
    const overallLabel = overall >= 80
        ? "Excellent 🌟"
        : overall >= 60
            ? "Good 👍"
            : "Needs Attention ⚠️";
    const lineData = {
        labels: score.history.map((h) => h.date),
        datasets: [
            {
                label: "Dental Score",
                data: score.history.map((h) => h.score),
                fill: true,
                backgroundColor: "rgba(14,165,233,0.08)",
                borderColor: "#0ea5e9",
                tension: 0.4,
                pointBackgroundColor: "#0ea5e9",
                pointRadius: 5,
            },
        ],
    };
    const radarData = {
        labels: ["Gum Health", "Decay Risk", "Alignment", "Cleanliness", "Overall"],
        datasets: [
            {
                label: "Your Score",
                data: [
                    score.gumHealth,
                    score.toothDecay,
                    score.alignment,
                    score.cleanliness,
                    score.overall,
                ],
                fill: true,
                backgroundColor: "rgba(14,165,233,0.12)",
                borderColor: "#0ea5e9",
                pointBackgroundColor: "#0ea5e9",
                pointRadius: 4,
            },
        ],
    };
    const lineOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { min: 0, max: 100, grid: { color: "#f1f5f9" } },
            x: { grid: { display: false } },
        },
    };
    const radarOptions = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: { stepSize: 25 },
                grid: { color: "#e2e8f0" },
            },
        },
        plugins: { legend: { display: false } },
    };
    const metrics = [
        { label: "Gum Health", value: score.gumHealth, color: "#10b981" },
        { label: "Tooth Decay Risk", value: score.toothDecay, color: "#f59e0b" },
        { label: "Alignment", value: score.alignment, color: "#0ea5e9" },
        { label: "Cleanliness", value: score.cleanliness, color: "#8b5cf6" },
    ];
    const tips = [
        {
            icon: "🪥",
            title: "Brushing",
            score: score.cleanliness,
            advice: score.cleanliness < 75
                ? "Try brushing for a full 2 minutes, twice daily."
                : "Great brushing habits! Keep it up.",
        },
        {
            icon: "🧵",
            title: "Flossing",
            score: score.gumHealth,
            advice: score.gumHealth < 80
                ? "Floss daily to reduce gum inflammation."
                : "Your gums are in great shape!",
        },
        {
            icon: "🍎",
            title: "Diet",
            score: score.toothDecay,
            advice: score.toothDecay < 70
                ? "Reduce sugary drinks and snacks to protect enamel."
                : "Your diet is supporting good dental health.",
        },
    ];
    return (_jsxs("div", { className: "flex", children: [_jsx(PatientSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsx("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: _jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "S\u1EE9c kh\u1ECFe r\u0103ng" }) }) }), _jsxs("div", { className: "space-y-6 p-8", children: [_jsxs("div", { className: "card bg-gradient-dental text-green border-0 flex flex-col sm:flex-row items-center gap-6", children: [_jsxs("div", { className: "relative w-36 h-36 flex-shrink-0", children: [_jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 136 136", children: [_jsx("circle", { cx: "68", cy: "68", r: "56", fill: "none", stroke: "rgba(255,255,255,0.2)", strokeWidth: "12" }), _jsx("circle", { cx: "68", cy: "68", r: "56", fill: "none", stroke: "white", strokeWidth: "12", strokeDasharray: 2 * Math.PI * 56, strokeDashoffset: 2 * Math.PI * 56 * (1 - overall / 100), strokeLinecap: "round", style: { transition: "stroke-dashoffset 1.5s ease" } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-4xl font-display font-bold text-green-600", children: loading ? "—" : overall }), _jsx("span", { className: "text-green-600 text-xs font-bold", children: "/100" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-dental-100 text-sm font-medium", children: "Overall Dental Health" }), _jsx("h2", { className: "font-display font-bold text-3xl mt-1", children: overallLabel }), _jsx("p", { className: "text-dental-200 text-sm mt-2 max-w-md", children: "Your dental health score is calculated based on gum health, tooth decay risk, alignment, and cleanliness metrics from your recent checkups." })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "font-bold text-surface-800 mb-6", children: "Score Breakdown" }), _jsx("div", { className: "flex flex-wrap justify-around gap-6", children: metrics.map((m) => (_jsx(ScoreRing, { value: m.value, label: m.label, color: m.color }, m.label))) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "font-bold text-surface-800 mb-4", children: "Detailed Metrics" }), _jsx("div", { className: "space-y-4", children: metrics.map((m) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1.5", children: [_jsx("span", { className: "text-sm font-semibold text-surface-700", children: m.label }), _jsxs("span", { className: "text-sm font-bold", style: { color: m.color }, children: [m.value, "/100"] })] }), _jsx("div", { className: "h-2.5 bg-surface-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-1000 ease-out", style: { width: `${m.value}%`, backgroundColor: m.color } }) })] }, m.label))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "font-bold text-surface-800 mb-4", children: "Score History" }), _jsx(Line, { data: lineData, options: lineOptions })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "font-bold text-surface-800 mb-4", children: "Health Radar" }), _jsx(Radar, { data: radarData, options: radarOptions })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "font-bold text-surface-800 mb-4", children: "Personalized Recommendations" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: tips.map((t) => (_jsxs("div", { className: `p-4 rounded-xl border ${t.score < 75 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`, children: [_jsx("p", { className: "text-2xl mb-2", children: t.icon }), _jsx("p", { className: "font-bold text-surface-800 text-sm", children: t.title }), _jsx("p", { className: "text-xs text-surface-600 mt-1", children: t.advice })] }, t.title))) })] }), _jsxs("div", { className: "card bg-gradient-to-br from-dental-50 to-mint-50 border-dental-200 flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-surface-800", children: "Schedule Your Next Checkup" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Kh\u00E1m \u0111\u1ECBnh k\u1EF3 gi\u00FAp duy tr\u00EC v\u00E0 c\u1EA3i thi\u1EC7n s\u1EE9c kh\u1ECFe r\u0103ng" })] }), _jsx("a", { href: "/patient/appointments", className: "px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition", children: "\u0110\u1EB7t l\u1ECBch \u2192" })] })] })] })] }));
}
