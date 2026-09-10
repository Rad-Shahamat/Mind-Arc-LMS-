import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  Video, 
  FileText, 
  GraduationCap, 
  User, 
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  Users,
  ShieldCheck,
  Globe,
  Mail,
  ExternalLink,
  X,
  PlayCircle,
  Award
} from 'lucide-react';
import { Course, TabId, Teacher } from '../types';

interface CoursesTabProps {
  courses: Course[];
  initialBoard?: 'all' | 'Edexcel' | 'Cambridge';
  initialCategory?: 'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level';
  onNavigate?: (tab: TabId, courseId?: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  initialBoard = 'all',
  initialCategory = 'all',
  onNavigate
}) => {
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'Edexcel' | 'Cambridge'>(initialBoard);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnrolledOnly, setFilterEnrolledOnly] = useState(true);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // Sync state if initial props change
  React.useEffect(() => {
    if (initialBoard) setSelectedBoard(initialBoard);
  }, [initialBoard]);

  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleBoardSelect = (board: 'all' | 'Edexcel' | 'Cambridge') => {
    setSelectedBoard(board);
    setSelectedCategory('all');
  };

  // Enrolled courses list
  const activeCourses = useMemo(() => {
    if (filterEnrolledOnly) {
      return courses.filter(c => c.enrolled);
    }
    return courses;
  }, [courses, filterEnrolledOnly]);

  // Counts for tabs & pills based on activeCourses
  const edexcelIgcseCount = activeCourses.filter(c => c.board === 'Edexcel' && c.category === 'IGCSE').length;
  const edexcelIalCount = activeCourses.filter(c => c.board === 'Edexcel' && c.category === 'IAL').length;
  const cambridgeOLevelCount = activeCourses.filter(c => c.board === 'Cambridge' && c.category === 'O-Levels').length;
  const cambridgeIgcseCount = activeCourses.filter(c => c.board === 'Cambridge' && c.category === 'IGCSE').length;
  const cambridgeALevelCount = activeCourses.filter(c => c.board === 'Cambridge' && (c.category === 'A-Levels' || c.category === 'A-Level')).length;
  const totalEdexcelCount = edexcelIgcseCount + edexcelIalCount;
  const totalCambridgeCount = cambridgeOLevelCount + cambridgeIgcseCount + cambridgeALevelCount;

  // Board elimination logic: Whichever board they are enrolled in, the other board is eliminated from their dashboard
  const hasEdexcel = totalEdexcelCount > 0;
  const hasCambridge = totalCambridgeCount > 0;
  const isOnlyEdexcel = hasEdexcel && !hasCambridge;
  const isOnlyCambridge = hasCambridge && !hasEdexcel;

  const showEdexcel = isOnlyEdexcel || (!isOnlyCambridge && (hasEdexcel || !hasCambridge));
  const showCambridge = isOnlyCambridge || (!isOnlyEdexcel && (hasCambridge || !hasEdexcel));

  const filteredCourses = useMemo(() => {
    return activeCourses.filter(c => {
      // Board elimination: eliminate other board completely
      if (isOnlyEdexcel && c.board !== 'Edexcel') return false;
      if (isOnlyCambridge && c.board !== 'Cambridge') return false;

      // Board filter
      if (selectedBoard !== 'all' && c.board !== selectedBoard) return false;
      
      // Category filter (handling A-Levels / A-Level aliases)
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'A-Levels' || selectedCategory === 'A-Level') {
          if (c.category !== 'A-Levels' && c.category !== 'A-Level') return false;
        } else if (c.category !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code?.toLowerCase().includes(q);
        const matchesTeacher = c.teacher.toLowerCase().includes(q);
        const matchesAssigned = c.assignedTeachers?.some(t => t.name.toLowerCase().includes(q) || t.qualification?.toLowerCase().includes(q));
        const matchesCategory = c.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesTeacher && !matchesAssigned && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [activeCourses, selectedBoard, selectedCategory, searchQuery, isOnlyEdexcel, isOnlyCambridge]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8d99b3] mb-1">
            <span className="font-mono flex items-center gap-1 text-[#14e6ff]">
              <Globe className="w-3.5 h-3.5" />
              <span>WORDPRESS LMS SYNCED</span>
            </span>
            <span>•</span>
            <span className="text-[#8d99b3] font-medium">{courses.length} Standardised Modules</span>
          </div>
          <h2 className="font-['Sora'] font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Academic Courses & Syllabi
          </h2>
          <p className="text-xs sm:text-sm text-[#8d99b3] mt-1">
            Centrally authored via WordPress Admin with dedicated lead instructors, co-teachers, and syllabus modules.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d99b3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, teachers, codes..."
            className="w-full bg-[#050e33]/70 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff] transition-all"
          />
        </div>
      </div>

      {/* Main Board Tabs (All, Edexcel, Cambridge) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            {/* If student is in both boards or all boards are active */}
            {!isOnlyEdexcel && !isOnlyCambridge && (
              <button
                onClick={() => handleBoardSelect('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedBoard === 'all'
                    ? 'bg-white text-[#01021c] font-bold shadow-sm'
                    : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                All Boards ({activeCourses.length})
              </button>
            )}

            {/* Pearson Edexcel Board Tab - Shown only if student has Edexcel */}
            {showEdexcel && (
              <button
                onClick={() => handleBoardSelect('Edexcel')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedBoard === 'Edexcel' || (isOnlyEdexcel && selectedBoard === 'all')
                    ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-[0_0_15px_rgba(20,230,255,0.25)]'
                    : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>Pearson Edexcel</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedBoard === 'Edexcel' || (isOnlyEdexcel && selectedBoard === 'all') ? 'bg-[#00131a]/20 text-[#00131a]' : 'bg-white/10 text-white'
                }`}>
                  {totalEdexcelCount}
                </span>
              </button>
            )}

            {/* Cambridge (CAIE) Board Tab - Shown only if student has Cambridge */}
            {showCambridge && (
              <button
                onClick={() => handleBoardSelect('Cambridge')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedBoard === 'Cambridge' || (isOnlyCambridge && selectedBoard === 'all')
                    ? 'bg-[#ffa600] text-[#00131a] font-bold shadow-[0_0_15px_rgba(255,166,0,0.25)]'
                    : 'bg-white/[0.03] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>Cambridge (CAIE)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedBoard === 'Cambridge' || (isOnlyCambridge && selectedBoard === 'all') ? 'bg-[#00131a]/20 text-[#00131a]' : 'bg-white/10 text-white'
                }`}>
                  {totalCambridgeCount}
                </span>
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-[#8d99b3] cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={filterEnrolledOnly}
              onChange={(e) => setFilterEnrolledOnly(e.target.checked)}
              className="rounded bg-white/10 border-white/20 text-[#14e6ff] focus:ring-0 cursor-pointer"
            />
            <span>Show Enrolled Only</span>
          </label>
        </div>

        {/* Sub-Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edexcel Sub-Categories: IGCSE and IAL (Shown only if Edexcel is visible) */}
          {showEdexcel && (selectedBoard === 'all' || selectedBoard === 'Edexcel') && (
            <>
              <button
                onClick={() => {
                  setSelectedBoard('Edexcel');
                  setSelectedCategory('IGCSE');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  (selectedBoard === 'Edexcel' || isOnlyEdexcel) && selectedCategory === 'IGCSE'
                    ? 'bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#14e6ff]" />
                <span>Edexcel IGCSE</span>
                <span className="text-[10px] text-[#8d99b3] font-mono">({edexcelIgcseCount})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBoard('Edexcel');
                  setSelectedCategory('IAL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  (selectedBoard === 'Edexcel' || isOnlyEdexcel) && selectedCategory === 'IAL'
                    ? 'bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#14e6ff]" />
                <span>Edexcel IAL</span>
                <span className="text-[10px] text-[#8d99b3] font-mono">({edexcelIalCount})</span>
              </button>
            </>
          )}

          {/* Cambridge Sub-Categories: O-Levels, IGCSE & A-Levels (Shown only if Cambridge is visible) */}
          {showCambridge && (selectedBoard === 'all' || selectedBoard === 'Cambridge') && (
            <>
              <button
                onClick={() => {
                  setSelectedBoard('Cambridge');
                  setSelectedCategory('O-Levels');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  (selectedBoard === 'Cambridge' || isOnlyCambridge) && selectedCategory === 'O-Levels'
                    ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                <span>Cambridge O-Levels</span>
                <span className="text-[10px] text-[#8d99b3] font-mono">({cambridgeOLevelCount})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBoard('Cambridge');
                  setSelectedCategory('IGCSE');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  (selectedBoard === 'Cambridge' || isOnlyCambridge) && selectedCategory === 'IGCSE'
                    ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                <span>Cambridge IGCSE</span>
                <span className="text-[10px] text-[#8d99b3] font-mono">({cambridgeIgcseCount})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBoard('Cambridge');
                  setSelectedCategory('A-Levels');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  (selectedBoard === 'Cambridge' || isOnlyCambridge) && (selectedCategory === 'A-Levels' || selectedCategory === 'A-Level')
                    ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#8d99b3] hover:text-white border border-white/[0.06]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                <span>Cambridge A-Levels</span>
                <span className="text-[10px] text-[#8d99b3] font-mono">({cambridgeALevelCount})</span>
              </button>
            </>
          )}

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] text-[#8d99b3] hover:text-white underline ml-2"
            >
              Reset sub-filter
            </button>
          )}
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredCourses.map((course) => {
            const isEdexcel = course.board === 'Edexcel';
            const boardColor = isEdexcel ? 'text-[#14e6ff] border-[#14e6ff]/30 bg-[#00131a]/80' : 'text-[#ffa600] border-[#ffa600]/30 bg-[#00131a]/80';
            const teachersList = course.assignedTeachers && course.assignedTeachers.length > 0
              ? course.assignedTeachers
              : [{ id: 'primary', name: course.teacher, role: 'Lead Instructor' as const }];

            return (
              <div
                key={course.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-white/[0.08] relative group transition-all duration-300"
              >
                {/* Course Image Header with Badges */}
                <div 
                  onClick={() => setSelectedCourseDetail(course)}
                  className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#030722] cursor-pointer"
                >
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#050e33] to-[#0d1e5c] flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-[#14e6ff]/30" />
                    </div>
                  )}

                  {/* Gradient Scrim Overlay for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050e33] via-[#050e33]/50 to-black/30 pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5 backdrop-blur-md">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border font-mono shadow-md ${boardColor}`}>
                        {course.board} • {course.category}
                      </span>
                      {course.code && (
                        <span className="text-[10px] font-mono text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-md">
                          {course.code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {course.wpPostId && (
                        <span className="text-[10px] font-mono text-[#8d99b3] bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-md hidden sm:inline-block">
                          WP #{course.wpPostId}
                        </span>
                      )}

                      {course.enrolled ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#25D366] bg-[#001f0e]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#25D366]/40 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Enrolled</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 shadow-md">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Banner Info: Assigned Faculty Stack */}
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs z-10">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {teachersList.map((t, idx) => (
                          t.avatarUrl ? (
                            <img 
                              key={t.id || idx} 
                              src={t.avatarUrl} 
                              alt={t.name}
                              title={`${t.name} (${t.role})`}
                              className="w-6 h-6 rounded-full object-cover border-2 border-[#050e33]"
                            />
                          ) : (
                            <div 
                              key={t.id || idx}
                              className="w-6 h-6 rounded-full bg-[#14e6ff] text-[#00131a] text-[10px] font-bold flex items-center justify-center border-2 border-[#050e33]"
                            >
                              {t.name[0]}
                            </div>
                          )
                        ))}
                      </div>

                      <div className="text-white/90 drop-shadow-md text-xs font-semibold truncate max-w-[170px] sm:max-w-[210px]">
                        <span>{course.teacher}</span>
                        {teachersList.length > 1 && (
                          <span className="text-[#14e6ff] text-[10px] ml-1 font-mono">
                            +{teachersList.length - 1} co-faculty
                          </span>
                        )}
                      </div>
                    </div>

                    {course.totalLectures && (
                      <span className="text-[11px] font-mono text-[#e7ecf6] bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        {course.completedLectures || 0}/{course.totalLectures} Lectures
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Card Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Course Title & Description */}
                    <div 
                      onClick={() => setSelectedCourseDetail(course)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-['Sora'] font-bold text-base sm:text-lg text-white group-hover:text-[#14e6ff] transition-colors line-clamp-1">
                        {course.name}
                      </h3>
                      <p className="text-xs text-[#8d99b3] mt-1.5 line-clamp-2 leading-relaxed">
                        {course.description || 'Comprehensive syllabus modules, past paper drilling, and live interactive lectures.'}
                      </p>
                    </div>

                    {/* Assigned Faculty Roster Preview */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono text-[#8d99b3]/80">Assigned Instructor:</span>
                      {teachersList.map((t, idx) => (
                        <span 
                          key={t.id || idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/90 border border-white/[0.08] flex items-center gap-1 font-mono"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.role === 'Lead Instructor' ? 'bg-[#14e6ff]' : t.role === 'Co-Teacher' ? 'bg-[#ffa600]' : 'bg-[#25D366]'}`} />
                          <span className="truncate max-w-[120px]">{t.name}</span>
                          <span className="text-[#8d99b3] text-[9px]">({t.role === 'Lead Instructor' ? 'Lead' : t.role === 'Co-Teacher' ? 'Co' : 'TA'})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Course Metadata & Syllabus Progress */}
                  <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                    {/* Syllabus Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8d99b3] font-medium">Syllabus Completion</span>
                        <span className="font-mono font-bold text-[#14e6ff]">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isEdexcel ? 'bg-[#14e6ff]' : 'bg-[#ffa600]'}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedCourseDetail(course)}
                        className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
                        title="View assigned teachers, bio & modules"
                      >
                        <Users className="w-3.5 h-3.5 text-[#14e6ff]" />
                        <span>Faculty</span>
                      </button>

                      {onNavigate && (
                        <>
                          <button
                            onClick={() => onNavigate('classes', course.id)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-[#14e6ff]/10 hover:border-[#14e6ff]/40 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all group"
                            title={`View scheduled classes for ${course.name}`}
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#14e6ff] group-hover:scale-110 transition-transform" />
                            <span>Classes</span>
                          </button>

                          <button
                            onClick={() => onNavigate('recordings', course.id)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-[#ff00c3]/10 hover:border-[#ff00c3]/40 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all group"
                            title={`Watch lecture recordings for ${course.name}`}
                          >
                            <Video className="w-3.5 h-3.5 text-[#ff00c3] group-hover:scale-110 transition-transform" />
                            <span>Lectures</span>
                          </button>

                          <button
                            onClick={() => onNavigate('papers')}
                            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-[#ffa600]/10 hover:border-[#ffa600]/40 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all group"
                            title={`Practice past papers for ${course.name}`}
                          >
                            <FileText className="w-3.5 h-3.5 text-[#ffa600] group-hover:scale-110 transition-transform" />
                            <span>Papers</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#8d99b3] mx-auto opacity-50" />
          <h3 className="font-['Sora'] font-bold text-white text-base">No courses found</h3>
          <p className="text-xs text-[#8d99b3] max-w-sm mx-auto">
            Try adjusting your board, category, or search filters to find the required syllabus module.
          </p>
          <button
            onClick={() => {
              setSelectedBoard('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterEnrolledOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-['Sora'] font-bold text-xs inline-block transition-all"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* COURSE & ASSIGNED FACULTY MODAL (WORDPRESS ADMIN WORKFLOW) */}
      {selectedCourseDetail && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedCourseDetail(null)}
        >
          <div 
            className="bg-[#050e33] border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#01021c]">
              {selectedCourseDetail.imageUrl ? (
                <img
                  src={selectedCourseDetail.imageUrl}
                  alt={selectedCourseDetail.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#0d1836] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#14e6ff]/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e33] via-[#050e33]/60 to-black/40" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/20 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badges */}
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#14e6ff] text-[#00131a] font-mono">
                      {selectedCourseDetail.board} • {selectedCourseDetail.category}
                    </span>
                    {selectedCourseDetail.code && (
                      <span className="text-xs font-mono text-white bg-black/60 px-2 py-0.5 rounded border border-white/15">
                        Code: {selectedCourseDetail.code}
                      </span>
                    )}
                    {selectedCourseDetail.wpPostId && (
                      <span className="text-xs font-mono text-[#8d99b3] bg-black/60 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#14e6ff]" />
                        <span>WP ID #{selectedCourseDetail.wpPostId}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Sora'] font-bold text-xl sm:text-2xl text-white">
                    {selectedCourseDetail.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Overview & WordPress Sync Status */}
              <div className="glass-card-nested p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Sora'] font-bold uppercase tracking-wider text-[#14e6ff] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>WordPress Admin Origin & Curriculum Sync</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#25D366] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    Live Synced
                  </span>
                </div>
                <p className="text-xs text-[#8d99b3] leading-relaxed">
                  {selectedCourseDetail.description || 'This course module has been provisioned through the Mind Arc WordPress LMS dashboard with assigned faculty rosters and structured lesson milestones.'}
                </p>
              </div>

              {/* Assigned Faculty Team */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-['Sora'] font-bold text-sm text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#14e6ff]" />
                    <span>Assigned Instructors & Faculty</span>
                  </h4>
                  <span className="text-xs font-mono text-[#8d99b3]">
                    {selectedCourseDetail.assignedTeachers?.length || 1} Assigned
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedCourseDetail.assignedTeachers && selectedCourseDetail.assignedTeachers.length > 0
                    ? selectedCourseDetail.assignedTeachers
                    : [{ id: 'primary', name: selectedCourseDetail.teacher, role: 'Lead Instructor' as const }]
                  ).map((teacher) => (
                    <div 
                      key={teacher.id}
                      className="glass-card-nested p-3.5 rounded-2xl flex items-start gap-3 border border-white/[0.08]"
                    >
                      {teacher.avatarUrl ? (
                        <img 
                          src={teacher.avatarUrl} 
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/10 text-[#14e6ff] flex items-center justify-center font-bold text-sm flex-shrink-0 border border-[#14e6ff]/20">
                          {teacher.name[0]}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-white truncate">
                            {teacher.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            teacher.role === 'Lead Instructor' 
                              ? 'bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30'
                              : teacher.role === 'Co-Teacher'
                              ? 'bg-[#ffa600]/15 text-[#ffa600] border border-[#ffa600]/30'
                              : 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'
                          }`}>
                            {teacher.role}
                          </span>
                        </div>

                        {teacher.qualification && (
                          <p className="text-[10px] text-[#8d99b3] mt-1 line-clamp-1">
                            {teacher.qualification}
                          </p>
                        )}

                        {teacher.email && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-[#8d99b3] mt-1 truncate">
                            <Mail className="w-3 h-3 text-[#14e6ff]" />
                            <span className="truncate">{teacher.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Modules & Units Breakdown */}
              {selectedCourseDetail.modules && selectedCourseDetail.modules.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-['Sora'] font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#ffa600]" />
                    <span>Curriculum Syllabus Breakdown</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedCourseDetail.modules.map((m, idx) => (
                      <div 
                        key={m.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white/[0.05] font-mono text-[11px] text-[#14e6ff] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-medium text-white">{m.title}</div>
                            <div className="text-[10px] text-[#8d99b3] font-mono">{m.lessonsCount} lessons • ~{m.durationHours}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          m.status === 'completed' 
                            ? 'bg-[#25D366]/15 text-[#25D366]' 
                            : m.status === 'in-progress'
                            ? 'bg-[#14e6ff]/15 text-[#14e6ff]'
                            : 'bg-white/5 text-[#8d99b3]'
                        }`}>
                          {m.status === 'completed' ? 'Completed' : m.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#8d99b3] font-mono">
                Syllabus Progress: <span className="text-[#14e6ff] font-bold">{selectedCourseDetail.progress}%</span>
              </div>

              <div className="flex items-center gap-2">
                {onNavigate && (
                  <>
                    <button
                      onClick={() => {
                        const courseId = selectedCourseDetail.id;
                        setSelectedCourseDetail(null);
                        onNavigate('classes', courseId);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#14e6ff]/20 hover:text-[#14e6ff] border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Scheduled Classes</span>
                    </button>

                    <button
                      onClick={() => {
                        const courseId = selectedCourseDetail.id;
                        setSelectedCourseDetail(null);
                        onNavigate('recordings', courseId);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#14e6ff] text-[#00131a] font-['Sora'] font-bold text-xs transition-all shadow-[0_0_12px_rgba(20,230,255,0.3)] flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch Lectures</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
