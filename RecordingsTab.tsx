import React, { useState, useMemo, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Calendar, 
  Play,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  RefreshCw,
  Maximize2,
  X,
  FileText,
  Clock,
  Download,
  ExternalLink,
  ShieldCheck,
  Send,
  Radio,
  Lock,
  Smartphone,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { Course, Recording, BoardType, PastPaperCategory, TabId } from '../types';
import { formatDate } from '../utils/formatters';

interface RecordingsTabProps {
  courses: Course[];
  recordings: Recording[];
  initialCourseId?: string | null;
  onNavigate?: (tab: TabId, courseId?: string) => void;
}

export const RecordingsTab: React.FC<RecordingsTabProps> = ({ 
  courses, 
  recordings, 
  initialCourseId, 
  onNavigate 
}) => {
  // Only Enrolled Courses
  const enrolledCourses = useMemo(() => {
    const enrolled = courses.filter(c => c.enrolled);
    return enrolled.length > 0 ? enrolled : courses;
  }, [courses]);

  // Navigation & Tree state
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
    'O-Levels': true,
    'O-levels': true,
    'A-levels': true
  });
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalRecording, setActiveModalRecording] = useState<Recording | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Synchronize when initialCourseId is passed
  useEffect(() => {
    if (initialCourseId) {
      const matchCourse = courses.find(c => c.id === initialCourseId);
      if (matchCourse) {
        setSelectedCourseId(matchCourse.id);
        if (matchCourse.board) setSelectedBoard(matchCourse.board as any);
        if (matchCourse.category) setSelectedCategory(matchCourse.category);
        if (matchCourse.board) {
          setExpandedBoards(prev => ({ ...prev, [matchCourse.board!]: true }));
        }
      }
    }
  }, [initialCourseId, courses]);

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

  // Helper to resolve recordings count for a course
  const getCourseRecordingsCount = (courseId: string, courseName: string) => {
    return recordings.filter(r => 
      r.courseId === courseId || 
      r.courseName.toLowerCase().includes(courseName.toLowerCase()) ||
      courseName.toLowerCase().includes((r.courseName || '').toLowerCase())
    ).length;
  };

  // Group enrolled courses by Board -> Category for Tree
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

        const totalRecsInCat = filteredList.reduce((acc, c) => {
          return acc + getCourseRecordingsCount(c.id, c.name);
        }, 0);

        return {
          categoryName: catName,
          courses: filteredList,
          totalRecs: totalRecsInCat
        };
      }).filter(group => group.courses.length > 0);

      const totalRecsInBoard = categories.reduce((acc, cat) => acc + cat.totalRecs, 0);

      return {
        board,
        hasCourses: boardCourses.length > 0,
        categories,
        totalRecs: totalRecsInBoard,
        coursesCount: boardCourses.length
      };
    }).filter(b => b.hasCourses);
  }, [enrolledCourses, recordings, treeSearchQuery]);

  // Total enrolled lectures count
  const totalEnrolledRecordings = useMemo(() => {
    return enrolledCourses.reduce((acc, c) => acc + getCourseRecordingsCount(c.id, c.name), 0);
  }, [enrolledCourses, recordings]);

  // Active Selected Course Object
  const activeSelectedCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return enrolledCourses.find(c => c.id === selectedCourseId) || courses.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId, enrolledCourses, courses]);

  // Helper to match a recording to enrolled course
  const matchRecordingToEnrolledCourse = (rec: Recording) => {
    return enrolledCourses.find(c => 
      c.id === rec.courseId || 
      rec.courseName.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(rec.courseName.toLowerCase()) ||
      (c.code && rec.subjectCode && c.code.toLowerCase() === rec.subjectCode.toLowerCase())
    );
  };

  // Filtered recordings based on active tree selection and search/attendance
  const filteredRecordings = useMemo(() => {
    return recordings.filter(rec => {
      // Must match enrolled courses
      const matchedEnrolled = matchRecordingToEnrolledCourse(rec);
      if (!matchedEnrolled) return false;

      // Course-specific filter
      if (selectedCourseId !== 'all') {
        if (matchedEnrolled.id !== selectedCourseId && rec.courseId !== selectedCourseId) {
          return false;
        }
      } else {
        // Board filter
        if (selectedBoard !== 'all' && matchedEnrolled.board !== selectedBoard && rec.board !== selectedBoard) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'all') {
          const recCat = (rec.category || matchedEnrolled.category || '').toLowerCase();
          const selCat = selectedCategory.toLowerCase();
          const matchCat = recCat === selCat || 
            (selCat.includes('ial') && recCat.includes('ial')) ||
            (selCat.includes('igcse') && recCat.includes('igcse')) ||
            (selCat.includes('o-level') && recCat.includes('o-level')) ||
            (selCat.includes('a-level') && recCat.includes('a-level'));
          if (!matchCat) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch = 
          rec.topic.toLowerCase().includes(q) ||
          rec.courseName.toLowerCase().includes(q) ||
          rec.teacher.toLowerCase().includes(q) ||
          (rec.chapter && rec.chapter.toLowerCase().includes(q)) ||
          (rec.telegramChannelName && rec.telegramChannelName.toLowerCase().includes(q)) ||
          (rec.subjectCode && rec.subjectCode.toLowerCase().includes(q));
        if (!matchSearch) return false;
      }

      return true;
    });
  }, [recordings, enrolledCourses, selectedCourseId, selectedBoard, selectedCategory, searchQuery]);

  const sortedRecordings = useMemo(() => {
    return [...filteredRecordings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredRecordings]);

  return (
    <div className="space-y-6">
      {/* Main Grid: Left Tree Navigation + Right Recordings Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Enrolled Courses Tree Navigation */}
        <div className={`transition-all duration-300 ${isTreeCollapsed ? 'lg:col-span-1' : 'lg:col-span-4 xl:col-span-3'}`}>
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden sticky top-20 shadow-xl bg-[#050e33]/70 backdrop-blur-xl">
            
            {/* Tree Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2AABEE]/20 to-[#0066ff]/20 border border-[#2AABEE]/30 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-[#2AABEE]" />
                </div>
                {!isTreeCollapsed && (
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                      <span>Enrolled Courses</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#2AABEE]/10 text-[#2AABEE] border border-[#2AABEE]/20">
                        {enrolledCourses.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#8d99b3]">Lecture recording tree</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                title={isTreeCollapsed ? "Expand tree" : "Collapse tree"}
                className="p-1.5 rounded-lg text-[#8d99b3] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                {isTreeCollapsed ? (
                  <ChevronsRight className="w-4 h-4 text-[#2AABEE]" />
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
                    className="w-full bg-[#01021c]/80 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#8d99b3]/70 focus:outline-none focus:border-[#2AABEE]"
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
                  {/* Root Node: All Enrolled Lectures */}
                  <button
                    onClick={handleSelectAllEnrolled}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-[#2AABEE]/20 to-[#2AABEE]/5 text-white border-[#2AABEE]/50 shadow-[0_0_12px_rgba(42,171,238,0.15)] font-semibold'
                        : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers className={`w-4 h-4 shrink-0 ${
                        selectedCourseId === 'all' && selectedBoard === 'all' && selectedCategory === 'all'
                          ? 'text-[#2AABEE]'
                          : 'text-[#8d99b3]'
                      }`} />
                      <span className="text-xs truncate font-medium">All Enrolled Lectures</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-white shrink-0 font-medium">
                      {totalEnrolledRecordings}
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
                              ? 'bg-[#2AABEE]/15 text-white border-[#2AABEE]/40 font-semibold'
                              : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.03] border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button
                              onClick={(e) => toggleBoardExpand(boardNode.board, e)}
                              className="p-1 -ml-1 text-[#8d99b3] hover:text-white rounded transition-colors"
                            >
                              {isBoardExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#2AABEE]" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {isBoardExpanded ? (
                              <FolderOpen className="w-3.5 h-3.5 text-[#2AABEE] shrink-0" />
                            ) : (
                              <Folder className="w-3.5 h-3.5 text-[#8d99b3] shrink-0" />
                            )}
                            <span className="truncate font-semibold tracking-wide">
                              {boardNode.board === 'Edexcel' ? 'Edexcel (Pearson)' : 'Cambridge (CAIE)'}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8d99b3] group-hover:text-white">
                            {boardNode.totalRecs}
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
                                        ? 'bg-[#2AABEE]/10 text-white border-[#2AABEE]/30 font-medium'
                                        : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02] border-transparent'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <button
                                        onClick={(e) => toggleCategoryExpand(catKey, e)}
                                        className="p-0.5 text-[#8d99b3] hover:text-white rounded"
                                      >
                                        {isCatExpanded ? (
                                          <ChevronDown className="w-3 h-3 text-[#2AABEE]" />
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
                                      {catNode.totalRecs}
                                    </span>
                                  </div>

                                  {/* Course Leaf Nodes - Display Only Course Name */}
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
                                                ? 'bg-[#2AABEE]/20 text-white border-[#2AABEE]/60 shadow-[0_0_12px_rgba(42,171,238,0.2)] font-semibold'
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
              /* Collapsed quick icons */
              <div className="p-2 space-y-2 flex flex-col items-center">
                <button
                  onClick={handleSelectAllEnrolled}
                  title="All Enrolled Lectures"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedCourseId === 'all'
                      ? 'bg-[#2AABEE] text-white shadow-[0_0_12px_rgba(42,171,238,0.4)]'
                      : 'bg-white/[0.04] text-[#8d99b3] hover:text-white'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </button>

                {enrolledCourses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    title={course.name}
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      selectedCourseId === course.id
                        ? 'bg-[#2AABEE] text-white shadow-[0_0_12px_rgba(42,171,238,0.4)]'
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

        {/* Right Side: Recordings Explorer */}
        <div className={`space-y-4 ${isTreeCollapsed ? 'lg:col-span-11' : 'lg:col-span-8 xl:col-span-9'}`}>
          
          {/* Controls Bar: Breadcrumb Banner & Filters */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            {/* Active Tree Focus Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2AABEE]/10 border border-[#2AABEE]/20 flex items-center justify-center text-[#2AABEE] shrink-0">
                  {activeSelectedCourse ? <BookOpen className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#8d99b3] uppercase tracking-wider">
                      Active Tree Focus:
                    </span>
                    {activeSelectedCourse ? (
                      <span className="px-2 py-0.5 rounded bg-[#2AABEE]/15 text-[#2AABEE] text-xs font-mono font-bold">
                        {activeSelectedCourse.code || activeSelectedCourse.board}
                      </span>
                    ) : selectedBoard !== 'all' ? (
                      <span className="px-2 py-0.5 rounded bg-[#2AABEE]/15 text-[#2AABEE] text-xs font-mono font-bold">
                        {selectedBoard} {selectedCategory !== 'all' ? `• ${selectedCategory}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-mono font-bold">
                        All Enrolled Courses
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base mt-0.5 truncate">
                    {activeSelectedCourse 
                      ? `${activeSelectedCourse.name} — ${activeSelectedCourse.teacher}`
                      : selectedBoard !== 'all'
                        ? `${selectedBoard} ${selectedCategory !== 'all' ? selectedCategory : ''} Enrolled Vault`
                        : `Complete Enrolled Lecture Vault (${enrolledCourses.length} Subjects)`}
                  </h4>
                </div>
              </div>

              {(selectedCourseId !== 'all' || selectedBoard !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={handleSelectAllEnrolled}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs text-[#2AABEE] hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer border border-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Show All Enrolled</span>
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#8d99b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topic, chapter, or @channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-[#8d99b3]/60 focus:outline-none focus:border-[#2AABEE]/50 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8d99b3] hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Active Breadcrumb & Filters summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs text-[#8d99b3]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white/60">Showing:</span>
                <strong className="text-white font-mono">{sortedRecordings.length}</strong>
                <span>Telegram lecture posts</span>
              </div>
            </div>
          </div>

          {/* Grid of Recordings */}
          {sortedRecordings.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl space-y-4 border border-white/10">
              <Send className="w-12 h-12 text-[#8d99b3]/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-['Sora'] font-bold text-base text-white">No Telegram Recordings Found</h3>
                <p className="text-xs text-[#8d99b3] max-w-md mx-auto">
                  No lecture posts match the active enrolled filter or search criteria.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSelectAllEnrolled}
                  className="px-4 py-2 rounded-xl bg-[#2AABEE] text-white font-bold text-xs shadow-[0_0_12px_rgba(42,171,238,0.3)] transition-all cursor-pointer"
                >
                  View All Enrolled Lectures
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedRecordings.map(rec => {
                const matchedCourse = matchRecordingToEnrolledCourse(rec);
                const board = rec.board || matchedCourse?.board || 'Edexcel';
                const category = rec.category || matchedCourse?.category || 'IAL';

                return (
                  <div
                    key={rec.id}
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 group transition-all"
                  >
                    {/* Top Section: Telegram Custom Media Card */}
                    <div>
                      <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#061427] via-[#09223e] to-[#040e1c] border-b border-white/10 relative p-4 flex flex-col justify-between overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-[#2AABEE]/15 rounded-full blur-2xl pointer-events-none" />
                        
                        {/* Telegram Header Strip */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-[#2AABEE]/25 border border-[#2AABEE]/40 flex items-center justify-center text-[#2AABEE]">
                              <Send className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-[#2AABEE]">
                              {rec.telegramChannelName || '@mindarc_vault'}
                            </span>
                          </div>

                          {rec.duration && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/50 text-white/90 border border-white/10 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#2AABEE]" />
                              {rec.duration}
                            </span>
                          )}
                        </div>

                        {/* Central Play Badge */}
                        <div className="flex flex-col items-center justify-center py-2 relative z-10">
                          <a
                            href={rec.telegramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-13 h-13 rounded-2xl bg-[#2AABEE] hover:bg-[#229ED9] text-white flex items-center justify-center shadow-[0_0_25px_rgba(42,171,238,0.5)] group-hover/card:scale-105 transition-all cursor-pointer"
                            title="Open direct video in Telegram"
                          >
                            <Send className="w-6 h-6 ml-0.5" />
                          </a>
                          <span className="text-[10px] font-mono text-white/70 mt-1.5 font-semibold">
                            Stream HD on Telegram
                          </span>
                        </div>

                        {/* Quick Action Overlay Buttons */}
                        <div className="flex items-center justify-between relative z-10 text-[10px] text-white/60">
                          <span className="font-mono">{formatDate(rec.date)}</span>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleCopyLink(rec.telegramUrl, e)}
                              className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors"
                              title="Copy Telegram Link"
                            >
                              {copiedLink === rec.telegramUrl ? (
                                <Check className="w-3 h-3 text-[#25D366]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>

                            <button
                              onClick={() => setActiveModalRecording(rec)}
                              className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors"
                              title="Lecture Details"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        {/* Category Badge */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            board === 'Edexcel' 
                              ? 'bg-[#ffa600]/15 text-[#ffa600] border border-[#ffa600]/30' 
                              : 'bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30'
                          }`}>
                            {board} • {category}
                          </span>
                        </div>

                        {/* Topic & Chapter */}
                        <div>
                          <div className="text-[11px] font-semibold text-[#8d99b3] truncate mb-0.5">
                            {rec.courseName.split('—')[0].trim()}
                          </div>
                          <h4 className="font-['Sora'] font-bold text-sm text-white leading-snug group-hover:text-[#2AABEE] transition-colors line-clamp-2">
                            {rec.topic}
                          </h4>
                          {rec.chapter && (
                            <div className="text-[11px] text-[#ffa600] mt-1 font-mono flex items-center gap-1">
                              <span>📑</span>
                              <span className="truncate">{rec.chapter}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#8d99b3]">
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="w-3.5 h-3.5 text-[#2AABEE] flex-shrink-0" />
                          <span className="truncate font-medium">{rec.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#8d99b3]" />
                            <span>{formatDate(rec.date)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={rec.telegramUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white text-xs font-bold font-['Sora'] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(42,171,238,0.3)] cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Watch on Telegram</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                        </a>

                        <button
                          onClick={() => setActiveModalRecording(rec)}
                          className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8d99b3] hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="View post details and quick links"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal View */}
      {activeModalRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl bg-[#081528] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/20 border border-[#2AABEE]/40 flex items-center justify-center flex-shrink-0 text-[#2AABEE] shadow-[0_0_12px_rgba(42,171,238,0.3)]">
                  <Send className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.08] text-[#2AABEE]">
                      {activeModalRecording.board || 'MindArc'} • {activeModalRecording.category || 'Class'}
                    </span>
                    <span className="text-xs text-[#8d99b3] truncate">
                      {activeModalRecording.courseName}
                    </span>
                  </div>
                  <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-white truncate mt-0.5">
                    {activeModalRecording.topic}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalRecording(null)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.15] text-[#8d99b3] hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Video Launch Screen */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#061224] to-[#040c1a] border-b border-white/10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#2AABEE] flex items-center justify-center text-white shadow-[0_0_30px_rgba(42,171,238,0.5)]">
                <Send className="w-8 h-8 ml-0.5" />
              </div>

              <div className="space-y-1 max-w-md">
                <div className="text-xs font-mono font-bold text-[#2AABEE] uppercase tracking-wider">
                  Official Telegram Video Stream
                </div>
                <h4 className="font-['Sora'] font-bold text-lg text-white">
                  {activeModalRecording.topic}
                </h4>
                <p className="text-xs text-[#8d99b3]">
                  Delivered on channel <strong className="text-white font-mono">{activeModalRecording.telegramChannelName || '@mindarc_vault'}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <a
                  href={activeModalRecording.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white text-sm font-bold font-['Sora'] flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(42,171,238,0.4)]"
                >
                  <Send className="w-4 h-4" />
                  <span>Launch in Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  onClick={() => handleCopyLink(activeModalRecording.telegramUrl)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                >
                  {copiedLink === activeModalRecording.telegramUrl ? (
                    <>
                      <Check className="w-4 h-4 text-[#25D366]" />
                      <span className="text-[#25D366]">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#8d99b3]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer Info & Actions */}
            <div className="p-5 overflow-y-auto space-y-4 bg-[#060e1d]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2AABEE]/20 border border-[#2AABEE]/40 flex items-center justify-center font-['Sora'] font-bold text-[#2AABEE] text-sm">
                    {activeModalRecording.teacher.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{activeModalRecording.teacher}</div>
                    <div className="text-xs text-[#8d99b3]">Course Instructor • MindArc Faculty</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#8d99b3]">
                  {formatDate(activeModalRecording.date)}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {activeModalRecording.chapter && (
                  <div className="text-[#ffa600] font-mono">
                    Topic Chapter: <strong>{activeModalRecording.chapter}</strong>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <>
                      <button
                        onClick={() => {
                          const courseId = activeModalRecording.courseId;
                          setActiveModalRecording(null);
                          onNavigate('classes', courseId);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#14e6ff]" />
                        <span>View Live Classes</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveModalRecording(null);
                          onNavigate('papers');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)] cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Past Paper Bank</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

