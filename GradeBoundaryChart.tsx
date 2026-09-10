import React, { useState } from 'react';
import { 
  Award, 
  BarChart3, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  BookOpen, 
  FileSpreadsheet,
  Layers,
  ChevronDown
} from 'lucide-react';

interface ComponentThreshold {
  paperCode: string;
  name: string;
  maxRaw: number;
  weighting: string;
  thresholds: {
    aStar: number;
    a: number;
    b: number;
    c: number;
    d: number;
  };
  studentScore: number;
}

interface SubjectBoundaryData {
  id: string;
  subject: string;
  examBoard: string;
  series: string;
  overallMax: number;
  overallAStar: number;
  overallA: number;
  studentComposite: number;
  components: ComponentThreshold[];
}

const BOUNDARY_DATA: Record<string, SubjectBoundaryData> = {
  chem: {
    id: 'chem',
    subject: 'Chemistry (9701)',
    examBoard: 'Cambridge International A-Level',
    series: 'June / Nov 2024–2025 Component Series',
    overallMax: 260,
    overallAStar: 194,
    overallA: 168,
    studentComposite: 218,
    components: [
      {
        paperCode: 'Paper 1 (12)',
        name: 'Multiple Choice (AS)',
        maxRaw: 40,
        weighting: '15.5%',
        thresholds: { aStar: 33, a: 29, b: 24, c: 20, d: 16 },
        studentScore: 36
      },
      {
        paperCode: 'Paper 2 (22)',
        name: 'AS Structured Questions',
        maxRaw: 60,
        weighting: '23.0%',
        thresholds: { aStar: 46, a: 39, b: 32, c: 25, d: 19 },
        studentScore: 49
      },
      {
        paperCode: 'Paper 3 (33)',
        name: 'Advanced Practical Skills',
        maxRaw: 40,
        weighting: '11.5%',
        thresholds: { aStar: 31, a: 28, b: 24, c: 20, d: 17 },
        studentScore: 34
      },
      {
        paperCode: 'Paper 4 (42)',
        name: 'A2 Structured Theory',
        maxRaw: 100,
        weighting: '38.5%',
        thresholds: { aStar: 76, a: 64, b: 51, c: 39, d: 29 },
        studentScore: 82
      },
      {
        paperCode: 'Paper 5 (52)',
        name: 'Planning, Analysis & Evaluation',
        maxRaw: 30,
        weighting: '11.5%',
        thresholds: { aStar: 23, a: 20, b: 16, c: 13, d: 10 },
        studentScore: 24
      }
    ]
  },
  phys: {
    id: 'phys',
    subject: 'Physics (9702)',
    examBoard: 'Cambridge International A-Level',
    series: 'June / Nov 2024–2025 Series',
    overallMax: 260,
    overallAStar: 198,
    overallA: 172,
    studentComposite: 212,
    components: [
      {
        paperCode: 'Paper 1 (12)',
        name: 'Multiple Choice (AS)',
        maxRaw: 40,
        weighting: '15.5%',
        thresholds: { aStar: 34, a: 30, b: 25, c: 20, d: 16 },
        studentScore: 35
      },
      {
        paperCode: 'Paper 2 (22)',
        name: 'AS Structured Questions',
        maxRaw: 60,
        weighting: '23.0%',
        thresholds: { aStar: 47, a: 40, b: 33, c: 26, d: 20 },
        studentScore: 48
      },
      {
        paperCode: 'Paper 3 (33)',
        name: 'Advanced Practical Skills',
        maxRaw: 40,
        weighting: '11.5%',
        thresholds: { aStar: 32, a: 29, b: 25, c: 21, d: 18 },
        studentScore: 31
      },
      {
        paperCode: 'Paper 4 (42)',
        name: 'A2 Structured Theory',
        maxRaw: 100,
        weighting: '38.5%',
        thresholds: { aStar: 78, a: 66, b: 53, c: 41, d: 30 },
        studentScore: 80
      },
      {
        paperCode: 'Paper 5 (52)',
        name: 'Planning, Analysis & Evaluation',
        maxRaw: 30,
        weighting: '11.5%',
        thresholds: { aStar: 24, a: 21, b: 17, c: 14, d: 11 },
        studentScore: 23
      }
    ]
  },
  bio: {
    id: 'bio',
    subject: 'Biology (9700)',
    examBoard: 'Cambridge International A-Level',
    series: 'June / Nov 2024–2025 Series',
    overallMax: 260,
    overallAStar: 190,
    overallA: 165,
    studentComposite: 205,
    components: [
      {
        paperCode: 'Paper 1 (12)',
        name: 'Multiple Choice (AS)',
        maxRaw: 40,
        weighting: '15.5%',
        thresholds: { aStar: 32, a: 28, b: 23, c: 19, d: 15 },
        studentScore: 33
      },
      {
        paperCode: 'Paper 2 (22)',
        name: 'AS Structured Questions',
        maxRaw: 60,
        weighting: '23.0%',
        thresholds: { aStar: 44, a: 37, b: 30, c: 24, d: 18 },
        studentScore: 45
      },
      {
        paperCode: 'Paper 3 (33)',
        name: 'Advanced Practical Skills',
        maxRaw: 40,
        weighting: '11.5%',
        thresholds: { aStar: 30, a: 27, b: 23, c: 19, d: 16 },
        studentScore: 30
      },
      {
        paperCode: 'Paper 4 (42)',
        name: 'A2 Structured Theory',
        maxRaw: 100,
        weighting: '38.5%',
        thresholds: { aStar: 74, a: 62, b: 50, c: 38, d: 28 },
        studentScore: 78
      },
      {
        paperCode: 'Paper 5 (52)',
        name: 'Planning, Analysis & Evaluation',
        maxRaw: 30,
        weighting: '11.5%',
        thresholds: { aStar: 23, a: 19, b: 15, c: 12, d: 9 },
        studentScore: 22
      }
    ]
  }
};

