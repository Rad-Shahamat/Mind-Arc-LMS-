import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Upload, 
  ExternalLink, 
  Search, 
  Filter, 
  Award, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  FileUp, 
  GraduationCap, 
  Download,
  Share2,
  X,
  Play,
  FileCode,
  Paperclip
} from 'lucide-react';
import { 
  Course, 
  Teacher, 
  LectureSheet, 
  WeeklyAssessment, 
  StudentSubmission, 
  ClassScheduleItem, 
  StudentDoubt,
  TeacherTabId 
} from '../types';
import { formatFullDateTime } from '../utils/formatters';

interface TeacherDashboardProps {
  teacher: Teacher;
  courses: Course[];
  lectureSheets: LectureSheet[];
  weeklyAssessments: WeeklyAssessment[];
  classSchedules: ClassScheduleItem[];
  studentDoubts: StudentDoubt[];
  onAddLectureSheet: (sheet: Omit<LectureSheet, 'id' | 'downloads' | 'uploadedAt'>) => void;
  onAddAssessment: (assessment: Omit<WeeklyAssessment, 'id' | 'submissionsCount' | 'totalStudents' | 'submissions'>) => void;
  onGradeSubmission: (assessmentId: string, submissionId: string, marks: number, grade: string, feedback: string) => void;
  onAnswerDoubt: (doubtId: string, answer: string) => void;
  onToggleScheduleLive: (scheduleId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  courses,
  lectureSheets,
  weeklyAssessments,
  classSchedules,
  studentDoubts,
  onAddLectureSheet,
  onAddAssessment,
  onGradeSubmission,
  onAnswerDoubt,
  onToggleScheduleLive
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTabId>('overview');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  
  // Modals
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [showNewLectureSheetModal, setShowNewLectureSheetModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<{ assessment: WeeklyAssessment; submission: StudentSubmission } | null>(null);
  const [answeringDoubt, setAnsweringDoubt] = useState<StudentDoubt | null>(null);

  // Forms state
  const [newAssessmentForm, setNewAssessmentForm] = useState({
    courseId: courses[0]?.id || '',
    title: '',
    topic: '',
    weekNumber: 4,
    durationMin: 45,
    totalMarks: 30,
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16),
    instructions: '',
    assessmentType: 'file_upload' as 'file_upload' | 'direct_message' | 'mixed',
    teacherPrompt: '',
    attachmentFileName: '',
    attachmentFileType: 'pdf' as 'pdf' | 'doc' | 'docx'
  });

  const [newLectureForm, setNewLectureForm] = useState({
    courseId: courses[0]?.id || '',
    title: '',
    topic: '',
    fileType: 'PDF' as 'PDF' | 'Slides' | 'Handwritten Notes' | 'Worksheet',
    fileSize: '4.5 MB',
    uploaderRole: 'teacher' as 'teacher' | 'admin'
  });

  const [gradingForm, setGradingForm] = useState({
    marks: 28,
    grade: 'Grade 9 / A*',
    feedback: ''
  });

  const [doubtAnswerText, setDoubtAnswerText] = useState('');

  // Filter courses assigned to this teacher (or all if general)
  const myCourses = courses.filter(c => 
    c.teacher.toLowerCase().includes(teacher.name.toLowerCase()) ||
    c.assignedTeachers?.some(t => t.id === teacher.id || t.name.toLowerCase().includes(teacher.name.toLowerCase()))
  );

  // Filtered lists
  const filteredAssessments = weeklyAssessments.filter(a => 
    selectedCourseFilter === 'all' ? true : a.courseId === selectedCourseFilter
  );

  const filteredLectureSheets = lectureSheets.filter(ls => 
    selectedCourseFilter === 'all' ? true : ls.courseId === selectedCourseFilter
  );

  const pendingGradingCount = weeklyAssessments.reduce((acc, a) => {
    const pendingInThis = (a.submissions || []).filter(s => s.status === 'submitted').length;
    return acc + pendingInThis;
  }, 0);

  const pendingDoubtsCount = studentDoubts.filter(d => d.status === 'pending').length;

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessmentForm.title) return;

    const course = courses.find(c => c.id === newAssessmentForm.courseId);

    const attachmentsList: any[] = [];
    if (newAssessmentForm.assessmentType === 'direct_message' && newAssessmentForm.teacherPrompt.trim()) {
      attachmentsList.push({
        id: `att-${Date.now()}-msg`,
        type: 'direct_message',
        directMessageText: newAssessmentForm.teacherPrompt.trim(),
        uploadedAt: new Date().toISOString()
      });
    }

