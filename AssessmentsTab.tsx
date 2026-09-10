import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCheck, 
  Clock, 
  Upload, 
  FileText, 
  Calendar, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Download, 
  User, 
  Sparkles, 
  X, 
  FileUp, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  FolderOpen,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  FileCode,
  Layers,
  HelpCircle,
  BarChart3,
  ExternalLink,
  MessageSquare,
  Paperclip,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Course, Exam, ExamResult, WeeklyAssessment, StudentSubmission, Student } from '../types';
import { formatDate, formatTime, formatFullDateTime, formatDuration, formatMMSS } from '../utils/formatters';
import { ExamSessionOverlay } from './ExamSessionOverlay';

interface AssessmentsTabProps {
  courses: Course[];
  student: Student;
  weeklyAssessments: WeeklyAssessment[];
  exams: Exam[];
  onUpdateExamResult: (examId: string, result: ExamResult) => void;
  onSubmitWeeklyAssessment: (
    assessmentId: string, 
    submissionData: {
      fileName: string;
      fileType: 'PDF' | 'DOC' | 'DOCX';
      fileSize: string;
      studentNotes?: string;
    }
  ) => void;
}

export const AssessmentsTab: React.FC<AssessmentsTabProps> = ({
  courses,
  student,
  weeklyAssessments,
  exams,
  onUpdateExamResult,
  onSubmitWeeklyAssessment
}) => {
  // Enrolled Courses Only
  const enrolledCourses = useMemo(() => {
    const enrolled = courses.filter(c => c.enrolled);
    return enrolled.length > 0 ? enrolled : courses;
  }, [courses]);

  // Navigation & Tree Selection State
  const [activeSegment, setActiveSegment] = useState<'written' | 'mcq' | 'graded'>('written');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'Edexcel' | 'Cambridge'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Tree UI state
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);
  const [expandedBoards, setExpandedBoards] = useState<Record<string, boolean>>({
    Edexcel: true,
    Cambridge: true
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    IAL: true,
    IGCSE: true,
    'A-Levels': true,
    'O-Levels': true
  });
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Modal States
  const [submittingAssessment, setSubmittingAssessment] = useState<WeeklyAssessment | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: 'PDF' | 'DOC' | 'DOCX';
  } | null>(null);
  const [studentNote, setStudentNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Timed MCQ Exam States
  const [activeSessionExam, setActiveSessionExam] = useState<Exam | null>(null);
  const [confirmStartExam, setConfirmStartExam] = useState<Exam | null>(null);
  const [reviewExam, setReviewExam] = useState<Exam | null>(null);
  const [now, setNow] = useState(Date.now());

  // Clock tick for unlock countdowns and deadline timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Tree Handlers
  const toggleBoardExpand = (board: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBoards(prev => ({ ...prev, [board]: !prev[board] }));
  };

  const toggleCategoryExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllEnrolled = () => {
    setSelectedCourseId('all');
    setSelectedBoard('all');
    setSelectedCategory('all');
  };

  const handleSelectBoard = (board: 'Edexcel' | 'Cambridge') => {
    setSelectedBoard(board);
    setSelectedCategory('all');
    setSelectedCourseId('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
  };

  const handleSelectCategory = (board: 'Edexcel' | 'Cambridge', category: string) => {
    setSelectedBoard(board);
    setSelectedCategory(category);
    setSelectedCourseId('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
    setExpandedCategories(prev => ({ ...prev, [`${board}-${category}`]: true }));
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.board) setSelectedBoard(course.board as any);
    if (course.category) setSelectedCategory(course.category);
  };

  // Group enrolled courses by Board -> Category
  const treeStructure = useMemo(() => {
    const boards = ['Edexcel', 'Cambridge'] as const;
    return boards.map(board => {
      const boardCourses = enrolledCourses.filter(c => c.board === board);
      // Group by category
      const categoriesMap = new Map<string, Course[]>();
      boardCourses.forEach(c => {
        const cat = c.category || 'General';
        if (!categoriesMap.has(cat)) {
          categoriesMap.set(cat, []);
        }
        categoriesMap.get(cat)!.push(c);
      });

      const categories = Array.from(categoriesMap.entries()).map(([catName, cList]) => {
        // Filter by treeSearchQuery if provided
        const filteredList = treeSearchQuery.trim()
          ? cList.filter(c => 
              c.name.toLowerCase().includes(treeSearchQuery.toLowerCase()) || 
              (c.code && c.code.toLowerCase().includes(treeSearchQuery.toLowerCase())) ||
              c.teacher.toLowerCase().includes(treeSearchQuery.toLowerCase())
            )
          : cList;

        const totalTasksInCat = filteredList.reduce((acc, c) => {
          const written = weeklyAssessments.filter(a => a.courseId === c.id).length;
          const mcq = exams.filter(e => e.courseId === c.id).length;
          return acc + written + mcq;
        }, 0);

        return {
          categoryName: catName,
          courses: filteredList,
          totalTasks: totalTasksInCat
        };
      }).filter(group => group.courses.length > 0);

      const totalTasksInBoard = categories.reduce((acc, cat) => acc + cat.totalTasks, 0);

      return {
        board,
        hasCourses: boardCourses.length > 0,
        categories,
        totalTasks: totalTasksInBoard,
        coursesCount: boardCourses.length
      };
    }).filter(b => b.hasCourses);
  }, [enrolledCourses, weeklyAssessments, exams, treeSearchQuery]);

  // Total enrolled tasks sum
  const totalEnrolledTasks = useMemo(() => {
    return enrolledCourses.reduce((acc, c) => {
      const written = weeklyAssessments.filter(a => a.courseId === c.id).length;
      const mcq = exams.filter(e => e.courseId === c.id).length;
      return acc + written + mcq;
    }, 0);
  }, [enrolledCourses, weeklyAssessments, exams]);

  // Active Selected Course Object (if specific course selected)
  const activeSelectedCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return enrolledCourses.find(c => c.id === selectedCourseId) || courses.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId, enrolledCourses, courses]);

  // Filtered Assessments
  const filteredAssessments = weeklyAssessments.filter(a => {
    // Tree-level course filter
    if (selectedCourseId !== 'all') {
      if (a.courseId !== selectedCourseId) return false;
    } else {
      // Must belong to an enrolled course
      const isEnrolledCourse = enrolledCourses.some(c => c.id === a.courseId);
      if (!isEnrolledCourse) return false;

      if (selectedBoard !== 'all') {
        const c = enrolledCourses.find(c => c.id === a.courseId);
        if (!c || c.board !== selectedBoard) return false;
      }
      if (selectedCategory !== 'all') {
        const c = enrolledCourses.find(c => c.id === a.courseId);
        if (!c || c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchTopic = a.topic.toLowerCase().includes(q);
      const matchCourse = a.courseName.toLowerCase().includes(q);
      const matchTeacher = a.assignedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchCourse && !matchTeacher) return false;
    }

    const mySub = a.submissions?.find(s => s.studentId === student.id);
    if (filterStatus === 'pending') {
      return !mySub;
    }
    if (filterStatus === 'submitted') {
      return mySub && mySub.status === 'submitted';
    }
    if (filterStatus === 'graded') {
      return mySub && mySub.status === 'graded';
    }

    return true;
  });

  // Filtered Timed MCQ Exams
  const filteredExams = exams.filter(e => {
    if (selectedCourseId !== 'all') {
      if (e.courseId !== selectedCourseId) return false;
    } else {
      const isEnrolledCourse = enrolledCourses.some(c => c.id === e.courseId);
      if (!isEnrolledCourse) return false;

      if (selectedBoard !== 'all') {
        const c = enrolledCourses.find(c => c.id === e.courseId);
        if (!c || c.board !== selectedBoard) return false;
      }
      if (selectedCategory !== 'all') {
        const c = enrolledCourses.find(c => c.id === e.courseId);
        if (!c || c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.courseName.toLowerCase().includes(q);
    }
    return true;
  });

  // Graded evaluated submissions filtered by active selection
  const filteredGradedAssessments = weeklyAssessments.filter(a => {
    if (selectedCourseId !== 'all') {
      if (a.courseId !== selectedCourseId) return false;
    } else {
      const isEnrolledCourse = enrolledCourses.some(c => c.id === a.courseId);
      if (!isEnrolledCourse) return false;

      if (selectedBoard !== 'all') {
        const c = enrolledCourses.find(c => c.id === a.courseId);
        if (!c || c.board !== selectedBoard) return false;
      }
      if (selectedCategory !== 'all') {
        const c = enrolledCourses.find(c => c.id === a.courseId);
        if (!c || c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
    }
    return a.submissions?.some(s => s.studentId === student.id && s.status === 'graded');
  });

  // Helper to count pending tasks for an enrolled course
  const getCoursePendingCount = (courseId: string) => {
    return weeklyAssessments.filter(a => 
      a.courseId === courseId && 
      !a.submissions?.some(s => s.studentId === student.id)
    ).length;
  };

  // Helper to get total tasks for a course
  const getCourseTotalTasks = (courseId: string) => {
    const written = weeklyAssessments.filter(a => a.courseId === courseId).length;
    const mcq = exams.filter(e => e.courseId === courseId).length;
    return written + mcq;
  };

  // Submission handler
  const handleConfirmDocSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssessment) return;

    const fileToSubmit = selectedFile || {
      name: `${student.name.replace(/\s+/g, '_')}_${submittingAssessment.title.replace(/\s+/g, '_').substring(0, 20)}.pdf`,
      size: '2.8 MB',
      type: 'PDF' as const
    };

    onSubmitWeeklyAssessment(submittingAssessment.id, {
      fileName: fileToSubmit.name,
      fileType: fileToSubmit.type,
      fileSize: fileToSubmit.size,
      studentNotes: studentNote.trim() || undefined
    });

    setSubmittingAssessment(null);
    setSelectedFile(null);
    setStudentNote('');
  };

  // Drag & drop file selection
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toUpperCase();
      let type: 'PDF' | 'DOC' | 'DOCX' = 'PDF';
      if (ext === 'DOC') type = 'DOC';
      if (ext === 'DOCX') type = 'DOCX';

      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toUpperCase();
      let type: 'PDF' | 'DOC' | 'DOCX' = 'PDF';
      if (ext === 'DOC') type = 'DOC';
      if (ext === 'DOCX') type = 'DOCX';

      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type
      });
    }
  };

  // Timed MCQ helpers
  const getExamStatus = (exam: Exam) => {
    if (exam.result) {
      return exam.result.passed ? 'completed-pass' : 'completed-fail';
    }
    const unlock = new Date(exam.unlockAt).getTime();
    const close = new Date(exam.closeAt).getTime();

    if (now < unlock) return 'locked';
    if (exam.attemptsUsed >= exam.attemptsAllowed) return 'expired';
    if (now > close) return 'expired';
    return 'available';
  };

  const handleFinishExam = (result: ExamResult) => {
    if (activeSessionExam) {
      onUpdateExamResult(activeSessionExam.id, result);
    }
    setActiveSessionExam(null);
  };

  // Calculated Stats
  const totalPendingWritten = weeklyAssessments.filter(a => !a.submissions?.some(s => s.studentId === student.id)).length;
  const totalGraded = weeklyAssessments.filter(a => a.submissions?.some(s => s.studentId === student.id && s.status === 'graded')).length;
  const availableMCQsCount = exams.filter(e => getExamStatus(e) === 'available').length;

  return (
    <>
      {/* Live Fullscreen Timed MCQ Exam Overlay */}
      {activeSessionExam && (
        <ExamSessionOverlay
          exam={activeSessionExam}
          onFinish={handleFinishExam}
          onCancel={() => setActiveSessionExam(null)}
        />
      )}

      {/* Main Tab Content */}
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Summary Header & KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Assessments */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#8d99b3]">
              <span className="text-xs font-medium">Assigned by Teachers</span>
              <FileText className="w-4 h-4 text-[#14e6ff]" />
            </div>
            <div className="font-bold text-2xl text-white mt-2">
              {weeklyAssessments.length + exams.length}
            </div>
            <div className="text-[11px] text-[#8d99b3] mt-1">Across all enrolled subjects</div>
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-16 h-16 rounded-full bg-[#14e6ff]/5 blur-xl pointer-events-none" />
          </div>

          {/* Card 2: Pending Submissions with Deadlines */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#8d99b3]">
              <span className="text-xs font-medium">Action Required</span>
              <Clock className="w-4 h-4 text-[#ffa600]" />
            </div>
            <div className="font-bold text-2xl text-[#ffa600] mt-2">
              {totalPendingWritten}
            </div>
            <div className="text-[11px] text-[#8d99b3] mt-1">Written scripts pending upload</div>
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-16 h-16 rounded-full bg-[#ffa600]/5 blur-xl pointer-events-none" />
          </div>

          {/* Card 3: Timed MCQ Tests */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#8d99b3]">
              <span className="text-xs font-medium">Timed MCQ Tests</span>
              <Sparkles className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="font-bold text-2xl text-white mt-2">
              {availableMCQsCount}
            </div>
            <div className="text-[11px] text-[#25D366] mt-1 font-medium">Auto-graded on submission</div>
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-16 h-16 rounded-full bg-[#25D366]/5 blur-xl pointer-events-none" />
          </div>

          {/* Card 4: Evaluated & Graded */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#8d99b3]">
              <span className="text-xs font-medium">Evaluated Scripts</span>
              <Award className="w-4 h-4 text-[#ff00c3]" />
            </div>
            <div className="font-bold text-2xl text-white mt-2">
              {totalGraded}
            </div>
            <div className="text-[11px] text-[#8d99b3] mt-1">With teacher marks & feedback</div>
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-16 h-16 rounded-full bg-[#ff00c3]/5 blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Main 2-Column Responsive Layout: Enrolled Courses Tree + Assessment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: ENROLLED COURSES NAVIGATION TREE */}
          <div className={`${isTreeCollapsed ? 'lg:col-span-1' : 'lg:col-span-4 xl:col-span-3'} transition-all duration-300`}>
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden sticky top-20 shadow-xl bg-[#050e33]/70 backdrop-blur-xl">
              {/* Tree Header */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#14e6ff]/20 to-[#0066ff]/20 border border-[#14e6ff]/30 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-[#14e6ff]" />
                  </div>
                  {!isTreeCollapsed && (
                    <div>
                      <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                        <span>Enrolled Courses</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#14e6ff]/10 text-[#14e6ff] border border-[#14e6ff]/20">
                          {enrolledCourses.length}
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#8d99b3]">Course assessment tree</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                  title={isTreeCollapsed ? 'Expand Tree' : 'Collapse Tree'}
                  className="p-1.5 rounded-lg text-[#8d99b3] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  {isTreeCollapsed ? (
                    <ChevronsRight className="w-4 h-4 text-[#14e6ff]" />
                  ) : (
                    <ChevronsLeft className="w-4 h-4" />
                  )}
                </button>
              </div>

              {!isTreeCollapsed ? (
                <div className="p-3 space-y-3">
                  {/* Tree Quick Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8d99b3] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={treeSearchQuery}
                      onChange={(e) => setTreeSearchQuery(e.target.value)}
                      placeholder="Filter enrolled subjects..."
                      className="w-full bg-[#01021c]/80 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#8d99b3]/70 focus:outline-none focus:border-[#14e6ff]"
                    />
                    {treeSearchQuery && (
                      <button
                        onClick={() => setTreeSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d99b3] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Navigation Tree Content */}
                  <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                    {/* Root Item: All Enrolled Courses */}
                    <button
                      onClick={handleSelectAllEnrolled}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-[#14e6ff]/20 to-[#14e6ff]/5 text-white border-[#14e6ff]/50 shadow-[0_0_12px_rgba(20,230,255,0.15)] font-semibold'
                          : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04] border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Layers className={`w-4 h-4 shrink-0 ${
                          selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                            ? 'text-[#14e6ff]'
                            : 'text-[#8d99b3]'
                        }`} />
                        <span className="text-xs truncate font-medium">All Enrolled Courses</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-white shrink-0 font-medium">
                        {totalEnrolledTasks}
                      </span>
                    </button>

                    {/* Boards Tree */}
                    {treeStructure.map(boardNode => {
                      const isBoardExpanded = !!expandedBoards[boardNode.board];
                      const isBoardActive = selectedBoard === boardNode.board && selectedCategory === 'all' && selectedCourseId === 'all';

                      return (
                        <div key={boardNode.board} className="pt-1">
                          {/* Board Header Node */}
                          <div 
                            onClick={() => handleSelectBoard(boardNode.board)}
                            className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all border ${
                              isBoardActive 
                                ? 'bg-[#14e6ff]/15 text-white border-[#14e6ff]/40 font-semibold'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.03] border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <button
                                onClick={(e) => toggleBoardExpand(boardNode.board, e)}
                                className="p-1 -ml-1 text-[#8d99b3] hover:text-white rounded transition-colors"
                              >
                                {isBoardExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-[#14e6ff]" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                              {isBoardExpanded ? (
                                <FolderOpen className="w-3.5 h-3.5 text-[#14e6ff] shrink-0" />
                              ) : (
                                <Folder className="w-3.5 h-3.5 text-[#8d99b3] shrink-0" />
                              )}
                              <span className="truncate font-semibold tracking-wide">
                                {boardNode.board === 'Edexcel' ? 'Edexcel (Pearson)' : 'Cambridge (CAIE)'}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8d99b3] group-hover:text-white">
                              {boardNode.totalTasks}
                            </span>
                          </div>

                          {/* Categories Sub-tree */}
                          {isBoardExpanded && (
                            <div className="pl-4 ml-2 border-l border-white/[0.08] space-y-1 mt-1">
                              {boardNode.categories.map(catNode => {
                                const catKey = `${boardNode.board}-${catNode.categoryName}`;
                                const isCatExpanded = !!expandedCategories[catKey] || expandedCategories[catNode.categoryName];
                                const isCatActive = selectedBoard === boardNode.board && selectedCategory.toLowerCase() === catNode.categoryName.toLowerCase() && selectedCourseId === 'all';

                                return (
                                  <div key={catKey} className="space-y-1">
                                    {/* Category Sub-Node */}
                                    <div
                                      onClick={() => handleSelectCategory(boardNode.board, catNode.categoryName)}
                                      className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all border ${
                                        isCatActive
                                          ? 'bg-[#14e6ff]/10 text-white border-[#14e6ff]/30 font-medium'
                                          : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02] border-transparent'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <button
                                          onClick={(e) => toggleCategoryExpand(catKey, e)}
                                          className="p-0.5 text-[#8d99b3] hover:text-white rounded"
                                        >
                                          {isCatExpanded ? (
                                            <ChevronDown className="w-3 h-3 text-[#14e6ff]" />
                                          ) : (
                                            <ChevronRight className="w-3 h-3" />
                                          )}
                                        </button>
                                        <BookOpen className="w-3 h-3 text-[#8d99b3] shrink-0" />
                                        <span className="truncate text-[11px] font-medium">
                                          {catNode.categoryName} Level
                                        </span>
                                      </div>

                                      <span className="text-[10px] font-mono text-[#8d99b3]">
                                        {catNode.totalTasks}
                                      </span>
                                    </div>

                                    {/* Course Leaf Nodes */}
                                    {isCatExpanded && (
                                      <div className="pl-3.5 ml-2 border-l border-white/[0.06] space-y-1">
                                        {catNode.courses.map(course => {
                                          const isCourseActive = selectedCourseId === course.id;

                                          return (
                                            <button
                                              key={course.id}
                                              onClick={() => handleSelectCourse(course)}
                                              className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer border ${
                                                isCourseActive
                                                  ? 'bg-[#14e6ff]/20 text-white border-[#14e6ff]/60 shadow-[0_0_12px_rgba(20,230,255,0.2)] font-semibold'
                                                  : 'bg-white/[0.02] hover:bg-white/[0.06] text-[#8d99b3] hover:text-white border-transparent'
                                              }`}
                                            >
                                              <span className="text-xs truncate block">
                                                {course.name}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Collapsed View: Quick Icon Selector */
                <div className="p-2 space-y-2 flex flex-col items-center">
                  <button
                    onClick={handleSelectAllEnrolled}
                    title="All Enrolled Courses"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedCourseId === 'all'
                        ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.4)]'
                        : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </button>

                  {enrolledCourses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      title={`${course.name} (${course.code || course.board})`}
                      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        selectedCourseId === course.id
                          ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.4)]'
                          : 'bg-white/[0.04] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <span>{(course.code || course.name).substring(0, 3)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ASSESSMENT WORKSPACE & TABS */}
          <div className={`${isTreeCollapsed ? 'lg:col-span-11' : 'lg:col-span-8 xl:col-span-9'} space-y-6`}>
            {/* Active Tree Filter Context Breadcrumb Banner */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#14e6ff]/10 border border-[#14e6ff]/20 flex items-center justify-center text-[#14e6ff] shrink-0">
                  {activeSelectedCourse ? <BookOpen className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#8d99b3] uppercase tracking-wider">
                      Active Tree Focus:
                    </span>
                    {activeSelectedCourse ? (
                      <span className="px-2 py-0.5 rounded bg-[#14e6ff]/15 text-[#14e6ff] text-xs font-mono font-bold">
                        {activeSelectedCourse.code || activeSelectedCourse.board}
                      </span>
                    ) : selectedBoard !== 'all' ? (
                      <span className="px-2 py-0.5 rounded bg-[#14e6ff]/15 text-[#14e6ff] text-xs font-mono font-bold">
                        {selectedBoard} {selectedCategory !== 'all' ? `• ${selectedCategory}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-mono font-bold">
                        All Enrolled Courses
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base mt-0.5">
                    {activeSelectedCourse 
                      ? `${activeSelectedCourse.name} — ${activeSelectedCourse.teacher}`
                      : selectedBoard !== 'all'
                        ? `${selectedBoard} ${selectedCategory !== 'all' ? selectedCategory : ''} Enrolled Portfolio`
                        : `Complete Enrolled Assessment Portfolio (${enrolledCourses.length} Subjects)`}
                  </h4>
                </div>
              </div>

              {(selectedCourseId !== 'all' || selectedBoard !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={handleSelectAllEnrolled}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs text-[#14e6ff] hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer border border-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Show All Enrolled</span>
                </button>
              )}
            </div>

            {/* Sub-Navigation Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveSegment('written')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSegment === 'written'
                      ? 'bg-white text-[#01021c] font-bold shadow-md'
                      : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Teacher Assignments ({filteredAssessments.length})</span>
                </button>

                <button
                  onClick={() => setActiveSegment('mcq')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSegment === 'mcq'
                      ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_15px_rgba(20,230,255,0.3)]'
                      : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Timed MCQ Assessments ({filteredExams.length})</span>
                </button>

                <button
                  onClick={() => setActiveSegment('graded')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSegment === 'graded'
                      ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_15px_rgba(255,166,0,0.3)]'
                      : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Teacher Feedback & Gradebook ({filteredGradedAssessments.length})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-60">
                <Search className="w-3.5 h-3.5 text-[#8d99b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topic or assignment..."
                  className="w-full bg-[#050e33]/80 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                />
              </div>
            </div>

        {/* 1. TEACHER WRITTEN ASSIGNMENTS VIEW (DOC / PDF SUBMISSIONS WITH DEADLINES) */}
        {activeSegment === 'written' && (
          <div className="space-y-4">
            {/* Status Filter Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-[#8d99b3] mr-1 flex items-center gap-1 font-mono">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'pending', label: 'Needs Submission (Pending)' },
                { id: 'submitted', label: 'Submitted / Under Review' },
                { id: 'graded', label: 'Evaluated' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    filterStatus === f.id
                      ? 'bg-white/15 text-white border border-white/30'
                      : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Assessment Cards List */}
            {filteredAssessments.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#8d99b3] flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">No assessments found</h3>
                <p className="text-xs text-[#8d99b3] max-w-sm mx-auto">
                  There are no assessments matching your current filter criteria or course selection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssessments.map(assessment => {
                  const mySubmission = assessment.submissions?.find(s => s.studentId === student.id);
                  const isSubmitted = !!mySubmission;
                  const isGraded = mySubmission?.status === 'graded';

                  // Calculate deadline countdown
                  const dueTime = new Date(assessment.dueDate).getTime();
                  const msRemaining = dueTime - now;
                  const isOverdue = msRemaining <= 0 && !isSubmitted;
                  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
                  const daysRemaining = Math.floor(hoursRemaining / 24);

                  return (
                    <div 
                      key={assessment.id}
                      onClick={() => {
                        setSelectedFile(null);
                        setStudentNote('');
                        setSubmittingAssessment(assessment);
                      }}
                      className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/[0.07] hover:border-[#14e6ff]/40 hover:shadow-[0_4px_30px_rgba(20,230,255,0.12)] transition-all flex flex-col justify-between group cursor-pointer relative"
                    >
                      {/* Top Header: Meta & Status Pill */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-[#14e6ff]">
                              Week {assessment.weekNumber}
                            </span>
                            <span className="text-white/20">•</span>
                            <span className="font-mono text-[#8d99b3]">
                              {assessment.totalMarks} Marks
                            </span>
                          </div>

                          {/* Minimal Clean Status Indicator */}
                          {isGraded ? (
                            <span className="text-xs font-medium text-[#25D366] flex items-center gap-1.5 font-mono">
                              <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
                              <span>{mySubmission.grade || 'Graded'} ({mySubmission.marksObtained}/{assessment.totalMarks})</span>
                            </span>
                          ) : isSubmitted ? (
                            <span className="text-xs font-medium text-[#14e6ff] flex items-center gap-1.5 font-mono">
                              <span className="w-2 h-2 rounded-full bg-[#14e6ff] shadow-[0_0_8px_#14e6ff]" />
                              <span>Submitted</span>
                            </span>
                          ) : isOverdue ? (
                            <span className="text-xs font-medium text-red-400 flex items-center gap-1.5 font-mono">
                              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                              <span>Overdue</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-[#ffa600] flex items-center gap-1.5 font-mono">
                              <span className="w-2 h-2 rounded-full bg-[#ffa600] shadow-[0_0_8px_#ffa600]" />
                              <span>Due in {daysRemaining > 0 ? `${daysRemaining}d ${hoursRemaining % 24}h` : `${hoursRemaining}h`}</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Subject */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {assessment.assessmentType === 'direct_message' ? (
                              <span className="text-[11px] font-medium text-[#25D366] flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>Direct Prompt Task</span>
                              </span>
                            ) : assessment.assessmentType === 'mixed' ? (
                              <span className="text-[11px] font-medium text-[#ffa600] flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                <span>Doc & Briefing</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-[#14e6ff] flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>File Submission</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-base group-hover:text-[#14e6ff] transition-colors leading-snug">
                            {assessment.title}
                          </h3>
                          <p className="text-xs text-[#8d99b3] mt-1 font-medium">
                            {assessment.courseName}
                          </p>
                        </div>

                        {/* Teacher & Direct Message / Instructions (Fluid Layout) */}
                        <div className="space-y-2.5 pt-0.5">
                          <div className="flex items-center gap-2 text-xs text-[#8d99b3]">
                            <div className="w-5 h-5 rounded-full bg-[#ffa600]/20 text-[#ffa600] flex items-center justify-center font-bold text-[10px]">
                              {assessment.assignedBy.charAt(0)}
                            </div>
                            <span className="text-white font-medium">{assessment.assignedBy}</span>
                            <span className="text-[11px] text-[#8d99b3]">({assessment.assignedByRole || 'Faculty'})</span>
                          </div>

                          {/* Direct Prompt: Sleek Left-Border Accent instead of Box */}
                          {assessment.teacherPrompt && (
                            <div className="border-l-2 border-[#25D366]/70 pl-3 py-1 space-y-0.5">
                              <span className="text-[10px] font-bold text-[#25D366] uppercase tracking-wider font-mono block">
                                Prompt Brief:
                              </span>
                              <p className="text-xs text-[#e7ecf6] line-clamp-2 leading-relaxed">
                                {assessment.teacherPrompt}
                              </p>
                            </div>
                          )}

                          {/* Instructions */}
                          <div className="text-xs text-[#8d99b3] leading-relaxed">
                            <p className="line-clamp-2">{assessment.instructions}</p>
                            <span className="text-[11px] text-[#14e6ff] font-medium inline-flex items-center gap-1 mt-1 group-hover:underline">
                              <span>View full brief & submit script</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>

                          {/* Teacher Materials (Subtle Pills) */}
                          {assessment.attachments && assessment.attachments.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] text-[#8d99b3] mr-1">Materials:</span>
                              {assessment.attachments.map((att) => (
                                <a
                                  key={att.id}
                                  href={att.fileUrl || '#'}
                                  download={att.fileName || true}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!att.fileUrl || att.fileUrl === '#') {
                                      e.preventDefault();
                                      alert(`Downloading ${att.fileName || 'Assessment Document'}...`);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-[#14e6ff]/20 text-[11px] text-white/90 hover:text-[#14e6ff] transition-all"
                                >
                                  {att.type === 'pdf' ? (
                                    <FileText className="w-3 h-3 text-[#14e6ff]" />
                                  ) : (
                                    <FileCode className="w-3 h-3 text-[#ffa600]" />
                                  )}
                                  <span className="truncate max-w-[120px]">{att.fileName || 'Document'}</span>
                                  <Download className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* If Graded, Show Teacher Feedback Note */}
                        {isGraded && mySubmission?.feedback && (
                          <div className="border-l-2 border-[#25D366] pl-3 py-1 space-y-0.5">
                            <span className="text-[10px] font-bold text-[#25D366] font-mono">Teacher Remarks</span>
                            <p className="text-xs text-white/90 italic line-clamp-2">
                              "{mySubmission.feedback}"
                            </p>
                          </div>
                        )}

                        {/* If Submitted, Show Submitted File Info */}
                        {isSubmitted && !isGraded && (
                          <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#14e6ff]/10 text-white">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-[#14e6ff]" />
                              <span className="font-mono text-white text-[11px] truncate max-w-[170px]">
                                {mySubmission.fileName || 'Uploaded_Script.pdf'}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#14e6ff]">Submitted</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer with Specific Date & Time */}
                      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                        <div className="text-xs text-[#8d99b3]">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8d99b3]/70">
                            Due Date & Time
                          </span>
                          <span className="font-mono text-white font-semibold text-xs flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-[#14e6ff]" />
                            <span>{formatFullDateTime(assessment.dueDate)}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setStudentNote('');
                              setSubmittingAssessment(assessment);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isGraded
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : isSubmitted
                                ? 'bg-[#14e6ff]/20 hover:bg-[#14e6ff]/30 text-[#14e6ff]'
                                : 'bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] shadow-[0_0_12px_rgba(20,230,255,0.25)]'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {isGraded ? 'Review Result' : isSubmitted ? 'Re-Upload' : 'View & Submit'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. TIMED MCQ ASSESSMENTS VIEW (AUTO-GRADED) */}
        {activeSegment === 'mcq' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#14e6ff]/10 border border-[#14e6ff]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#14e6ff]">
                  <Sparkles className="w-4 h-4" />
                  <span>Timed Multiple Choice Assessment Simulator</span>
                </div>
                <p className="text-xs text-[#8d99b3]">
                  Take strict timed quizzes set by faculty. Auto-graded instantly upon submit or timer expiration with detailed question review.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/40 text-white border border-white/10">
                  ⚡ Instant Automatic Grading
                </span>
              </div>
            </div>

            {/* Timed Exams Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.map(exam => {
                const status = getExamStatus(exam);
                const isPass = exam.result?.passed;
                const isAttempted = !!exam.result;

                return (
                  <div 
                    key={exam.id}
                    className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[#14e6ff]">
                          ⏱️ {exam.durationMin} Minutes Timed
                        </span>

                        {isAttempted ? (
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono flex items-center gap-1 ${
                            isPass 
                              ? 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/40'
                              : 'bg-red-500/20 text-red-400 border-red-500/40'
                          }`}>
                            <Award className="w-3 h-3" />
                            {exam.result?.scored} / {exam.result?.total} ({exam.result?.percentage}%) {isPass ? 'PASSED' : 'RETRY'}
                          </span>
                        ) : status === 'available' ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 font-mono animate-pulse">
                            ● READY TO TAKE
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-[#8d99b3]">
                            Scheduled
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-base">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-[#8d99b3] mt-0.5">
                          {exam.courseName}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                        <div>
                          <span className="text-[10px] text-[#8d99b3] block">Questions</span>
                          <span className="text-xs font-bold text-white font-mono">{exam.questions?.length || 5} MCQs</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8d99b3] block">Pass Mark</span>
                          <span className="text-xs font-bold text-[#ffa600] font-mono">{exam.passingScore}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8d99b3] block">Timer</span>
                          <span className="text-xs font-bold text-[#14e6ff] font-mono">{exam.durationMin}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="text-[11px] font-mono text-[#8d99b3]">
                        {isAttempted ? `Submitted ${formatDate(exam.result?.submittedAt || '')}` : 'One attempt only'}
                      </div>

                      {isAttempted ? (
                        <button
                          onClick={() => setReviewExam(exam)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-[#14e6ff]" />
                          <span>Review Questions</span>
                        </button>
                      ) : status === 'available' ? (
                        <button
                          onClick={() => setConfirmStartExam(exam)}
                          className="px-4 py-2 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)] cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Timed Exam</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-white/5 text-[#8d99b3] text-xs font-medium cursor-not-allowed"
                        >
                          Locked Until {formatTime(exam.unlockAt)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TEACHER FEEDBACK & GRADEBOOK VIEW */}
        {activeSegment === 'graded' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Official Academic Feedback & Evaluated Scripts
                </h3>
                <p className="text-xs text-[#8d99b3] mt-0.5">
                  Detailed evaluation remarks, points awarded, and teacher recommendations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredGradedAssessments.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center space-y-3 border border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#8d99b3] flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">No evaluated assessments yet</h3>
                  <p className="text-xs text-[#8d99b3] max-w-sm mx-auto">
                    There are no graded submissions for this selection. Once your teacher reviews and evaluates your uploaded scripts, their detailed remarks and grades will appear here.
                  </p>
                </div>
              ) : (
                filteredGradedAssessments.map(assessment => {
                  const sub = assessment.submissions?.find(s => s.studentId === student.id && s.status === 'graded')!;
                  return (
                    <div 
                      key={assessment.id}
                      className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#14e6ff] font-bold">
                              {assessment.courseName}
                            </span>
                            <span className="text-xs text-[#8d99b3]">Week #{assessment.weekNumber}</span>
                          </div>
                          <h4 className="font-bold text-white text-base">{assessment.title}</h4>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-center">
                          <div className="text-right">
                            <div className="text-xs font-mono text-[#8d99b3]">Score Awarded</div>
                            <div className="text-lg font-bold text-[#25D366] font-mono">
                              {sub.marksObtained} / {assessment.totalMarks}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 font-bold text-xs font-mono">
                            {sub.grade || 'Grade 9 / A*'}
                          </span>
                        </div>
                      </div>

                      {/* Feedback remark card */}
                      <div className="p-4 rounded-xl bg-[#01021c] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#8d99b3]">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#14e6ff]" />
                            <span className="font-semibold text-white">{sub.gradedBy || assessment.assignedBy}</span>
                          </div>
                          <span className="font-mono text-[11px]">
                            {sub.gradedAt ? formatDate(sub.gradedAt) : 'Evaluated'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#e7ecf6] leading-relaxed">
                          "{sub.feedback}"
                        </p>
                      </div>

                      {/* File Submitted Tag */}
                      <div className="flex items-center justify-between text-xs text-[#8d99b3] pt-1">
                        <span className="font-mono text-[11px]">
                          Script File: <strong className="text-white">{sub.fileName || 'Assessment_Script.pdf'}</strong> ({sub.fileSize || '2.4 MB'})
                        </span>
                        <span className="text-[11px] font-mono text-[#25D366]">✓ Verification Locked</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ASSESSMENT BRIEFING & SUBMISSION MODAL */}
      {submittingAssessment && (() => {
        const modalSub = submittingAssessment.submissions?.find(s => s.studentId === student.id);
        const isModalGraded = modalSub?.status === 'graded';
        const isModalSubmitted = !!modalSub;
        const modalDueTime = new Date(submittingAssessment.dueDate).getTime();
        const modalMsRemaining = modalDueTime - now;
        const isModalOverdue = modalMsRemaining <= 0 && !isModalSubmitted;
        const modalHoursRemaining = Math.floor(modalMsRemaining / (1000 * 60 * 60));
        const modalDaysRemaining = Math.floor(modalHoursRemaining / 24);

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSubmittingAssessment(null)}
          >
            <div 
              className="bg-[#050e33] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#14e6ff]">
                      Week #{submittingAssessment.weekNumber} Assessment
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[11px] text-[#8d99b3] font-medium">
                      {submittingAssessment.courseName}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xl sm:text-2xl leading-snug">
                    {submittingAssessment.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#8d99b3] pt-1">
                    <span>By <strong className="text-white">{submittingAssessment.assignedBy}</strong> ({submittingAssessment.assignedByRole || 'Faculty'})</span>
                    <span>•</span>
                    <span className="text-[#ffa600] font-mono font-semibold">{submittingAssessment.totalMarks} Marks</span>
                    <span>•</span>
                    <span className="font-mono">{submittingAssessment.durationMin}m duration</span>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittingAssessment(null)}
                  className="p-2 rounded-xl text-[#8d99b3] hover:text-white hover:bg-white/10 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Seamless Due Date & Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#ffa600]" />
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#8d99b3]">Due Date & Time</span>
                    <span className="text-white font-mono font-bold text-sm">
                      {formatFullDateTime(submittingAssessment.dueDate)}
                    </span>
                  </div>
                </div>

                <div>
                  {isModalGraded ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] font-mono inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Graded ({modalSub.marksObtained}/{submittingAssessment.totalMarks})
                    </span>
                  ) : isModalSubmitted ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#14e6ff]/20 text-[#14e6ff] font-mono inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submitted
                    </span>
                  ) : isModalOverdue ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-mono inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Overdue
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ffa600]/20 text-[#ffa600] font-mono inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Due in {modalDaysRemaining > 0 ? `${modalDaysRemaining}d ${modalHoursRemaining % 24}h` : `${modalHoursRemaining}h`}
                    </span>
                  )}
                </div>
              </div>

              {/* 1. Teacher Instructions (Clean Fluid Flow) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#14e6ff]" />
                  <span>Teacher Instructions & Guidelines</span>
                </h4>
                <div className="text-xs sm:text-sm text-[#e7ecf6] leading-relaxed whitespace-pre-line pl-1">
                  {submittingAssessment.instructions}
                </div>
              </div>

              {/* 2. Direct Teacher Prompt Briefing */}
              {submittingAssessment.teacherPrompt && (
                <div className="border-l-2 border-[#25D366] pl-4 py-1.5 space-y-1 bg-[#25D366]/[0.03] rounded-r-xl">
                  <h4 className="text-xs font-bold text-[#25D366] uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Faculty Prompt Briefing</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-white leading-relaxed whitespace-pre-line">
                    {submittingAssessment.teacherPrompt}
                  </p>
                </div>
              )}

              {/* 3. Teacher Attached Materials (Compact Clean Chips) */}
              {submittingAssessment.attachments && submittingAssessment.attachments.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px] flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#ffa600]" />
                      <span>Attached Resources ({submittingAssessment.attachments.length})</span>
                    </span>
                    <span className="text-[10px] text-[#8d99b3]">Click to download</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {submittingAssessment.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.fileUrl || '#'}
                        download={att.fileName || true}
                        onClick={(e) => {
                          if (!att.fileUrl || att.fileUrl === '#') {
                            e.preventDefault();
                            alert(`Downloading ${att.fileName || 'Assessment Document'}...`);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-[#14e6ff]/20 text-xs text-white hover:text-[#14e6ff] transition-all cursor-pointer group/att border border-white/[0.06]"
                      >
                        {att.type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-[#14e6ff]" />
                        ) : (
                          <FileCode className="w-4 h-4 text-[#ffa600]" />
                        )}
                        <span className="font-medium truncate max-w-[160px]">{att.fileName || 'Resource Paper'}</span>
                        {att.fileSize && (
                          <span className="text-[10px] text-[#8d99b3] font-mono">({att.fileSize})</span>
                        )}
                        <Download className="w-3 h-3 opacity-60 group-hover/att:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. If Graded Result Section */}
              {isModalGraded && (
                <div className="border-l-2 border-[#25D366] pl-4 py-2 space-y-2 bg-[#25D366]/[0.04] rounded-r-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#25D366] flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Graded Result: {modalSub.marksObtained}/{submittingAssessment.totalMarks} Marks ({modalSub.grade || 'A*'})</span>
                    </span>
                    <span className="text-[10px] text-[#8d99b3] font-mono">
                      Evaluated {modalSub.gradedAt ? formatFullDateTime(modalSub.gradedAt) : 'Recently'}
                    </span>
                  </div>
                  {modalSub.feedback && (
                    <p className="text-xs text-white/90 italic">
                      "{modalSub.feedback}"
                    </p>
                  )}
                </div>
              )}

              {/* 5. Clean Upload Desk */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#14e6ff]" />
                    <span>{isModalSubmitted ? 'Update Assignment Script' : 'Upload Assignment Script'}</span>
                  </span>
                  <span className="text-[#8d99b3]">
                    Accepted: <strong className="text-white">.PDF, .DOC, .DOCX</strong>
                  </span>
                </div>

                <form onSubmit={handleConfirmDocSubmission} className="space-y-4">
                  {/* Subtle Clean Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-[#14e6ff] bg-[#14e6ff]/10'
                        : selectedFile
                        ? 'border-[#25D366]/50 bg-[#25D366]/[0.03]'
                        : 'border-white/15 hover:border-white/30 bg-white/[0.015]'
                    }`}
                    onClick={() => document.getElementById('assessment-file-input')?.click()}
                  >
                    <input
                      id="assessment-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="space-y-1.5">
                        <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs text-white truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#8d99b3]">
                          {selectedFile.type} • {selectedFile.size}
                        </div>
                        <p className="text-[11px] text-[#25D366]">File ready. Click to change.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-1">
                        <Upload className="w-6 h-6 text-[#14e6ff] mx-auto opacity-80" />
                        <div className="text-xs font-semibold text-white">
                          Drag and drop script here, or <span className="text-[#14e6ff] underline">Browse Files</span>
                        </div>
                        <p className="text-[11px] text-[#8d99b3]">
                          Upload handwritten scans (.pdf) or typed documents (.docx)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Student Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8d99b3] block">
                      Student Notes / Derivation Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={studentNote}
                      onChange={(e) => setStudentNote(e.target.value)}
                      placeholder="e.g. Completed all derivation questions. Question 4 graph on page 3."
                      className="w-full bg-[#01021c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmittingAssessment(null)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8d99b3] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>{isModalSubmitted ? 'Confirm Re-Submission' : 'Submit Script to Faculty'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CONFIRM START TIMED EXAM MODAL */}
      {confirmStartExam && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setConfirmStartExam(null)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#14e6ff]/20 text-[#14e6ff] flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Start Timed MCQ Assessment</h3>
              <p className="text-xs text-[#8d99b3]">{confirmStartExam.title}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-[#8d99b3]">
                <span>Duration:</span>
                <span className="font-mono text-white font-bold">{confirmStartExam.durationMin} Minutes</span>
              </div>
              <div className="flex justify-between text-[#8d99b3]">
                <span>Total Questions:</span>
                <span className="font-mono text-white font-bold">{confirmStartExam.questions.length} MCQs</span>
              </div>
              <div className="flex justify-between text-[#8d99b3]">
                <span>Passing Grade:</span>
                <span className="font-mono text-[#ffa600] font-bold">{confirmStartExam.passingScore}%</span>
              </div>
              <div className="flex justify-between text-[#8d99b3]">
                <span>Grading Mode:</span>
                <span className="font-mono text-[#25D366] font-bold">Instant Automatic</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmStartExam(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveSessionExam(confirmStartExam);
                  setConfirmStartExam(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] text-xs font-bold shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
              >
                Start Assessment Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION-BY-QUESTION REVIEW MODAL */}
      {reviewExam && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setReviewExam(null)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-2xl w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white text-base">Assessment Review</h3>
                <p className="text-xs text-[#8d99b3]">{reviewExam.title}</p>
              </div>

              <button
                onClick={() => setReviewExam(null)}
                className="p-1.5 rounded-xl text-[#8d99b3] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {reviewExam.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Question {idx + 1}</span>
                    <span className="font-mono text-[#14e6ff]">{q.points} Mark</span>
                  </div>

                  <p className="text-xs sm:text-sm text-white font-medium">
                    {q.text}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map(opt => {
                      const isCorrect = opt.id === q.correctOptionId;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                            isCorrect
                              ? 'bg-[#25D366]/10 border-[#25D366]/40 text-[#25D366] font-semibold'
                              : 'bg-white/[0.02] border-white/5 text-[#8d99b3]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono uppercase font-bold text-[10px] w-5 h-5 rounded bg-black/30 flex items-center justify-center">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isCorrect && (
                            <span className="text-[10px] font-mono font-bold text-[#25D366]">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
