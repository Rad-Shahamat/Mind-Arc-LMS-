import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  Clock, 
  Radio,
  Sparkles
} from 'lucide-react';
import { Student, TabId } from '../types';

interface HeaderProps {
  currentTab: TabId;
  student: Student;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNotices: () => void;
  unreadCount: number;
  liveClassesCount: number;
  onNavigateToClasses: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  student,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNotices,
  unreadCount,
  liveClassesCount,
  onNavigateToClasses
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabTitles: Record<TabId, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your courses, schedule, and recent activity' },
    courses: { title: 'Academic Courses', subtitle: 'Edexcel (IGCSE & IAL) and Cambridge (O-Levels & A-Level) Syllabi' },
    calendar: { title: 'Academic Calendar', subtitle: 'Classes, tests, deadlines, and live sessions' },
    classes: { title: 'Live Classes & Lectures', subtitle: 'Interactive Google Meet schedule & study materials' },
    recordings: { title: 'Lecture Recordings', subtitle: 'Watch past classes with on-demand video playback' },
    assessments: { title: 'Assessments & Examinations', subtitle: 'Course-wise teacher assignments, DOC/PDF submissions & timed auto-graded MCQs' },
    planner: { title: 'Study Planner', subtitle: 'Manage assignments, goals, and study tasks' },
    papers: { title: 'Past Papers', subtitle: 'Question papers and official mark schemes' },
    announcements: { title: 'Announcements', subtitle: 'Official notices and faculty bulletin' },
    billing: { title: 'Billing & Invoices', subtitle: 'Subscription status and payment history' },
    profile: { title: 'Student Profile', subtitle: 'Account information and enrollment details' },
    support: { title: 'Student Support', subtitle: 'Get assistance via WhatsApp, Telegram, or phone' }
  };

  const currentMeta = tabTitles[currentTab] || { title: 'Dashboard', subtitle: 'Student Portal' };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#01021c]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-[#8d99b3] hover:text-white transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg sm:text-xl text-white tracking-tight">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#14e6ff]/10 text-[#14e6ff] border border-[#14e6ff]/30 font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              STUDENT PORTAL
            </span>
          </div>
          <p className="hidden md:block text-xs text-[#8d99b3] mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Student Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Classes Badge */}
        {liveClassesCount > 0 && (
          <button
            onClick={onNavigateToClasses}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#25D366]" />
            <span>{liveClassesCount} Live Today</span>
          </button>
        )}

        {/* Real-time Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#8d99b3]">
          <Clock className="w-3.5 h-3.5 text-[#14e6ff]" />
          <span>{timeStr || '00:00'}</span>
        </div>

        {/* Global Search Bar / Command Palette Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#8d99b3] hover:text-white transition-all group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#14e6ff] transition-colors" />
          <span className="hidden md:inline">Search…</span>
          <kbd className="hidden md:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-[#8d99b3] border border-white/10">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotices}
          className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#8d99b3] hover:text-white transition-colors cursor-pointer"
          title="Announcements"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#14e6ff] text-[#00131a] font-bold text-[9px] flex items-center justify-center font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Student Avatar Icon */}
        <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-white/10">
          <img
            src={student.avatarUrl}
            alt={student.name}
            className="w-8 h-8 rounded-xl object-cover border border-white/20"
          />
        </div>
      </div>
    </header>
  );
};
