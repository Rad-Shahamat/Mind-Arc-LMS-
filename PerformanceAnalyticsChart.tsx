import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  BarChart2, 
  Sparkles, 
  Target, 
  Layers, 
  Zap,
  ArrowUpRight,
  Flame
} from 'lucide-react';

interface MockPoint {
  test: string;
  paper: string;
  student: number;
  batchAvg: number;
  topDecile: number;
  date: string;
}

const MOCK_SERIES: MockPoint[] = [
  { test: 'Mock 1', paper: 'Chem P2 (AS)', student: 74, batchAvg: 58, topDecile: 82, date: 'May 10' },
  { test: 'Mock 2', paper: 'Phys P2 (AS)', student: 78, batchAvg: 61, topDecile: 84, date: 'May 24' },
  { test: 'Mock 3', paper: 'Chem P4 (A2)', student: 82, batchAvg: 64, topDecile: 86, date: 'Jun 12' },
  { test: 'Mock 4', paper: 'Bio P4 (A2)', student: 80, batchAvg: 60, topDecile: 85, date: 'Jun 28' },
  { test: 'Mock 5', paper: 'Phys P4 (A2)', student: 85, batchAvg: 66, topDecile: 88, date: 'Jul 15' },
  { test: 'Mock 6', paper: 'Chem Full Mock', student: 88, batchAvg: 69, topDecile: 90, date: 'Aug 04' }
];

const TOPIC_MASTERY = [
  { topic: 'Organic Reaction Mechanisms & Synthesis', subject: 'Chemistry 9701', mastery: 92, status: 'Mastered' },
  { topic: 'Electrochemistry & Redox Potentials', subject: 'Chemistry 9701', mastery: 86, status: 'Strong' },
  { topic: 'Thermodynamics & Gibbs Free Energy (ΔG)', subject: 'Chemistry 9701', mastery: 84, status: 'Strong' },
  { topic: 'Reaction Kinetics & Rate Equations', subject: 'Chemistry 9701', mastery: 74, status: 'Needs Review' },
  { topic: 'Nuclear Physics & Quantum Phenomena', subject: 'Physics 9702', mastery: 90, status: 'Mastered' },
  { topic: 'Electric & Magnetic Fields Induction', subject: 'Physics 9702', mastery: 82, status: 'Strong' },
  { topic: 'Practical Paper 3/5 Data Analysis', subject: 'Practical', mastery: 88, status: 'Mastered' }
];

const WEEKLY_SOLVE_DISTRIBUTION = [
  { day: 'Mon', solved: 14, hours: 3.5 },
  { day: 'Tue', solved: 22, hours: 4.2 },
  { day: 'Wed', solved: 18, hours: 3.8 },
  { day: 'Thu', solved: 26, hours: 5.0 },
  { day: 'Fri', solved: 30, hours: 5.5 },
  { day: 'Sat', solved: 38, hours: 6.8 },
  { day: 'Sun', solved: 24, hours: 4.0 }
];

