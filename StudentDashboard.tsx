import React, { useState } from 'react';
import { 
  Student, 
  Course, 
  UpcomingClass, 
  Recording, 
  Notice, 
  Exam, 
  Task, 
  PastPaper, 
  BillingInfo, 
  TabId,
  ExamResult,
  LectureSheet,
  WeeklyAssessment,
  ClassScheduleItem,
  StudentSubmission
} from '../types';
import { 
  initialStudent, 
  initialCourses, 
  initialUpcomingClasses, 
  initialRecordings, 
  initialNotices, 
  initialExams, 
  initialTasks, 
  initialPastPapers, 
  initialBilling,
  initialLectureSheets,
  initialWeeklyAssessments,
  initialClassSchedules
} from '../data/initialData';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NoticeStack } from './NoticeStack';
import { CommandPalette } from './CommandPalette';
import { DashboardTab } from './DashboardTab';
import { CoursesTab } from './CoursesTab';
import { CalendarTab } from './CalendarTab';
import { ClassesTab } from './ClassesTab';
import { RecordingsTab } from './RecordingsTab';
import { AssessmentsTab } from './AssessmentsTab';
import { PlannerTab } from './PlannerTab';
import { PastPapersTab } from './PastPapersTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { BillingTab } from './BillingTab';
import { ProfileTab } from './ProfileTab';
import { SupportTab } from './SupportTab';
import { isToday } from '../utils/formatters';

