import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Video, 
  Clock, 
  Users, 
  Radio, 
  ExternalLink,
  CalendarCheck,
  FileText,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Play,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  CheckCircle2,
  Folder,
  Search,
  X,
  Check
} from 'lucide-react';
import { UpcomingClass, LectureSheet, ClassScheduleItem, Course, TabId } from '../types';
import { formatDate, formatTime, durationSuffix, isToday, timeParts } from '../utils/formatters';

interface ClassesTabProps {
  upcomingClasses: UpcomingClass[];
  classSchedules?: ClassScheduleItem[];
  lectureSheets?: LectureSheet[];
  courses?: Course[];
  initialCourseId?: string | null;
  onClearCourseFilter?: () => void;
  onSelectCourse?: (courseId: string) => void;
  onNavigate?: (tab: TabId, courseId?: string) => void;
}

export const ClassesTab: React.FC<ClassesTabProps> = ({ 
  upcomingClasses,
  classSchedules = [],
  lectureSheets = [],
  courses = [],
  initialCourseId = null,
  onClearCourseFilter,
  onSelectCourse,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'lectures'>('schedule');

  // Enrolled courses list
  const enrolledCourses = useMemo(() => {
    const enrolled = courses.filter(c => c.enrolled);
    return enrolled.length > 0 ? enrolled : courses;
  }, [courses]);

  // Navigation Tree State - navigated strictly by enrolled courses tree
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || 'all');
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'Edexcel' | 'Cambridge'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  const [downloadingSheetId, setDownloadingSheetId] = useState<string | null>(null);

  const [expandedBoards, setExpandedBoards] = useState<Record<string, boolean>>({
    Cambridge: true,
    Edexcel: true
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    IAL: true,
    IGCSE: true,
    'A-Levels': true,
    'A-levels': true,
    'O-Levels': true,
    'O-levels': true
  });

  // Synchronize when initialCourseId prop changes from external navigation
  useEffect(() => {
    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
      const matchCourse = enrolledCourses.find(c => c.id === initialCourseId) || courses.find(c => c.id === initialCourseId);
      if (matchCourse) {
        if (matchCourse.board) setSelectedBoard(matchCourse.board as any);
        if (matchCourse.category) setSelectedCategory(matchCourse.category);
        if (matchCourse.board) {
          setExpandedBoards(prev => ({ ...prev, [matchCourse.board!]: true }));
        }
      }
    }
  }, [initialCourseId, enrolledCourses, courses]);

  // Helper matching function
  const isCourseMatch = (itemCourseId: string, itemCourseName: string, targetCourseId: string) => {
    if (targetCourseId === 'all') return true;
    if (itemCourseId === targetCourseId) return true;
    
    const targetCourse = courses.find(c => c.id === targetCourseId);
    if (targetCourse) {
      const codeOrSimpleName = targetCourse.name.split('—')[0].trim().toLowerCase();
      const codeOnly = targetCourse.code?.toLowerCase();
      const itemNameLower = itemCourseName.toLowerCase();
      const itemIdLower = itemCourseId.toLowerCase();

      if (itemIdLower === targetCourse.id.toLowerCase()) return true;
      if (itemNameLower.includes(codeOrSimpleName) || codeOrSimpleName.includes(itemNameLower)) return true;
      if (codeOnly && itemNameLower.includes(codeOnly)) return true;
    }

    return itemCourseId.toLowerCase().includes(targetCourseId.toLowerCase()) || 
           targetCourseId.toLowerCase().includes(itemCourseId.toLowerCase());
  };

  // Find active course metadata if filtered
  const activeCourse = enrolledCourses.find(c => c.id === selectedCourseId) || courses.find(c => c.id === selectedCourseId);

  // Tree Handlers
  const toggleBoardExpand = (board: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBoards(prev => ({ ...prev, [board]: !prev[board] }));
  };

  const toggleCategoryExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = () => {
    setSelectedCourseId('all');
    setSelectedBoard('all');
    setSelectedCategory('all');
    onClearCourseFilter?.();
  };

  const handleSelectBoard = (board: 'Edexcel' | 'Cambridge') => {
    setSelectedBoard(board);
    setSelectedCategory('all');
    setSelectedCourseId('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
    onClearCourseFilter?.();
  };

  const handleSelectCategory = (board: 'Edexcel' | 'Cambridge', category: string) => {
    setSelectedBoard(board);
    setSelectedCategory(category);
    setSelectedCourseId('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
    setExpandedCategories(prev => ({ ...prev, [`${board}-${category}`]: true }));
    onClearCourseFilter?.();
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.board) setSelectedBoard(course.board as any);
    if (course.category) setSelectedCategory(course.category);
    onSelectCourse?.(course.id);
  };

  // Helper to count upcoming and schedule items for a course
  const getCourseClassesCount = (course: Course) => {
    const upcoming = upcomingClasses.filter(c => isCourseMatch(c.courseId, c.courseName, course.id)).length;
    const routine = classSchedules.filter(s => isCourseMatch(s.courseId, s.courseName, course.id)).length;
    return upcoming + routine;
  };

  const isCourseLive = (course: Course) => {
    return classSchedules.some(s => isCourseMatch(s.courseId, s.courseName, course.id) && s.isLiveNow);
  };

  // Build Tree Structure grouped by Board -> Category -> Enrolled Course
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

        const totalClassesInCat = filteredList.reduce((acc, c) => acc + getCourseClassesCount(c), 0);

        return {
          categoryName: catName,
          courses: filteredList,
          totalClasses: totalClassesInCat
        };
      }).filter(group => group.courses.length > 0);

      const totalClassesInBoard = categories.reduce((acc, cat) => acc + cat.totalClasses, 0);

      return {
        board,
        hasCourses: boardCourses.length > 0,
        categories,
        totalClasses: totalClassesInBoard,
        coursesCount: boardCourses.length
      };
    }).filter(b => b.hasCourses);
  }, [enrolledCourses, upcomingClasses, classSchedules, treeSearchQuery]);

  // Total enrolled upcoming sessions
  const totalEnrolledClassesCount = useMemo(() => {
    return upcomingClasses.filter(c => 
      enrolledCourses.some(ec => isCourseMatch(c.courseId, c.courseName, ec.id))
    ).length;
  }, [upcomingClasses, enrolledCourses]);

  // Filtered schedules for current tree selection (strictly enrolled)
  const filteredSchedules = useMemo(() => {
    return classSchedules.filter(sch => {
      // Must belong to an enrolled course
      const matchesEnrolled = enrolledCourses.some(c => isCourseMatch(sch.courseId, sch.courseName, c.id));
      if (!matchesEnrolled) return false;

      if (selectedCourseId !== 'all') {
        return isCourseMatch(sch.courseId, sch.courseName, selectedCourseId);
      }
      if (selectedBoard !== 'all' && sch.board !== selectedBoard) {
        return false;
      }
      if (selectedCategory !== 'all') {
        const schCat = (sch.category || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        if (!schCat.includes(selCat) && !selCat.includes(schCat)) return false;
      }
      return true;
    });
  }, [classSchedules, enrolledCourses, selectedCourseId, selectedBoard, selectedCategory]);

  // Filtered upcoming classes for current tree selection (strictly enrolled)
  const filteredUpcoming = useMemo(() => {
    return upcomingClasses.filter(c => {
      // Must belong to an enrolled course
      const matchesEnrolled = enrolledCourses.some(ec => isCourseMatch(c.courseId, c.courseName, ec.id));
      if (!matchesEnrolled) return false;

      if (selectedCourseId !== 'all') {
        return isCourseMatch(c.courseId, c.courseName, selectedCourseId);
      }

      // Check board / category if selected
      if (selectedBoard !== 'all' || selectedCategory !== 'all') {
        const matchedCourse = enrolledCourses.find(ec => isCourseMatch(c.courseId, c.courseName, ec.id));
        if (!matchedCourse) return false;
        if (selectedBoard !== 'all' && matchedCourse.board !== selectedBoard) return false;
        if (selectedCategory !== 'all') {
          const cCat = (matchedCourse.category || '').toLowerCase();
          const selCat = selectedCategory.toLowerCase();
          if (!cCat.includes(selCat) && !selCat.includes(cCat)) return false;
        }
      }

      return true;
    });
  }, [upcomingClasses, enrolledCourses, selectedCourseId, selectedBoard, selectedCategory]);

  // Filtered lecture sheets
  const filteredLectureSheets = useMemo(() => {
    return lectureSheets.filter(ls => {
      const matchesEnrolled = enrolledCourses.some(ec => isCourseMatch(ls.courseId, ls.courseName, ec.id));
      if (!matchesEnrolled) return false;

      if (selectedCourseId !== 'all') {
        return isCourseMatch(ls.courseId, ls.courseName, selectedCourseId);
      }
      if (selectedBoard !== 'all' || selectedCategory !== 'all') {
        const matchedCourse = enrolledCourses.find(ec => isCourseMatch(ls.courseId, ls.courseName, ec.id));
        if (!matchedCourse) return false;
        if (selectedBoard !== 'all' && matchedCourse.board !== selectedBoard) return false;
        if (selectedCategory !== 'all') {
          const cCat = (matchedCourse.category || '').toLowerCase();
          const selCat = selectedCategory.toLowerCase();
          if (!cCat.includes(selCat) && !selCat.includes(cCat)) return false;
        }
      }
      return true;
    });
  }, [lectureSheets, enrolledCourses, selectedCourseId, selectedBoard, selectedCategory]);

  // Sort upcoming sessions chronologically
  const sortedUpcoming = useMemo(() => {
    return [...filteredUpcoming].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [filteredUpcoming]);

  // Group by date
  const groups: Record<string, UpcomingClass[]> = {};
  const order: string[] = [];

  sortedUpcoming.forEach(c => {
    const key = formatDate(c.startsAt);
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push(c);
  });

  const handleDownloadSheet = (id: string, title: string) => {
    setDownloadingSheetId(id);
    setTimeout(() => {
      setDownloadingSheetId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Main Grid: Left Tree Navigation + Right Classes Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Enrolled Courses Tree Navigation */}
        <div className={`transition-all duration-300 ${isTreeCollapsed ? 'lg:col-span-1' : 'lg:col-span-4 xl:col-span-3'}`}>
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden sticky top-20 shadow-xl bg-[#050e33]/70 backdrop-blur-xl">
            
            {/* Tree Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#14e6ff]/20 to-[#0066ff]/20 border border-[#14e6ff]/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#14e6ff]" />
                </div>
                {!isTreeCollapsed && (
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                      <span>Enrolled Courses</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30">
                        {enrolledCourses.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#8d99b3]">Class routine tree</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                title={isTreeCollapsed ? "Expand tree" : "Collapse tree"}
                className="p-1.5 rounded-lg text-[#8d99b3] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                {isTreeCollapsed ? (
                  <ChevronsRight className="w-4 h-4 text-[#14e6ff]" />
                ) : (
                  <ChevronsLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Tree Content */}
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

                {/* Tree Root: All Enrolled Classes */}
                <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                  <button
                    onClick={handleSelectAll}
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
                      <span className="text-xs truncate font-medium">All Enrolled Classes</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-white shrink-0 font-medium">
                      {totalEnrolledClassesCount}
                    </span>
                  </button>

                  {/* Boards Accordion */}
                  {treeStructure.map(boardNode => {
                    const isBoardExpanded = !!expandedBoards[boardNode.board];
                    const isBoardActive = selectedBoard === boardNode.board && selectedCategory === 'all' && selectedCourseId === 'all';
                    const isEdx = boardNode.board === 'Edexcel';

                    return (
                      <div key={boardNode.board} className="rounded-xl overflow-hidden border border-white/[0.04] bg-white/[0.01]">
                        {/* Board Header Node */}
                        <div
                          onClick={() => handleSelectBoard(boardNode.board)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left transition-all cursor-pointer ${
                            isBoardActive
                              ? isEdx 
                                ? 'bg-[#ffa600]/20 text-[#ffa600] font-bold shadow-[0_0_12px_rgba(255,166,0,0.15)]'
                                : 'bg-[#14e6ff]/20 text-[#14e6ff] font-bold shadow-[0_0_12px_rgba(20,230,255,0.15)]'
                              : 'text-white/90 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              onClick={(e) => toggleBoardExpand(boardNode.board, e)}
                              className="p-0.5 rounded hover:bg-white/10 text-[#8d99b3] hover:text-white transition-colors"
                            >
                              {isBoardExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isEdx ? 'text-[#ffa600]' : 'text-[#14e6ff]'}`} />
                            <span className="text-xs font-bold tracking-tight truncate">
                              {boardNode.board}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8d99b3] shrink-0 font-medium">
                            {boardNode.coursesCount}
                          </span>
                        </div>

                        {/* Categories List */}
                        {isBoardExpanded && (
                          <div className="pl-4 pr-1 py-1 space-y-1 bg-black/20 border-t border-white/[0.03]">
                            {boardNode.categories.map(categoryNode => {
                              const catKey = `${boardNode.board}-${categoryNode.categoryName}`;
                              const isCatExpanded = expandedCategories[catKey] ?? true;
                              const isCatActive = selectedBoard === boardNode.board && selectedCategory === categoryNode.categoryName && selectedCourseId === 'all';

                              return (
                                <div key={categoryNode.categoryName} className="space-y-0.5">
                                  {/* Category Header */}
                                  <div
                                    onClick={() => handleSelectCategory(boardNode.board, categoryNode.categoryName)}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                                      isCatActive
                                        ? 'bg-white/15 text-white font-semibold'
                                        : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.03]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <button
                                        onClick={(e) => toggleCategoryExpand(catKey, e)}
                                        className="p-0.5 rounded hover:bg-white/10 transition-colors"
                                      >
                                        {isCatExpanded ? (
                                          <ChevronDown className="w-3 h-3" />
                                        ) : (
                                          <ChevronRight className="w-3 h-3" />
                                        )}
                                      </button>
                                      <BookOpen className="w-3 h-3 text-[#14e6ff]/80 shrink-0" />
                                      <span className="text-[11px] font-medium truncate">
                                        {categoryNode.categoryName}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-mono px-1 rounded bg-white/[0.04] text-[#8d99b3] shrink-0">
                                      {categoryNode.courses.length}
                                    </span>
                                  </div>

                                  {/* Enrolled Courses Leaf Nodes */}
                                  {isCatExpanded && (
                                    <div className="pl-5 space-y-0.5 border-l border-white/[0.06] ml-2.5 my-0.5">
                                      {categoryNode.courses.map(c => {
                                        const isCourseActive = selectedCourseId === c.id;
                                        const live = isCourseLive(c);

                                        return (
                                          <button
                                            key={c.id}
                                            onClick={() => handleSelectCourse(c)}
                                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-all cursor-pointer group ${
                                              isCourseActive
                                                ? isEdx
                                                  ? 'bg-[#ffa600]/25 text-[#ffa600] font-bold border-l-2 border-[#ffa600]'
                                                  : 'bg-[#14e6ff]/25 text-[#14e6ff] font-bold border-l-2 border-[#14e6ff]'
                                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                          >
                                            <div className="min-w-0 pr-1">
                                              <div className="flex items-center gap-1">
                                                <p className="text-[11px] truncate leading-tight font-medium">
                                                  {c.code || c.name.split('—')[0].trim()}
                                                </p>
                                                {live && (
                                                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping shrink-0" />
                                                )}
                                              </div>
                                              <p className="text-[9px] text-[#8d99b3]/80 truncate">
                                                {c.teacher}
                                              </p>
                                            </div>

                                            {live ? (
                                              <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-[#25D366] text-black shrink-0">
                                                LIVE
                                              </span>
                                            ) : (
                                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                                                isCourseActive
                                                  ? 'bg-black/30 font-bold'
                                                  : 'bg-white/[0.05] text-[#8d99b3]'
                                              }`}>
                                                {c.progress}%
                                              </span>
                                            )}
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
              /* Collapsed quick icons */
              <div className="flex flex-col items-center gap-3 py-3">
                <button
                  onClick={handleSelectAll}
                  title="All Enrolled Classes"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    selectedCourseId === 'all' && selectedBoard === 'all' ? 'bg-[#14e6ff]/20 text-[#14e6ff]' : 'hover:bg-white/[0.05] text-[#8d99b3]'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </button>
                {treeStructure.map(b => (
                  <button
                    key={b.board}
                    onClick={() => handleSelectBoard(b.board)}
                    title={`${b.board} Enrolled Classes`}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      selectedBoard === b.board ? 'bg-[#ffa600]/20 text-[#ffa600]' : 'hover:bg-white/[0.05] text-[#8d99b3]'
                    }`}
                  >
                    <Folder className="w-5 h-5" />
                  </button>
                ))}
              </div>
            )}

            {/* Tree Footer Google Meet Note */}
            {!isTreeCollapsed && (
              <div className="p-3 border-t border-white/[0.06] text-[11px] text-[#8d99b3] space-y-1 bg-white/[0.01]">
                <div className="flex items-center gap-1.5 text-white/80 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Google Meet Verified</span>
                </div>
                <p className="text-[10px] leading-relaxed text-[#8d99b3]">
                  All live sessions and weekly routines are restricted to your enrolled curriculum.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Focus Header, Sub-nav and Sessions List */}
        <div className={`space-y-6 ${isTreeCollapsed ? 'lg:col-span-11' : 'lg:col-span-8 xl:col-span-9'}`}>
          
          {/* Active Focus Header */}
          {selectedCourseId !== 'all' && activeCourse ? (
            <div className="relative overflow-hidden rounded-3xl border border-[#14e6ff]/30 bg-gradient-to-r from-[#14e6ff]/[0.08] via-white/[0.02] to-transparent p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(20,230,255,0.08)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/40">
                      {activeCourse.board || 'Curriculum'} • {activeCourse.category || 'Course'}
                    </span>
                    {activeCourse.code && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#8d99b3] border border-white/10">
                        Code: {activeCourse.code}
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Enrolled Routine
                    </span>
                  </div>

                  <div>
                    <h2 className="font-['Sora'] font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#14e6ff]" />
                      <span>{activeCourse.name}</span>
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#8d99b3] mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#14e6ff]" />
                        <span>Assigned Faculty: <strong className="text-white">{activeCourse.teacher}</strong></span>
                      </span>
                      <span>•</span>
                      <span>Syllabus Progress: <strong className="text-[#14e6ff] font-mono">{activeCourse.progress}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions for this Course */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('recordings', activeCourse.id)}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Watch recorded lectures for this course"
                    >
                      <Video className="w-3.5 h-3.5 text-[#ff00c3]" />
                      <span>Past Lectures</span>
                    </button>
                  )}

                  <button
                    onClick={handleSelectAll}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    title="View all scheduled classes across enrolled courses"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#ffa600]" />
                    <span>All Enrolled Classes</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                <span className="text-[#8d99b3]">Classes</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d99b3]/60" />
                <span className={`font-bold ${
                  selectedBoard === 'Edexcel' ? 'text-[#ffa600]' : selectedBoard === 'Cambridge' ? 'text-[#14e6ff]' : 'text-white'
                }`}>
                  {selectedBoard === 'all' ? 'All Enrolled Courses' : selectedBoard}
                </span>
                {selectedCategory !== 'all' && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8d99b3]/60" />
                    <span className="px-2 py-0.5 rounded bg-white/[0.08] text-white font-bold">
                      {selectedCategory}
                    </span>
                  </>
                )}
                <span className="text-[11px] text-[#8d99b3] ml-1">
                  ({filteredUpcoming.length} upcoming sessions)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#25D366]">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shadow-[0_0_8px_#25D366]" />
                <span>Live Google Meet Verified</span>
              </div>
            </div>
          )}

          {/* Sub-Nav Switcher: Schedule vs Lecture Sheets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'schedule'
                    ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_15px_rgba(20,230,255,0.25)]'
                    : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>
                  {selectedCourseId === 'all' 
                    ? 'Live Schedule & Routine' 
                    : `${activeCourse?.code || 'Course'} Schedule & Routine`}
                </span>
              </button>

              <button
                onClick={() => setActiveSubTab('lectures')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'lectures'
                    ? 'bg-white text-[#01021c] font-bold shadow-md'
                    : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lecture Sheets &amp; Notes ({filteredLectureSheets.length})</span>
              </button>
            </div>

            <div className="text-xs text-[#8d99b3]">
              Showing <span className="text-white font-semibold">{filteredUpcoming.length}</span> scheduled sessions
            </div>
          </div>

          {/* VIEW 1: LIVE CLASSES & RECURRING ROUTINE */}
          {activeSubTab === 'schedule' && (
            <div className="space-y-6">
              {/* Master Weekly Course Routine Banner */}
              {filteredSchedules.length > 0 && (
                <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#14e6ff]" />
                      <h3 className="font-bold text-sm text-white">
                        {selectedCourseId === 'all' 
                          ? 'Enrolled Weekly Course Routine' 
                          : `Weekly Routine for ${activeCourse?.name || 'Selected Course'}`}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.04] px-2 py-0.5 rounded">
                      Official Routine
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {filteredSchedules.map((sch) => (
                      <div 
                        key={sch.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          sch.isLiveNow 
                            ? 'bg-[#25D366]/[0.06] border-[#25D366]/40 shadow-[0_0_15px_rgba(37,211,102,0.15)]' 
                            : 'bg-white/[0.02] border-white/[0.06]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.06] text-[#14e6ff]">
                              {sch.board} • {sch.category}
                            </span>
                            {sch.isLiveNow && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#25D366] text-black animate-pulse">
                                LIVE NOW
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs text-white break-words">{sch.courseName}</div>
                          <div className="text-[11px] text-[#8d99b3] mt-0.5 break-words">{sch.teacherName} • {sch.dayOfWeek}</div>
                          <div className="text-[11px] font-mono text-[#ffa600] mt-0.5">{sch.timeSlot}</div>
                        </div>

                        <a
                          href={sch.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                            sch.isLiveNow 
                              ? 'bg-[#25D366] text-black shadow-[0_0_12px_rgba(37,211,102,0.4)]' 
                              : 'bg-[#14e6ff] text-[#00131a]'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current shrink-0" />
                          <span>{sch.isLiveNow ? 'Join Class' : 'Meet Link'}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Sessions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#14e6ff]" />
                    <span>
                      {selectedCourseId === 'all' 
                        ? 'Upcoming Enrolled Live Sessions & Google Meet Broadcasts' 
                        : `Upcoming Live Broadcasts for ${activeCourse?.name || 'this Course'}`}
                    </span>
                  </h3>
                </div>

                {order.length === 0 ? (
                  <div className="glass-panel p-10 sm:p-12 text-center rounded-3xl space-y-4 border border-white/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#8d99b3]">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="font-['Sora'] font-bold text-base text-white">
                        {selectedCourseId === 'all' 
                          ? 'No Upcoming Classes Scheduled' 
                          : `No Immediate Live Broadcasts for ${activeCourse?.name || 'this Course'}`}
                      </h3>
                      <p className="text-xs text-[#8d99b3] leading-relaxed">
                        {filteredSchedules.length > 0
                          ? `Regular weekly lectures take place on ${filteredSchedules.map(s => `${s.dayOfWeek} (${s.timeSlot})`).join(', ')}. Check back on the class day for the live link.`
                          : 'No live classes are currently scheduled for this selection. Check back later or watch past recorded lectures.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {activeCourse && onNavigate && (
                        <button
                          onClick={() => onNavigate('recordings', activeCourse.id)}
                          className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(20,230,255,0.25)] flex items-center gap-2 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Watch {activeCourse.code || 'Course'} Recordings</span>
                        </button>
                      )}

                      {selectedCourseId !== 'all' && (
                        <button
                          onClick={handleSelectAll}
                          className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#ffa600]" />
                          <span>Show All Enrolled Classes</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  order.map(dateKey => {
                    const items = groups[dateKey];
                    const hasToday = items.some(c => isToday(c.startsAt));

                    return (
                      <div key={dateKey} className="space-y-3">
                        {/* Date Group Heading */}
                        <div className="flex items-center gap-2 px-1">
                          <CalendarCheck className="w-4 h-4 text-[#14e6ff]" />
                          <h3 className="font-bold text-sm text-white">
                            {dateKey}
                          </h3>
                          {hasToday && (
                            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 shadow-[0_0_10px_rgba(37,211,102,0.25)]">
                              Live Today
                            </span>
                          )}
                        </div>

                        {/* Group Card */}
                        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.06] w-full">
                          {items.map(c => {
                            const today = isToday(c.startsAt);
                            const tp = timeParts(c.startsAt);

                            return (
                              <div
                                key={c.id}
                                className={`
                                  p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 transition-all w-full
                                  ${today ? 'bg-[#25D366]/[0.03]' : 'hover:bg-white/[0.02]'}
                                `}
                              >
                                {/* Left: Time & Details */}
                                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto flex-1">
                                  {/* Time Chip */}
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#14e6ff]/10 border border-[#14e6ff]/20 flex flex-col items-center justify-center shrink-0 text-center shadow-[0_0_15px_rgba(20,230,255,0.1)]">
                                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#14e6ff]">
                                      {tp.period}
                                    </span>
                                    <span className="font-bold text-sm sm:text-base text-white leading-tight mt-0.5 font-mono">
                                      {tp.time}
                                    </span>
                                  </div>

                                  {/* Text meta */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d99b3] break-words">
                                        {c.courseName}
                                      </span>
                                      <span className="text-[10px] font-mono text-[#8d99b3] bg-white/[0.06] px-1.5 py-0.5 rounded shrink-0">
                                        {durationSuffix(c.durationMin)}
                                      </span>
                                    </div>

                                    <h4 className="font-['Sora'] font-bold text-sm sm:text-base text-white break-words leading-snug">
                                      {c.topic}
                                    </h4>

                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 text-xs text-[#8d99b3] flex-wrap">
                                      <Users className="w-3.5 h-3.5 text-[#14e6ff] shrink-0" />
                                      <span className="break-words">Assigned Faculty: <strong className="text-white font-medium">{c.teacher}</strong></span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="w-full sm:w-auto flex items-center pt-1 sm:pt-0 shrink-0 sm:self-center">
                                  <a
                                    href={c.meetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-['Sora'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(20,230,255,0.3)] cursor-pointer"
                                  >
                                    <Radio className="w-4 h-4 text-[#00131a] animate-pulse shrink-0" />
                                    <span className="whitespace-nowrap">Join Google Meet</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: LECTURE SHEETS & RESOURCE LIBRARY */}
          {activeSubTab === 'lectures' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {selectedCourseId === 'all' 
                      ? 'Enrolled Lecture Sheets & Study Notes' 
                      : `Lecture Sheets & Notes for ${activeCourse?.name || 'Selected Course'}`}
                  </h3>
                  <p className="text-xs text-[#8d99b3]">
                    Official syllabus booklets, solved reaction sheets, and presentation slides uploaded by faculty &amp; admin.
                  </p>
                </div>
              </div>

              {filteredLectureSheets.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-3xl space-y-3">
                  <FileText className="w-10 h-10 text-[#8d99b3]/40 mx-auto" />
                  <h4 className="font-bold text-white text-base">No Lecture Sheets Uploaded Yet</h4>
                  <p className="text-xs text-[#8d99b3]">Faculty will upload handouts and worksheets prior to the live lecture.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLectureSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[#14e6ff] border border-white/[0.08]">
                            {sheet.fileType} • {sheet.fileSize}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            sheet.uploaderRole === 'admin' 
                              ? 'bg-[#ff00c3]/15 text-[#ff00c3] border border-[#ff00c3]/30' 
                              : 'bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30'
                          }`}>
                            {sheet.uploaderRole === 'admin' ? '👑 Admin Uploaded' : '🧑‍🏫 Teacher Uploaded'}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white">
                          {sheet.title}
                        </h4>
                        <p className="text-xs text-[#8d99b3] mt-1">
                          Course: <span className="text-white font-medium">{sheet.courseName}</span>
                        </p>
                        <p className="text-xs text-[#ffa600] mt-0.5">
                          Topic: {sheet.topic}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        <div className="text-[11px] font-mono text-[#8d99b3]">
                          Uploaded by {sheet.uploadedBy}
                        </div>

                        <button
                          onClick={() => handleDownloadSheet(sheet.id, sheet.title)}
                          className="px-4 py-2 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.25)] cursor-pointer"
                        >
                          {downloadingSheetId === sheet.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Downloaded</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