export const GradeBoundaryChart: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'chem' | 'phys' | 'bio'>('chem');
  const [activeView, setActiveView] = useState<'visual' | 'markScheme'>('visual');

  const currentData = BOUNDARY_DATA[selectedSubject];
  const deltaAStar = currentData.studentComposite - currentData.overallAStar;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header with Subject Switcher & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffa600]/10 border border-[#ffa600]/30 text-[#ffa600] flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-white">
                Grade Boundary & Mark Scheme Matrix
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                Official CAIE Matrix
              </span>
            </div>
            <p className="text-xs text-[#8d99b3] mt-0.5">
              {currentData.examBoard} · {currentData.series}
            </p>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setSelectedSubject('chem')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubject === 'chem'
                ? 'bg-[#14e6ff] text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Chemistry 9701
          </button>
          <button
            onClick={() => setSelectedSubject('phys')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubject === 'phys'
                ? 'bg-[#14e6ff] text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Physics 9702
          </button>
          <button
            onClick={() => setSelectedSubject('bio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubject === 'bio'
                ? 'bg-[#14e6ff] text-[#00131a] shadow-sm'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            Biology 9700
          </button>
        </div>
      </div>

      {/* Overall Standing Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <div className="space-y-1">
          <span className="text-xs text-[#8d99b3]">Composite Mock Total</span>
          <div className="flex items-baseline gap-2">
            <span className="font-['Sora'] font-extrabold text-2xl text-white">
              {currentData.studentComposite}
            </span>
            <span className="text-xs text-[#8d99b3] font-mono">/ {currentData.overallMax} marks</span>
          </div>
          <span className="text-[11px] text-[#25D366] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Projected Grade: <strong>A* (Distinction)</strong>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8d99b3]">Cambridge A* Threshold</span>
          <div className="flex items-baseline gap-2">
            <span className="font-['Sora'] font-extrabold text-2xl text-[#ffa600]">
              {currentData.overallAStar}
            </span>
            <span className="text-xs text-[#8d99b3] font-mono">/ {currentData.overallMax} marks</span>
          </div>
          <span className="text-[11px] text-[#8d99b3]">
            Grade A baseline is {currentData.overallA} marks
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8d99b3]">Safety Buffer</span>
          <div className="flex items-baseline gap-2">
            <span className="font-['Sora'] font-extrabold text-2xl text-[#14e6ff]">
              +{deltaAStar} Marks
            </span>
          </div>
          <span className="text-[11px] text-[#25D366]">
            Comfortable cushion above A* boundary
          </span>
        </div>
      </div>

      {/* Mode Switcher (Visual Graph vs Detailed Table) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('visual')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeView === 'visual'
                ? 'bg-white/[0.1] text-white'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Component Comparison Graph
          </button>
          <button
            onClick={() => setActiveView('markScheme')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeView === 'markScheme'
                ? 'bg-white/[0.1] text-white'
                : 'text-[#8d99b3] hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Mark Scheme Scaling Table
          </button>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#8d99b3]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14e6ff]" />
            <span>Your Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffa600]" />
            <span>A* Boundary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c9bc4]" />
            <span>A Boundary</span>
          </div>
        </div>
      </div>

      {/* Visual Component Bar Graphs */}
      {activeView === 'visual' && (
        <div className="space-y-4 pt-2">
          {currentData.components.map((comp, idx) => {
            const studentPct = (comp.studentScore / comp.maxRaw) * 100;
            const aStarPct = (comp.thresholds.aStar / comp.maxRaw) * 100;
            const aPct = (comp.thresholds.a / comp.maxRaw) * 100;
            const bPct = (comp.thresholds.b / comp.maxRaw) * 100;

            const isAboveAStar = comp.studentScore >= comp.thresholds.aStar;

            return (
              <div key={idx} className="glass-card-nested p-3.5 rounded-xl space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-['Sora'] font-bold text-white">
                      {comp.paperCode}
                    </span>
                    <span className="text-[#8d99b3]">— {comp.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-[#8d99b3]">
                      Weight: {comp.weighting}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#8d99b3]">
                      Raw Max: <strong>{comp.maxRaw}</strong>
                    </span>
                    <span className={`font-bold ${isAboveAStar ? 'text-[#25D366]' : 'text-[#ffa600]'}`}>
                      Your Mark: {comp.studentScore}/{comp.maxRaw} ({Math.round(studentPct)}%)
                    </span>
                  </div>
                </div>

                {/* Graph Track with Markers */}
                <div className="relative w-full h-5 bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.08]">
                  {/* Student Score Bar */}
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-[#14e6ff]/70 to-[#14e6ff] transition-all duration-700 relative z-10"
                    style={{ width: `${Math.min(studentPct, 100)}%` }}
                  >
                    <div className="absolute right-1 top-0 bottom-0 flex items-center text-[10px] font-mono font-bold text-[#00131a] pr-1">
                      {comp.studentScore}m
                    </div>
                  </div>

                  {/* A* Boundary Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#ffa600] z-20 shadow-[0_0_8px_#ffa600]"
                    style={{ left: `${aStarPct}%` }}
                    title={`A* Boundary: ${comp.thresholds.aStar}m`}
                  />

                  {/* A Boundary Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#8c9bc4] z-20"
                    style={{ left: `${aPct}%` }}
                    title={`A Boundary: ${comp.thresholds.a}m`}
                  />

                  {/* B Boundary Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#e2635a]/60 z-20"
                    style={{ left: `${bPct}%` }}
                    title={`B Boundary: ${comp.thresholds.b}m`}
                  />
                </div>

                {/* Sub-threshold numbers */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8d99b3] px-1">
                  <span>0</span>
                  <span>B: {comp.thresholds.b}m</span>
                  <span className="text-[#8c9bc4]">A: {comp.thresholds.a}m</span>
                  <span className="text-[#ffa600] font-bold">A*: {comp.thresholds.aStar}m</span>
                  <span>Max: {comp.maxRaw}m</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Mark Scheme Table View */}
      {activeView === 'markScheme' && (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#8d99b3] font-mono text-[11px]">
                <th className="pb-3 pr-4">Paper Code</th>
                <th className="pb-3 pr-4">Component Title</th>
                <th className="pb-3 pr-4">Max Raw</th>
                <th className="pb-3 pr-4 text-center">Grade A*</th>
                <th className="pb-3 pr-4 text-center">Grade A</th>
                <th className="pb-3 pr-4 text-center">Grade B</th>
                <th className="pb-3 pr-4 text-center">Grade C</th>
                <th className="pb-3 text-right">Your Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {currentData.components.map((comp, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-mono font-bold text-white">{comp.paperCode}</td>
                  <td className="py-3 pr-4 text-white/90">{comp.name}</td>
                  <td className="py-3 pr-4 font-mono text-[#8d99b3]">{comp.maxRaw}</td>
                  <td className="py-3 pr-4 text-center font-mono text-[#ffa600] font-bold">{comp.thresholds.aStar}</td>
                  <td className="py-3 pr-4 text-center font-mono text-[#8c9bc4]">{comp.thresholds.a}</td>
                  <td className="py-3 pr-4 text-center font-mono text-[#8d99b3]">{comp.thresholds.b}</td>
                  <td className="py-3 pr-4 text-center font-mono text-[#8d99b3]">{comp.thresholds.c}</td>
                  <td className="py-3 text-right font-mono font-bold text-[#14e6ff]">
                    {comp.studentScore} / {comp.maxRaw}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