export const StudentDashboard: React.FC = () => {
  // Student Portal State
  const [student, setStudent] = useState<Student>(initialStudent);
  const [courses] = useState<Course[]>(initialCourses);
  const [upcomingClasses] = useState<UpcomingClass[]>(initialUpcomingClasses);
  const [classSchedules] = useState<ClassScheduleItem[]>(initialClassSchedules);
  const [lectureSheets] = useState<LectureSheet[]>(initialLectureSheets);
  const [weeklyAssessments, setWeeklyAssessments] = useState<WeeklyAssessment[]>(initialWeeklyAssessments);
  const [recordings] = useState<Recording[]>(initialRecordings);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [pastPapers] = useState<PastPaper[]>(initialPastPapers);
  const [billing] = useState<BillingInfo>(initialBilling);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [coursesBoardFilter, setCoursesBoardFilter] = useState<'all' | 'Edexcel' | 'Cambridge'>('all');
  const [coursesCategoryFilter, setCoursesCategoryFilter] = useState<'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level'>('all');
  const [selectedCourseForClasses, setSelectedCourseForClasses] = useState<string | null>(null);
  const [selectedCourseForRecordings, setSelectedCourseForRecordings] = useState<string | null>(null);
  const [dismissedNotices, setDismissedNotices] = useState<Record<string, boolean>>({});
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigate = (tab: TabId, courseId?: string) => {
    if (tab === 'classes') {
      setSelectedCourseForClasses(courseId || null);
    }
    if (tab === 'recordings') {
      setSelectedCourseForRecordings(courseId || null);
    }
    setCurrentTab(tab);
  };

  const handleSelectCourseCategory = (
    board: 'all' | 'Edexcel' | 'Cambridge',
    category: 'all' | 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level'
  ) => {
    setCoursesBoardFilter(board);
    setCoursesCategoryFilter(category);
    setCurrentTab('courses');
  };

  // Enrolled courses
  const enrolledCourses = courses.filter(c => c.enrolled);

  // Badges & Counters
  const unreadAnnouncementsCount = notices.filter(n => !(n as any).read && !dismissedNotices[n.id]).length;
  const pendingAssessmentsCount = weeklyAssessments.filter(a => !a.submissions?.some(s => s.studentId === student.id)).length;
  const openExamsCount = exams.filter(e => !e.result).length;
  const totalActionAssessmentsCount = pendingAssessmentsCount + openExamsCount;
  const pendingTasksCount = tasks.filter(t => !t.done).length;
  const liveClassesTodayCount = classSchedules.filter(s => s.isLiveNow).length || upcomingClasses.filter(c => isToday(c.startsAt)).length;

  // Handlers
  const handleUpdateExamResult = (examId: string, result: ExamResult) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, result, attemptsUsed: (e.attemptsUsed || 0) + 1 } : e));
  };

  const handleSubmitWeeklyAssessment = (
    assessmentId: string, 
    submissionData: {
      fileName: string;
      fileType: 'PDF' | 'DOC' | 'DOCX';
      fileSize: string;
      studentNotes?: string;
    }
  ) => {
    setWeeklyAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      const existingIndex = (a.submissions || []).findIndex(s => s.studentId === student.id);
      const newSubmission: StudentSubmission = {
        id: `sub-${Date.now()}`,
        assessmentId,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatarUrl,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        fileName: submissionData.fileName,
        fileType: submissionData.fileType,
        fileSize: submissionData.fileSize,
        studentNotes: submissionData.studentNotes
      };
      let updatedSubs = [...(a.submissions || [])];
      if (existingIndex >= 0) {
        updatedSubs[existingIndex] = { ...updatedSubs[existingIndex], ...newSubmission };
      } else {
        updatedSubs.push(newSubmission);
      }
      return { ...a, submissions: updatedSubs, submissionsCount: updatedSubs.length };
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleDismissNotice = (id: string) => {
    setDismissedNotices(prev => ({ ...prev, [id]: true }));
  };

  const handleToggleNoticeRead = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: !(n as any).read } : n));
  };

  const handleUpdateAvatar = (newUrl: string) => {
    setStudent(prev => ({ ...prev, avatarUrl: newUrl }));
  };

  return (
    <div className="min-h-screen bg-[#01021c] text-[#e7ecf6] flex flex-row relative selection:bg-[#14e6ff]/30 selection:text-[#5ff2ff]">
      {/* Search / Command Palette (CMD+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={courses}
        exams={exams}
        pastPapers={pastPapers}
        upcomingClasses={upcomingClasses}
        notices={notices}
        onNavigate={handleNavigate}
      />

      {/* Student Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onSelectCourseCategory={handleSelectCourseCategory}
        activeBoard={coursesBoardFilter}
        activeCategory={coursesCategoryFilter}
        student={student}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        openExamsCount={totalActionAssessmentsCount}
        pendingTasksCount={pendingTasksCount}
        totalCoursesCount={enrolledCourses.length}
        courses={enrolledCourses}
      />

      {/* Main Student Portal Container */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Student Top Header */}
        <Header
          currentTab={currentTab}
          student={student}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotices={() => handleNavigate('announcements')}
          unreadCount={unreadAnnouncementsCount}
          liveClassesCount={liveClassesTodayCount}
          onNavigateToClasses={() => handleNavigate('classes')}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Urgent Notices Banner Stack */}
          <NoticeStack
            notices={notices}
            dismissedIds={dismissedNotices}
            onDismiss={handleDismissNotice}
            onNavigate={handleNavigate}
          />

          {/* Active Tab View */}
          {currentTab === 'dashboard' && (
            <DashboardTab
              student={student}
              courses={courses}
              upcomingClasses={upcomingClasses}
              recordings={recordings}
              weeklyAssessments={weeklyAssessments}
              exams={exams}
              tasks={tasks}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'courses' && (
            <CoursesTab
              courses={courses}
              initialBoard={coursesBoardFilter}
              initialCategory={coursesCategoryFilter}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarTab
              upcomingClasses={upcomingClasses}
              recordings={recordings}
              exams={exams}
              weeklyAssessments={weeklyAssessments}
              tasks={tasks}
              courses={courses}
              student={student}
              onNavigate={handleNavigate}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          )}

          {currentTab === 'classes' && (
            <ClassesTab
              upcomingClasses={upcomingClasses}
              classSchedules={classSchedules}
              lectureSheets={lectureSheets}
              courses={courses}
              initialCourseId={selectedCourseForClasses}
              onClearCourseFilter={() => setSelectedCourseForClasses(null)}
              onSelectCourse={(courseId) => setSelectedCourseForClasses(courseId)}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'recordings' && (
            <RecordingsTab
              courses={courses}
              recordings={recordings}
              initialCourseId={selectedCourseForRecordings}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'assessments' && (
            <AssessmentsTab
              courses={courses}
              student={student}
              weeklyAssessments={weeklyAssessments}
              exams={exams}
              onUpdateExamResult={handleUpdateExamResult}
              onSubmitWeeklyAssessment={handleSubmitWeeklyAssessment}
            />
          )}

          {currentTab === 'planner' && (
            <PlannerTab
              courses={courses}
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'papers' && (
            <PastPapersTab
              courses={courses}
              pastPapers={pastPapers}
            />
          )}

          {currentTab === 'announcements' && (
            <AnnouncementsTab
              notices={notices}
              dismissedIds={dismissedNotices}
              onToggleRead={handleToggleNoticeRead}
            />
          )}

          {currentTab === 'billing' && (
            <BillingTab
              billing={billing}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              student={student}
              courses={courses}
              upcomingClasses={upcomingClasses}
              recordings={recordings}
              onUpdateAvatar={handleUpdateAvatar}
            />
          )}

          {currentTab === 'support' && (
            <SupportTab
              student={student}
            />
          )}
        </main>
      </div>
    </div>
  );
};
export default StudentDashboard;
