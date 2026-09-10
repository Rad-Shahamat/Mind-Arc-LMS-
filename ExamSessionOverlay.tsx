import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileQuestion, 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { Exam, ExamQuestion, ExamResult } from '../types';
import { formatMMSS, shuffleArray } from '../utils/formatters';

interface ExamSessionOverlayProps {
  exam: Exam;
  onFinish: (result: ExamResult) => void;
  onCancel: () => void;
}

export const ExamSessionOverlay: React.FC<ExamSessionOverlayProps> = ({
  exam,
  onFinish,
  onCancel
}) => {
  // Session State
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMin * 60);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize randomized questions once
  useEffect(() => {
    if (exam.questions && exam.questions.length > 0) {
      const randomized = exam.questions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setQuestions(shuffleArray(randomized));
    }
  }, [exam]);

  // Handle final submission calculation
  const performSubmit = useCallback((reason: string = 'manual') => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let scored = 0;
    let total = 0;

    questions.forEach(q => {
      total += q.points;
      const userAns = answers[q.id];
      if (userAns && userAns === q.correctOptionId) {
        scored += q.points;
      } else if (userAns && exam.negativeMarking) {
        scored -= exam.negativeMarking;
      }
    });

    if (scored < 0) scored = 0;
    const percentage = total ? Math.round((scored / total) * 100) : 0;
    const passed = percentage >= exam.passingScore;

    const result: ExamResult = {
      scored,
      total,
      percentage,
      passed,
      submittedAt: new Date().toISOString(),
      reason
    };

    onFinish(result);
  }, [answers, exam, isSubmitted, onFinish, questions]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          performSubmit('time_up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, performSubmit]);

  // Anti-cheat tab switch listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isSubmitted) return;
      if (document.visibilityState === 'hidden') {
        setTabWarnings(prev => {
          const next = prev + 1;
          if (next >= 2) {
            performSubmit('tab_switch');
          } else {
            setShowWarningModal(true);
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted, performSubmit]);

  // Prevent right-click / selection in test environment
  useEffect(() => {
    const preventAction = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', preventAction);
    return () => document.removeEventListener('contextmenu', preventAction);
  }, []);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isFlagged = !!flagged[currentQ.id];
  const selectedOption = answers[currentQ.id];
  const isLastQuestion = currentIndex === questions.length - 1;

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const isTimeLow = secondsLeft < 300; // Less than 5 mins

  return (
    <div className="fixed inset-0 z-50 bg-[#01021c] flex flex-col font-['DM_Sans'] text-white select-none">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30 flex items-center justify-center">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Sora'] font-bold text-sm sm:text-base text-white tracking-tight truncate max-w-[280px] sm:max-w-md">
              {exam.title}
            </h2>
            <div className="text-[11.5px] text-[#8d99b3] truncate">
              {exam.courseName}
            </div>
          </div>
        </div>

        {/* Center: Live Timer */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl border font-['Sora'] font-extrabold text-lg sm:text-xl tracking-wider transition-all
          ${isTimeLow 
            ? 'bg-[#e2635a]/20 text-[#ff6b60] border-[#e2635a]/50 shadow-[0_0_20px_rgba(226,99,90,0.4)] animate-pulse' 
            : 'bg-[#14e6ff]/15 text-[#5ff2ff] border-[#14e6ff]/30 shadow-[0_0_15px_rgba(20,230,255,0.2)]'
          }
        `}>
          <Clock className="w-5 h-5" />
          <span>{formatMMSS(secondsLeft)}</span>
        </div>

        {/* Right: Submit button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#14e6ff] to-[#5ff2ff] hover:from-[#5ff2ff] hover:to-[#14e6ff] text-[#00131a] font-['Sora'] font-bold text-xs sm:text-sm transition-all shadow-[0_4px_15px_rgba(20,230,255,0.4)] hover:scale-105"
        >
          Submit Exam
        </button>
      </div>

      {/* Main Examination View Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigator Palette */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 bg-white/[0.015] overflow-y-auto flex-shrink-0">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8d99b3] mb-3">
            Question Palette
          </div>

          <div className="flex md:flex-col gap-2 text-[11px] text-[#8d99b3] mb-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span>Unanswered ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffa600]" />
              <span>Flagged ({Object.keys(flagged).length})</span>
            </div>
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-6 md:grid-cols-4 gap-2">
            {questions.map((q, i) => {
              const isCurrent = i === currentIndex;
              const hasAnswer = !!answers[q.id];
              const isFlag = !!flagged[q.id];

              let bgCls = 'bg-white/[0.03] text-[#8d99b3] border-white/10';
              if (isFlag) {
                bgCls = 'bg-[#ffa600]/20 text-[#ffa600] border-[#ffa600]/50 shadow-[0_0_10px_rgba(255,166,0,0.2)]';
              } else if (hasAnswer) {
                bgCls = 'bg-[#25D366]/20 text-[#3fe07f] border-[#25D366]/50 shadow-[0_0_10px_rgba(37,211,102,0.2)]';
              }

              if (isCurrent) {
                bgCls += ' ring-2 ring-[#14e6ff] text-white';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-xl border text-xs font-['Sora'] font-bold flex items-center justify-center transition-all hover:border-[#14e6ff]/50 ${bgCls}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Question Reader */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between max-w-4xl mx-auto w-full">
          <div>
            {/* Question Progress Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs text-[#8d99b3]">
              <span className="font-semibold text-white">
                Question {currentIndex + 1} of {questions.length} · {currentQ.points} Point{currentQ.points > 1 ? 's' : ''}
              </span>

              <button
                onClick={() => {
                  setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all
                  ${isFlagged 
                    ? 'bg-[#ffa600]/20 border-[#ffa600]/40 text-[#ffa600]' 
                    : 'bg-white/[0.04] border-white/10 text-[#8d99b3] hover:text-white'
                  }
                `}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isFlagged ? 'Flagged for review' : 'Flag for review'}</span>
              </button>
            </div>

            {/* Question Prompt */}
            <h3 className="font-['Sora'] font-semibold text-lg sm:text-xl text-white leading-relaxed mb-8">
              {currentQ.text}
            </h3>

            {/* MCQ Options List */}
            <div className="space-y-3.5">
              {currentQ.options.map(opt => {
                const isSelected = selectedOption === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }));
                    }}
                    className={`
                      w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border text-left transition-all
                      ${isSelected 
                        ? 'bg-[#14e6ff]/15 border-[#14e6ff] text-white shadow-[0_0_20px_rgba(20,230,255,0.2)]' 
                        : 'bg-white/[0.025] hover:bg-white/[0.06] border-white/10 text-[#e7ecf6]'
                      }
                    `}
                  >
                    {/* Radio Indicator */}
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected ? 'border-[#14e6ff]' : 'border-[#8d99b3]'}
                    `}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#14e6ff] shadow-[0_0_6px_#14e6ff]" />
                      )}
                    </div>

                    {/* Option Text */}
                    <span className="text-sm sm:text-base font-medium leading-normal">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-40 disabled:pointer-events-none border border-white/10 text-xs sm:text-sm font-semibold text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isLastQuestion ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-['Sora'] font-bold text-xs sm:text-sm transition-all shadow-[0_4px_20px_rgba(20,230,255,0.4)]"
              >
                <span>Review &amp; Submit</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#14e6ff] to-[#5ff2ff] hover:from-[#5ff2ff] hover:to-[#14e6ff] text-[#00131a] font-['Sora'] font-bold text-xs sm:text-sm transition-all shadow-[0_4px_15px_rgba(20,230,255,0.3)]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Modal (Tab Switch Detected) */}
      {showWarningModal && (
        <div className="fixed inset-0 z-60 bg-[#01021c]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050e33] border border-[#e2635a]/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(226,99,90,0.3)] text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e2635a]/20 text-[#e2635a] border border-[#e2635a]/40 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="font-['Sora'] font-bold text-lg text-white mb-2">
              Security Protocol Triggered
            </h3>
            <p className="text-xs text-[#8d99b3] leading-relaxed mb-6">
              Switching away from the examination window is recorded. One additional tab switch or minimize will result in immediate automatic exam submission.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3 rounded-xl bg-[#e2635a] hover:bg-[#e2635a]/90 text-white font-['Sora'] font-bold text-xs transition-all shadow-lg"
            >
              I Understand &amp; Return
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-[#01021c]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050e33] border border-white/20 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
            <h3 className="font-['Sora'] font-bold text-lg text-white mb-2">
              Ready to Submit?
            </h3>
            <p className="text-xs text-[#8d99b3] leading-relaxed mb-4">
              {unansweredCount > 0 
                ? `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish now?`
                : 'All questions have been answered. Once submitted, answers cannot be modified.'
              }
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white transition-all"
              >
                Keep Working
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  performSubmit('manual');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-['Sora'] font-bold text-xs transition-all shadow-lg"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
