import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  BookOpen,
  FileCheck,
  Video,
  CheckSquare,
  Flame,
  Zap,
  Target,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Filter,
  ExternalLink,
  Layers,
  Award,
  AlertCircle,
  TrendingUp,
  X,
  Radio,
  Share2
} from 'lucide-react';
import { UpcomingClass, Recording, Exam, Task, TabId, WeeklyAssessment, Course, Student } from '../types';
import { formatDate, formatTime, isToday, monthShort, dayNum } from '../utils/formatters';

interface CustomStudySlot {
  id: string;
  title: string;
  subject: string;
  startsAt: string;
  durationMin: number;
  completed: boolean;
}

interface CalendarTabProps {
  upcomingClasses: UpcomingClass[];
  recordings: Recording[];
  exams: Exam[];
  weeklyAssessments?: WeeklyAssessment[];
  tasks: Task[];
  courses?: Course[];
  student?: Student;
  onNavigate: (tab: TabId) => void;
  onToggleTask?: (taskId: string) => void;
  onAddTask?: (task: Omit<Task, 'id'>) => void;
}

export type CalendarEventType = 'class' | 'exam' | 'assessment' | 'recording' | 'task' | 'study_slot';

export interface CalendarEvent {
  id: string;
  date: Date;
  type: CalendarEventType;
  color: string;
  title: string;
  subtitle: string;
  subject?: string;
  tabLink?: TabId;
  meetUrl?: string;
  isLiveNow?: boolean;
  completed?: boolean;
  rawItem?: any;
}

type ViewMode = 'month' | 'week' | 'timeline';

