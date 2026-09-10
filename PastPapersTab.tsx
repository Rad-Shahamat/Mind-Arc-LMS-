import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  FileCheck, 
  Download, 
  ExternalLink, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  ChevronsLeft, 
  ChevronsRight, 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { Course, PastPaper, BoardType } from '../types';

interface PastPapersTabProps {
  courses: Course[];
  pastPapers: PastPaper[];
}

// Matching helper between a past paper and a course
export const isPaperForCourse = (paper: PastPaper, course: Course): boolean => {
  if (paper.courseId === course.id) return true;
  
  // Check code overlap (e.g. WMA11, 4BI1, 9701, etc.)
  if (course.code && paper.subjectCode) {
    const cCodes = course.code.toLowerCase().split(/[\s/,]+/).filter(Boolean);
    const pCode = paper.subjectCode.toLowerCase();
    if (cCodes.some(c => c.includes(pCode) || pCode.includes(c))) return true;
  }
  
  // Check name & subject matching within board & category
  if (course.name && (paper.courseName || paper.subjectName)) {
    const cNameClean = course.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const pNameClean = (paper.subjectName || paper.courseName || '').toLowerCase().replace(/[^a-z0-9]/g, ' ');
    
    const boardMatch = !paper.board || !course.board || paper.board.toLowerCase() === course.board.toLowerCase();
    const catClean = (c: string) => c.toLowerCase().replace(/[^a-z]/g, '');
    const catMatch = !paper.category || !course.category || catClean(paper.category) === catClean(course.category);

    if (boardMatch && catMatch) {
      const keywords = ['chemistry', 'physics', 'biology', 'mathematics', 'math', 'mechanics', 'bangla'];
      for (const kw of keywords) {
        if (cNameClean.includes(kw) && pNameClean.includes(kw)) {
          return true;
        }
      }
    }
  }

  // ID overlap
  if (paper.courseId && course.id) {
    if (paper.courseId.includes(course.id) || course.id.includes(paper.courseId)) return true;
  }

  return false;
};

