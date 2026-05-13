import { useEffect, useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { scoreApi } from "../../services/api";
import type { DentalScore } from "../../types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

const MOCK_SCORE: DentalScore = {
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

function ScoreRing({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const textColor =
    value >= 80
      ? "text-emerald-600"
      : value >= 60
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-display font-bold ${textColor}`}>
            {value}
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-surface-600 text-center">
        {label}
      </p>
    </div>
  );
}

export default function PatientDentalScore() {
  const [score, setScore] = useState<DentalScore>(MOCK_SCORE);
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
  const overallColor =
    overall >= 80 ? "#10b981" : overall >= 60 ? "#f59e0b" : "#ef4444";
  const overallLabel =
    overall >= 80
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
      advice:
        score.cleanliness < 75
          ? "Try brushing for a full 2 minutes, twice daily."
          : "Great brushing habits! Keep it up.",
    },
    {
      icon: "🧵",
      title: "Flossing",
      score: score.gumHealth,
      advice:
        score.gumHealth < 80
          ? "Floss daily to reduce gum inflammation."
          : "Your gums are in great shape!",
    },
    {
      icon: "🍎",
      title: "Diet",
      score: score.toothDecay,
      advice:
        score.toothDecay < 70
          ? "Reduce sugary drinks and snacks to protect enamel."
          : "Your diet is supporting good dental health.",
    },
  ];

  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sức khỏe răng</h1>
          </div>
        </div>

        <div className="space-y-6 p-8">
          {/* Hero Score */}
          <div className="card bg-gradient-dental text-green border-0 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 136 136">
                <circle
                  cx="68"
                  cy="68"
                  r="56"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                />
                <circle
                  cx="68"
                  cy="68"
                  r="56"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - overall / 100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-bold text-green-600">
                  {loading ? "—" : overall}
                </span>
                <span className="text-green-600 text-xs font-bold">/100</span>
              </div>
            </div>
            <div>
              <p className="text-dental-100 text-sm font-medium">
                Overall Dental Health
              </p>
              <h2 className="font-display font-bold text-3xl mt-1">
                {overallLabel}
              </h2>
              <p className="text-dental-200 text-sm mt-2 max-w-md">
                Your dental health score is calculated based on gum health,
                tooth decay risk, alignment, and cleanliness metrics from your
                recent checkups.
              </p>
            </div>
          </div>

          {/* Metric Rings */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-6">Score Breakdown</h3>
            <div className="flex flex-wrap justify-around gap-6">
              {metrics.map((m) => (
                <ScoreRing
                  key={m.label}
                  value={m.value}
                  label={m.label}
                  color={m.color}
                />
              ))}
            </div>
          </div>

          {/* Progress Bars */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">
              Detailed Metrics
            </h3>
            <div className="space-y-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-surface-700">
                      {m.label}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: m.color }}
                    >
                      {m.value}/100
                    </span>
                  </div>
                  <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${m.value}%`, backgroundColor: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold text-surface-800 mb-4">Score History</h3>
              <Line data={lineData} options={lineOptions} />
            </div>
            <div className="card">
              <h3 className="font-bold text-surface-800 mb-4">Health Radar</h3>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">
              Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tips.map((t) => (
                <div
                  key={t.title}
                  className={`p-4 rounded-xl border ${t.score < 75 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
                >
                  <p className="text-2xl mb-2">{t.icon}</p>
                  <p className="font-bold text-surface-800 text-sm">
                    {t.title}
                  </p>
                  <p className="text-xs text-surface-600 mt-1">{t.advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Checkup CTA */}
          <div className="card bg-gradient-to-br from-dental-50 to-mint-50 border-dental-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-surface-800">
                Schedule Your Next Checkup
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Khám định kỳ giúp duy trì và cải thiện sức khỏe răng
              </p>
            </div>
            <a
              href="/patient/appointments"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Đặt lịch →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