export const PerformanceAnalyticsChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'trend' | 'topics' | 'velocity'>('trend');

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/10 border border-[#14e6ff]/30 text-[#14e6ff] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-white">
                Academic Velocity & Analytics
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30">
                +14% Growth
              </span>
            </div>
            <p className="text-xs text-[#8d99b3] mt-0.5">
              Continuous diagnostic tracking across all mock evaluations
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setActiveChart('trend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeChart === 'trend'
                ? 'bg-white text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Exam Velocity Trend
          </button>
          <button
            onClick={() => setActiveChart('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeChart === 'topics'
                ? 'bg-white text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Topic Competency
          </button>
          <button
            onClick={() => setActiveChart('velocity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeChart === 'velocity'
                ? 'bg-white text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Weekly Solves
          </button>
        </div>
      </div>

      {/* View 1: Exam Velocity Trend Graph (Line / Area Curve) */}
      {activeChart === 'trend' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs text-[#8d99b3]">
            <span>Mock Evaluation Series (Score %)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14e6ff]" />
                <span className="text-white">Your Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span>Cambridge Top 10%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <span>Batch Average</span>
              </div>
            </div>
          </div>

          {/* Minimalist SVG Chart */}
          <div className="relative w-full h-56 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
            {/* Grid lines */}
            <div className="absolute inset-x-4 inset-y-6 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-dashed border-white" />
              <div className="w-full border-b border-dashed border-white" />
              <div className="w-full border-b border-dashed border-white" />
              <div className="w-full border-b border-dashed border-white" />
            </div>

            {/* SVG Plot Lines */}
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              {/* Batch Avg Line */}
              <polyline
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={MOCK_SERIES.map((m, idx) => {
                  const x = (idx / (MOCK_SERIES.length - 1)) * 500;
                  const y = 160 - ((m.batchAvg - 40) / 60) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Top Decile Line */}
              <polyline
                fill="none"
                stroke="#25D366"
                strokeWidth="2"
                strokeOpacity="0.7"
                points={MOCK_SERIES.map((m, idx) => {
                  const x = (idx / (MOCK_SERIES.length - 1)) * 500;
                  const y = 160 - ((m.topDecile - 40) / 60) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Student Gradient Area */}
              <polygon
                fill="url(#studentGradient)"
                points={`
                  0,160 
                  ${MOCK_SERIES.map((m, idx) => {
                    const x = (idx / (MOCK_SERIES.length - 1)) * 500;
                    const y = 160 - ((m.student - 40) / 60) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                  500,160
                `}
              />

              {/* Student Curve Line */}
              <polyline
                fill="none"
                stroke="#14e6ff"
                strokeWidth="3"
                points={MOCK_SERIES.map((m, idx) => {
                  const x = (idx / (MOCK_SERIES.length - 1)) * 500;
                  const y = 160 - ((m.student - 40) / 60) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data points */}
              {MOCK_SERIES.map((m, idx) => {
                const x = (idx / (MOCK_SERIES.length - 1)) * 500;
                const y = 160 - ((m.student - 40) / 60) * 160;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#01021c" stroke="#14e6ff" strokeWidth="2.5" />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontFamily="Sora"
                      fontWeight="bold"
                    >
                      {m.student}%
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14e6ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#14e6ff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8d99b3] pt-2 border-t border-white/[0.08]">
              {MOCK_SERIES.map((m, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-white font-medium">{m.test}</div>
                  <div className="text-[#8d99b3]">{m.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Topic Competency Matrix */}
      {activeChart === 'topics' && (
        <div className="space-y-3 pt-1">
          {TOPIC_MASTERY.map((t, idx) => (
            <div key={idx} className="glass-card-nested p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-white truncate">{t.topic}</span>
                  <span className="text-[10px] text-[#8d99b3]">· {t.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.mastery >= 90 ? 'bg-[#25D366]/15 text-[#25D366]' :
                    t.mastery >= 80 ? 'bg-[#14e6ff]/15 text-[#14e6ff]' :
                    'bg-[#ffa600]/15 text-[#ffa600]'
                  }`}>
                    {t.status}
                  </span>
                  <span className="font-mono font-bold text-white text-xs">{t.mastery}%</span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    t.mastery >= 90 ? 'bg-[#25D366]' :
                    t.mastery >= 80 ? 'bg-[#14e6ff]' :
                    'bg-[#ffa600]'
                  }`}
                  style={{ width: `${t.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Weekly Past Paper Solving Distribution */}
      {activeChart === 'velocity' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-7 gap-2.5">
            {WEEKLY_SOLVE_DISTRIBUTION.map((w, idx) => (
              <div key={idx} className="glass-card-nested p-3 rounded-xl flex flex-col items-center justify-between h-40">
                <span className="text-xs font-mono text-[#8d99b3]">{w.day}</span>
                
                {/* Vertical Bar */}
                <div className="w-full flex-1 flex items-end justify-center py-2">
                  <div 
                    className="w-full max-w-[28px] rounded-lg bg-gradient-to-t from-[#14e6ff]/30 to-[#14e6ff] flex items-center justify-center text-[10px] font-mono font-bold text-[#00131a] pb-1"
                    style={{ height: `${(w.solved / 40) * 100}%` }}
                  >
                    {w.solved}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-white font-mono">{w.hours}h</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8d99b3] px-1">
            <span>Total Questions Solved: <strong className="text-white font-mono">172 Problems</strong></span>
            <span>Total Focused Study: <strong className="text-[#14e6ff] font-mono">32.8 Hours this week</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
