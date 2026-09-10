import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Layers, 
  BarChart2, 
  Award, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Zap, 
  CheckCheck, 
  ExternalLink,
  ChevronDown,
  X,
  Users,
  Trophy,
  Activity,
  Folder,
  FolderOpen,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { 
  Student, 
  Course, 
  WeeklyAssessment, 
  Exam, 
  Task, 
  TabId 
} from '../types';

interface StudentProgressAnalyticsProps {
  student: Student;
  courses: Course[];
  weeklyAssessments?: WeeklyAssessment[];
  exams?: Exam[];
  tasks?: Task[];
  onNavigate: (tab: TabId) => void;
}

export interface PeerComparisonCohort {
  rank: number;
  studentName: string;
  isCurrentStudent: boolean;
  avatarSeed: string;
  overallScore: number;
  scriptScore: number;
  mcqScore: number;
  homeworkScore: number;
  mockScore: number;
  completionRate: number;
  gradeBadge: string;
}

export const StudentProgressAnalytics: React.FC<StudentProgressAnalyticsProps> = ({
  student,
  courses,
  weeklyAssessments = [],
  exams = [],
  tasks = [],
  onNavigate
}) => {
  // Navigation Tree State for Enrolled Courses
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'Edexcel' | 'Cambridge'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  
  const [expandedBoards, setExpandedBoards] = useState<Record<string, boolean>>({
    Edexcel: true,
    Cambridge: true
  });
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    IAL: true,
    IGCSE: true,
    'A-Levels': true,
    'A-Level': true,
    'O-Levels': true
  });

  // Filter enrolled courses
  const enrolledCourses = useMemo(() => {
    return courses.filter(c => c.enrolled !== false);
  }, [courses]);

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
    setExpandedCategories(prev => ({ ...prev, [`${board}-${category}`]: true, [category]: true }));
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.board) setSelectedBoard(course.board as any);
    if (course.category) setSelectedCategory(course.category);
  };

  // Group enrolled courses by Board -> Category for navigation tree
  const treeStructure = useMemo(() => {
    const boards = ['Edexcel', 'Cambridge'] as const;
    return boards.map(board => {
      const boardCourses = enrolledCourses.filter(c => c.board === board);
      const categoriesMap = new Map<string, Course[]>();
      
      boardCourses.forEach(c => {
        const cat = c.category || 'General';
        if (!categoriesMap.has(cat)) {
          categoriesMap.set(cat, []);
        }
        categoriesMap.get(cat)!.push(c);
      });

      const categories = Array.from(categoriesMap.entries()).map(([catName, cList]) => {
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

  // Active Selected Course Object
  const activeSelectedCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return enrolledCourses.find(c => c.id === selectedCourseId) || courses.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId, enrolledCourses, courses]);

  // Dynamic Course-Filtered Metrics
  const courseFilteredAssessments = useMemo(() => {
    if (selectedCourseId !== 'all') {
      return weeklyAssessments.filter(a => a.courseId === selectedCourseId);
    }
    if (selectedBoard !== 'all') {
      return weeklyAssessments.filter(a => {
        const c = enrolledCourses.find(item => item.id === a.courseId);
        return c && c.board === selectedBoard;
      });
    }
    return weeklyAssessments;
  }, [weeklyAssessments, selectedCourseId, selectedBoard, enrolledCourses]);

  const courseFilteredExams = useMemo(() => {
    if (selectedCourseId !== 'all') {
      return exams.filter(e => e.courseId === selectedCourseId);
    }
    if (selectedBoard !== 'all') {
      return exams.filter(e => {
        const c = enrolledCourses.find(item => item.id === e.courseId);
        return c && c.board === selectedBoard;
      });
    }
    return exams;
  }, [exams, selectedCourseId, selectedBoard, enrolledCourses]);

  const courseFilteredTasks = useMemo(() => {
    if (selectedCourseId !== 'all') {
      return tasks.filter(t => t.courseId === selectedCourseId);
    }
    return tasks;
  }, [tasks, selectedCourseId]);

  // Calculations across 4 Pillars for the selected scope
  const metrics = useMemo(() => {
    // 1. Written Scripts
    const totalScripts = courseFilteredAssessments.length;
    const submittedScripts = courseFilteredAssessments.filter(a => 
      a.submissions?.some(s => s.studentId === student.id || s.studentName.toLowerCase().includes(student.name.toLowerCase().split(' ')[0]))
    ).length;
    const gradedScripts = courseFilteredAssessments.filter(a => 
      a.submissions?.some(s => (s.studentId === student.id || s.studentName.toLowerCase().includes(student.name.toLowerCase().split(' ')[0])) && s.status === 'graded')
    ).length;
    
    // Calculate student average score or fallback
    const scriptAvgScore = selectedCourseId === 'all' 
      ? 86 
      : (activeSelectedCourse?.progress ? Math.min(95, Math.max(70, activeSelectedCourse.progress + 6)) : 84);

    // 2. MCQ Quizzes
    const totalMcq = courseFilteredExams.length;
    const completedMcq = courseFilteredExams.filter(e => e.result !== null).length;
    const mcqAvgScore = completedMcq > 0
      ? Math.round(courseFilteredExams.filter(e => e.result).reduce((acc, curr) => acc + (curr.result?.percentage || 0), 0) / completedMcq)
      : (selectedCourseId === 'all' ? 88 : 85);

    // 3. Homework Tasks
    const totalHomework = courseFilteredTasks.length;
    const completedHomework = courseFilteredTasks.filter(t => t.done).length;
    const homeworkAvgScore = selectedCourseId === 'all' ? 92 : 89;

    // 4. Mock Exams
    const mockAvgScore = selectedCourseId === 'all' ? 85 : 82;

    // Benchmarks
    const batchAvgScript = selectedCourseId === 'all' ? 64.2 : 62.5;
    const batchHighestScript = selectedCourseId === 'all' ? 96.0 : 94.0;

    const batchAvgMcq = selectedCourseId === 'all' ? 70.8 : 68.4;
    const batchHighestMcq = selectedCourseId === 'all' ? 98.0 : 96.0;

    const batchAvgHomework = selectedCourseId === 'all' ? 74.5 : 72.0;
    const batchHighestHomework = selectedCourseId === 'all' ? 100.0 : 98.0;

    const batchAvgMock = selectedCourseId === 'all' ? 68.0 : 66.5;
    const batchHighestMock = selectedCourseId === 'all' ? 96.0 : 94.0;

    const overallScore = Math.round(
      (scriptAvgScore * 0.30) + 
      (mcqAvgScore * 0.25) + 
      (homeworkAvgScore * 0.15) + 
      (mockAvgScore * 0.30)
    );

    return {
      scriptAvgScore,
      batchAvgScript,
      batchHighestScript,
      totalScripts,
      submittedScripts,
      gradedScripts,

      mcqAvgScore,
      batchAvgMcq,
      batchHighestMcq,
      totalMcq,
      completedMcq,

      homeworkAvgScore,
      batchAvgHomework,
      batchHighestHomework,
      totalHomework,
      completedHomework,

      mockAvgScore,
      batchAvgMock,
      batchHighestMock,

      overallScore,
      batchOverallAvg: 69.8,
      batchOverallHighest: 95.4
    };
  }, [courseFilteredAssessments, courseFilteredExams, courseFilteredTasks, selectedCourseId, activeSelectedCourse, student]);

  // Pillar Comparison Data for Circular Indicators
  const pillarComparisonData = useMemo(() => [
    {
      pillar: 'Weekly Scripts (Written)',
      fahim: metrics.scriptAvgScore,
      batchAvg: metrics.batchAvgScript,
      batchHighest: metrics.batchHighestScript,
      icon: FileText,
      color: '#14e6ff',
      details: `${metrics.submittedScripts}/${metrics.totalScripts} Submissions`
    },
    {
      pillar: 'Topical MCQ Quizzes',
      fahim: metrics.mcqAvgScore,
      batchAvg: metrics.batchAvgMcq,
      batchHighest: metrics.batchHighestMcq,
      icon: HelpCircle,
      color: '#25D366',
      details: `${metrics.completedMcq}/${metrics.totalMcq} Completed`
    },
    {
      pillar: 'Homework Tasks',
      fahim: metrics.homeworkAvgScore,
      batchAvg: metrics.batchAvgHomework,
      batchHighest: metrics.batchHighestHomework,
      icon: CheckCircle2,
      color: '#ffa600',
      details: `${metrics.completedHomework}/${metrics.totalHomework} Done`
    },
    {
      pillar: 'Mock Exams (Full-length)',
      fahim: metrics.mockAvgScore,
      batchAvg: metrics.batchAvgMock,
      batchHighest: metrics.batchHighestMock,
      icon: Award,
      color: '#ff00c3',
      details: 'Term Benchmark'
    }
  ], [metrics]);

  // Batch Peer Cohort (25 Students)
  const batchCohortList: PeerComparisonCohort[] = useMemo(() => [
    { rank: 1, studentName: 'Ayaan Zafar', isCurrentStudent: false, avatarSeed: 'ayaan', overallScore: 95.4, scriptScore: 96, mcqScore: 98, homeworkScore: 98, mockScore: 94, completionRate: 100, gradeBadge: 'A*' },
    { rank: 2, studentName: 'Zubair Al-Mamun', isCurrentStudent: false, avatarSeed: 'zubair', overallScore: 91.8, scriptScore: 90, mcqScore: 94, homeworkScore: 95, mockScore: 91, completionRate: 98, gradeBadge: 'A*' },
    { rank: 3, studentName: student.name, isCurrentStudent: true, avatarSeed: 'fahim', overallScore: metrics.overallScore, scriptScore: metrics.scriptAvgScore, mcqScore: metrics.mcqAvgScore, homeworkScore: metrics.homeworkAvgScore, mockScore: metrics.mockAvgScore, completionRate: 94, gradeBadge: 'A*' },
    { rank: 4, studentName: 'Tasnim Rahman', isCurrentStudent: false, avatarSeed: 'tasnim', overallScore: 86.2, scriptScore: 84, mcqScore: 90, homeworkScore: 92, mockScore: 85, completionRate: 96, gradeBadge: 'A' },
    { rank: 5, studentName: 'Samira Huq', isCurrentStudent: false, avatarSeed: 'samira', overallScore: 84.5, scriptScore: 83, mcqScore: 86, homeworkScore: 90, mockScore: 84, completionRate: 95, gradeBadge: 'A' },
    { rank: 6, studentName: 'Tanvir Hossain', isCurrentStudent: false, avatarSeed: 'tanvir', overallScore: 81.0, scriptScore: 79, mcqScore: 85, homeworkScore: 88, mockScore: 80, completionRate: 92, gradeBadge: 'A' },
    { rank: 7, studentName: 'Nafis Chowdhury', isCurrentStudent: false, avatarSeed: 'nafis', overallScore: 78.4, scriptScore: 76, mcqScore: 82, homeworkScore: 85, mockScore: 77, completionRate: 90, gradeBadge: 'A' },
    { rank: 8, studentName: 'Mahir Faysal', isCurrentStudent: false, avatarSeed: 'mahir', overallScore: 76.2, scriptScore: 74, mcqScore: 80, homeworkScore: 82, mockScore: 75, completionRate: 88, gradeBadge: 'B' },
    { rank: 9, studentName: 'Rania Siddique', isCurrentStudent: false, avatarSeed: 'rania', overallScore: 75.0, scriptScore: 72, mcqScore: 78, homeworkScore: 84, mockScore: 74, completionRate: 88, gradeBadge: 'B' },
    { rank: 10, studentName: 'Shahriar Kabir', isCurrentStudent: false, avatarSeed: 'shahriar', overallScore: 73.6, scriptScore: 71, mcqScore: 76, homeworkScore: 80, mockScore: 72, completionRate: 85, gradeBadge: 'B' }
  ], [student.name, metrics]);

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-6 border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#14e6ff]/20 to-[#25D366]/10 border border-[#14e6ff]/30 text-[#14e6ff] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(20,230,255,0.2)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Sora'] font-bold text-base sm:text-lg text-white">
                Performance & Progress Analytics
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Live Benchmark</span>
              </span>
            </div>
            <p className="text-xs text-[#8d99b3] mt-0.5">
              Course-wise evaluation tracking across Weekly Scripts, MCQs, Homework, and Mock Exams
            </p>
          </div>
        </div>

        {/* Mobile toggle button for tree */}
        <button
          onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
          className="lg:hidden px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#14e6ff] font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isTreeCollapsed ? 'Show Enrolled Courses' : 'Hide Navigation'}</span>
        </button>
      </div>

      {/* Main 2-Column Responsive Layout with Enrolled Course Navigation Tree */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ENROLLED COURSES NAVIGATION TREE */}
        {/* ========================================================================= */}
        <div className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-3 ${isTreeCollapsed ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-['Sora']">
                <GraduationCap className="w-4 h-4 text-[#14e6ff]" />
                <span>Enrolled Subjects</span>
              </div>
              <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.04] px-2 py-0.5 rounded">
                {enrolledCourses.length} Courses
              </span>
            </div>

            {/* Tree Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8d99b3] absolute left-2.5 top-1/2 -translate-y-1/2" />
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
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
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
                          const isCatExpanded = !!expandedCategories[catKey] || !!expandedCategories[catNode.categoryName];
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
                                        <div className="flex items-center justify-between text-[10px] text-[#8d99b3] mt-0.5 font-mono">
                                          <span>{course.teacher.split(' ')[0]}</span>
                                          <span className="text-[#14e6ff]">{course.progress}%</span>
                                        </div>
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
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: COURSE PERFORMANCE METRICS & PILLARS */}
        {/* ========================================================================= */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          
          {/* Active Context Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#14e6ff]/15 border border-[#14e6ff]/30 text-[#14e6ff] flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white font-['Sora']">
                    {activeSelectedCourse ? activeSelectedCourse.name : (selectedBoard !== 'all' ? `${selectedBoard} Curriculum Performance` : 'All Enrolled Courses Performance')}
                  </h4>
                  {activeSelectedCourse && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#14e6ff] border border-white/10">
                      {activeSelectedCourse.board} • {activeSelectedCourse.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8d99b3] mt-0.5">
                  {activeSelectedCourse ? `Instructor: ${activeSelectedCourse.teacher} • Syllabus Completion: ${activeSelectedCourse.progress}%` : 'Consolidated performance analytics across all enrolled academic subjects'}
                </p>
              </div>
            </div>

            {(selectedCourseId !== 'all' || selectedBoard !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={handleSelectAllEnrolled}
                className="text-xs text-[#14e6ff] hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
              >
                <span>Reset to All</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* 4 Pillars Comparison Minimal Circular Progress Indicators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white font-semibold">
                <Activity className="w-3.5 h-3.5 text-[#14e6ff]" />
                <span>Pillar-by-Pillar Performance Comparison</span>
              </div>
              <span className="text-[11px] font-mono text-[#8d99b3]">
                4 Core Evaluation Domains
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pillarComparisonData.map((item, idx) => {
                const radius = 36;
                const circumference = 2 * Math.PI * radius;
                const scorePercent = Math.min(100, Math.max(0, item.fahim));
                const strokeDashoffset = circumference - (scorePercent / 100) * circumference;
                const deltaVsAvg = Math.round(item.fahim - item.batchAvg);

                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/12 transition-colors flex flex-col items-center text-center relative group"
                  >
                    {/* Top: Pillar Name & Subtle Delta */}
                    <div className="w-full flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-white/90 text-xs truncate">
                          {item.pillar}
                        </span>
                      </div>
                      <span 
                        className={`text-[10px] font-mono font-medium shrink-0 ${
                          deltaVsAvg >= 0 ? 'text-[#3fe07f]' : 'text-[#ff6b60]'
                        }`}
                      >
                        {deltaVsAvg >= 0 ? `+${deltaVsAvg}%` : `${deltaVsAvg}%`}
                      </span>
                    </div>

                    {/* Minimal Circular Progress Indicator */}
                    <div className="relative w-24 h-24 my-1 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                        {/* Clean Subtle Track */}
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          stroke="rgba(255, 255, 255, 0.06)"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        {/* Dynamic Clean Progress Ring */}
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          stroke={item.color}
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          style={{
                            transition: 'stroke-dashoffset 0.6s ease-out',
                          }}
                        />
                      </svg>

                      {/* Clean Centered Metric */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-mono font-bold text-white tracking-tight">
                          {item.fahim}<span className="text-xs text-white/50 font-normal">%</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Clean Minimal Benchmark Footnote */}
                    <div className="w-full pt-3 mt-1 border-t border-white/[0.04] flex items-center justify-between text-[10.5px] font-mono text-[#8d99b3]">
                      <span>Avg <strong className="text-white/80 font-normal">{item.batchAvg}%</strong></span>
                      <span className="text-white/20">•</span>
                      <span>High <strong className="text-white/80 font-normal">{item.batchHighest}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PEER BENCHMARK COHORT & GRADE DISTRIBUTION */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 Cols: Peer Comparison Table */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white font-bold font-['Sora']">
                  <Users className="w-4 h-4 text-[#14e6ff]" />
                  <span>Batch Cohort Standings (Top 10 of 25)</span>
                </div>
                <span className="text-[11px] text-[#25D366] font-mono font-semibold">
                  You are Rank #3
                </span>
              </div>

              <div className="space-y-1.5">
                {batchCohortList.map((peer) => (
                  <div
                    key={peer.rank}
                    className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      peer.isCurrentStudent
                        ? 'bg-gradient-to-r from-[#14e6ff]/15 to-transparent border-[#14e6ff]/40 shadow-[0_0_15px_rgba(20,230,255,0.1)]'
                        : 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        peer.rank === 1
                          ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40'
                          : peer.rank === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                          : peer.rank === 3
                          ? 'bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/40'
                          : 'bg-white/5 text-[#8d99b3]'
                      }`}>
                        {peer.rank}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold truncate ${
                            peer.isCurrentStudent ? 'text-[#14e6ff] font-bold' : 'text-white'
                          }`}>
                            {peer.studentName}
                          </span>
                          {peer.isCurrentStudent && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#14e6ff]/20 text-[#14e6ff] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8d99b3] font-mono flex items-center gap-2">
                          <span>Scripts: {peer.scriptScore}%</span>
                          <span>•</span>
                          <span>MCQs: {peer.mcqScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-mono font-bold text-xs ${
                        peer.isCurrentStudent ? 'text-[#14e6ff]' : peer.rank <= 3 ? 'text-[#ffa600]' : 'text-white'
                      }`}>
                        {peer.overallScore}%
                      </div>
                      <div className="text-[9.5px] text-[#8d99b3] font-mono">
                        {peer.completionRate}% complete
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Grade Distribution & Cohort Dispersion */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white font-bold font-['Sora']">
                  <Activity className="w-4 h-4 text-[#ffa600]" />
                  <span>Cohort Grade Distribution</span>
                </div>
                <span className="text-[11px] text-[#8d99b3] font-mono">25 Total</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.06] space-y-3.5">
                {/* Distribution Categories */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#25D366] flex items-center gap-1.5">
                        <span>A* Bracket (90%+)</span>
                        <span className="text-[10px] text-white font-mono bg-[#25D366]/20 px-1.5 py-0.2 rounded font-bold">3 Students (Includes You)</span>
                      </span>
                      <span className="text-white font-mono font-bold">12%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#25D366]" style={{ width: '12%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#14e6ff]">A Bracket (80% - 89%)</span>
                      <span className="text-white font-mono font-bold">16% (4 Students)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#14e6ff]" style={{ width: '16%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#ffa600]">B Bracket (70% - 79%)</span>
                      <span className="text-white font-mono font-bold">24% (6 Students)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#ffa600]" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#8d99b3]">C Bracket (60% - 69%)</span>
                      <span className="text-white font-mono font-bold">20% (5 Students)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#8d99b3]" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-red-400">D / E / U Bracket (&lt;60%)</span>
                      <span className="text-white font-mono font-bold">28% (7 Students)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-red-400" style={{ width: '28%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-[#8d99b3] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white">
                    <span>Your Decile: <strong className="text-[#14e6ff]">Top 10% (Decile 1)</strong></span>
                    <span>Deviation: <strong className="text-[#25D366]">+1.82 σ</strong></span>
                  </div>
                  <p className="text-[11px] text-[#8d99b3] leading-relaxed">
                    Consistent performance across all 4 pillars keeps you in the top cohort for university recommendation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Assessment Actions Link */}
          <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] flex items-center justify-between">
            <div className="text-xs text-[#8d99b3]">
              Need to submit written assessment scripts or take pending online quizzes?
            </div>
            <button
              onClick={() => onNavigate('assessments')}
              className="text-xs text-[#14e6ff] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Go to Assessments Tab</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