export const PastPapersTab: React.FC<PastPapersTabProps> = ({ courses, pastPapers }) => {
  // Navigation & Tree state for enrolled courses
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'Edexcel' | 'Cambridge'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');

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
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');

  // Main list filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // 1. Enrolled Courses only
  const enrolledCourses = useMemo(() => {
    const enrolled = courses.filter(c => c.enrolled);
    return enrolled.length > 0 ? enrolled : courses;
  }, [courses]);

  // 2. Filter past papers to only those for enrolled courses
  const enrolledPastPapers = useMemo(() => {
    return pastPapers.filter(paper => 
      enrolledCourses.some(course => isPaperForCourse(paper, course))
    );
  }, [pastPapers, enrolledCourses]);

  // Count papers for a specific course
  const getCoursePapersCount = (course: Course) => {
    return enrolledPastPapers.filter(p => isPaperForCourse(p, course)).length;
  };

  // Build Tree Structure from enrolled courses
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

        const totalPapersInCat = filteredList.reduce((acc, c) => acc + getCoursePapersCount(c), 0);

        return {
          categoryName: catName,
          courses: filteredList,
          totalPapers: totalPapersInCat
        };
      }).filter(group => group.courses.length > 0);

      const totalPapersInBoard = categories.reduce((acc, cat) => acc + cat.totalPapers, 0);

      return {
        board,
        hasCourses: boardCourses.length > 0,
        categories,
        totalPapers: totalPapersInBoard,
        coursesCount: boardCourses.length
      };
    }).filter(b => b.hasCourses);
  }, [enrolledCourses, enrolledPastPapers, treeSearchQuery]);

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
    setSelectedSubject('all');
    setSelectedYear('all');
  };

  const handleSelectBoardOnly = (board: 'Edexcel' | 'Cambridge') => {
    setSelectedBoard(board);
    setSelectedCategory('all');
    setSelectedCourseId('all');
    setSelectedSubject('all');
    setSelectedYear('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
  };

  const handleSelectCategory = (board: 'Edexcel' | 'Cambridge', category: string) => {
    setSelectedBoard(board);
    setSelectedCategory(category);
    setSelectedCourseId('all');
    setSelectedSubject('all');
    setSelectedYear('all');
    setExpandedBoards(prev => ({ ...prev, [board]: true }));
    setExpandedCategories(prev => ({ ...prev, [`${board}-${category}`]: true }));
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.board) setSelectedBoard(course.board as any);
    if (course.category) setSelectedCategory(course.category);
    setSelectedSubject('all');
    setSelectedYear('all');
  };

  // Active Selected Course metadata
  const activeSelectedCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return enrolledCourses.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId, enrolledCourses]);

  // Filter enrolled papers based on active selections
  const filteredPapers = useMemo(() => {
    return enrolledPastPapers.filter(paper => {
      // 1. Course filter
      if (selectedCourseId !== 'all') {
        const course = enrolledCourses.find(c => c.id === selectedCourseId);
        if (course && !isPaperForCourse(paper, course)) {
          return false;
        }
      } else {
        // 2. Board filter
        if (selectedBoard !== 'all' && paper.board !== selectedBoard) {
          return false;
        }
        // 3. Category filter
        if (selectedCategory !== 'all') {
          const catClean = (c: string) => c.toLowerCase().replace(/[^a-z]/g, '');
          if (catClean(paper.category) !== catClean(selectedCategory)) {
            return false;
          }
        }
      }

      // 4. Subject filter
      if (selectedSubject !== 'all') {
        const matchSub = (paper.subjectName || '').toLowerCase().includes(selectedSubject.toLowerCase()) ||
          (paper.courseName || '').toLowerCase().includes(selectedSubject.toLowerCase()) ||
          (paper.courseId === selectedSubject);
        if (!matchSub) return false;
      }

      // 5. Year filter
      if (selectedYear !== 'all') {
        const yearStr = (paper.year || '').toString();
        const sessionStr = paper.session || '';
        if (!yearStr.includes(selectedYear) && !sessionStr.includes(selectedYear)) {
          return false;
        }
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch = 
          paper.paper.toLowerCase().includes(q) ||
          paper.session.toLowerCase().includes(q) ||
          (paper.subjectName && paper.subjectName.toLowerCase().includes(q)) ||
          (paper.subjectCode && paper.subjectCode.toLowerCase().includes(q)) ||
          (paper.courseName && paper.courseName.toLowerCase().includes(q));
        if (!matchSearch) return false;
      }

      return true;
    });
  }, [enrolledPastPapers, selectedCourseId, selectedBoard, selectedCategory, selectedSubject, selectedYear, searchQuery, enrolledCourses]);

  // Extract available unique subjects and years for currently selected tree node
  const availableSubjects = useMemo(() => {
    const pool = enrolledPastPapers.filter(p => {
      if (selectedCourseId !== 'all') {
        const course = enrolledCourses.find(c => c.id === selectedCourseId);
        return course ? isPaperForCourse(p, course) : true;
      }
      if (selectedBoard !== 'all' && p.board !== selectedBoard) return false;
      if (selectedCategory !== 'all') {
        const catClean = (c: string) => c.toLowerCase().replace(/[^a-z]/g, '');
        if (catClean(p.category) !== catClean(selectedCategory)) return false;
      }
      return true;
    });

    const set = new Set<string>();
    pool.forEach(p => {
      if (p.subjectName) set.add(p.subjectName);
    });
    return Array.from(set);
  }, [enrolledPastPapers, selectedCourseId, selectedBoard, selectedCategory, enrolledCourses]);

  const availableYears = useMemo(() => {
    const pool = enrolledPastPapers.filter(p => {
      if (selectedCourseId !== 'all') {
        const course = enrolledCourses.find(c => c.id === selectedCourseId);
        return course ? isPaperForCourse(p, course) : true;
      }
      if (selectedBoard !== 'all' && p.board !== selectedBoard) return false;
      if (selectedCategory !== 'all') {
        const catClean = (c: string) => c.toLowerCase().replace(/[^a-z]/g, '');
        if (catClean(p.category) !== catClean(selectedCategory)) return false;
      }
      return true;
    });

    const set = new Set<string>();
    pool.forEach(p => {
      if (p.year) set.add(p.year.toString());
    });
    return Array.from(set).sort().reverse();
  }, [enrolledPastPapers, selectedCourseId, selectedBoard, selectedCategory, enrolledCourses]);

  // Group filtered papers by Session
  const sessionGroups = useMemo(() => {
    const map: Record<string, PastPaper[]> = {};
    filteredPapers.forEach(p => {
      const key = `${p.subjectName || p.courseName || 'Subject'} — ${p.session}`;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [filteredPapers]);

  // Helper for title breadcrumbs
  const getHeaderTitle = () => {
    if (activeSelectedCourse) return `${activeSelectedCourse.name} Past Papers`;
    if (selectedBoard === 'all') return 'Enrolled Courses Past Papers';
    if (selectedCategory === 'all') return `${selectedBoard} Enrolled Question Papers & Mark Schemes`;
    return `${selectedBoard} ${selectedCategory} Enrolled Papers`;
  };

  const getHeaderSubtitle = () => {
    if (activeSelectedCourse) {
      return `Access verified question papers, mark schemes, and examiner reports for ${activeSelectedCourse.name}.`;
    }
    if (selectedBoard === 'Cambridge') {
      return 'Official Cambridge examination series and mark schemes for your enrolled curriculum.';
    }
    if (selectedBoard === 'Edexcel') {
      return 'Pearson Edexcel International question papers and solved mark schemes for your enrolled courses.';
    }
    return 'Showing official question papers and solved mark schemes strictly for your enrolled courses.';
  };

  const handleDownload = (filename: string, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDownloadingFile(filename);
    setTimeout(() => {
      setDownloadingFile(null);
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card / Overview Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-white/10 bg-gradient-to-r from-[#00131a] via-[#041c2c] to-[#0d0f1a]">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#14e6ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#ffa600]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Enrolled Courses Only
              </span>
              <span className="text-xs text-[#8d99b3] font-mono">
                {enrolledPastPapers.length} Available Papers
              </span>
            </div>
            <h2 className="font-['Sora'] font-bold text-xl sm:text-2xl text-white">
              {getHeaderTitle()}
            </h2>
            <p className="text-xs sm:text-sm text-[#8d99b3] max-w-2xl">
              {getHeaderSubtitle()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-['Sora'] transition-all flex items-center gap-2 cursor-pointer ${
                selectedBoard === 'all' && selectedCourseId === 'all'
                  ? 'bg-[#14e6ff] text-[#00131a] shadow-[0_0_15px_rgba(20,230,255,0.3)] font-bold'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Enrolled ({enrolledPastPapers.length})</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedYear('all');
              }}
              title="Reset Filters"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8d99b3] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tree Navigation + Right Papers Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Enrolled Courses Tree Navigation */}
        <div className={`transition-all duration-300 ${isTreeCollapsed ? 'lg:col-span-1' : 'lg:col-span-4 xl:col-span-3'}`}>
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden sticky top-20 shadow-xl bg-[#050e33]/70 backdrop-blur-xl">
            
            {/* Tree Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#ffa600]/15 border border-[#ffa600]/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#ffa600]" />
                </div>
                {!isTreeCollapsed && (
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                      <span>Enrolled Courses</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#ffa600]/15 text-[#ffa600] border border-[#ffa600]/30">
                        {enrolledCourses.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#8d99b3]">Past papers tree</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                title={isTreeCollapsed ? "Expand tree" : "Collapse tree"}
                className="p-1.5 rounded-lg text-[#8d99b3] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                {isTreeCollapsed ? (
                  <ChevronsRight className="w-4 h-4 text-[#ffa600]" />
                ) : (
                  <ChevronsLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Tree Items */}
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
                    className="w-full bg-[#01021c]/80 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#8d99b3]/70 focus:outline-none focus:border-[#ffa600]"
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

                {/* Tree Root: All Enrolled Papers */}
                <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                  <button
                    onClick={handleSelectAll}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-[#ffa600]/20 to-[#ffa600]/5 text-white border-[#ffa600]/50 shadow-[0_0_12px_rgba(255,166,0,0.15)] font-semibold'
                        : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers className={`w-4 h-4 shrink-0 ${
                        selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                          ? 'text-[#ffa600]'
                          : 'text-[#8d99b3]'
                      }`} />
                      <span className="text-xs truncate font-medium">All Enrolled Papers</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-white shrink-0 font-medium">
                      {enrolledPastPapers.length}
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
                          onClick={() => handleSelectBoardOnly(boardNode.board)}
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
                            {boardNode.totalPapers}
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
                                      <BookOpen className="w-3 h-3 text-[#ffa600]/80 shrink-0" />
                                      <span className="text-[11px] font-medium truncate">
                                        {categoryNode.categoryName}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-mono px-1 rounded bg-white/[0.04] text-[#8d99b3] shrink-0">
                                      {categoryNode.totalPapers}
                                    </span>
                                  </div>

                                  {/* Enrolled Courses Leaf Nodes */}
                                  {isCatExpanded && (
                                    <div className="pl-5 space-y-0.5 border-l border-white/[0.06] ml-2.5 my-0.5">
                                      {categoryNode.courses.map(c => {
                                        const isCourseActive = selectedCourseId === c.id;
                                        const papersCount = getCoursePapersCount(c);

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
                                              <p className="text-[11px] truncate leading-tight font-medium">
                                                {c.code || c.name.split('—')[0].trim()}
                                              </p>
                                              <p className="text-[9px] text-[#8d99b3]/80 truncate">
                                                {c.teacher}
                                              </p>
                                            </div>
                                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                                              isCourseActive
                                                ? 'bg-black/30 font-bold'
                                                : 'bg-white/[0.05] text-[#8d99b3]'
                                            }`}>
                                              {papersCount}
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
              /* Collapsed quick icons */
              <div className="flex flex-col items-center gap-3 py-3">
                <button
                  onClick={handleSelectAll}
                  title="All Enrolled Papers"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    selectedCourseId === 'all' && selectedBoard === 'all' ? 'bg-[#ffa600]/20 text-[#ffa600]' : 'hover:bg-white/[0.05] text-[#8d99b3]'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </button>
                {treeStructure.map(b => (
                  <button
                    key={b.board}
                    onClick={() => handleSelectBoardOnly(b.board)}
                    title={`${b.board} Enrolled Papers`}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      selectedBoard === b.board ? 'bg-[#14e6ff]/20 text-[#14e6ff]' : 'hover:bg-white/[0.05] text-[#8d99b3]'
                    }`}
                  >
                    <Folder className="w-5 h-5" />
                  </button>
                ))}
              </div>
            )}

            {/* Tree Footer Guarantee */}
            {!isTreeCollapsed && (
              <div className="p-3 border-t border-white/[0.06] text-[11px] text-[#8d99b3] space-y-1 bg-white/[0.01]">
                <div className="flex items-center gap-1.5 text-white/80 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#14e6ff]" />
                  <span>Enrolled Paper Archive</span>
                </div>
                <p className="text-[10px] leading-relaxed text-[#8d99b3]">
                  All QP &amp; MS links are synchronized strictly to your enrolled syllabus subjects.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Search & Filter Toolbar + Papers Listing */}
        <div className={`space-y-5 ${isTreeCollapsed ? 'lg:col-span-11' : 'lg:col-span-8 xl:col-span-9'}`}>
          
          {/* Active Breadcrumb & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
            
            {/* Breadcrumb line & Search row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                <span className="text-[#8d99b3]">Past Papers</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d99b3]/60" />
                <span className={`font-bold ${
                  selectedBoard === 'Edexcel' ? 'text-[#ffa600]' : selectedBoard === 'Cambridge' ? 'text-[#14e6ff]' : 'text-white'
                }`}>
                  {selectedBoard === 'all' ? 'All Enrolled Curricula' : selectedBoard}
                </span>
                {selectedCategory !== 'all' && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8d99b3]/60" />
                    <span className="px-2 py-0.5 rounded bg-white/[0.08] text-white font-bold">
                      {selectedCategory}
                    </span>
                  </>
                )}
                {activeSelectedCourse && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8d99b3]/60" />
                    <span className="px-2 py-0.5 rounded bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/30 font-bold truncate max-w-xs">
                      {activeSelectedCourse.code || activeSelectedCourse.name}
                    </span>
                  </>
                )}
                <span className="text-[11px] text-[#8d99b3] ml-1">
                  ({filteredPapers.length} results)
                </span>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8d99b3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search code, year, paper..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-[#8d99b3]/60 focus:outline-none focus:border-[#ffa600] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8d99b3] hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills (Subjects & Years) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs text-[#8d99b3] mr-1">
                <Filter className="w-3.5 h-3.5 text-[#ffa600]" />
                <span className="text-[11px] font-semibold uppercase">Subjects:</span>
              </div>

              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSubject === 'all'
                    ? 'bg-[#ffa600] text-[#00131a] font-bold'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white border border-white/05'
                }`}
              >
                All
              </button>

              {availableSubjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all truncate max-w-[180px] cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_10px_rgba(255,166,0,0.3)]'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-[#8d99b3] hover:text-white border border-white/05'
                  }`}
                >
                  {sub}
                </button>
              ))}

              {/* Year Selector */}
              {availableYears.length > 0 && (
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-[11px] text-[#8d99b3]">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-[#00131a] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffa600]"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Papers Listing by Session Group */}
          {Object.keys(sessionGroups).length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-[#8d99b3]">
                <FileText className="w-6 h-6 text-[#ffa600]" />
              </div>
              <h3 className="font-['Sora'] font-bold text-base text-white">No Enrolled Past Papers Match Your Filter</h3>
              <p className="text-xs text-[#8d99b3] max-w-md mx-auto">
                No past papers found for this course, category, or search keyword. You only receive papers for courses in which you are actively enrolled.
              </p>
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 rounded-xl bg-[#ffa600] text-[#00131a] text-xs font-bold font-['Sora'] hover:bg-[#ffb733] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Show All Enrolled Papers</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {(Object.entries(sessionGroups) as [string, PastPaper[]][]).map(([groupTitle, papers]) => {
                const firstPaper = papers[0];
                const isEdexcel = firstPaper ? firstPaper.board === 'Edexcel' : true;

                return (
                  <div key={groupTitle} className="space-y-3">
                    
                    {/* Session Header Banner */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          isEdexcel ? 'bg-[#ffa600]' : 'bg-[#14e6ff]'
                        }`} />
                        <h3 className="font-['Sora'] font-bold text-sm text-white">
                          {groupTitle}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-[#8d99b3]">
                        {papers.length} paper{papers.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Paper Cards List */}
                    <div className="glass-panel rounded-2xl divide-y divide-white/[0.06] overflow-hidden border border-white/10">
                      {papers.map(p => (
                        <div
                          key={p.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Paper metadata */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 ${
                              p.board === 'Edexcel'
                                ? 'bg-[#ffa600]/10 border-[#ffa600]/25 text-[#ffa600]'
                                : 'bg-[#14e6ff]/10 border-[#14e6ff]/25 text-[#14e6ff]'
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm text-white truncate">
                                  {p.paper}
                                </h4>
                                {p.subjectCode && (
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.06] text-white/80 border border-white/10">
                                    {p.subjectCode}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-[#8d99b3] flex-wrap">
                                <span className={`font-semibold ${
                                  p.board === 'Edexcel' ? 'text-[#ffa600]' : 'text-[#14e6ff]'
                                }`}>
                                  {p.board} · {p.category}
                                </span>
                                <span>•</span>
                                <span>{p.session}</span>
                                {p.year && <span>• {p.year}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: QP, MS, ER */}
                          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
                            {/* Question Paper */}
                            <a
                              href={p.qpUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => handleDownload(`${p.subjectCode || 'paper'}_QP.pdf`, p.qpUrl, e)}
                              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer group"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#8d99b3] group-hover:text-white transition-colors" />
                              <span>{downloadingFile === `${p.subjectCode || 'paper'}_QP.pdf` ? 'Opening...' : 'Question Paper'}</span>
                              <ExternalLink className="w-3 h-3 text-[#8d99b3] opacity-60" />
                            </a>

                            {/* Mark Scheme */}
                            <a
                              href={p.msUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => handleDownload(`${p.subjectCode || 'paper'}_MS.pdf`, p.msUrl, e)}
                              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-xs font-bold font-['Sora'] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                                p.board === 'Edexcel'
                                  ? 'bg-[#ffa600]/15 hover:bg-[#ffa600]/25 text-[#ffa600] border-[#ffa600]/40 shadow-[0_0_12px_rgba(255,166,0,0.15)]'
                                  : 'bg-[#14e6ff]/15 hover:bg-[#14e6ff]/25 text-[#5ff2ff] border-[#14e6ff]/40 shadow-[0_0_12px_rgba(20,230,255,0.15)]'
                              }`}
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>{downloadingFile === `${p.subjectCode || 'paper'}_MS.pdf` ? 'Opening...' : 'Mark Scheme'}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>

                            {/* Examiner Report (if available) */}
                            {p.erUrl && (
                              <a
                                href={p.erUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => handleDownload(`${p.subjectCode || 'paper'}_ER.pdf`, p.erUrl!, e)}
                                title="Examiner Report"
                                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8d99b3] hover:text-white border border-white/10 transition-colors cursor-pointer hidden md:flex items-center"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
