import React from 'react';
import { 
  BookOpen, 
  Video, 
  CalendarClock, 
  ArrowRight, 
  Users, 
  ExternalLink,
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Radio, 
  PlayCircle,
  FileCheck,
  Award,
  Sparkles,
  Upload,
  Send
} from 'lucide-react';
import { Student, Course, UpcomingClass, Recording, TabId, WeeklyAssessment, Exam, Task } from '../types';
import { formatDate, formatTime, durationSuffix, isToday, monthShort, dayNum } from '../utils/formatters';
import { StudentProgressAnalytics } from './StudentProgressAnalytics';

interface DashboardTabProps {
  student: Student;
  courses: Course[];
  upcomingClasses: UpcomingClass[];
  recordings: Recording[];
  weeklyAssessments?: WeeklyAssessment[];
  exams?: Exam[];
  tasks?: Task[];
  onNavigate: (tab: TabId) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  student,
  courses,
  upcomingClasses,
  recordings,
  weeklyAssessments = [],
  exams = [],
  tasks = [],
  onNavigate
}) => {
  const firstName = student.name.split(' ')[0] || 'Student';
  const sortedClasses = [...upcomingClasses].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const todayClasses = sortedClasses.filter(c => isToday(c.startsAt));
  const nextClass = sortedClasses[0];
  const latestRecording = [...recordings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const pendingAssessmentsCount = weeklyAssessments.filter(a => !a.submissions?.some(s => s.studentId === student.id)).length;
  const availableExamsCount = exams.filter(e => !e.result).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Clean Minimal Greeting Section without background card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 px-1">
        <div className="flex items-center gap-4">
          <div className="relative">
            {student.avatarUrl ? (
              <img 
                src={student.avatarUrl} 
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/10" 
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 text-[#14e6ff] font-['Sora'] font-bold text-xl flex items-center justify-center">
                {student.initials}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#01021c]" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#8d99b3]">
              <span className="font-mono">{student.id}</span>
              <span>•</span>
              <span className="text-[#25D366] font-medium">Student Active</span>
            </div>
            <h2 className="font-['Sora'] font-bold text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
              Welcome back, <span className="text-[#14e6ff]">{firstName}</span> 👋
            </h2>
            <p className="text-xs sm:text-sm text-[#8d99b3] mt-1">
              {todayClasses.length > 0 
                ? `You have ${todayClasses.length} live ${todayClasses.length === 1 ? 'class' : 'classes'} scheduled for today.` 
                : 'No live classes scheduled for today.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('classes')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-['Sora'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <span>Live Class Deck</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Next Class Quick Bar (if available) */}
      {nextClass && (
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-[#14e6ff] w-full">
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 w-full sm:w-auto flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/10 text-[#14e6ff] flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14e6ff] bg-[#14e6ff]/10 px-2 py-0.5 rounded font-mono shrink-0">
                  Next Up
                </span>
                <span className="text-xs text-[#8d99b3] font-mono">
                  {formatDate(nextClass.startsAt)} at {formatTime(nextClass.startsAt)}
                </span>
              </div>
              <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-white break-words mt-1">
                {nextClass.topic}
              </h3>
              <p className="text-xs text-[#8d99b3] break-words mt-0.5">
                {nextClass.courseName} · {nextClass.teacher}
              </p>
            </div>
          </div>

          <a
            href={nextClass.meetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] border border-[#14e6ff]/30 text-xs font-bold font-['Sora'] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.25)] shrink-0 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#00131a] shrink-0" />
            <span className="whitespace-nowrap">Join Google Meet</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
          </a>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div 
          onClick={() => onNavigate('courses')}
          className="glass-panel p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-[#14e6ff]/30 transition-all group"
        >
          <div className="flex items-center justify-between text-[#8d99b3]">
            <span className="text-xs font-medium">Courses</span>
            <BookOpen className="w-4 h-4 text-[#14e6ff] group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-['Sora'] font-bold text-xl sm:text-2xl lg:text-3xl text-white mt-2">
            {courses.length}
          </div>
          <div className="text-[11px] text-[#8d99b3] mt-1">Enrolled modules</div>
        </div>

        <div 
          onClick={() => onNavigate('classes')}
          className="glass-panel p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-[#ffa600]/30 transition-all group"
        >
          <div className="flex items-center justify-between text-[#8d99b3]">
            <span className="text-xs font-medium">Live Classes</span>
            <CalendarClock className="w-4 h-4 text-[#ffa600] group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-['Sora'] font-bold text-xl sm:text-2xl lg:text-3xl text-white mt-2">
            {upcomingClasses.length}
          </div>
          <div className="text-[11px] text-[#8d99b3] mt-1">
            {todayClasses.length} scheduled today
          </div>
        </div>

        <div 
          onClick={() => onNavigate('recordings')}
          className="glass-panel p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-[#ff00c3]/30 transition-all group"
        >
          <div className="flex items-center justify-between text-[#8d99b3]">
            <span className="text-xs font-medium">Recordings</span>
            <Video className="w-4 h-4 text-[#ff00c3] group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-['Sora'] font-bold text-xl sm:text-2xl lg:text-3xl text-white mt-2">
            {recordings.length}
          </div>
          <div className="text-[11px] text-[#8d99b3] mt-1">Video archives</div>
        </div>

        <div 
          onClick={() => onNavigate('assessments')}
          className="glass-panel p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-[#14e6ff]/30 transition-all group"
        >
          <div className="flex items-center justify-between text-[#8d99b3]">
            <span className="text-xs font-medium text-[#14e6ff]">Assessments</span>
            <FileCheck className="w-4 h-4 text-[#14e6ff] group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-['Sora'] font-bold text-xl sm:text-2xl lg:text-3xl text-white mt-2">
            {weeklyAssessments.length + exams.length}
          </div>
          <div className="text-[11px] text-[#14e6ff] mt-1 font-medium truncate">
            {pendingAssessmentsCount} pending submission
          </div>
        </div>
      </div>

      {/* Progress & Performance Analytics */}
      <StudentProgressAnalytics
        student={student}
        courses={courses}
        weeklyAssessments={weeklyAssessments}
        exams={exams}
        tasks={tasks}
        onNavigate={onNavigate}
      />

      {/* Grid: Upcoming Schedule + Right Column (Progress & Archive) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Classes */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#14e6ff]" />
              <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-white">
                Upcoming Live Schedule
              </h3>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-[#8d99b3] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {sortedClasses.slice(0, 4).map(c => {
              const today = isToday(c.startsAt);
              return (
                <div
                  key={c.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 hover:bg-white/[0.015] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono shrink-0 ${
                      today ? 'bg-[#14e6ff] text-[#00131a] font-bold' : 'bg-white/[0.05] text-[#8d99b3]'
                    }`}>
                      <span className="text-[9px] uppercase font-bold">{monthShort(c.startsAt)}</span>
                      <span className="text-xs font-bold leading-none">{dayNum(c.startsAt)}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white break-words">
                          {c.topic}
                        </span>
                        {today && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#14e6ff]/20 text-[#14e6ff] font-mono shrink-0">
                            TODAY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8d99b3] break-words mt-0.5">
                        {c.courseName} · {formatTime(c.startsAt)} ({c.durationMin} min)
                      </div>
                    </div>
                  </div>

                  <a
                    href={c.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold font-['Sora'] flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <span>Join</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Syllabus Progress & Recent Lecture */}
        <div className="space-y-6">
          {/* Syllabus Progress */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#22e07a]" />
                <h3 className="font-['Sora'] font-bold text-sm text-white">
                  Syllabus Progress
                </h3>
              </div>
              <span className="text-xs text-[#8d99b3] font-mono">{courses.length} courses</span>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 5).map(c => (
                <div key={c.id} className="space-y-1.5 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => onNavigate('courses')}>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {c.imageUrl ? (
                        <img 
                          src={c.imageUrl} 
                          alt={c.name}
                          className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-white/10" 
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 text-[#14e6ff]">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="font-medium text-white truncate">{c.name.split('—')[0]}</span>
                    </div>
                    <span className="font-mono text-[#14e6ff] font-bold text-[11px] flex-shrink-0">{c.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden ml-9.5">
                    <div 
                      className="h-full rounded-full bg-[#14e6ff] transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lecture Card */}
          {latestRecording && (
            <div className="glass-panel rounded-2xl p-5 space-y-3 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#2AABEE]" />
                  Latest Lecture (Telegram)
                </span>
                <button
                  onClick={() => onNavigate('recordings')}
                  className="text-[11px] text-[#8d99b3] hover:text-[#14e6ff] cursor-pointer transition-colors"
                >
                  All archives →
                </button>
              </div>

              {/* Telegram Preview Box */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#09182d] to-[#040d1a] border border-[#2AABEE]/25 p-4 flex flex-col justify-between min-h-[140px] group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2AABEE]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2AABEE]/20 text-[#2AABEE] border border-[#2AABEE]/30">
                      <Send className="w-2.5 h-2.5" />
                      {latestRecording.telegramChannelName || 'Telegram Lecture Stream'}
                    </span>
                    {latestRecording.duration && (
                      <span className="text-[10px] font-mono text-[#8d99b3]">
                        {latestRecording.duration}
                      </span>
                    )}
                  </div>

                  <h4 className="font-['Sora'] font-bold text-xs sm:text-sm text-white line-clamp-2">
                    {latestRecording.topic}
                  </h4>
                  <div className="text-[11px] text-[#8d99b3] flex items-center gap-2">
                    <span>{latestRecording.teacher}</span>
                    <span>•</span>
                    <span>{formatDate(latestRecording.date)}</span>
                  </div>
                </div>

                <div className="pt-3 relative z-10 flex items-center gap-2">
                  <a
                    href={latestRecording.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white text-xs font-bold font-['Sora'] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(42,171,238,0.35)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Watch on Telegram</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                  <button
                    onClick={() => onNavigate('recordings')}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 transition-colors"
                    title="Open in Lecture Vault"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