    if (newAssessmentForm.assessmentType !== 'direct_message' || newAssessmentForm.attachmentFileName) {
      const fileName = newAssessmentForm.attachmentFileName.trim() || 
        (newAssessmentForm.assessmentType === 'direct_message' ? 'Reference_Handout.pdf' : `${newAssessmentForm.title.replace(/\s+/g, '_')}_Paper.${newAssessmentForm.attachmentFileType}`);
      attachmentsList.push({
        id: `att-${Date.now()}-file`,
        type: newAssessmentForm.attachmentFileType,
        fileName: fileName,
        fileSize: newAssessmentForm.attachmentFileType === 'pdf' ? '2.8 MB' : '750 KB',
        fileUrl: '#',
        uploadedAt: new Date().toISOString()
      });
    }

    onAddAssessment({
      courseId: newAssessmentForm.courseId,
      courseName: course ? course.name : 'A-Level Chemistry',
      title: newAssessmentForm.title,
      topic: newAssessmentForm.topic || 'Curriculum Module Drill',
      weekNumber: Number(newAssessmentForm.weekNumber),
      durationMin: Number(newAssessmentForm.durationMin),
      totalMarks: Number(newAssessmentForm.totalMarks),
      assignedBy: teacher.name,
      assignedByAvatar: teacher.avatarUrl,
      assignedByRole: teacher.role,
      dueDate: newAssessmentForm.dueDate,
      instructions: newAssessmentForm.instructions || 'Show all mathematical workings and units.',
      assessmentType: newAssessmentForm.assessmentType,
      teacherPrompt: newAssessmentForm.teacherPrompt.trim() || undefined,
      attachments: attachmentsList,
      questionPdfUrl: newAssessmentForm.attachmentFileType === 'pdf' ? '#' : undefined,
      allowedFormats: ['PDF', 'DOC', 'DOCX'],
      status: 'active'
    });

