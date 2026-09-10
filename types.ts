export interface Student {
  name: string;
  initials: string;
  id: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: 'Lead Instructor' | 'Co-Teacher' | 'Teaching Assistant';
  avatarUrl?: string;
  email?: string;
  qualification?: string;
  bio?: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  lessonsCount: number;
  durationHours: string;
  status?: 'completed' | 'in-progress' | 'upcoming';
}

export interface Course {
  id: string;
  wpPostId?: number;
  name: string;
  teacher: string;
  assignedTeachers?: Teacher[];
  progress: number;
  board?: 'Edexcel' | 'Cambridge';
  category?: 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Levels' | 'A-Level';
  code?: string;
  imageUrl?: string;
  enrolled?: boolean;
  totalLectures?: number;
  completedLectures?: number;
  upcomingLive?: string;
  description?: string;
  wpSynced?: boolean;
  lastSyncedAt?: string;
  modules?: SyllabusModule[];
}

export interface UpcomingClass {
  id: string;
  courseId: string;
  courseName: string;
  teacher: string;
  topic: string;
  startsAt: string; // ISO-8601
  durationMin: number;
  meetUrl: string;
}

export interface Recording {
  id: string;
  courseId: string;
  courseName: string;
  board?: BoardType;
  category?: PastPaperCategory | 'IAL' | 'IGCSE' | 'O-levels' | 'A-levels' | 'O-Levels' | 'A-Levels' | 'A-Level';
  subjectCode?: string;
  teacher: string;
  topic: string;
  chapter?: string;
  date: string; // ISO-8601
  duration?: string;
  telegramUrl: string; // Telegram video / post / channel URL
  telegramChannelName?: string; // e.g. "MindArc IAL Vault", "Edexcel Pure Maths (P1/P2)"
  telegramMessageId?: string; // Optional direct message ID
  attendance: 'present' | 'absent' | 'not_marked';
  lectureNotesUrl?: string;
  relatedPaperId?: string;
}

export interface Notice {
  id: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  text: string;
  postedAt: string;
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  points: number;
  options: ExamOption[];
  correctOptionId: string;
}

export interface ExamResult {
  scored: number;
  total: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  reason?: string;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  durationMin: number;
  passingScore: number;
  attemptsAllowed: number;
  attemptsUsed: number;
  negativeMarking: number;
  reviewEnabled: boolean;
  unlockAt: string;
  closeAt: string;
  result: ExamResult | null;
  questions: ExamQuestion[];
}

export interface Task {
  id: string;
  title: string;
  courseId: string;
  dueAt: string;
  done: boolean;
}

export type BoardType = 'Cambridge' | 'Edexcel';
export type CambridgeSubCategory = 'O-levels' | 'IGCSE' | 'A-levels';
export type EdexcelSubCategory = 'IGCSE' | 'IAL';
export type PastPaperCategory = 'O-levels' | 'IGCSE' | 'A-levels' | 'IAL';

export interface PastPaper {
  id: string;
  courseId: string;
  courseName?: string;
  board: BoardType;
  category: PastPaperCategory;
  subjectName?: string;
  subjectCode?: string;
  session: string;
  year?: number | string;
  paper: string;
  qpUrl: string;
  msUrl: string;
  erUrl?: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'refunded' | 'failed';
  orderUrl: string;
}

export interface BillingInfo {
  planName: string;
  amount: string;
  nextRenewal: string;
  status: 'active' | 'inactive';
  invoices: Invoice[];
}

export type UserRole = 'student' | 'teacher' | 'admin';

export type TeacherTabId = 
  | 'overview'
  | 'classes'
  | 'assessments'
  | 'lectures'
  | 'gradebook'
  | 'students';

export interface LectureSheet {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  topic: string;
  uploadedBy: string;
  uploaderRole: 'teacher' | 'admin';
  fileUrl: string;
  fileType: 'PDF' | 'Slides' | 'Handwritten Notes' | 'Worksheet';
  fileSize: string;
  downloads: number;
  uploadedAt: string;
  board?: 'Edexcel' | 'Cambridge';
  category?: 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Level';
}

export interface StudentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  fileName?: string;
  fileType?: 'PDF' | 'DOC' | 'DOCX';
  fileSize?: string;
  scriptUrl?: string;
  studentNotes?: string;
  marksObtained?: number;
  grade?: string;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export type TeacherAttachmentType = 'pdf' | 'doc' | 'docx' | 'image' | 'direct_message' | 'link';

export interface TeacherAttachment {
  id: string;
  type: TeacherAttachmentType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  directMessageText?: string;
  uploadedAt?: string;
}

export interface WeeklyAssessment {
  id: string;
  courseId: string;
  courseName: string;
  board?: 'Edexcel' | 'Cambridge';
  category?: 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Level';
  title: string;
  topic: string;
  weekNumber: number;
  durationMin: number;
  totalMarks: number;
  assignedBy: string;
  assignedByAvatar?: string;
  assignedByRole?: string;
  dueDate: string;
  questionPdfUrl?: string;
  instructions: string;
  assessmentType?: 'file_upload' | 'direct_message' | 'mixed';
  teacherPrompt?: string; // Direct text/message prompt from teacher
  attachments?: TeacherAttachment[]; // Attached DOC, PDF, images, or documents
  allowedFormats?: ('PDF' | 'DOC' | 'DOCX' | 'JPG' | 'PNG')[];
  status: 'active' | 'grading' | 'published' | 'closed';
  submissionsCount: number;
  totalStudents: number;
  submissions?: StudentSubmission[];
}

export interface StudentDoubt {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  topic: string;
  question: string;
  askedAt: string;
  status: 'answered' | 'pending';
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export interface ClassScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  board: 'Edexcel' | 'Cambridge';
  category: 'IGCSE' | 'IAL' | 'O-Levels' | 'A-Level';
  teacherName: string;
  topic: string;
  dayOfWeek: string;
  timeSlot: string;
  meetUrl: string;
  isLiveNow: boolean;
  uploadedByAdmin: boolean;
}

export type TabId = 
  | 'dashboard'
  | 'courses'
  | 'calendar'
  | 'classes'
  | 'recordings'
  | 'assessments'
  | 'planner'
  | 'papers'
  | 'announcements'
  | 'billing'
  | 'profile'
  | 'support';
