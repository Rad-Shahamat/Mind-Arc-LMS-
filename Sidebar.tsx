import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Video, 
  FileCheck, 
  CheckSquare, 
  FileText, 
  Bell, 
  CreditCard, 
  User, 
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  Folder,
  Layers,
  X
} from 'lucide-react';
import { Course, Student, TabId } from '../types';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onSelectCourseCategory?: (board: 'all' | 'Edexcel' | 'Cambridge', category: 'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level') => void;
  activeBoard?: 'all' | 'Edexcel' | 'Cambridge';
  activeCategory?: 'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level';
  student: Student;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadAnnouncementsCount: number;
  openExamsCount: number;
  pendingTasksCount: number;
  totalCoursesCount?: number;
  courses?: Course[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onSelectCourseCategory,
  activeBoard = 'all',
  activeCategory = 'all',
  student,
  isOpenMobile,
  onCloseMobile,
  unreadAnnouncementsCount,
  openExamsCount,
  pendingTasksCount,
  totalCoursesCount = 2,
  courses = []
}) => {
  // State for Courses accordion and category expansion
  const [isCoursesOpen, setIsCoursesOpen] = useState(true);
  const [isEdexcelOpen, setIsEdexcelOpen] = useState(true);
  const [isCambridgeOpen, setIsCambridgeOpen] = useState(true);

  // Calculate enrolled counts by category
  const enrolledCourses = courses.length > 0 ? courses : [];
  const edexcelTotal = enrolledCourses.filter(c => c.board === 'Edexcel').length;
  const edexcelIgcseCount = enrolledCourses.filter(c => c.board === 'Edexcel' && c.category === 'IGCSE').length;
  const edexcelIalCount = enrolledCourses.filter(c => c.board === 'Edexcel' && c.category === 'IAL').length;

  const cambridgeTotal = enrolledCourses.filter(c => c.board === 'Cambridge').length;
  const cambridgeOLevelCount = enrolledCourses.filter(c => c.board === 'Cambridge' && c.category === 'O-Levels').length;
  const cambridgeIgcseCount = enrolledCourses.filter(c => c.board === 'Cambridge' && c.category === 'IGCSE').length;
  const cambridgeALevelCount = enrolledCourses.filter(c => c.board === 'Cambridge' && (c.category === 'A-Levels' || c.category === 'A-Level')).length;

  // Board elimination logic: Whichever board they are enrolled in, the other board is eliminated from their dashboard
  const hasEdexcel = edexcelTotal > 0;
  const hasCambridge = cambridgeTotal > 0;
  const isOnlyEdexcel = hasEdexcel && !hasCambridge;
  const isOnlyCambridge = hasCambridge && !hasEdexcel;

  const showEdexcel = isOnlyEdexcel || (!isOnlyCambridge && (hasEdexcel || student.curriculum?.toLowerCase().includes('edexcel') || !student.curriculum));
  const showCambridge = isOnlyCambridge || (!isOnlyEdexcel && (hasCambridge || student.curriculum?.toLowerCase().includes('cambridge')));

  const handleCategoryClick = (
    board: 'all' | 'Edexcel' | 'Cambridge',
    category: 'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level'
  ) => {
    if (onSelectCourseCategory) {
      onSelectCourseCategory(board, category);
    }
    onSelectTab('courses');
    onCloseMobile();
  };

  const navItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'recordings', label: 'Recordings', icon: Video },
    { id: 'assessments', label: 'Assessments', icon: FileCheck, badge: openExamsCount, badgeColor: 'bg-[#14e6ff]/15 text-[#14e6ff] border-[#14e6ff]/30' },
    { id: 'planner', label: 'Study Planner', icon: CheckSquare, badge: pendingTasksCount, badgeColor: 'bg-[#22e07a]/15 text-[#22e07a] border-[#22e07a]/30' },
    { id: 'papers', label: 'Past Papers', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: unreadAnnouncementsCount, badgeColor: 'bg-[#ffa600]/15 text-[#ffa600] border-[#ffa600]/30' },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: LifeBuoy }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-[#01021c]/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-[260px] z-50 flex flex-col flex-shrink-0
          bg-[#01021c] lg:bg-[#030722]/90 backdrop-blur-xl border-r border-white/[0.08]
          transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14e6ff] text-[#00131a] flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="w-5 h-5 text-[#00131a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Sora'] font-bold text-base tracking-tight text-white">
                Mind Arc
              </span>
              <span className="text-[10px] text-[#8d99b3] tracking-wider uppercase font-medium">
                Student Portal
              </span>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#8d99b3] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {/* Dashboard Item */}
          <button
            onClick={() => {
              onSelectTab('dashboard');
              onCloseMobile();
            }}
            className={`
              w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 relative
              ${currentTab === 'dashboard' 
                ? 'bg-white text-[#01021c] font-bold shadow-sm' 
                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04]'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 transition-colors ${
                currentTab === 'dashboard' ? 'text-[#01021c]' : 'text-[#8d99b3] group-hover:text-white'
              }`} />
              <span>Dashboard</span>
            </div>
          </button>

          {/* DEDICATED COURSES SECTION WITH CATEGORIES */}
          <div className="pt-2">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8d99b3]/60">
                Courses
              </span>
              <span className="text-[10px] font-mono text-[#14e6ff] bg-[#14e6ff]/10 px-1.5 py-0.5 rounded border border-[#14e6ff]/20">
                {totalCoursesCount}
              </span>
            </div>

            {/* Courses Master Item */}
            <div className="space-y-1">
              <div
                className={`
                  w-full group flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 cursor-pointer
                  ${currentTab === 'courses' && activeBoard === 'all' && activeCategory === 'all'
                    ? 'bg-[#14e6ff] text-[#00131a] font-bold shadow-sm'
                    : currentTab === 'courses'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#e7ecf6] hover:bg-white/[0.04]'
                  }
                `}
              >
                <div 
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                  onClick={() => handleCategoryClick('all', 'all')}
                >
                  <Layers className={`w-4 h-4 ${
                    currentTab === 'courses' && activeBoard === 'all' && activeCategory === 'all'
                      ? 'text-[#00131a]'
                      : 'text-[#14e6ff]'
                  }`} />
                  <span className="truncate">All Courses</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoursesOpen(!isCoursesOpen);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-[#8d99b3] hover:text-white transition-colors"
                >
                  {isCoursesOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Nested Categories Tree */}
              {isCoursesOpen && (
                <div className="pl-3 pr-1 space-y-1.5 pt-1 border-l-2 border-white/[0.08] ml-3.5">
                  {/* Category 1: Edexcel (Shown only if student is in Edexcel) */}
                  {showEdexcel && (
                    <div className="space-y-1">
                      <div 
                        onClick={() => {
                          setIsEdexcelOpen(!isEdexcelOpen);
                          handleCategoryClick('Edexcel', 'all');
                        }}
                        className={`
                          w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all
                          ${currentTab === 'courses' && activeBoard === 'Edexcel' && activeCategory === 'all'
                            ? 'bg-[#14e6ff]/20 text-[#14e6ff] border border-[#14e6ff]/30'
                            : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.03]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#14e6ff]" />
                          <span>Edexcel</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#8d99b3]">
                            {edexcelTotal}
                          </span>
                          <span className="text-[#8d99b3]">
                            {isEdexcelOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                        </div>
                      </div>

                      {/* Sub-categories under Edexcel: IGCSE and IAL */}
                      {isEdexcelOpen && (
                        <div className="pl-4 space-y-0.5 border-l border-white/[0.06] ml-2.5">
                          <button
                            onClick={() => handleCategoryClick('Edexcel', 'IGCSE')}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left
                              ${currentTab === 'courses' && activeBoard === 'Edexcel' && activeCategory === 'IGCSE'
                                ? 'text-[#14e6ff] bg-[#14e6ff]/10 font-bold border-l-2 border-[#14e6ff]'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02]'
                              }
                            `}
                          >
                            <span>IGCSE Courses</span>
                            <span className="text-[9px] font-mono text-[#8d99b3]">{edexcelIgcseCount} {edexcelIgcseCount === 1 ? 'course' : 'courses'}</span>
                          </button>

                          <button
                            onClick={() => handleCategoryClick('Edexcel', 'IAL')}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left
                              ${currentTab === 'courses' && activeBoard === 'Edexcel' && activeCategory === 'IAL'
                                ? 'text-[#14e6ff] bg-[#14e6ff]/10 font-bold border-l-2 border-[#14e6ff]'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02]'
                              }
                            `}
                          >
                            <span>IAL Courses</span>
                            <span className="text-[9px] font-mono text-[#8d99b3]">{edexcelIalCount} {edexcelIalCount === 1 ? 'course' : 'courses'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category 2: Cambridge (Shown only if student is in Cambridge) */}
                  {showCambridge && (
                    <div className="space-y-1 pt-1">
                      <div 
                        onClick={() => {
                          setIsCambridgeOpen(!isCambridgeOpen);
                          handleCategoryClick('Cambridge', 'all');
                        }}
                        className={`
                          w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all
                          ${currentTab === 'courses' && activeBoard === 'Cambridge' && activeCategory === 'all'
                            ? 'bg-[#ffa600]/20 text-[#ffa600] border border-[#ffa600]/30'
                            : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.03]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ffa600]" />
                          <span>Cambridge</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#8d99b3]">
                            {cambridgeTotal}
                          </span>
                          <span className="text-[#8d99b3]">
                            {isCambridgeOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                        </div>
                      </div>

                      {/* Sub-categories under Cambridge: O-levels, IGCSE & A-levels */}
                      {isCambridgeOpen && (
                        <div className="pl-4 space-y-0.5 border-l border-white/[0.06] ml-2.5">
                          <button
                            onClick={() => handleCategoryClick('Cambridge', 'O-Levels')}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left
                              ${currentTab === 'courses' && activeBoard === 'Cambridge' && activeCategory === 'O-Levels'
                                ? 'text-[#ffa600] bg-[#ffa600]/10 font-bold border-l-2 border-[#ffa600]'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02]'
                              }
                            `}
                          >
                            <span>O-Levels</span>
                            <span className="text-[9px] font-mono text-[#8d99b3]">{cambridgeOLevelCount} {cambridgeOLevelCount === 1 ? 'course' : 'courses'}</span>
                          </button>

                          <button
                            onClick={() => handleCategoryClick('Cambridge', 'IGCSE')}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left
                              ${currentTab === 'courses' && activeBoard === 'Cambridge' && activeCategory === 'IGCSE'
                                ? 'text-[#ffa600] bg-[#ffa600]/10 font-bold border-l-2 border-[#ffa600]'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02]'
                              }
                            `}
                          >
                            <span>IGCSE</span>
                            <span className="text-[9px] font-mono text-[#8d99b3]">{cambridgeIgcseCount} {cambridgeIgcseCount === 1 ? 'course' : 'courses'}</span>
                          </button>

                          <button
                            onClick={() => handleCategoryClick('Cambridge', 'A-Levels')}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left
                              ${currentTab === 'courses' && activeBoard === 'Cambridge' && (activeCategory === 'A-Levels' || activeCategory === 'A-Level')
                                ? 'text-[#ffa600] bg-[#ffa600]/10 font-bold border-l-2 border-[#ffa600]'
                                : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.02]'
                              }
                            `}
                          >
                            <span>A-Levels</span>
                            <span className="text-[9px] font-mono text-[#8d99b3]">{cambridgeALevelCount} {cambridgeALevelCount === 1 ? 'course' : 'courses'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Regular Navigation Items */}
          <div className="pt-2 space-y-1">
            <div className="px-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-[#8d99b3]/60">
              Academic Tools
            </div>

            {navItems.filter(i => i.id !== 'dashboard').map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 relative
                    ${isActive 
                      ? 'bg-white text-[#01021c] font-bold shadow-sm' 
                      : 'text-[#8d99b3] hover:text-white hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#01021c]' : 'text-[#8d99b3] group-hover:text-white'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer / Student Card */}
        <div className="p-3 border-t border-white/[0.08] bg-white/[0.01]">
          <button
            onClick={() => {
              onSelectTab('profile');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition-all text-left"
          >
            <div className="relative">
              {student.avatarUrl ? (
                <img 
                  src={student.avatarUrl} 
                  alt={student.name} 
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/[0.08] text-[#14e6ff] font-['Sora'] font-bold text-xs flex items-center justify-center">
                  {student.initials}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#25D366] border border-[#01021c]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-['Sora'] font-semibold text-xs text-white truncate">
                {student.name}
              </div>
              <div className="text-[10px] text-[#8d99b3] truncate font-mono">
                {student.id}
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
