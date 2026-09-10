import React, { useState } from 'react';
import { 
  Teacher, 
  Course, 
  LectureSheet, 
  WeeklyAssessment, 
  ClassScheduleItem, 
  StudentDoubt 
} from '../types';
import { 
  currentTeacherProfile, 
  initialCourses, 
  initialLectureSheets, 
  initialWeeklyAssessments, 
  initialClassSchedules, 
  initialStudentDoubts 
} from '../data/initialData';
import { TeacherDashboard } from './TeacherDashboard';

interface TeacherPortalProps {
  initialTeacher?: Teacher;
}

/**
 * TeacherPortal - Dedicated, self-contained file and component for the Teacher Dashboard.
 * Manages faculty state, assessments, lecture handouts, doubts desk, and live class routines.
 * Can be mounted independently in React or embedded via WordPress shortcode [teacher_portal].
 */
export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  initialTeacher = currentTeacherProfile
}) => {
  const [teacher, setTeacher] = useState<Teacher>(initialTeacher);
  const [courses] = useState<Course[]>(initialCourses);
  const [lectureSheets, setLectureSheets] = useState<LectureSheet[]>(initialLectureSheets);
  const [weeklyAssessments, setWeeklyAssessments] = useState<WeeklyAssessment[]>(initialWeeklyAssessments);
  const [classSchedules, setClassSchedules] = useState<ClassScheduleItem[]>(initialClassSchedules);
  const [studentDoubts, setStudentDoubts] = useState<StudentDoubt[]>(initialStudentDoubts);

  // 1. Add Lecture Handout / Sheet
  const handleAddLectureSheet = (sheet: Omit<LectureSheet, 'id' | 'downloads' | 'uploadedAt'>) => {
    const newSheetItem: LectureSheet = {
      ...sheet,
      id: `ls-${Date.now()}`,
      downloads: 0,
      uploadedAt: new Date().toISOString()
    };
    setLectureSheets(prev => [newSheetItem, ...prev]);
  };

  // 2. Add New Weekly Assessment / Assignment
  const handleAddAssessment = (assessment: Omit<WeeklyAssessment, 'id' | 'submissionsCount' | 'totalStudents' | 'submissions'>) => {
    const newAssessmentItem: WeeklyAssessment = {
      ...assessment,
      id: `wa-${Date.now()}`,
      submissionsCount: 0,
      totalStudents: 28,
      status: 'active',
      submissions: []
    };
    setWeeklyAssessments(prev => [newAssessmentItem, ...prev]);
  };

  // 3. Grade Student Submission with marks, grade & annotated feedback
  const handleGradeSubmission = (
    assessmentId: string, 
    submissionId: string, 
    marks: number, 
    grade: string, 
    feedback: string
  ) => {
    setWeeklyAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      const updatedSubmissions = (a.submissions || []).map(s => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          marksObtained: marks,
          grade,
          feedback,
          status: 'graded' as const,
          gradedBy: teacher.name,
          gradedAt: new Date().toISOString()
        };
      });
      return {
        ...a,
        submissions: updatedSubmissions
      };
    }));
  };

  // 4. Answer Student Doubt
  const handleAnswerDoubt = (doubtId: string, answer: string) => {
    setStudentDoubts(prev => prev.map(d => {
      if (d.id !== doubtId) return d;
      return {
        ...d,
        status: 'answered' as const,
        answer,
        answeredBy: teacher.name,
        answeredAt: new Date().toISOString()
      };
    }));
  };

  // 5. Toggle Live Now status for Class Schedule
  const handleToggleScheduleLive = (scheduleId: string) => {
    setClassSchedules(prev => prev.map(sch => {
      if (sch.id !== scheduleId) return sch;
      return {
        ...sch,
        isLiveNow: !sch.isLiveNow
      };
    }));
  };

  return (
    <div className="min-h-screen bg-[#01021c] text-[#e7ecf6] font-['DM_Sans',sans-serif]">
      <TeacherDashboard
        teacher={teacher}
        courses={courses}
        lectureSheets={lectureSheets}
        weeklyAssessments={weeklyAssessments}
        classSchedules={classSchedules}
        studentDoubts={studentDoubts}
        onAddLectureSheet={handleAddLectureSheet}
        onAddAssessment={handleAddAssessment}
        onGradeSubmission={handleGradeSubmission}
        onAnswerDoubt={handleAnswerDoubt}
        onToggleScheduleLive={handleToggleScheduleLive}
      />
    </div>
  );
};
export default TeacherPortal;
