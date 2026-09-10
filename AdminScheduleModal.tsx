import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Link, 
  FileText, 
  Upload, 
  CheckCircle2, 
  X, 
  Trash2, 
  Play, 
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';
import { Course, ClassScheduleItem, LectureSheet, WeeklyAssessment } from '../types';

interface AdminScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  classSchedules: ClassScheduleItem[];
  lectureSheets: LectureSheet[];
  weeklyAssessments: WeeklyAssessment[];
  onAddSchedule: (schedule: Omit<ClassScheduleItem, 'id'>) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  onToggleLive: (scheduleId: string) => void;
  onAddAdminLectureSheet: (sheet: Omit<LectureSheet, 'id' | 'downloads' | 'uploadedAt'>) => void;
}

export const AdminScheduleModal: React.FC<AdminScheduleModalProps> = ({
  isOpen,
  onClose,
  courses,
  classSchedules,
  lectureSheets,
  weeklyAssessments,
  onAddSchedule,
  onDeleteSchedule,
  onToggleLive,
  onAddAdminLectureSheet
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedules' | 'sheets' | 'audit'>('schedules');
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [showAddSheetForm, setShowAddSheetForm] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    courseId: courses[0]?.id || '',
    topic: '',
    dayOfWeek: 'Tuesday & Thursday',
    timeSlot: '07:30 PM – 09:00 PM BST',
    meetUrl: 'https://meet.google.com/mindarc-live-class'
  });

  const [newSheet, setNewSheet] = useState({
    courseId: courses[0]?.id || '',
    title: '',
    topic: '',
    fileType: 'PDF' as 'PDF' | 'Slides' | 'Handwritten Notes' | 'Worksheet',
    fileSize: '6.5 MB'
  });

  if (!isOpen) return null;

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.topic) return;

    const course = courses.find(c => c.id === newSchedule.courseId);

    onAddSchedule({
      courseId: newSchedule.courseId,
      courseName: course ? course.name : 'A-Level Course',
      board: course?.board || 'Cambridge',
      category: course?.category || 'A-Level',
      teacherName: course?.teacher || 'Academic Faculty',
      topic: newSchedule.topic,
      dayOfWeek: newSchedule.dayOfWeek,
      timeSlot: newSchedule.timeSlot,
      meetUrl: newSchedule.meetUrl || 'https://meet.google.com/mindarc-live',
      isLiveNow: false,
      uploadedByAdmin: true
    });

    setShowAddScheduleForm(false);
    setNewSchedule({
      courseId: courses[0]?.id || '',
      topic: '',
      dayOfWeek: 'Tuesday & Thursday',
      timeSlot: '07:30 PM – 09:00 PM BST',
      meetUrl: 'https://meet.google.com/mindarc-live-class'
    });
  };

  const handleCreateAdminSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheet.title) return;

    const course = courses.find(c => c.id === newSheet.courseId);

    onAddAdminLectureSheet({
      courseId: newSheet.courseId,
      courseName: course ? course.name : 'A-Level Chemistry',
      title: newSheet.title,
      topic: newSheet.topic || 'Official Curriculum Booklet',
      uploadedBy: 'Mind Arc Academic Admin',
      uploaderRole: 'admin',
      fileUrl: '#',
      fileType: newSheet.fileType,
      fileSize: newSheet.fileSize || '5.5 MB',
      board: course?.board,
      category: course?.category
    });

    setShowAddSheetForm(false);
    setNewSheet({
      courseId: courses[0]?.id || '',
      title: '',
      topic: '',
      fileType: 'PDF',
      fileSize: '6.5 MB'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#050e33] border border-white/15 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff00c3]/20 border border-[#ff00c3]/40 text-[#ff00c3] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#ff00c3]/20 text-[#ff00c3] font-bold">
                  MASTER ACADEMIC OPS
                </span>
                <span className="text-xs text-[#8d99b3]">Course & Schedule Controller</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">Admin Master Console</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8d99b3] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'schedules'
                ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_15px_rgba(20,230,255,0.3)]'
                : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Course Schedules & Meet Links ({classSchedules.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sheets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'sheets'
                ? 'bg-white text-[#01021c] font-bold shadow-md'
                : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Master Lecture Sheets ({lectureSheets.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'audit'
                ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_15px_rgba(255,166,0,0.3)]'
                : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Assessment & Gradebook Audit</span>
          </button>
        </div>

        {/* 1. SCHEDULE & MEET CONTROLLER */}
        {activeSubTab === 'schedules' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  Course Routine & Google Meet Launch Controller
                </h3>
                <p className="text-xs text-[#8d99b3]">
                  Upload weekly recurring schedules and active Google Meet room links for courses.
                </p>
              </div>

              <button
                onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
                className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddScheduleForm ? 'Close Form' : 'Upload New Schedule'}</span>
              </button>
            </div>

            {/* Form */}
            {showAddScheduleForm && (
              <form onSubmit={handleCreateSchedule} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Select Academic Course</label>
                  <select
                    value={newSchedule.courseId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, courseId: e.target.value })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.board} • {c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Lecture Topic / Syllabus Unit</label>
                  <input
                    type="text"
                    required
                    value={newSchedule.topic}
                    onChange={(e) => setNewSchedule({ ...newSchedule, topic: e.target.value })}
                    placeholder="e.g. Unit 3 Chemical Energetics & Born-Haber Cycles"
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Class Days</label>
                    <input
                      type="text"
                      required
                      value={newSchedule.dayOfWeek}
                      onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
                      placeholder="e.g. Tuesday & Thursday"
                      className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Time Slot</label>
                    <input
                      type="text"
                      required
                      value={newSchedule.timeSlot}
                      onChange={(e) => setNewSchedule({ ...newSchedule, timeSlot: e.target.value })}
                      placeholder="e.g. 07:30 PM – 09:00 PM BST"
                      className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Google Meet Link (Admin Generated)</label>
                  <input
                    type="url"
                    required
                    value={newSchedule.meetUrl}
                    onChange={(e) => setNewSchedule({ ...newSchedule, meetUrl: e.target.value })}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)]"
                  >
                    Save & Publish Routine
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="space-y-3">
              {classSchedules.map((sch) => (
                <div 
                  key={sch.id}
                  className="glass-card-nested p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/[0.06]"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-white/[0.05] text-[#14e6ff]">
                        {sch.board} • {sch.category}
                      </span>
                      {sch.isLiveNow ? (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-[#25D366] text-black animate-pulse">
                          LIVE NOW
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.03] px-2 py-0.2 rounded">
                          Scheduled
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white">{sch.courseName}</h4>
                    <p className="text-xs text-[#8d99b3] mt-0.5">{sch.topic} • <strong className="text-white">{sch.teacherName}</strong></p>
                    <p className="text-xs font-mono text-[#ffa600] mt-0.5">{sch.dayOfWeek} • {sch.timeSlot}</p>
                    <p className="text-[11px] font-mono text-[#14e6ff] mt-0.5">{sch.meetUrl}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onToggleLive(sch.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        sch.isLiveNow 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30'
                      }`}
                    >
                      {sch.isLiveNow ? 'Stop Live' : 'Launch Live'}
                    </button>

                    <button
                      onClick={() => onDeleteSchedule(sch.id)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-[#8d99b3] hover:text-red-400 border border-white/10 transition-colors"
                      title="Remove Schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. MASTER LECTURE SHEETS */}
        {activeSubTab === 'sheets' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  Academic Admin Master Lecture Sheets & Formula Booklets
                </h3>
                <p className="text-xs text-[#8d99b3]">
                  Upload official institution materials visible to all enrolled students.
                </p>
              </div>

              <button
                onClick={() => setShowAddSheetForm(!showAddSheetForm)}
                className="px-4 py-2 rounded-xl bg-white text-[#01021c] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>{showAddSheetForm ? 'Close Form' : 'Upload Admin Booklet'}</span>
              </button>
            </div>

            {showAddSheetForm && (
              <form onSubmit={handleCreateAdminSheet} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Course</label>
                  <select
                    value={newSheet.courseId}
                    onChange={(e) => setNewSheet({ ...newSheet, courseId: e.target.value })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.board} • {c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Document Title</label>
                  <input
                    type="text"
                    required
                    value={newSheet.title}
                    onChange={(e) => setNewSheet({ ...newSheet, title: e.target.value })}
                    placeholder="e.g. Master Formula & Definition Handbook (2026 Edition)"
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Topic</label>
                    <input
                      type="text"
                      value={newSheet.topic}
                      onChange={(e) => setNewSheet({ ...newSheet, topic: e.target.value })}
                      placeholder="e.g. Complete Syllabus Reference"
                      className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">File Type</label>
                    <select
                      value={newSheet.fileType}
                      onChange={(e) => setNewSheet({ ...newSheet, fileType: e.target.value as any })}
                      className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                    >
                      <option value="PDF">PDF Master Document</option>
                      <option value="Slides">Presentation Deck</option>
                      <option value="Handwritten Notes">Faculty Notes</option>
                      <option value="Worksheet">Practice Drill</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)]"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lectureSheets.map((sheet) => (
                <div key={sheet.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#14e6ff]">{sheet.fileType} • {sheet.fileSize}</span>
                    <span className="text-[#8d99b3]">{sheet.uploaderRole === 'admin' ? '👑 Admin' : '🧑‍🏫 Teacher'}</span>
                  </div>
                  <div className="font-bold text-xs text-white">{sheet.title}</div>
                  <div className="text-[11px] text-[#8d99b3]">{sheet.courseName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AUDIT ASSESSMENTS */}
        {activeSubTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-white">
                Weekly Assessment & Teacher Grading Audit
              </h3>
              <p className="text-xs text-[#8d99b3]">
                Admin view of all weekly assessments opened across courses and marks assigned by teachers.
              </p>
            </div>

            <div className="space-y-3">
              {weeklyAssessments.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{a.title}</span>
                    <span className="text-xs font-mono text-[#ffa600]">Week #{a.weekNumber} • {a.totalMarks} Marks</span>
                  </div>
                  <div className="text-xs text-[#8d99b3] flex items-center justify-between">
                    <span>Course: {a.courseName}</span>
                    <span>Teacher: {a.assignedBy}</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.04] text-[11px] font-mono text-[#25D366]">
                    Submissions: {a.submissions?.length || 0} evaluated / received
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
