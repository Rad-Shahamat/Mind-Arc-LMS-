import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Video, 
  FileCheck, 
  FileText, 
  CheckSquare, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Course, UpcomingClass, Recording, Exam, Task, PastPaper, TabId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  upcomingClasses: UpcomingClass[];
  recordings: Recording[];
  exams: Exam[];
  tasks: Task[];
  pastPapers: PastPaper[];
  onNavigate: (tab: TabId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  courses,
  upcomingClasses,
  recordings,
  exams,
  tasks,
  pastPapers,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose(); else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCourses = q ? courses.filter(c => 
    c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q) || (c.code && c.code.toLowerCase().includes(q))
  ) : [];

  const filteredClasses = q ? upcomingClasses.filter(c => 
    c.topic.toLowerCase().includes(q) || c.courseName.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q)
  ) : upcomingClasses.slice(0, 2);

  const filteredRecordings = q ? recordings.filter(r => 
    r.topic.toLowerCase().includes(q) || r.courseName.toLowerCase().includes(q)
  ) : recordings.slice(0, 2);

  const filteredExams = q ? exams.filter(e => 
    e.title.toLowerCase().includes(q) || e.courseName.toLowerCase().includes(q)
  ) : exams.slice(0, 2);

  const filteredPapers = q ? pastPapers.filter(p => 
    p.paper.toLowerCase().includes(q) || p.session.toLowerCase().includes(q)
  ) : pastPapers.slice(0, 2);

  const filteredTasks = q ? tasks.filter(t => 
    t.title.toLowerCase().includes(q)
  ) : tasks.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#01021c]/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#050e33]/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(20,230,255,0.15)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 relative">
          <Search className="w-5 h-5 text-[#14e6ff]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, recordings, mock exams, past papers, planner..."
            className="w-full bg-transparent text-white placeholder-[#8d99b3] text-sm focus:outline-none font-['DM_Sans']"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-[#8d99b3] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#14e6ff] px-2 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Courses & Syllabi
              </div>
              <div className="space-y-1.5">
                {filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onNavigate('courses'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {c.imageUrl ? (
                        <img 
                          src={c.imageUrl} 
                          alt={c.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] text-[#14e6ff] flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-[#14e6ff] truncate">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-[#8d99b3] truncate">
                          {c.board} • {c.category} · {c.teacher}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#14e6ff] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Classes */}
          {filteredClasses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#14e6ff] px-2 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Live Classes
              </div>
              <div className="space-y-1.5">
                {filteredClasses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onNavigate('classes'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#14e6ff]">
                        {c.topic}
                      </div>
                      <div className="text-[11px] text-[#8d99b3]">
                        {c.courseName} · {c.teacher}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#14e6ff] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recordings */}
          {filteredRecordings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#ff00c3] px-2 mb-2">
                <Video className="w-3.5 h-3.5" />
                Recordings
              </div>
              <div className="space-y-1.5">
                {filteredRecordings.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { onNavigate('recordings'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#5ff2ff]">
                        {r.topic}
                      </div>
                      <div className="text-[11px] text-[#8d99b3]">
                        {r.courseName}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#5ff2ff] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mock Exams & Assessments */}
          {filteredExams.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#ffa600] px-2 mb-2">
                <FileCheck className="w-3.5 h-3.5" />
                Assessments & Exams
              </div>
              <div className="space-y-1.5">
                {filteredExams.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => { onNavigate('assessments'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#ffa600]">
                        {e.title}
                      </div>
                      <div className="text-[11px] text-[#8d99b3]">
                        {e.courseName} · {e.durationMin} min
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#ffa600] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Past Papers */}
          {filteredPapers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8c9bc4] px-2 mb-2">
                <FileText className="w-3.5 h-3.5" />
                Past Papers
              </div>
              <div className="space-y-1.5">
                {filteredPapers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onNavigate('papers'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-white">
                        {p.paper}
                      </div>
                      <div className="text-[11px] text-[#8d99b3]">
                        {p.session}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#22e07a] px-2 mb-2">
                <CheckSquare className="w-3.5 h-3.5" />
                Study Planner Tasks
              </div>
              <div className="space-y-1.5">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { onNavigate('planner'); onClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#22e07a]">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-[#8d99b3]">
                        {t.done ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-[#22e07a] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-[#8d99b3]">
          <span>Navigation shortcut</span>
          <div className="flex items-center gap-2 font-mono">
            <span>ESC to close</span>
            <span>·</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
