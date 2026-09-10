import React, { useState, useEffect } from 'react';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherPortal } from './components/TeacherPortal';

export default function App() {
  const [roleView, setRoleView] = useState<'student' | 'teacher'>('teacher');

  useEffect(() => {
    // Independent portal detection via query param (?portal=student or ?portal=teacher)
    const params = new URLSearchParams(window.location.search);
    const portal = params.get('portal') || params.get('role');
    if (portal === 'student' || window.location.hash === '#student') {
      setRoleView('student');
    } else if (portal === 'teacher' || window.location.hash === '#teacher') {
      setRoleView('teacher');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#01021c] text-[#e7ecf6] font-['DM_Sans',sans-serif]">
      {roleView === 'teacher' ? <TeacherPortal /> : <StudentDashboard />}
    </div>
  );
}