    setShowNewAssessmentModal(false);
    setNewAssessmentForm({
      courseId: courses[0]?.id || '',
      title: '',
      topic: '',
      weekNumber: 5,
      durationMin: 45,
      totalMarks: 30,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16),
      instructions: '',
      assessmentType: 'file_upload',
      teacherPrompt: '',
      attachmentFileName: '',
      attachmentFileType: 'pdf'
    });
  };

  const handleCreateLectureSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLectureForm.title) return;

    const course = courses.find(c => c.id === newLectureForm.courseId);

    onAddLectureSheet({
      courseId: newLectureForm.courseId,
      courseName: course ? course.name : 'A-Level Chemistry',
      title: newLectureForm.title,
      topic: newLectureForm.topic || 'Class Handout',
      uploadedBy: `${teacher.name} (${teacher.role})`,
      uploaderRole: newLectureForm.uploaderRole,
      fileUrl: '#',
      fileType: newLectureForm.fileType,
      fileSize: newLectureForm.fileSize || '3.2 MB',
      board: course?.board,
      category: course?.category
    });

    setShowNewLectureSheetModal(false);
    setNewLectureForm({
      courseId: courses[0]?.id || '',
      title: '',
      topic: '',
      fileType: 'PDF',
      fileSize: '4.5 MB',
      uploaderRole: 'teacher'
    });
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    onGradeSubmission(
      gradingSubmission.assessment.id,
      gradingSubmission.submission.id,
      Number(gradingForm.marks),
      gradingForm.grade,
      gradingForm.feedback || 'Well attempted. Thorough explanation.'
    );

    setGradingSubmission(null);
  };

  const handleSendDoubtAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringDoubt || !doubtAnswerText.trim()) return;

    onAnswerDoubt(answeringDoubt.id, doubtAnswerText.trim());
    setAnsweringDoubt(null);
    setDoubtAnswerText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Teacher Top Identity & Navigation Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#14e6ff]/10 via-[#ffa600]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Teacher Profile Left */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {teacher.avatarUrl ? (
                <img 
                  src={teacher.avatarUrl} 
                  alt={teacher.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#14e6ff] shadow-[0_0_15px_rgba(20,230,255,0.25)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#14e6ff] text-[#00131a] font-bold text-xl flex items-center justify-center">
                  {teacher.name[0]}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#25D366] border-2 border-[#050e33]" title="Online Faculty" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30 font-bold">
                  {teacher.role} • FACULTY DESK
                </span>
                <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  {teacher.email}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {teacher.name}
              </h1>
              <p className="text-xs text-[#8d99b3] mt-0.5 line-clamp-1">
                {teacher.qualification || 'Senior International Cambridge & Edexcel Specialist'}
              </p>
            </div>
          </div>

          {/* Action Hub & Role Switching */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assessment</span>
            </button>

            <button
              onClick={() => setShowNewLectureSheetModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#ffa600]" />
              <span>Upload Lecture Sheet</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/[0.08]">
          <div className="glass-card-nested p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#14e6ff]/10 text-[#14e6ff] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{myCourses.length}</div>
              <div className="text-[11px] text-[#8d99b3] mt-0.5">Assigned Courses</div>
            </div>
          </div>

          <div className="glass-card-nested p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ffa600]/10 text-[#ffa600] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{weeklyAssessments.length}</div>
              <div className="text-[11px] text-[#8d99b3] mt-0.5">Weekly Assessments</div>
            </div>
          </div>

          <div className="glass-card-nested p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ff00c3]/10 text-[#ff00c3] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#ff00c3] leading-none">{pendingGradingCount}</div>
              <div className="text-[11px] text-[#8d99b3] mt-0.5">Pending Grading</div>
            </div>
          </div>

          <div className="glass-card-nested p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{pendingDoubtsCount}</div>
              <div className="text-[11px] text-[#8d99b3] mt-0.5">Student Doubts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-white text-[#01021c] font-bold shadow-md'
              : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Assigned Batches & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'classes'
              ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_15px_rgba(20,230,255,0.3)]'
              : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Schedule & Google Meet</span>
        </button>

        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'assessments'
              ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_15px_rgba(255,166,0,0.3)]'
              : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Weekly Assessments</span>
          {pendingGradingCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold">
              {pendingGradingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'lectures'
              ? 'bg-white text-[#01021c] font-bold shadow-md'
              : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lecture Sheets ({lectureSheets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-[#25D366] text-[#00131a] font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)]'
              : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Student Doubts & Q&A</span>
          {pendingDoubtsCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#25D366] text-black font-bold">
              {pendingDoubtsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW & ASSIGNED BATCHES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Assigned Courses Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#14e6ff]" />
                  <span>Assigned Course Batches (WordPress Admin Provisioned)</span>
                </h3>
                <p className="text-xs text-[#8d99b3]">
                  Courses where your faculty profile has been assigned as Lead Instructor or Co-Faculty.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8d99b3]">
                {myCourses.length} Active Courses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map((course) => {
                const courseAssessments = weeklyAssessments.filter(a => a.courseId === course.id);
                const courseSheets = lectureSheets.filter(s => s.courseId === course.id);

                return (
                  <div 
                    key={course.id}
                    className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/[0.08] space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            course.board === 'Edexcel' ? 'text-[#14e6ff] border-[#14e6ff]/30 bg-[#14e6ff]/10' : 'text-[#ffa600] border-[#ffa600]/30 bg-[#ffa600]/10'
                          }`}>
                            {course.board} • {course.category}
                          </span>
                          {course.code && (
                            <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.04] px-2 py-0.5 rounded">
                              {course.code}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/20">
                          Active Batch
                        </span>
                      </div>

                      {/* Course Name */}
                      <h4 className="font-bold text-white text-base">
                        {course.name}
                      </h4>
                      <p className="text-xs text-[#8d99b3] mt-1 line-clamp-2">
                        {course.description || 'Comprehensive syllabus modules, past paper drilling, and live interactive lectures.'}
                      </p>

                      {/* Syllabus Progress */}
                      <div className="space-y-1 mt-3">
                        <div className="flex items-center justify-between text-xs text-[#8d99b3]">
                          <span>Syllabus Covered</span>
                          <span className="font-mono text-[#14e6ff] font-bold">{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className="h-full bg-[#14e6ff] rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="pt-3 border-t border-white/[0.06] space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="font-bold text-white">{course.totalLectures || 36}</div>
                          <div className="text-[10px] text-[#8d99b3]">Lectures</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="font-bold text-[#ffa600]">{courseAssessments.length}</div>
                          <div className="text-[10px] text-[#8d99b3]">Assessments</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="font-bold text-[#14e6ff]">{courseSheets.length}</div>
                          <div className="text-[10px] text-[#8d99b3]">Sheets</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setNewAssessmentForm(prev => ({ ...prev, courseId: course.id }));
                            setShowNewAssessmentModal(true);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#14e6ff]/10 hover:bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Assessment</span>
                        </button>

                        <button
                          onClick={() => {
                            setNewLectureForm(prev => ({ ...prev, courseId: course.id }));
                            setShowNewLectureSheetModal(true);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#ffa600]" />
                          <span>Upload Sheet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Schedule Row */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#25D366]" />
                  <span>Today's Live Classes (Admin Scheduled Google Meet)</span>
                </h3>
                <p className="text-xs text-[#8d99b3]">
                  Admin provisions the timing and Google Meet rooms. Click to broadcast live.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('classes')}
                className="text-xs text-[#14e6ff] hover:underline flex items-center gap-1"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {classSchedules.map((sch) => (
                <div 
                  key={sch.id}
                  className="glass-card-nested p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      sch.isLiveNow ? 'bg-[#25D366]/20 text-[#25D366] animate-pulse' : 'bg-white/[0.05] text-[#8d99b3]'
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{sch.courseName}</span>
                        {sch.isLiveNow && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#25D366] text-black animate-pulse">
                            LIVE NOW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8d99b3] mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{sch.topic}</span>
                        <span>•</span>
                        <span className="font-mono text-[#14e6ff]">{sch.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onToggleScheduleLive(sch.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        sch.isLiveNow 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30'
                      }`}
                    >
                      {sch.isLiveNow ? 'End Class' : 'Mark Live'}
                    </button>

                    <a
                      href={sch.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-[#14e6ff] text-[#00131a] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(20,230,255,0.3)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Join Meet</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. SCHEDULE & GOOGLE MEET CONDUCTION */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Weekly Class Routine & Google Meet Launcher
              </h3>
              <p className="text-xs text-[#8d99b3]">
                Admin uploads the weekly recurring schedule and room parameters. Faculty can launch and conduct sessions.
              </p>
            </div>
            <div className="text-xs font-mono text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-xl border border-[#25D366]/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Verified Meet Rooms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classSchedules.map((sch) => (
              <div 
                key={sch.id}
                className={`glass-panel rounded-2xl p-5 border space-y-4 relative ${
                  sch.isLiveNow ? 'border-[#25D366]/40 shadow-[0_0_20px_rgba(37,211,102,0.15)]' : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.05] text-[#8d99b3]">
                    {sch.board} • {sch.category}
                  </span>

                  {sch.isLiveNow ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#25D366] bg-[#25D366]/15 px-2.5 py-0.5 rounded-full border border-[#25D366]/30 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                      <span>Class in Session</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.03] px-2 py-0.5 rounded">
                      Scheduled Routine
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{sch.courseName}</h4>
                  <p className="text-xs text-[#14e6ff] font-medium mt-1">{sch.topic}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#8d99b3]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ffa600]" />
                      <span>Days:</span>
                    </span>
                    <span className="text-white font-medium">{sch.dayOfWeek}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#8d99b3]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#14e6ff]" />
                      <span>Time:</span>
                    </span>
                    <span className="text-white font-mono">{sch.timeSlot}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#8d99b3] pt-1 border-t border-white/[0.04]">
                    <span>Admin Meet Link:</span>
                    <span className="text-[#14e6ff] font-mono text-[11px] truncate max-w-[180px]">{sch.meetUrl}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onToggleScheduleLive(sch.id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      sch.isLiveNow 
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40'
                    }`}
                  >
                    {sch.isLiveNow ? 'End Class Session' : 'Start Live Broadcast'}
                  </button>

                  <a
                    href={sch.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)]"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. WEEKLY ASSESSMENTS & GRADING */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Weekly Assessments & Marksheet Desk
              </h3>
              <p className="text-xs text-[#8d99b3]">
                Teachers create assessments throughout the course. Admin has complete audit oversight.
              </p>
            </div>

            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Assessment</span>
            </button>
          </div>

          <div className="space-y-4">
            {weeklyAssessments.map((assessment) => (
              <div 
                key={assessment.id}
                className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ffa600]/15 text-[#ffa600] border border-[#ffa600]/30">
                        WEEK #{assessment.weekNumber}
                      </span>
                      <span className="text-xs text-[#8d99b3] font-medium">
                        {assessment.courseName}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {assessment.title}
                    </h4>
                    <p className="text-xs text-[#14e6ff] mt-0.5">
                      Topic: {assessment.topic}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-mono text-[#8d99b3] bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#14e6ff]" />
                      <span>Due: <strong className="text-white">{formatFullDateTime(assessment.dueDate)}</strong></span>
                    </span>
                    <span className="text-xs font-mono text-[#8d99b3] bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                      Total: <strong className="text-white">{assessment.totalMarks} Marks</strong> ({assessment.durationMin}m)
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${
                      assessment.status === 'active' 
                        ? 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30' 
                        : 'bg-white/[0.05] text-[#8d99b3] border-white/10'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                </div>

                {/* Assessment Type / Prompt or Attachments */}
                {assessment.teacherPrompt && (
                  <div className="border-l-2 border-[#25D366] pl-3.5 py-1.5 space-y-1 bg-[#25D366]/[0.03] rounded-r-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#25D366]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Teacher Direct Prompt Briefing:</span>
                    </div>
                    <p className="text-xs text-[#e7ecf6] whitespace-pre-line leading-relaxed">
                      {assessment.teacherPrompt}
                    </p>
                  </div>
                )}

                {assessment.attachments && assessment.attachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#8d99b3] uppercase tracking-wider font-mono">
                      Faculty Attached Materials ({assessment.attachments.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {assessment.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-xs text-white"
                        >
                          {att.type === 'pdf' ? (
                            <FileText className="w-3 h-3 text-[#14e6ff]" />
                          ) : att.type === 'doc' || att.type === 'docx' ? (
                            <FileCode className="w-3 h-3 text-[#ffa600]" />
                          ) : att.type === 'direct_message' ? (
                            <MessageSquare className="w-3 h-3 text-[#25D366]" />
                          ) : (
                            <Paperclip className="w-3 h-3 text-[#14e6ff]" />
                          )}
                          <span className="font-medium truncate max-w-[200px]">
                            {att.fileName || (att.directMessageText ? 'Direct Message Task' : 'Assessment File')}
                          </span>
                          {att.fileSize && (
                            <span className="text-[10px] font-mono text-[#8d99b3]">({att.fileSize})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {assessment.instructions && (
                  <p className="text-xs text-[#8d99b3] leading-relaxed pl-1">
                    <strong className="text-white/80">Instructions:</strong> {assessment.instructions}
                  </p>
                )}

                {/* Submissions Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#14e6ff]" />
                      <span>Student Submissions ({assessment.submissions?.length || 0})</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#8d99b3]">
                      Due: {new Date(assessment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {assessment.submissions && assessment.submissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {assessment.submissions.map((sub) => (
                        <div 
                          key={sub.id}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {sub.studentAvatar ? (
                                <img src={sub.studentAvatar} alt={sub.studentName} className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-[#14e6ff] text-[#00131a] font-bold text-xs flex items-center justify-center">
                                  {sub.studentName[0]}
                                </div>
                              )}
                              <span className="font-semibold text-xs text-white truncate max-w-[120px]">{sub.studentName}</span>
                            </div>

                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              sub.status === 'graded' 
                                ? 'bg-[#25D366]/20 text-[#25D366]' 
                                : 'bg-[#ffa600]/20 text-[#ffa600]'
                            }`}>
                              {sub.status === 'graded' ? 'Graded' : 'Needs Grade'}
                            </span>
                          </div>

                          {sub.status === 'graded' ? (
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-[#8d99b3]">Marks:</span>
                                <span className="font-bold text-[#14e6ff]">{sub.marksObtained} / {assessment.totalMarks}</span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-[#8d99b3]">Grade:</span>
                                <span className="font-bold text-[#25D366]">{sub.grade}</span>
                              </div>
                              {sub.feedback && (
                                <p className="text-[11px] text-[#8d99b3] italic line-clamp-2 pt-1 border-t border-white/[0.04]">
                                  "{sub.feedback}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-[#8d99b3] space-y-2">
                              <p className="text-[11px]">Submitted answer script awaiting evaluation.</p>
                              <button
                                onClick={() => {
                                  setGradingSubmission({ assessment, submission: sub });
                                  setGradingForm({ marks: 25, grade: 'Grade 9 / A*', feedback: '' });
                                }}
                                className="w-full py-1.5 rounded-lg bg-[#ffa600] hover:bg-[#ffb733] text-[#00131a] font-bold text-xs flex items-center justify-center gap-1 transition-all"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Evaluate & Enter Score</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center text-xs text-[#8d99b3]">
                      No student submissions yet for this assessment.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. LECTURE SHEETS & RESOURCE HUB */}
      {activeTab === 'lectures' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Lecture Sheets & Study Resources Management
              </h3>
              <p className="text-xs text-[#8d99b3]">
                Both Teachers and Academic Admins can upload topic lecture sheets, slides, and past paper drills.
              </p>
            </div>

            <button
              onClick={() => setShowNewLectureSheetModal(true)}
              className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLectureSheets.map((sheet) => (
              <div 
                key={sheet.id}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/[0.08] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.05] text-[#14e6ff] border border-white/[0.08]">
                      {sheet.fileType} • {sheet.fileSize}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      sheet.uploaderRole === 'admin' ? 'bg-[#ff00c3]/15 text-[#ff00c3] border border-[#ff00c3]/30' : 'bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30'
                    }`}>
                      {sheet.uploaderRole === 'admin' ? '👑 Admin Uploaded' : '🧑‍🏫 Faculty Uploaded'}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">
                    {sheet.title}
                  </h4>
                  <p className="text-xs text-[#8d99b3] mt-0.5">
                    Course: <strong className="text-white/90">{sheet.courseName}</strong>
                  </p>
                  <p className="text-xs text-[#ffa600] mt-0.5">
                    Topic: {sheet.topic}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="text-[#8d99b3] text-[11px] font-mono">
                    <span>By: {sheet.uploadedBy}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#8d99b3]">
                      {sheet.downloads} downloads
                    </span>
                    <button
                      onClick={() => alert(`Downloading "${sheet.title}"...`)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-[#14e6ff]" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. STUDENT DOUBTS & Q&A */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Student Doubt Box & Direct Q&A
            </h3>
            <p className="text-xs text-[#8d99b3]">
              Review questions submitted by students enrolled in your courses. Write step-by-step solutions and explanations.
            </p>
          </div>

          <div className="space-y-4">
            {studentDoubts.map((doubt) => (
              <div 
                key={doubt.id}
                className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#14e6ff]/20 text-[#14e6ff] flex items-center justify-center font-bold text-xs">
                      {doubt.studentName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{doubt.studentName}</div>
                      <div className="text-[11px] text-[#8d99b3]">{doubt.courseName} • {doubt.topic}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    doubt.status === 'answered' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-[#ffa600]/20 text-[#ffa600]'
                  }`}>
                    {doubt.status === 'answered' ? 'Answered' : 'Awaiting Reply'}
                  </span>
                </div>

                {/* Question */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white leading-relaxed">
                  <strong className="text-[#14e6ff]">Question: </strong>
                  {doubt.question}
                </div>

                {/* Answer or Answer Box */}
                {doubt.status === 'answered' && doubt.answer ? (
                  <div className="p-3.5 rounded-xl bg-[#00131a]/80 border border-[#14e6ff]/20 text-xs text-white space-y-1">
                    <div className="text-[11px] font-mono text-[#14e6ff] font-bold">
                      Answered by {doubt.answeredBy || teacher.name}:
                    </div>
                    <p className="text-[#e7ecf6] leading-relaxed">{doubt.answer}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAnsweringDoubt(doubt);
                      setDoubtAnswerText('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Write Teacher Solution</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE WEEKLY ASSESSMENT */}
      {showNewAssessmentModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowNewAssessmentModal(false)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-xl w-full p-6 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffa600]" />
                <h3 className="font-bold text-lg text-white">Create Weekly Assessment</h3>
              </div>
              <button 
                onClick={() => setShowNewAssessmentModal(false)}
                className="p-1 rounded-lg text-[#8d99b3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4">
              {/* Assessment Delivery Format Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white block">Assessment Delivery Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAssessmentForm({ ...newAssessmentForm, assessmentType: 'file_upload', attachmentFileType: 'pdf' })}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 border transition-all ${
                      newAssessmentForm.assessmentType === 'file_upload' && newAssessmentForm.attachmentFileType === 'pdf'
                        ? 'bg-[#14e6ff]/20 border-[#14e6ff] text-[#14e6ff]'
                        : 'bg-white/[0.03] border-white/10 text-[#8d99b3] hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Upload PDF File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAssessmentForm({ ...newAssessmentForm, assessmentType: 'file_upload', attachmentFileType: 'doc' })}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 border transition-all ${
                      newAssessmentForm.assessmentType === 'file_upload' && (newAssessmentForm.attachmentFileType === 'doc' || newAssessmentForm.attachmentFileType === 'docx')
                        ? 'bg-[#ffa600]/20 border-[#ffa600] text-[#ffa600]'
                        : 'bg-white/[0.03] border-white/10 text-[#8d99b3] hover:text-white'
                    }`}
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Upload DOC / Word</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAssessmentForm({ ...newAssessmentForm, assessmentType: 'direct_message' })}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 border transition-all ${
                      newAssessmentForm.assessmentType === 'direct_message'
                        ? 'bg-[#25D366]/20 border-[#25D366] text-[#25D366]'
                        : 'bg-white/[0.03] border-white/10 text-[#8d99b3] hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Direct Message</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">Select Course Batch</label>
                <select
                  value={newAssessmentForm.courseId}
                  onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, courseId: e.target.value })}
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
                <label className="text-xs font-semibold text-white">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={newAssessmentForm.title}
                  onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, title: e.target.value })}
                  placeholder="e.g. Weekly Assessment #5 — Reaction Kinetics & Hess Cycle"
                  className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              {/* Dynamic Assessment Section based on Type */}
              {newAssessmentForm.assessmentType === 'direct_message' ? (
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20">
                  <label className="text-xs font-bold text-[#25D366] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Message Assessment Text / Questions for Students</span>
                  </label>
                  <p className="text-[11px] text-[#8d99b3]">
                    Type your specific questions, prompts, or experimental tasks directly. Students will read this message in their assessment desk.
                  </p>
                  <textarea
                    rows={4}
                    required
                    value={newAssessmentForm.teacherPrompt}
                    onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, teacherPrompt: e.target.value })}
                    placeholder={"1. Explain why tertiary carbocations are more stable than primary carbocations.\n2. Calculate the standard cell potential for Daniell cell (Zn/Cu).\n3. State Markovnikov's rule with mechanism diagram."}
                    className="w-full bg-[#01021c] border border-[#25D366]/30 rounded-xl p-3 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              ) : (
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#14e6ff]" />
                      <span>Attach Assessment Document ({newAssessmentForm.attachmentFileType.toUpperCase()})</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8d99b3]">Max 25MB</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newAssessmentForm.attachmentFileName}
                      onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, attachmentFileName: e.target.value })}
                      placeholder={newAssessmentForm.attachmentFileType === 'pdf' ? "e.g. Chem_Week5_QuestionPaper.pdf" : "e.g. Chem_Week5_Assignment.docx"}
                      className="bg-[#01021c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                    />

                    <select
                      value={newAssessmentForm.attachmentFileType}
                      onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, attachmentFileType: e.target.value as any })}
                      className="bg-[#01021c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                    >
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="doc">Microsoft Word 97-2003 (.doc)</option>
                      <option value="docx">Microsoft Word Document (.docx)</option>
                    </select>
                  </div>

                  <div className="text-[11px] text-[#8d99b3] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Faculty can attach both question sheets and editable answer templates.</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Topic / Chapter</label>
                  <input
                    type="text"
                    required
                    value={newAssessmentForm.topic}
                    onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, topic: e.target.value })}
                    placeholder="e.g. Unit 3 Chemical Energetics"
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={newAssessmentForm.weekNumber}
                    onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, weekNumber: Number(e.target.value) })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newAssessmentForm.durationMin}
                    onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, durationMin: Number(e.target.value) })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newAssessmentForm.totalMarks}
                    onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">General Instructions for Students</label>
                <textarea
                  rows={2}
                  value={newAssessmentForm.instructions}
                  onChange={(e) => setNewAssessmentForm({ ...newAssessmentForm, instructions: e.target.value })}
                  placeholder="Answer all questions clearly. Show all mathematical workings and units. Scan and submit PDF or Word doc."
                  className="w-full bg-[#01021c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewAssessmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
                >
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD LECTURE SHEET */}
      {showNewLectureSheetModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowNewLectureSheetModal(false)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-xl w-full p-6 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#14e6ff]" />
                <h3 className="font-bold text-lg text-white">Upload Lecture Sheet & Resource</h3>
              </div>
              <button 
                onClick={() => setShowNewLectureSheetModal(false)}
                className="p-1 rounded-lg text-[#8d99b3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLectureSheet} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">Select Course</label>
                <select
                  value={newLectureForm.courseId}
                  onChange={(e) => setNewLectureForm({ ...newLectureForm, courseId: e.target.value })}
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
                  value={newLectureForm.title}
                  onChange={(e) => setNewLectureForm({ ...newLectureForm, title: e.target.value })}
                  placeholder="e.g. Unit 4 Transition Metals Solved Problem Set"
                  className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Topic / Sub-chapter</label>
                  <input
                    type="text"
                    required
                    value={newLectureForm.topic}
                    onChange={(e) => setNewLectureForm({ ...newLectureForm, topic: e.target.value })}
                    placeholder="e.g. Complex Ions & Colors"
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">File Type</label>
                  <select
                    value={newLectureForm.fileType}
                    onChange={(e) => setNewLectureForm({ ...newLectureForm, fileType: e.target.value as any })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  >
                    <option value="PDF">PDF Master Document</option>
                    <option value="Slides">Presentation Slides</option>
                    <option value="Handwritten Notes">Handwritten Faculty Notes</option>
                    <option value="Worksheet">Practice Worksheet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Uploader Authority</label>
                  <select
                    value={newLectureForm.uploaderRole}
                    onChange={(e) => setNewLectureForm({ ...newLectureForm, uploaderRole: e.target.value as any })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  >
                    <option value="teacher">Teacher (Lead Faculty)</option>
                    <option value="admin">Academic Admin (Mind Arc)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">File Size</label>
                  <input
                    type="text"
                    value={newLectureForm.fileSize}
                    onChange={(e) => setNewLectureForm({ ...newLectureForm, fileSize: e.target.value })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-center space-y-2 cursor-pointer hover:border-[#14e6ff]/50 transition-colors">
                <FileUp className="w-8 h-8 text-[#14e6ff] mx-auto" />
                <div className="text-xs font-semibold text-white">Choose File or Drop PDF Here</div>
                <div className="text-[10px] text-[#8d99b3]">Supports PDF, PPTX, DOCX, ZIP up to 50MB</div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewLectureSheetModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)]"
                >
                  Upload & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE STUDENT SUBMISSION */}
      {gradingSubmission && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setGradingSubmission(null)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">Evaluate Student Script</h3>
                <p className="text-xs text-[#8d99b3]">{gradingSubmission.assessment.title}</p>
              </div>
              <button 
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded-lg text-[#8d99b3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {gradingSubmission.submission.studentAvatar ? (
                  <img src={gradingSubmission.submission.studentAvatar} alt={gradingSubmission.submission.studentName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#14e6ff] text-[#00131a] font-bold text-sm flex items-center justify-center">
                    {gradingSubmission.submission.studentName[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xs text-white">{gradingSubmission.submission.studentName}</div>
                  <div className="text-[10px] text-[#8d99b3] font-mono">Student ID: {gradingSubmission.submission.studentId}</div>
                </div>
              </div>

              <span className="text-xs font-mono text-[#14e6ff]">
                Max: {gradingSubmission.assessment.totalMarks} Marks
              </span>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Marks Awarded</label>
                  <input
                    type="number"
                    min="0"
                    max={gradingSubmission.assessment.totalMarks}
                    value={gradingForm.marks}
                    onChange={(e) => setGradingForm({ ...gradingForm, marks: Number(e.target.value) })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Grade Designation</label>
                  <select
                    value={gradingForm.grade}
                    onChange={(e) => setGradingForm({ ...gradingForm, grade: e.target.value })}
                    className="w-full bg-[#01021c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff]"
                  >
                    <option value="Grade 9 / A*">Grade 9 / A*</option>
                    <option value="Grade 8 / A">Grade 8 / A</option>
                    <option value="Grade 7 / B">Grade 7 / B</option>
                    <option value="Grade 6 / C">Grade 6 / C</option>
                    <option value="Re-take Required">Re-take Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">Faculty Feedback & Remarks</label>
                <textarea
                  rows={3}
                  required
                  value={gradingForm.feedback}
                  onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                  placeholder="e.g. Excellent thermodynamic diagrams. Ensure correct significant figures in part 2(c)."
                  className="w-full bg-[#01021c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#25D366] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                >
                  Save & Publish Mark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ANSWER STUDENT DOUBT */}
      {answeringDoubt && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAnsweringDoubt(null)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">Answer Student Query</h3>
                <p className="text-xs text-[#8d99b3]">{answeringDoubt.studentName} ({answeringDoubt.courseName})</p>
              </div>
              <button 
                onClick={() => setAnsweringDoubt(null)}
                className="p-1 rounded-lg text-[#8d99b3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white leading-relaxed">
              <span className="text-[#14e6ff] font-bold">Student Question: </span>
              {answeringDoubt.question}
            </div>

            <form onSubmit={handleSendDoubtAnswer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">Your Faculty Explanation</label>
                <textarea
                  rows={4}
                  required
                  value={doubtAnswerText}
                  onChange={(e) => setDoubtAnswerText(e.target.value)}
                  placeholder="Explain the concept step-by-step with exam tips..."
                  className="w-full bg-[#01021c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAnsweringDoubt(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