export const CalendarTab: React.FC<CalendarTabProps> = ({
  upcomingClasses,
  recordings,
  exams,
  weeklyAssessments = [],
  tasks,
  courses = [],
  student,
  onNavigate,
  onToggleTask,
  onAddTask
}) => {
  // Calendar View State
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedFilterType, setSelectedFilterType] = useState<CalendarEventType | 'all'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  
  // Interactive Custom Study Sessions
  const [customSlots, setCustomSlots] = useState<CustomStudySlot[]>([
    {
      id: 'slot-1',
      title: 'Redox Past Papers (2024 Series)',
      subject: 'A-Level Chemistry (9701)',
      startsAt: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
      durationMin: 45,
      completed: false
    },
    {
      id: 'slot-2',
      title: 'Unit 1 Energetics Flashcard Recall',
      subject: 'Edexcel IAL Chemistry (WCH11)',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      durationMin: 30,
      completed: false
    }
  ]);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotSubject, setNewSlotSubject] = useState(courses[0]?.name || 'General Revision');
  const [newSlotTime, setNewSlotTime] = useState('17:00');
  const [newSlotDuration, setNewSlotDuration] = useState(45);

  // Focus Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroTopic, setPomodoroTopic] = useState('Chemistry Redox Revision');
  const [showPomodoroMini, setShowPomodoroMini] = useState(false);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isPomodoroRunning) {
      setIsPomodoroRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroSeconds]);

  const togglePomodoro = () => setIsPomodoroRunning(!isPomodoroRunning);
  const resetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroSeconds(25 * 60);
  };

  const formatPomoTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    if (viewMode === 'week') {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedDate(prevWeek);
      setViewDate(prevWeek);
    } else {
      setViewDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
      setViewDate(nextWeek);
    } else {
      setViewDate(new Date(year, month + 1, 1));
    }
  };

  const handleToday = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDate(now);
  };

  const sameDay = (a: Date, b: Date) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  // Build merged calendar events
  const allEvents: CalendarEvent[] = useMemo(() => {
    const list: CalendarEvent[] = [];

    // Live Classes
    upcomingClasses.forEach(c => {
      list.push({
        id: `class-${c.id}`,
        date: new Date(c.startsAt),
        type: 'class',
        color: '#14e6ff',
        title: c.topic,
        subtitle: `${c.courseName} · ${formatTime(c.startsAt)} (${c.durationMin}m)`,
        subject: c.courseName,
        meetUrl: c.meetUrl,
        tabLink: 'classes',
        rawItem: c
      });
    });

    // Lecture Recordings
    recordings.forEach(r => {
      list.push({
        id: `rec-${r.id}`,
        date: new Date(r.date),
        type: 'recording',
        color: '#ff00c3',
        title: r.topic,
        subtitle: `${r.courseName} · Lecture Recording`,
        subject: r.courseName,
        tabLink: 'recordings',
        rawItem: r
      });
    });

    // Weekly Assessments (Homework/Submissions)
    weeklyAssessments.forEach(wa => {
      list.push({
        id: `wa-${wa.id}`,
        date: new Date(wa.dueDate),
        type: 'assessment',
        color: '#ffa600',
        title: `${wa.title} (Deadline)`,
        subtitle: `${wa.courseName} · Due ${formatTime(wa.dueDate)}`,
        subject: wa.courseName,
        tabLink: 'assessments',
        rawItem: wa
      });
    });

    // Timed MCQ Exams
    exams.forEach(ex => {
      list.push({
        id: `exam-${ex.id}`,
        date: new Date(ex.unlockAt),
        type: 'exam',
        color: '#22e07a',
        title: `${ex.title} (Timed Test)`,
        subtitle: `${ex.courseName} · ${ex.totalQuestions} Questions (${ex.durationMinutes}m)`,
        subject: ex.courseName,
        tabLink: 'assessments',
        completed: !!ex.result,
        rawItem: ex
      });
    });

    // Study Tasks
    tasks.forEach(t => {
      list.push({
        id: `task-${t.id}`,
        date: new Date(t.dueAt),
        type: 'task',
        color: '#a855f7',
        title: t.title,
        subtitle: t.done ? 'Task (Completed)' : `Task due ${formatTime(t.dueAt)}`,
        subject: 'General Study',
        tabLink: 'planner',
        completed: t.done,
        rawItem: t
      });
    });

    // Custom Scheduled Study Slots
    customSlots.forEach(slot => {
      list.push({
        id: slot.id,
        date: new Date(slot.startsAt),
        type: 'study_slot',
        color: '#ff5c8a',
        title: slot.title,
        subtitle: `${slot.subject} · Focus Study (${slot.durationMin}m)`,
        subject: slot.subject,
        completed: slot.completed,
        rawItem: slot
      });
    });

    return list;
  }, [upcomingClasses, recordings, exams, weeklyAssessments, tasks, customSlots]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(evt => {
      if (selectedFilterType !== 'all' && evt.type !== selectedFilterType) return false;
      if (selectedSubjectFilter !== 'all' && evt.subject && !evt.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [allEvents, selectedFilterType, selectedSubjectFilter]);

  // Calendar Calculation Variables
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Selected Day Agenda Events
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter(e => sameDay(e.date, selectedDate))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents, selectedDate]);

  const isSelectedToday = sameDay(selectedDate, today);

  // Today's total and completed count
  const todayEvents = allEvents.filter(e => sameDay(e.date, today));
  const todayCompletedCount = todayEvents.filter(e => e.completed).length;
  const todayProgressPercent = todayEvents.length > 0 ? Math.round((todayCompletedCount / todayEvents.length) * 100) : 100;

  // Week View Days Calculation (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Upcoming Milestones (Next 14 Days)
  const upcomingMilestones = useMemo(() => {
    const now = new Date().getTime();
    return allEvents
      .filter(e => e.date.getTime() >= now - 3600000)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 8);
  }, [allEvents]);

  // Handle Add Custom Study Slot
  const handleSaveCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTitle.trim()) return;

    const [hours, mins] = newSlotTime.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours || 17, mins || 0, 0, 0);

    const newSlot: CustomStudySlot = {
      id: `slot-${Date.now()}`,
      title: newSlotTitle.trim(),
      subject: newSlotSubject,
      startsAt: slotDate.toISOString(),
      durationMin: Number(newSlotDuration) || 45,
      completed: false
    };

    setCustomSlots(prev => [newSlot, ...prev]);
    setNewSlotTitle('');
    setIsAddSlotOpen(false);
  };

  const handleToggleSlotCompleted = (slotId: string) => {
    setCustomSlots(prev => prev.map(s => s.id === slotId ? { ...s, completed: !s.completed } : s));
  };

  const handleDeleteSlot = (slotId: string) => {
    setCustomSlots(prev => prev.filter(s => s.id !== slotId));
  };

  // Copy Schedule to Clipboard
  const handleCopySchedule = () => {
    if (selectedDayEvents.length === 0) return;
    const dateStr = formatDate(selectedDate.toISOString());
    const text = `📅 Academic Schedule for ${dateStr}:\n` + 
      selectedDayEvents.map(e => `• [${formatTime(e.date.toISOString())}] ${e.title} (${e.subtitle})`).join('\n') +
      `\n\nStudy Hub — AI Studio Portal`;
    
    navigator.clipboard.writeText(text);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2500);
  };

  // Export .ics calendar file
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Studio Academic Hub//EN\nCALSCALE:GREGORIAN\n";
    
    allEvents.forEach(evt => {
      const dt = evt.date;
      const dtStr = dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDt = new Date(dt.getTime() + 60 * 60 * 1000);
      const dtEndStr = endDt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      icsContent += `BEGIN:VEVENT\nSUMMARY:${evt.title}\nDESCRIPTION:${evt.subtitle}\nDTSTART:${dtStr}\nDTEND:${dtEndStr}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `academic_schedule_${viewDate.getFullYear()}_${viewDate.getMonth() + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Gamified Engagement Hub: Streak, Daily Mission, Focus Pomodoro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Streak & Consistency Card */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#001824] to-[#010914] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ffa600]/15 border border-[#ffa600]/30 flex items-center justify-center text-[#ffa600]">
                <Flame className="w-4 h-4 animate-bounce" />
              </div>
              <span className="text-xs font-bold font-['Sora'] text-white">Study Streak</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40">
              🔥 5 DAYS
            </span>
          </div>

          <div className="my-3 space-y-1">
            <div className="text-2xl font-bold font-['Sora'] text-white flex items-baseline gap-1.5">
              <span>94%</span>
              <span className="text-xs font-normal text-[#8d99b3]">attendance &amp; test on-time</span>
            </div>
            <p className="text-[11px] text-[#8d99b3]">
              Active in Cambridge &amp; Edexcel revision cycles this week.
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayChar, i) => (
              <div 
                key={i} 
                className={`flex-1 py-1 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                  i < 5 
                    ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40 shadow-[0_0_8px_rgba(255,166,0,0.2)]' 
                    : 'bg-white/[0.04] text-[#8d99b3]'
                }`}
              >
                {dayChar}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Mission & Action Card */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#00222a] to-[#010e14] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#14e6ff]/15 border border-[#14e6ff]/30 flex items-center justify-center text-[#14e6ff]">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-['Sora'] text-white">Today's Goals</span>
            </div>
            <span className="text-[11px] font-mono text-[#14e6ff] font-bold">
              {todayEvents.length} Tasks Scheduled
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8d99b3]">Daily Completion</span>
              <span className="font-mono text-white font-bold">{todayProgressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#14e6ff] to-[#5ff2ff] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(20,230,255,0.4)]"
                style={{ width: `${Math.max(15, todayProgressPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] gap-2">
            <button
              onClick={handleToday}
              className="flex-1 py-1.5 rounded-xl bg-[#14e6ff]/15 hover:bg-[#14e6ff]/25 border border-[#14e6ff]/30 text-xs font-bold text-[#14e6ff] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Jump to Today</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white flex items-center gap-1 transition-all cursor-pointer"
              title="Schedule Personal Study Block"
            >
              <Plus className="w-3.5 h-3.5 text-[#14e6ff]" />
              <span>Study Slot</span>
            </button>
          </div>
        </div>

        {/* Focus Study Pomodoro Mini-Widget */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#1b0826] to-[#09020f] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ff00c3]/15 border border-[#ff00c3]/30 flex items-center justify-center text-[#ff00c3]">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-['Sora'] text-white">Focus Pomodoro</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
              isPomodoroRunning 
                ? 'bg-[#22e07a]/20 text-[#22e07a] border-[#22e07a]/40 animate-pulse' 
                : 'bg-white/[0.06] text-[#8d99b3] border-white/10'
            }`}>
              {isPomodoroRunning ? 'FOCUSING' : 'IDLE'}
            </span>
          </div>

          <div className="my-2 flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {formatPomoTime(pomodoroSeconds)}
              </div>
              <div className="text-[11px] text-[#8d99b3] truncate max-w-[160px]">
                {pomodoroTopic}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePomodoro}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  isPomodoroRunning
                    ? 'bg-[#ffa600] text-[#00131a] shadow-[0_0_15px_rgba(255,166,0,0.4)]'
                    : 'bg-[#ff00c3] text-white shadow-[0_0_15px_rgba(255,0,195,0.4)] hover:scale-105'
                }`}
              >
                {isPomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={resetPomodoro}
                className="p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#8d99b3]">
            <span>25m Study / 5m Break</span>
            <button 
              onClick={() => {
                const topic = prompt("Enter target study topic:", pomodoroTopic);
                if (topic) setPomodoroTopic(topic);
              }}
              className="text-[#ff00c3] hover:underline cursor-pointer"
            >
              Change Topic
            </button>
          </div>
        </div>

      </div>

      {/* 2. Top Controls & Navigation Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="min-w-[170px] text-center">
            <h2 className="font-['Sora'] font-bold text-base sm:text-lg text-white">
              {viewMode === 'week' 
                ? `Week of ${formatDate(weekDays[0].toISOString())}`
                : monthLabel
              }
            </h2>
            <span className="text-[11px] font-mono text-[#8d99b3]">
              Academic Term 2026
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="ml-2 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* View Mode Toggle (Month / Week / Timeline) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-black/40 p-1 rounded-2xl border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Sora'] transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.3)]'
                  : 'text-[#8d99b3] hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Sora'] transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.3)]'
                  : 'text-[#8d99b3] hover:text-white'
              }`}
            >
              Week Flow
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Sora'] transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.3)]'
                  : 'text-[#8d99b3] hover:text-white'
              }`}
            >
              Milestones
            </button>
          </div>

          {/* Export / Sync button */}
          <button
            onClick={handleExportICS}
            title="Download .ics calendar file"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white border border-white/10 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export .ics</span>
          </button>
        </div>
      </div>

      {/* 3. Filter Ribbons (Categories & Subjects) */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d99b3] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#14e6ff]" />
            Types:
          </span>

          <button
            onClick={() => setSelectedFilterType('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilterType === 'all'
                ? 'bg-white text-[#00131a] font-bold'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            All ({allEvents.length})
          </button>

          <button
            onClick={() => setSelectedFilterType('class')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedFilterType === 'class'
                ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_10px_rgba(20,230,255,0.3)]'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#14e6ff]" />
            <span>Live Classes ({upcomingClasses.length})</span>
          </button>

          <button
            onClick={() => setSelectedFilterType('exam')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedFilterType === 'exam'
                ? 'bg-[#22e07a] text-[#00131a] font-bold shadow-[0_0_10px_rgba(34,224,122,0.3)]'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#22e07a]" />
            <span>Timed Mocks ({exams.length})</span>
          </button>

          <button
            onClick={() => setSelectedFilterType('assessment')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedFilterType === 'assessment'
                ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_10px_rgba(255,166,0,0.3)]'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ffa600]" />
            <span>Submissions ({weeklyAssessments.length})</span>
          </button>

          <button
            onClick={() => setSelectedFilterType('recording')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedFilterType === 'recording'
                ? 'bg-[#ff00c3] text-white font-bold shadow-[0_0_10px_rgba(255,0,195,0.3)]'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff00c3]" />
            <span>Recordings ({recordings.length})</span>
          </button>

          <button
            onClick={() => setSelectedFilterType('study_slot')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedFilterType === 'study_slot'
                ? 'bg-[#ff5c8a] text-white font-bold'
                : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff5c8a]" />
            <span>Study Slots ({customSlots.length})</span>
          </button>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#8d99b3]">Subject:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#00131a] border border-white/10 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
          >
            <option value="all">All Subjects</option>
            {courses.map(c => (
              <option key={c.id} value={c.name}>{c.name.split('—')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. MAIN VIEW CONTAINER: Month / Week / Timeline */}
      {viewMode === 'month' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4">
          
          {/* Weekdays header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#8d99b3]">
            {weekdayNames.map(name => (
              <div key={name} className="py-1">{name}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset days */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] sm:min-h-[105px] rounded-2xl bg-white/[0.01] border border-white/[0.02] opacity-20 pointer-events-none" />
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const d = idx + 1;
              const cellDate = new Date(year, month, d);
              const isCellToday = sameDay(cellDate, today);
              const isCellSelected = sameDay(cellDate, selectedDate);
              const dayEvents = filteredEvents.filter(e => sameDay(e.date, cellDate));

              return (
                <div
                  key={d}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`
                    min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl flex flex-col justify-between transition-all relative group cursor-pointer
                    ${isCellSelected 
                      ? 'bg-[#14e6ff]/15 border-2 border-[#14e6ff] shadow-[0_0_20px_rgba(20,230,255,0.25)] scale-[1.02] z-10' 
                      : isCellToday
                        ? 'bg-white/[0.08] border border-[#14e6ff]/60 shadow-[0_0_12px_rgba(20,230,255,0.15)]'
                        : dayEvents.length > 0
                          ? 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08]'
                          : 'bg-white/[0.01] hover:bg-white/[0.05] border border-white/[0.04]'
                    }
                  `}
                >
                  {/* Top row: Day Number & Today indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-['Sora'] font-bold ${
                      isCellSelected ? 'text-[#14e6ff]' : isCellToday ? 'text-white' : 'text-[#8d99b3]'
                    }`}>
                      {d}
                    </span>

                    {isCellToday && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#14e6ff] text-[#00131a]">
                        TODAY
                      </span>
                    )}

                    {dayEvents.length > 0 && !isCellToday && (
                      <span className="text-[9px] font-mono font-semibold text-[#8d99b3] opacity-60">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Middle / Bottom: Event Badges */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded-md truncate flex items-center gap-1"
                        style={{
                          backgroundColor: `${evt.color}20`,
                          color: evt.color,
                          border: `1px solid ${evt.color}40`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: evt.color }} />
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div className="text-[8px] font-mono text-[#8d99b3] px-1 truncate">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Tiny event type dots for mobile */}
                  <div className="flex items-center gap-1 justify-center sm:hidden">
                    {dayEvents.slice(0, 3).map((evt, i) => (
                      <span 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: evt.color }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK TIMETABLE VIEW */}
      {viewMode === 'week' && (
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((dayDate) => {
              const isDayToday = sameDay(dayDate, today);
              const isDaySelected = sameDay(dayDate, selectedDate);
              const dayEvts = filteredEvents.filter(e => sameDay(e.date, dayDate));

              return (
                <div
                  key={dayDate.toISOString()}
                  onClick={() => setSelectedDate(dayDate)}
                  className={`rounded-2xl p-3.5 space-y-3 cursor-pointer transition-all border ${
                    isDaySelected
                      ? 'bg-[#14e6ff]/10 border-[#14e6ff] shadow-[0_0_15px_rgba(20,230,255,0.2)]'
                      : isDayToday
                        ? 'bg-white/[0.07] border-[#14e6ff]/40'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div>
                      <div className="text-[11px] font-bold uppercase text-[#8d99b3]">
                        {dayDate.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className="font-['Sora'] font-bold text-sm text-white">
                        {dayDate.getDate()} {monthShort(dayDate.toISOString())}
                      </div>
                    </div>
                    {isDayToday && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#14e6ff] text-[#00131a] font-mono">
                        NOW
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 min-h-[140px]">
                    {dayEvts.length === 0 ? (
                      <div className="text-[11px] text-[#8d99b3]/60 italic py-4 text-center">
                        No sessions
                      </div>
                    ) : (
                      dayEvts.map(evt => (
                        <div
                          key={evt.id}
                          className="p-2 rounded-xl text-xs space-y-1 transition-transform hover:scale-[1.02]"
                          style={{
                            backgroundColor: `${evt.color}15`,
                            border: `1px solid ${evt.color}35`
                          }}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-[10px] uppercase font-mono truncate" style={{ color: evt.color }}>
                              {evt.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-[#8d99b3] font-mono flex-shrink-0">
                              {formatTime(evt.date.toISOString())}
                            </span>
                          </div>
                          <div className="font-semibold text-white truncate text-[11px]">
                            {evt.title}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TIMELINE / UPCOMING MILESTONES VIEW */}
      {viewMode === 'timeline' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#14e6ff]" />
              <h3 className="font-['Sora'] font-bold text-sm text-white">
                Upcoming Academic Deadlines &amp; Live Deck Timeline
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8d99b3]">{upcomingMilestones.length} upcoming events</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.1]">
            {upcomingMilestones.map((evt, idx) => {
              const evtDate = evt.date;
              const isEvtToday = isToday(evtDate.toISOString());

              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-6 top-3 w-4 h-4 rounded-full border-2 border-[#00131a] flex items-center justify-center"
                    style={{ backgroundColor: evt.color, boxShadow: `0 0 10px ${evt.color}` }}
                  />

                  <div className="glass-card-nested p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono"
                          style={{ backgroundColor: `${evt.color}20`, color: evt.color, border: `1px solid ${evt.color}40` }}
                        >
                          {evt.type.replace('_', ' ')}
                        </span>
                        {isEvtToday && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono bg-[#14e6ff] text-[#00131a]">
                            TODAY
                          </span>
                        )}
                        <span className="text-xs font-mono text-[#8d99b3]">
                          {formatDate(evtDate.toISOString())} at {formatTime(evtDate.toISOString())}
                        </span>
                      </div>

                      <h4 className="font-['Sora'] font-bold text-sm text-white">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#8d99b3]">
                        {evt.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {evt.meetUrl && (
                        <a
                          href={evt.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold font-['Sora'] flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>Join Meet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {evt.tabLink && (
                        <button
                          onClick={() => onNavigate(evt.tabLink!)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Selected Day Agenda Deck & Interactive Task Completion */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        
        {/* Header with date and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#14e6ff]/15 border border-[#14e6ff]/30 flex items-center justify-center text-[#14e6ff]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Sora'] font-bold text-base text-white">
                  {isSelectedToday ? `Today's Agenda` : `Day Agenda`}
                </h3>
                {isSelectedToday && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#14e6ff]/20 text-[#14e6ff] font-mono">
                    ACTIVE DAY
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8d99b3]">
                {formatDate(selectedDate.toISOString())} · {selectedDayEvents.length} Item{selectedDayEvents.length === 1 ? '' : 's'} scheduled
              </p>
            </div>
          </div>

          {/* Quick Day Utility Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold font-['Sora'] flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.25)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Study Session</span>
            </button>

            <button
              onClick={handleCopySchedule}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Copy Day Schedule to Clipboard"
            >
              {copiedSchedule ? <Check className="w-4 h-4 text-[#22e07a]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Selected Day Event Cards */}
        <div className="space-y-3">
          {selectedDayEvents.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#8d99b3]">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <p className="text-sm text-white font-medium">No schedule items on this day</p>
              <p className="text-xs text-[#8d99b3] max-w-sm mx-auto">
                No classes or deadlines are logged for this date. You can add a personal study block or past paper practice session!
              </p>
              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/10 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#14e6ff]" />
                <span>Schedule Study Slot</span>
              </button>
            </div>
          ) : (
            selectedDayEvents.map((evt) => {
              const isSlot = evt.type === 'study_slot';
              const isTask = evt.type === 'task';

              return (
                <div 
                  key={evt.id}
                  className="glass-card-nested p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-white/20 group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Glowing colored icon box */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                      style={{
                        backgroundColor: `${evt.color}15`,
                        border: `1px solid ${evt.color}30`,
                        color: evt.color
                      }}
                    >
                      {evt.type === 'class' && <Video className="w-4 h-4" />}
                      {evt.type === 'exam' && <FileCheck className="w-4 h-4" />}
                      {evt.type === 'assessment' && <BookOpen className="w-4 h-4" />}
                      {evt.type === 'recording' && <Video className="w-4 h-4" />}
                      {evt.type === 'task' && <CheckSquare className="w-4 h-4" />}
                      {evt.type === 'study_slot' && <Target className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded"
                          style={{ backgroundColor: `${evt.color}20`, color: evt.color }}
                        >
                          {evt.type.replace('_', ' ')}
                        </span>
                        <span className="font-semibold text-sm text-white truncate">
                          {evt.title}
                        </span>
                      </div>

                      <div className="text-xs text-[#8d99b3] truncate">
                        {evt.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Actions according to event type */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    {/* If it's a Live Class */}
                    {evt.meetUrl && (
                      <a
                        href={evt.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold font-['Sora'] flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)] cursor-pointer"
                      >
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>Join Meet</span>
                        <ExternalLink className="w-3 h-3 opacity-75" />
                      </a>
                    )}

                    {/* If it's a study task */}
                    {isTask && onToggleTask && (
                      <button
                        onClick={() => onToggleTask(evt.rawItem.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          evt.completed
                            ? 'bg-[#22e07a]/20 text-[#22e07a] border border-[#22e07a]/30'
                            : 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{evt.completed ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    )}

                    {/* If it's a personal custom study slot */}
                    {isSlot && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleSlotCompleted(evt.rawItem.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            evt.completed
                              ? 'bg-[#22e07a]/20 text-[#22e07a] border border-[#22e07a]/30'
                              : 'bg-[#ff5c8a]/20 text-[#ff5c8a] border border-[#ff5c8a]/30 hover:bg-[#ff5c8a]/30'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{evt.completed ? 'Done' : 'Mark Done'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSlot(evt.rawItem.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-[#8d99b3] hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete slot"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Standard tab link button */}
                    {evt.tabLink && (
                      <button
                        onClick={() => onNavigate(evt.tabLink!)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-[#14e6ff] flex items-center gap-1 transition-all border border-white/10 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. Modal: Add Personal Study Session Slot */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 border border-white/15 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#14e6ff]/15 text-[#14e6ff] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-['Sora'] font-bold text-base text-white">
                  Schedule Study Session
                </h3>
              </div>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomSlot} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#8d99b3] block mb-1">
                  Session Topic / Task Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 7 Past Papers Revision"
                  value={newSlotTitle}
                  onChange={(e) => setNewSlotTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-[#8d99b3]/60 focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#8d99b3] block mb-1">
                  Enrolled Subject / Board
                </label>
                <select
                  value={newSlotSubject}
                  onChange={(e) => setNewSlotSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#00131a] border border-white/10 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="General Revision">General Revision &amp; Homework</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#8d99b3] block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#8d99b3] block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={newSlotDuration}
                    onChange={(e) => setNewSlotDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#8d99b3] bg-white/[0.03] p-2.5 rounded-xl border border-white/05 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#14e6ff] flex-shrink-0" />
                <span>Slot will be scheduled for <strong>{formatDate(selectedDate.toISOString())}</strong></span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold font-['Sora'] transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
