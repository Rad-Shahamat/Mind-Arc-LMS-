import { 
  Student, 
  Teacher,
  Course, 
  UpcomingClass, 
  Recording, 
  Notice, 
  Exam, 
  Task, 
  PastPaper, 
  BillingInfo,
  LectureSheet,
  WeeklyAssessment,
  ClassScheduleItem,
  StudentDoubt
} from '../types';

export function isoAt(daysOffset: number, hh: number, mm: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

export function minutesFromNow(mins: number): string {
  return new Date(Date.now() + mins * 60000).toISOString();
}

export const initialStudent: Student = {
  name: "Fahim Rahman",
  initials: "FR",
  id: "MA-2026-014",
  email: "fahim.rahman@student.mindarcbd.com",
  phone: "+880 1712-345678"
};

export const initialCourses: Course[] = [
  // 1. Cambridge -> A-Level Courses
  {
    id: "chem-as",
    wpPostId: 1042,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "A-Level Chemistry (9701) — AS Level",
    teacher: "Mr. Tanvir Ahmed",
    assignedTeachers: [
      {
        id: "t1",
        name: "Mr. Tanvir Ahmed",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Chemistry (DU), Ex-Notre Dame College Faculty",
        email: "tanvir.ahmed@mindarcbd.com"
      },
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Co-Teacher",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physical Sciences",
        email: "ks.hossain@mindarcbd.com"
      },
      {
        id: "t5",
        name: "Sadman Sakib",
        role: "Teaching Assistant",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "A* in A-Level Chem, BUET Chem Eng",
        email: "ta.chem@mindarcbd.com"
      }
    ],
    progress: 68,
    board: "Cambridge",
    category: "A-Levels",
    code: "9701/AS",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 36,
    completedLectures: 24,
    description: "Physical, Inorganic, and Organic Chemistry foundations for Cambridge International AS Level.",
    modules: [
      { id: "m1", title: "Atomic Structure & Chemical Bonding", lessonsCount: 8, durationHours: "12h", status: "completed" },
      { id: "m2", title: "States of Matter & Enthalpy Changes", lessonsCount: 6, durationHours: "9h", status: "completed" },
      { id: "m3", title: "Equilibria, Reaction Kinetics & Redox", lessonsCount: 10, durationHours: "15h", status: "in-progress" },
      { id: "m4", title: "Introductory Organic Chemistry & Haloalkanes", lessonsCount: 12, durationHours: "18h", status: "upcoming" }
    ]
  },
  {
    id: "chem-a2",
    wpPostId: 1045,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "A-Level Chemistry (9701) — A2 Level",
    teacher: "Mr. Tanvir Ahmed",
    assignedTeachers: [
      {
        id: "t1",
        name: "Mr. Tanvir Ahmed",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Chemistry (DU)",
        email: "tanvir.ahmed@mindarcbd.com"
      },
      {
        id: "t5",
        name: "Sadman Sakib",
        role: "Teaching Assistant",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "BUET Chem Eng",
        email: "ta.chem@mindarcbd.com"
      }
    ],
    progress: 34,
    board: "Cambridge",
    category: "A-Levels",
    code: "9701/A2",
    imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 40,
    completedLectures: 14,
    description: "Advanced Reaction Kinetics, Electrochemistry, Organic Synthesis, and Spectroscopy.",
    modules: [
      { id: "m21", title: "Electrochemistry & Lattice Energy", lessonsCount: 10, durationHours: "16h", status: "completed" },
      { id: "m22", title: "Transition Metals & Coordination Compounds", lessonsCount: 12, durationHours: "18h", status: "in-progress" },
      { id: "m23", title: "Benzene & Aromatic Compounds Synthesis", lessonsCount: 10, durationHours: "15h", status: "upcoming" },
      { id: "m24", title: "Analytical Spectroscopy (NMR & Mass Spec)", lessonsCount: 8, durationHours: "12h", status: "upcoming" }
    ]
  },
  {
    id: "phys-alevel",
    wpPostId: 1050,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "A-Level Physics (9702) — AS & A2",
    teacher: "Dr. K. S. Hossain",
    assignedTeachers: [
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physics, Senior CAIE Specialist",
        email: "ks.hossain@mindarcbd.com"
      }
    ],
    progress: 52,
    board: "Cambridge",
    category: "A-Levels",
    code: "9702",
    imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 45,
    completedLectures: 23,
    description: "Mechanics, Quantum Phenomena, Gravitational Fields, and Nuclear Physics."
  },
  {
    id: "maths-alevel",
    wpPostId: 1052,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "A-Level Mathematics (9709) — Pure & Mechanics",
    teacher: "Engr. Rezaul Karim",
    assignedTeachers: [
      {
        id: "t3",
        name: "Engr. Rezaul Karim",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "B.Sc. Civil Engineering (BUET)",
        email: "rezaul.karim@mindarcbd.com"
      }
    ],
    progress: 60,
    board: "Cambridge",
    category: "A-Levels",
    code: "9709",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 42,
    completedLectures: 25,
    description: "Pure Mathematics (P1, P3) and Mechanics (M1) syllabus coverage with past paper drilling."
  },

  // 2. Cambridge -> O-Levels Courses
  {
    id: "bio-cie",
    wpPostId: 1060,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "O-Level Biology (5090 / 0590)",
    teacher: "Ms. Nusrat Jahan",
    assignedTeachers: [
      {
        id: "t4",
        name: "Ms. Nusrat Jahan",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Microbiology (DU)",
        email: "nusrat.jahan@mindarcbd.com"
      },
      {
        id: "t6",
        name: "Ayesha Siddiqua",
        role: "Teaching Assistant",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        qualification: "DMC Final Year MBBS",
        email: "ta.bio@mindarcbd.com"
      }
    ],
    progress: 55,
    board: "Cambridge",
    category: "O-Levels",
    code: "5090",
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 32,
    completedLectures: 18,
    description: "Cell biology, Human Physiology, Plant Transport, Genetics, and Alternative to Practical."
  },
  {
    id: "chem-cie-olevel",
    wpPostId: 1062,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "O-Level Chemistry (5070)",
    teacher: "Mr. Tanvir Ahmed",
    assignedTeachers: [
      {
        id: "t1",
        name: "Mr. Tanvir Ahmed",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Chemistry (DU)",
        email: "tanvir.ahmed@mindarcbd.com"
      }
    ],
    progress: 70,
    board: "Cambridge",
    category: "O-Levels",
    code: "5070",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 30,
    completedLectures: 21,
    description: "Stoichiometry, Acid-Base, Electrolysis, Metals, and Organic Chemistry fundamentals."
  },
  {
    id: "phys-cie-olevel",
    wpPostId: 1065,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "O-Level Physics (5054)",
    teacher: "Dr. K. S. Hossain",
    assignedTeachers: [
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physics",
        email: "ks.hossain@mindarcbd.com"
      }
    ],
    progress: 48,
    board: "Cambridge",
    category: "O-Levels",
    code: "5054",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 28,
    completedLectures: 13,
    description: "General physics, Thermal physics, Waves, Electricity & Magnetism, and Nuclear physics."
  },
  {
    id: "addmath-cie",
    wpPostId: 1068,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "O-Level Additional Mathematics (4037)",
    teacher: "Engr. Rezaul Karim",
    assignedTeachers: [
      {
        id: "t3",
        name: "Engr. Rezaul Karim",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "B.Sc. Civil Engineering (BUET)",
        email: "rezaul.karim@mindarcbd.com"
      }
    ],
    progress: 40,
    board: "Cambridge",
    category: "O-Levels",
    code: "4037",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 35,
    completedLectures: 14,
    description: "Calculus, Trigonometry, Vectors, Permutations & Combinations, and Circular Measure."
  },

  // 3. Cambridge -> IGCSE Courses
  {
    id: "cambridge-igcse-chem",
    wpPostId: 1069,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Cambridge IGCSE Chemistry (0620)",
    teacher: "Mr. Tanvir Ahmed",
    assignedTeachers: [
      {
        id: "t1",
        name: "Mr. Tanvir Ahmed",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Chemistry (DU)",
        email: "tanvir.ahmed@mindarcbd.com"
      }
    ],
    progress: 50,
    board: "Cambridge",
    category: "IGCSE",
    code: "0620",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 32,
    completedLectures: 16,
    description: "Cambridge IGCSE Chemistry curriculum covering Atomic Structure, Chemical Energetics, and Organic Chemistry."
  },
  {
    id: "cambridge-igcse-phys",
    wpPostId: 1070,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Cambridge IGCSE Physics (0625)",
    teacher: "Dr. K. S. Hossain",
    assignedTeachers: [
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physics",
        email: "ks.hossain@mindarcbd.com"
      }
    ],
    progress: 45,
    board: "Cambridge",
    category: "IGCSE",
    code: "0625",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 30,
    completedLectures: 12,
    description: "General physics, Thermal physics, Properties of waves including light and sound, Electricity and magnetism."
  },

  // 3. Edexcel -> IGCSE Courses
  {
    id: "bio-edx",
    wpPostId: 1072,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IGCSE Biology (4BI1)",
    teacher: "Ms. Nusrat Jahan",
    assignedTeachers: [
      {
        id: "t4",
        name: "Ms. Nusrat Jahan",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Microbiology (DU)",
        email: "nusrat.jahan@mindarcbd.com"
      }
    ],
    progress: 42,
    board: "Edexcel",
    category: "IGCSE",
    code: "4BI1",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    enrolled: true,
    totalLectures: 30,
    completedLectures: 13,
    description: "Organisms & Life Processes, Animal Physiology, Plant Reproduction, and Ecology."
  },
  {
    id: "bangla-edx",
    wpPostId: 1075,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IGCSE Bangla (4BN1)",
    teacher: "Prof. Anisur Rahman",
    assignedTeachers: [
      {
        id: "t7",
        name: "Prof. Anisur Rahman",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        qualification: "M.A. Bengali Literature (DU), 18+ Yrs Experience",
        email: "anisur.rahman@mindarcbd.com"
      }
    ],
    progress: 65,
    board: "Edexcel",
    category: "IGCSE",
    code: "4BN1",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 24,
    completedLectures: 16,
    description: "Reading Comprehension, Essay Writing, Grammar, and Continuous Prose."
  },
  {
    id: "maths-a-edx",
    wpPostId: 1078,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IGCSE Mathematics A (4MA1)",
    teacher: "Engr. Rezaul Karim",
    assignedTeachers: [
      {
        id: "t3",
        name: "Engr. Rezaul Karim",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "B.Sc. Civil Engineering (BUET)",
        email: "rezaul.karim@mindarcbd.com"
      }
    ],
    progress: 75,
    board: "Edexcel",
    category: "IGCSE",
    code: "4MA1",
    imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 38,
    completedLectures: 29,
    description: "Higher Tier Mathematics: Algebra, Functions, Vectors, Statistics, and Probability."
  },
  {
    id: "physics-edx-igcse",
    wpPostId: 1080,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IGCSE Physics (4PH1)",
    teacher: "Dr. K. S. Hossain",
    assignedTeachers: [
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physics",
        email: "ks.hossain@mindarcbd.com"
      }
    ],
    progress: 58,
    board: "Edexcel",
    category: "IGCSE",
    code: "4PH1",
    imageUrl: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 32,
    completedLectures: 19,
    description: "Forces and Motion, Electricity, Waves, Energy resources, Solids, Liquids, and Gases."
  },

  // 4. Edexcel -> IAL Courses
  {
    id: "ial-p1-wma11",
    wpPostId: 1085,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)",
    teacher: "Engr. Rezaul Karim",
    assignedTeachers: [
      {
        id: "t3",
        name: "Engr. Rezaul Karim",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "B.Sc. Civil Engineering (BUET)",
        email: "rezaul.karim@mindarcbd.com"
      }
    ],
    progress: 62,
    board: "Edexcel",
    category: "IAL",
    code: "WMA11 / WMA12",
    imageUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80",
    enrolled: true,
    totalLectures: 36,
    completedLectures: 22,
    description: "Algebra, Coordinate Geometry, Sequences, Exponentials, Differentiation, and Integration."
  },
  {
    id: "ial-chem-wch11",
    wpPostId: 1088,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IAL Chemistry (Units 1, 2 & 3)",
    teacher: "Mr. Tanvir Ahmed",
    assignedTeachers: [
      {
        id: "t1",
        name: "Mr. Tanvir Ahmed",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        qualification: "M.Sc. Chemistry (DU)",
        email: "tanvir.ahmed@mindarcbd.com"
      }
    ],
    progress: 50,
    board: "Edexcel",
    category: "IAL",
    code: "WCH11 / WCH12",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 34,
    completedLectures: 17,
    description: "Structure, Bonding, Introduction to Organic Chemistry, Energetics, and Halogenoalkanes."
  },
  {
    id: "ial-phys-wph11",
    wpPostId: 1092,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IAL Physics (Units 1 & 2)",
    teacher: "Dr. K. S. Hossain",
    assignedTeachers: [
      {
        id: "t2",
        name: "Dr. K. S. Hossain",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        qualification: "Ph.D. Physics",
        email: "ks.hossain@mindarcbd.com"
      }
    ],
    progress: 45,
    board: "Edexcel",
    category: "IAL",
    code: "WPH11 / WPH12",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 32,
    completedLectures: 14,
    description: "Mechanics and Materials, Waves and Electricity, and Experimental Skills."
  },
  {
    id: "ial-m1-wme01",
    wpPostId: 1095,
    wpSynced: true,
    lastSyncedAt: "2026-08-22T08:30:00Z",
    name: "Edexcel IAL Mechanics 1 (M1)",
    teacher: "Engr. Rezaul Karim",
    assignedTeachers: [
      {
        id: "t3",
        name: "Engr. Rezaul Karim",
        role: "Lead Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        qualification: "B.Sc. Civil Engineering (BUET)",
        email: "rezaul.karim@mindarcbd.com"
      }
    ],
    progress: 38,
    board: "Edexcel",
    category: "IAL",
    code: "WME01",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    enrolled: false,
    totalLectures: 24,
    completedLectures: 9,
    description: "Mathematical Models, Kinematics of Particles, Dynamics, Statics, and Moments."
  }
];

export const initialUpcomingClasses: UpcomingClass[] = [
  { id: "u1", courseId: "chem-as", courseName: "A-Level Chemistry (9701) — AS Level", teacher: "Mr. Tanvir Ahmed", topic: "Chapter 7 — Redox Chemistry", startsAt: isoAt(0, 19, 0), durationMin: 90, meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "u2", courseId: "bio-cie", courseName: "O-Level Biology — Cambridge IGCSE (0590)", teacher: "Ms. Nusrat Jahan", topic: "Module 6 — Transport in Plants", startsAt: isoAt(0, 20, 45), durationMin: 75, meetUrl: "https://meet.google.com/xyz-uvwx-yzz" },
  { id: "u3", courseId: "chem-a2", courseName: "A-Level Chemistry (9701) — A2 Level", teacher: "Mr. Tanvir Ahmed", topic: "Chapter 26 — Polymerisation", startsAt: isoAt(1, 19, 0), durationMin: 90, meetUrl: "https://meet.google.com/mno-pqrs-tuv" },
  { id: "u4", courseId: "bio-edx", courseName: "Edexcel IGCSE Biology (4BI1)", teacher: "Ms. Nusrat Jahan", topic: "Module 5 — Nutrition & Enzyme Kinetics", startsAt: isoAt(0, 18, 0), durationMin: 75, meetUrl: "https://meet.google.com/mindarc-bio-edx" },
  { id: "u5", courseId: "ial-p1-wma11", courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)", teacher: "Engr. Rezaul Karim", topic: "Chapter 11 — Integration & Area Under Curves", startsAt: isoAt(0, 19, 30), durationMin: 90, meetUrl: "https://meet.google.com/mindarc-ial-math" },
  { id: "u6", courseId: "chem-as", courseName: "A-Level Chemistry (9701) — AS Level", teacher: "Mr. Tanvir Ahmed", topic: "P1 MCQ Drilling — Practice Set 3", startsAt: isoAt(3, 19, 0), durationMin: 60, meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "u7", courseId: "chem-a2", courseName: "A-Level Chemistry (9701) — A2 Level", teacher: "Mr. Tanvir Ahmed", topic: "Chapter 27 — Amino Acids & Proteins", startsAt: isoAt(4, 19, 0), durationMin: 90, meetUrl: "https://meet.google.com/mno-pqrs-tuv" },
  { id: "u8", courseId: "bio-cie", courseName: "O-Level Biology — Cambridge IGCSE (0590)", teacher: "Ms. Nusrat Jahan", topic: "Module 7 — Respiration & Gas Exchange", startsAt: isoAt(5, 20, 45), durationMin: 75, meetUrl: "https://meet.google.com/xyz-uvwx-yzz" },
  { id: "u9", courseId: "bio-edx", courseName: "Edexcel IGCSE Biology (4BI1)", teacher: "Ms. Nusrat Jahan", topic: "Module 6 — Plant Transport & Transpiration Pull", startsAt: isoAt(2, 18, 0), durationMin: 75, meetUrl: "https://meet.google.com/mindarc-bio-edx" },
  { id: "u10", courseId: "ial-p1-wma11", courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)", teacher: "Engr. Rezaul Karim", topic: "P1 Past Paper Practice — Jan 2026 Series Q1-Q8", startsAt: isoAt(3, 19, 30), durationMin: 90, meetUrl: "https://meet.google.com/mindarc-ial-math" },
  { id: "u11", courseId: "ial-chem-wch11", courseName: "Edexcel IAL Chemistry (Units 1, 2 & 3)", teacher: "Mr. Tanvir Ahmed", topic: "Unit 2 — Intermolecular Forces & Halogenoalkanes", startsAt: isoAt(1, 20, 0), durationMin: 90, meetUrl: "https://meet.google.com/mindarc-ial-chem" }
];

export const initialRecordings: Recording[] = [
  // Edexcel -> IAL Recordings
  { 
    id: "r-edx-ial-1", 
    courseId: "ial-p1-wma11", 
    courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)", 
    board: "Edexcel",
    category: "IAL",
    subjectCode: "WMA11",
    teacher: "Engr. Rezaul Karim", 
    topic: "Integration by Substitution & Area Under Trigonometric Curves", 
    chapter: "Chapter 6 — Advanced Calculus",
    duration: "1 hr 35 mins",
    date: isoAt(-1, 19, 30), 
    telegramUrl: "https://t.me/mindarc_ial_maths/104", 
    telegramChannelName: "@mindarc_ial_maths",
    telegramMessageId: "104",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-ial-2", 
    courseId: "ial-p1-wma11", 
    courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)", 
    board: "Edexcel",
    category: "IAL",
    subjectCode: "WMA11",
    teacher: "Engr. Rezaul Karim", 
    topic: "Binomial Expansion & Geometric Series Convergence", 
    chapter: "Chapter 4 — Sequences & Series",
    duration: "1 hr 20 mins",
    date: isoAt(-3, 19, 30), 
    telegramUrl: "https://t.me/mindarc_ial_maths/98", 
    telegramChannelName: "@mindarc_ial_maths",
    telegramMessageId: "98",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-ial-3", 
    courseId: "ial-chem-wch11", 
    courseName: "Edexcel IAL Chemistry (Units 1, 2 & 3)", 
    board: "Edexcel",
    category: "IAL",
    subjectCode: "WCH11",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Hess Law Cycles, Born-Haber Diagrams & Lattice Enthalpy", 
    chapter: "Unit 2 — Energetics & Kinetics",
    duration: "1 hr 45 mins",
    date: isoAt(-2, 20, 0), 
    telegramUrl: "https://t.me/mindarc_ial_chemistry/77", 
    telegramChannelName: "@mindarc_ial_chemistry",
    telegramMessageId: "77",
    attendance: "absent",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-ial-4", 
    courseId: "ial-phys-wph11", 
    courseName: "Edexcel IAL Physics (Units 1 & 2)", 
    board: "Edexcel",
    category: "IAL",
    subjectCode: "WPH11",
    teacher: "Dr. K. S. Hossain", 
    topic: "Wave Superposition, Stationary Waves & Phase Difference", 
    chapter: "Unit 2 — Waves and Electricity",
    duration: "1 hr 30 mins",
    date: isoAt(-5, 18, 30), 
    telegramUrl: "https://t.me/mindarc_ial_physics/62", 
    telegramChannelName: "@mindarc_ial_physics",
    telegramMessageId: "62",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-ial-5", 
    courseId: "ial-m1-wme01", 
    courseName: "Edexcel IAL Mechanics 1 (M1)", 
    board: "Edexcel",
    category: "IAL",
    subjectCode: "WME01",
    teacher: "Engr. Rezaul Karim", 
    topic: "Connected Particles on Inclined Planes & Friction Models", 
    chapter: "Chapter 3 — Dynamics of Particles",
    duration: "1 hr 25 mins",
    date: isoAt(-6, 19, 0), 
    telegramUrl: "https://t.me/mindarc_ial_mechanics/45", 
    telegramChannelName: "@mindarc_ial_mechanics",
    telegramMessageId: "45",
    attendance: "not_marked",
    lectureNotesUrl: "#"
  },

  // Edexcel -> IGCSE Recordings
  { 
    id: "r-edx-igcse-1", 
    courseId: "bio-edx", 
    courseName: "Edexcel IGCSE Biology (4BI1)", 
    board: "Edexcel",
    category: "IGCSE",
    subjectCode: "4BI1",
    teacher: "Ms. Nusrat Jahan", 
    topic: "Coordination & Nervous Response in Mammals (Synapses & Reflex Arcs)", 
    chapter: "Module 4 — Animal Physiology",
    duration: "1 hr 15 mins",
    date: isoAt(-2, 18, 0), 
    telegramUrl: "https://t.me/mindarc_igcse_biology/83", 
    telegramChannelName: "@mindarc_igcse_biology",
    telegramMessageId: "83",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-igcse-2", 
    courseId: "bio-edx", 
    courseName: "Edexcel IGCSE Biology (4BI1)", 
    board: "Edexcel",
    category: "IGCSE",
    subjectCode: "4BI1",
    teacher: "Ms. Nusrat Jahan", 
    topic: "Cell Division, Mitosis vs Meiosis & Monohybrid Crosses", 
    chapter: "Module 3 — Genetics & Inheritance",
    duration: "1 hr 30 mins",
    date: isoAt(-4, 18, 0), 
    telegramUrl: "https://t.me/mindarc_igcse_biology/74", 
    telegramChannelName: "@mindarc_igcse_biology",
    telegramMessageId: "74",
    attendance: "absent",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-igcse-3", 
    courseId: "bangla-edx", 
    courseName: "Edexcel IGCSE Bangla (4BN1)", 
    board: "Edexcel",
    category: "IGCSE",
    subjectCode: "4BN1",
    teacher: "Prof. Anisur Rahman", 
    topic: "Paper 1 Directed Writing & Grammatical Accuracy Drilling", 
    chapter: "Paper 1 — Continuous Prose",
    duration: "1 hr 10 mins",
    date: isoAt(-3, 17, 0), 
    telegramUrl: "https://t.me/mindarc_igcse_bangla/31", 
    telegramChannelName: "@mindarc_igcse_bangla",
    telegramMessageId: "31",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-igcse-4", 
    courseId: "maths-a-edx", 
    courseName: "Edexcel IGCSE Mathematics A (4MA1)", 
    board: "Edexcel",
    category: "IGCSE",
    subjectCode: "4MA1",
    teacher: "Engr. Rezaul Karim", 
    topic: "Quadratic Simultaneous Equations & Algebraic Fractions", 
    chapter: "Section 2 — Algebra & Functions",
    duration: "1 hr 30 mins",
    date: isoAt(-5, 17, 30), 
    telegramUrl: "https://t.me/mindarc_igcse_maths/56", 
    telegramChannelName: "@mindarc_igcse_maths",
    telegramMessageId: "56",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-edx-igcse-5", 
    courseId: "physics-edx-igcse", 
    courseName: "Edexcel IGCSE Physics (4PH1)", 
    board: "Edexcel",
    category: "IGCSE",
    subjectCode: "4PH1",
    teacher: "Dr. K. S. Hossain", 
    topic: "Electromagnetic Induction & Transformer Calculations", 
    chapter: "Unit 6 — Magnetism & Electromagnetism",
    duration: "1 hr 20 mins",
    date: isoAt(-7, 18, 0), 
    telegramUrl: "https://t.me/mindarc_igcse_physics/49", 
    telegramChannelName: "@mindarc_igcse_physics",
    telegramMessageId: "49",
    attendance: "not_marked",
    lectureNotesUrl: "#"
  },

  // Cambridge -> A-Levels Recordings
  { 
    id: "r-cam-alevel-1", 
    courseId: "chem-as", 
    courseName: "A-Level Chemistry (9701) — AS Level", 
    board: "Cambridge",
    category: "A-levels",
    subjectCode: "9701",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Group 2 & Group 17 Trends, Reactions & Halide Tests", 
    chapter: "Chapter 17–18 — Inorganic Chemistry",
    duration: "1 hr 30 mins",
    date: isoAt(-1, 19, 0), 
    telegramUrl: "https://t.me/mindarc_alevel_chemistry/112", 
    telegramChannelName: "@mindarc_alevel_chemistry",
    telegramMessageId: "112",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-alevel-2", 
    courseId: "chem-as", 
    courseName: "A-Level Chemistry (9701) — AS Level", 
    board: "Cambridge",
    category: "A-levels",
    subjectCode: "9701",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Redox Titrations, Oxidation Numbers & Practical Calculation Drilling", 
    chapter: "Chapter 7 — Redox Chemistry",
    duration: "1 hr 40 mins",
    date: isoAt(-4, 19, 0), 
    telegramUrl: "https://t.me/mindarc_alevel_chemistry/101", 
    telegramChannelName: "@mindarc_alevel_chemistry",
    telegramMessageId: "101",
    attendance: "not_marked",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-alevel-3", 
    courseId: "chem-a2", 
    courseName: "A-Level Chemistry (9701) — A2 Level", 
    board: "Cambridge",
    category: "A-levels",
    subjectCode: "9701",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Paper 4 A2 Theory Drilling — Transition Elements & Complex Ions", 
    chapter: "Chapter 24 — Transition Metals",
    duration: "1 hr 50 mins",
    date: isoAt(-2, 19, 0), 
    telegramUrl: "https://t.me/mindarc_a2_chemistry/89", 
    telegramChannelName: "@mindarc_a2_chemistry",
    telegramMessageId: "89",
    attendance: "absent",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-alevel-4", 
    courseId: "chem-a2", 
    courseName: "A-Level Chemistry (9701) — A2 Level", 
    board: "Cambridge",
    category: "A-levels",
    subjectCode: "9701",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Carbonyl Compounds, Nucleophilic Addition & Condensation Polymers", 
    chapter: "Chapter 28 — Organic Synthesis",
    duration: "1 hr 35 mins",
    date: isoAt(-7, 19, 0), 
    telegramUrl: "https://t.me/mindarc_a2_chemistry/76", 
    telegramChannelName: "@mindarc_a2_chemistry",
    telegramMessageId: "76",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-alevel-5", 
    courseId: "phys-as", 
    courseName: "A-Level Physics (9702) — AS Level", 
    board: "Cambridge",
    category: "A-levels",
    subjectCode: "9702",
    teacher: "Dr. K. S. Hossain", 
    topic: "Kirchhoff Laws, Potential Dividers & Internal Resistance", 
    chapter: "Chapter 9 — DC Circuits",
    duration: "1 hr 30 mins",
    date: isoAt(-3, 18, 30), 
    telegramUrl: "https://t.me/mindarc_alevel_physics/95", 
    telegramChannelName: "@mindarc_alevel_physics",
    telegramMessageId: "95",
    attendance: "present",
    lectureNotesUrl: "#"
  },

  // Cambridge -> O-Levels Recordings
  { 
    id: "r-cam-olevel-1", 
    courseId: "chem-cie-olevel", 
    courseName: "O-Level Chemistry (5070)", 
    board: "Cambridge",
    category: "O-levels",
    subjectCode: "5070",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Acids, Bases & Salts Preparation (Soluble vs Insoluble Salt Methods)", 
    chapter: "Chapter 8 — Chemical Reactions",
    duration: "1 hr 15 mins",
    date: isoAt(-3, 17, 30), 
    telegramUrl: "https://t.me/mindarc_olevel_chemistry/64", 
    telegramChannelName: "@mindarc_olevel_chemistry",
    telegramMessageId: "64",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-olevel-2", 
    courseId: "bio-cie", 
    courseName: "O-Level Biology (5090 / 0590)", 
    board: "Cambridge",
    category: "O-levels",
    subjectCode: "5090",
    teacher: "Ms. Nusrat Jahan", 
    topic: "Plant Nutrition, Photosynthesis Experiments & Leaf Anatomy", 
    chapter: "Module 3 — Plant Biology",
    duration: "1 hr 20 mins",
    date: isoAt(-5, 20, 45), 
    telegramUrl: "https://t.me/mindarc_olevel_biology/58", 
    telegramChannelName: "@mindarc_olevel_biology",
    telegramMessageId: "58",
    attendance: "present",
    lectureNotesUrl: "#"
  },

  // Cambridge -> IGCSE Recordings
  { 
    id: "r-cam-igcse-1", 
    courseId: "cambridge-igcse-chem", 
    courseName: "Cambridge IGCSE Chemistry (0620)", 
    board: "Cambridge",
    category: "IGCSE",
    subjectCode: "0620",
    teacher: "Mr. Tanvir Ahmed", 
    topic: "Stoichiometry & Mole Calculations Masterclass", 
    chapter: "Topic 3 — Stoichiometry",
    duration: "1 hr 25 mins",
    date: isoAt(-2, 17, 0), 
    telegramUrl: "https://t.me/mindarc_cam_igcse_chem/41", 
    telegramChannelName: "@mindarc_cam_igcse_chem",
    telegramMessageId: "41",
    attendance: "present",
    lectureNotesUrl: "#"
  },
  { 
    id: "r-cam-igcse-2", 
    courseId: "cambridge-igcse-phys", 
    courseName: "Cambridge IGCSE Physics (0625)", 
    board: "Cambridge",
    category: "IGCSE",
    subjectCode: "0625",
    teacher: "Dr. K. S. Hossain", 
    topic: "Light Refraction, Critical Angle & Total Internal Reflection", 
    chapter: "Topic 3 — Waves & Optics",
    duration: "1 hr 15 mins",
    date: isoAt(-6, 17, 30), 
    telegramUrl: "https://t.me/mindarc_cam_igcse_physics/37", 
    telegramChannelName: "@mindarc_cam_igcse_physics",
    telegramMessageId: "37",
    attendance: "present",
    lectureNotesUrl: "#"
  }
];

export const initialNotices: Notice[] = [
  { id: "n1", type: "warning", title: "Class rescheduled", text: "Saturday's A2 Chemistry class (Ch.27) moves to 8:30 PM — same Meet link.", postedAt: isoAt(0, 9, 15) },
  { id: "n2", type: "info", title: "New mock exam released", text: "The AS Chemistry Redox & Electrochemistry mock is now unlocked below in Exams.", postedAt: isoAt(0, 8, 0) },
  { id: "n3", type: "success", title: "Term 1 attendance certificates ready", text: "Certificates have been emailed to every student — check your inbox and spam folder.", postedAt: isoAt(-3, 18, 30) }
];

export const initialExams: Exam[] = [
  {
    id: "ex1",
    title: "Redox & Electrochemistry Mock Test",
    courseId: "chem-as",
    courseName: "A-Level Chemistry (9701) — AS Level",
    durationMin: 20,
    passingScore: 70,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    negativeMarking: 0,
    reviewEnabled: true,
    unlockAt: minutesFromNow(-30),
    closeAt: minutesFromNow(180),
    result: null,
    questions: [
      {
        id: "q1",
        text: "In a redox reaction, oxidation is best described as:",
        points: 1,
        options: [
          { id: "a", text: "Loss of electrons" },
          { id: "b", text: "Gain of electrons" },
          { id: "c", text: "Gain of protons" },
          { id: "d", text: "Loss of neutrons" }
        ],
        correctOptionId: "a"
      },
      {
        id: "q2",
        text: "What is the oxidation state of chlorine in ClO3⁻?",
        points: 1,
        options: [
          { id: "a", text: "+3" },
          { id: "b", text: "+5" },
          { id: "c", text: "-1" },
          { id: "d", text: "+7" }
        ],
        correctOptionId: "b"
      },
      {
        id: "q3",
        text: "Which electrode is the site of reduction in an electrolytic cell?",
        points: 1,
        options: [
          { id: "a", text: "Anode" },
          { id: "b", text: "Cathode" },
          { id: "c", text: "Salt bridge" },
          { id: "d", text: "Reference electrode" }
        ],
        correctOptionId: "b"
      },
      {
        id: "q4",
        text: "A standard hydrogen electrode is assigned an E° value of:",
        points: 1,
        options: [
          { id: "a", text: "+1.00 V" },
          { id: "b", text: "-1.00 V" },
          { id: "c", text: "0.00 V" },
          { id: "d", text: "+0.76 V" }
        ],
        correctOptionId: "c"
      },
      {
        id: "q5",
        text: "In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, the reducing agent is:",
        points: 1,
        options: [
          { id: "a", text: "Cu" },
          { id: "b", text: "Cu²⁺" },
          { id: "c", text: "Zn²⁺" },
          { id: "d", text: "Zn" }
        ],
        correctOptionId: "d"
      }
    ]
  },
  {
    id: "ex2",
    title: "Module 6 — Transport in Plants Quiz",
    courseId: "bio-cie",
    courseName: "O-Level Biology — Cambridge IGCSE (0590)",
    durationMin: 15,
    passingScore: 60,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    negativeMarking: 0,
    reviewEnabled: true,
    unlockAt: minutesFromNow(150),
    closeAt: minutesFromNow(390),
    result: null,
    questions: [
      {
        id: "q1",
        text: "Transpiration mainly occurs through which structures?",
        points: 1,
        options: [
          { id: "a", text: "Root hairs" },
          { id: "b", text: "Stomata" },
          { id: "c", text: "Xylem vessels" },
          { id: "d", text: "Phloem sieve tubes" }
        ],
        correctOptionId: "b"
      },
      {
        id: "q2",
        text: "Water moves up the xylem mainly due to:",
        points: 1,
        options: [
          { id: "a", text: "Active transport" },
          { id: "b", text: "Root pressure alone" },
          { id: "c", text: "Transpiration pull" },
          { id: "d", text: "Osmosis in the phloem" }
        ],
        correctOptionId: "c"
      },
      {
        id: "q3",
        text: "Translocation transports sucrose mainly through the:",
        points: 1,
        options: [
          { id: "a", text: "Xylem" },
          { id: "b", text: "Phloem" },
          { id: "c", text: "Cortex" },
          { id: "d", text: "Epidermis" }
        ],
        correctOptionId: "b"
      }
    ]
  },
  {
    id: "ex3",
    title: "Chapter 26 — Polymerisation Practice MCQ",
    courseId: "chem-a2",
    courseName: "A-Level Chemistry (9701) — A2 Level",
    durationMin: 30,
    passingScore: 70,
    attemptsAllowed: 1,
    attemptsUsed: 1,
    negativeMarking: 0,
    reviewEnabled: true,
    unlockAt: isoAt(-2, 19, 0),
    closeAt: isoAt(-1, 22, 0),
    result: { scored: 17, total: 20, percentage: 85, passed: true, submittedAt: isoAt(-1, 20, 10) },
    questions: []
  }
];

export const initialTasks: Task[] = [
  { id: "t1", title: "Redo Redox & Electrochemistry past-paper Qs 1–10", courseId: "chem-as", dueAt: isoAt(1, 18, 0), done: false },
  { id: "t2", title: "Revise Module 6 notes — Transport in Plants", courseId: "bio-cie", dueAt: isoAt(0, 21, 0), done: false },
  { id: "t3", title: "Watch the Polymerisation recording before Thursday", courseId: "chem-a2", dueAt: isoAt(-1, 20, 0), done: false },
  { id: "t4", title: "Submit the AS Chemistry Redox mock exam", courseId: "chem-as", dueAt: isoAt(0, 20, 0), done: true },
  { id: "t5", title: "Flashcards — command words (describe vs explain)", courseId: "bio-edx", dueAt: isoAt(3, 19, 0), done: false }
];

export const initialPastPapers: PastPaper[] = [
  // Cambridge -> O-levels
  { 
    id: "pp-cam-ol-chem-25mj-12", 
    courseId: "chem-cie-olevel", 
    courseName: "O-Level Chemistry (5070)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Chemistry", 
    subjectCode: "5070", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Multiple Choice", 
    qpUrl: "https://example.com/cambridge/5070_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/5070_s25_ms_12.pdf",
    erUrl: "https://example.com/cambridge/5070_s25_er.pdf"
  },
  { 
    id: "pp-cam-ol-chem-25mj-22", 
    courseId: "chem-cie-olevel", 
    courseName: "O-Level Chemistry (5070)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Chemistry", 
    subjectCode: "5070", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 22 — Theory Structured", 
    qpUrl: "https://example.com/cambridge/5070_s25_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/5070_s25_ms_22.pdf" 
  },
  { 
    id: "pp-cam-ol-chem-24on-12", 
    courseId: "chem-cie-olevel", 
    courseName: "O-Level Chemistry (5070)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Chemistry", 
    subjectCode: "5070", 
    session: "Oct/Nov 2024", 
    year: 2024, 
    paper: "Paper 12 — Multiple Choice", 
    qpUrl: "https://example.com/cambridge/5070_w24_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/5070_w24_ms_12.pdf" 
  },
  { 
    id: "pp-cam-ol-chem-24on-22", 
    courseId: "chem-cie-olevel", 
    courseName: "O-Level Chemistry (5070)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Chemistry", 
    subjectCode: "5070", 
    session: "Oct/Nov 2024", 
    year: 2024, 
    paper: "Paper 22 — Theory Structured", 
    qpUrl: "https://example.com/cambridge/5070_w24_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/5070_w24_ms_22.pdf" 
  },
  { 
    id: "pp-cam-ol-bio-25mj-12", 
    courseId: "bio-cie-5090", 
    courseName: "O-Level Biology (5090)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Biology", 
    subjectCode: "5090", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Multiple Choice", 
    qpUrl: "https://example.com/cambridge/5090_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/5090_s25_ms_12.pdf" 
  },
  { 
    id: "pp-cam-ol-bio-25mj-22", 
    courseId: "bio-cie-5090", 
    courseName: "O-Level Biology (5090)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Biology", 
    subjectCode: "5090", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 22 — Theory", 
    qpUrl: "https://example.com/cambridge/5090_s25_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/5090_s25_ms_22.pdf" 
  },
  { 
    id: "pp-cam-ol-phys-25mj-12", 
    courseId: "phys-cie-5054", 
    courseName: "O-Level Physics (5054)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Physics", 
    subjectCode: "5054", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Multiple Choice", 
    qpUrl: "https://example.com/cambridge/5054_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/5054_s25_ms_12.pdf" 
  },
  { 
    id: "pp-cam-ol-math-25mj-12", 
    courseId: "math-cie-4024", 
    courseName: "O-Level Mathematics D (4024)", 
    board: "Cambridge", 
    category: "O-levels", 
    subjectName: "Mathematics D", 
    subjectCode: "4024", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Non-Calculator", 
    qpUrl: "https://example.com/cambridge/4024_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/4024_s25_ms_12.pdf" 
  },

  // Cambridge -> IGCSE
  { 
    id: "pp-cam-ig-chem-25mj-22", 
    courseId: "chem-cie-0620", 
    courseName: "Cambridge IGCSE Chemistry (0620)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Chemistry", 
    subjectCode: "0620", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 22 — Multiple Choice (Extended)", 
    qpUrl: "https://example.com/cambridge/0620_s25_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/0620_s25_ms_22.pdf" 
  },
  { 
    id: "pp-cam-ig-chem-25mj-42", 
    courseId: "chem-cie-0620", 
    courseName: "Cambridge IGCSE Chemistry (0620)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Chemistry", 
    subjectCode: "0620", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 42 — Theory (Extended)", 
    qpUrl: "https://example.com/cambridge/0620_s25_qp_42.pdf", 
    msUrl: "https://example.com/cambridge/0620_s25_ms_42.pdf" 
  },
  { 
    id: "pp-cam-ig-bio-25mj-22", 
    courseId: "bio-cie", 
    courseName: "Cambridge IGCSE Biology (0610 / 0590)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Biology", 
    subjectCode: "0610", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 22 — Multiple Choice (Extended)", 
    qpUrl: "https://example.com/cambridge/0610_s25_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/0610_s25_ms_22.pdf" 
  },
  { 
    id: "pp-cam-ig-bio-25mj-42", 
    courseId: "bio-cie", 
    courseName: "Cambridge IGCSE Biology (0610 / 0590)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Biology", 
    subjectCode: "0610", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 42 — Theory (Extended)", 
    qpUrl: "https://example.com/cambridge/0610_s25_qp_42.pdf", 
    msUrl: "https://example.com/cambridge/0610_s25_ms_42.pdf" 
  },
  { 
    id: "pp-cam-ig-phys-25mj-42", 
    courseId: "phys-cie-0625", 
    courseName: "Cambridge IGCSE Physics (0625)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Physics", 
    subjectCode: "0625", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 42 — Theory (Extended)", 
    qpUrl: "https://example.com/cambridge/0625_s25_qp_42.pdf", 
    msUrl: "https://example.com/cambridge/0625_s25_ms_42.pdf" 
  },
  { 
    id: "pp-cam-ig-addmath-25mj-12", 
    courseId: "math-cie-0606", 
    courseName: "Cambridge IGCSE Additional Mathematics (0606)", 
    board: "Cambridge", 
    category: "IGCSE", 
    subjectName: "Additional Mathematics", 
    subjectCode: "0606", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Pure & Applied Maths", 
    qpUrl: "https://example.com/cambridge/0606_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/0606_s25_ms_12.pdf" 
  },

  // Cambridge -> A-levels
  { 
    id: "pp-cam-al-chem-25mj-12", 
    courseId: "chem-as", 
    courseName: "A-Level Chemistry (9701) — AS Level", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Chemistry (AS)", 
    subjectCode: "9701", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Multiple Choice (AS)", 
    qpUrl: "https://example.com/cambridge/9701_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/9701_s25_ms_12.pdf" 
  },
  { 
    id: "pp-cam-al-chem-25mj-22", 
    courseId: "chem-as", 
    courseName: "A-Level Chemistry (9701) — AS Level", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Chemistry (AS)", 
    subjectCode: "9701", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 22 — AS Level Structured Questions", 
    qpUrl: "https://example.com/cambridge/9701_s25_qp_22.pdf", 
    msUrl: "https://example.com/cambridge/9701_s25_ms_22.pdf" 
  },
  { 
    id: "pp-cam-al-chem-24on-12", 
    courseId: "chem-as", 
    courseName: "A-Level Chemistry (9701) — AS Level", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Chemistry (AS)", 
    subjectCode: "9701", 
    session: "Oct/Nov 2024", 
    year: 2024, 
    paper: "Paper 12 — Multiple Choice (AS)", 
    qpUrl: "https://example.com/cambridge/9701_w24_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/9701_w24_ms_12.pdf" 
  },
  { 
    id: "pp-cam-al-chem-25mj-42", 
    courseId: "chem-a2", 
    courseName: "A-Level Chemistry (9701) — A2 Level", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Chemistry (A2)", 
    subjectCode: "9701", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 42 — A Level Structured Questions", 
    qpUrl: "https://example.com/cambridge/9701_s25_qp_42.pdf", 
    msUrl: "https://example.com/cambridge/9701_s25_ms_42.pdf" 
  },
  { 
    id: "pp-cam-al-chem-25mj-52", 
    courseId: "chem-a2", 
    courseName: "A-Level Chemistry (9701) — A2 Level", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Chemistry (A2)", 
    subjectCode: "9701", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 52 — Planning, Analysis and Evaluation", 
    qpUrl: "https://example.com/cambridge/9701_s25_qp_52.pdf", 
    msUrl: "https://example.com/cambridge/9701_s25_ms_52.pdf" 
  },
  { 
    id: "pp-cam-al-phys-25mj-12", 
    courseId: "phys-cie-9702", 
    courseName: "A-Level Physics (9702)", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Physics", 
    subjectCode: "9702", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Multiple Choice (AS)", 
    qpUrl: "https://example.com/cambridge/9702_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/9702_s25_ms_12.pdf" 
  },
  { 
    id: "pp-cam-al-math-25mj-12", 
    courseId: "math-cie-9709", 
    courseName: "A-Level Mathematics (9709)", 
    board: "Cambridge", 
    category: "A-levels", 
    subjectName: "Mathematics", 
    subjectCode: "9709", 
    session: "May/June 2025", 
    year: 2025, 
    paper: "Paper 12 — Pure Mathematics 1 (P1)", 
    qpUrl: "https://example.com/cambridge/9709_s25_qp_12.pdf", 
    msUrl: "https://example.com/cambridge/9709_s25_ms_12.pdf" 
  },

  // Edexcel -> IGCSE
  { 
    id: "pp-edx-ig-bio-25j-1b", 
    courseId: "bio-edx", 
    courseName: "Edexcel IGCSE Biology (4BI1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Biology", 
    subjectCode: "4BI1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 1B — Biology", 
    qpUrl: "https://example.com/edexcel/4BI1_01_que_20250606.pdf", 
    msUrl: "https://example.com/edexcel/4BI1_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ig-bio-25j-2b", 
    courseId: "bio-edx", 
    courseName: "Edexcel IGCSE Biology (4BI1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Biology", 
    subjectCode: "4BI1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 2B — Biology", 
    qpUrl: "https://example.com/edexcel/4BI1_02_que_20250613.pdf", 
    msUrl: "https://example.com/edexcel/4BI1_02_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ig-bio-25jan-1b", 
    courseId: "bio-edx", 
    courseName: "Edexcel IGCSE Biology (4BI1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Biology", 
    subjectCode: "4BI1", 
    session: "January 2025", 
    year: 2025, 
    paper: "Paper 1B — Biology", 
    qpUrl: "https://example.com/edexcel/4BI1_01_que_20250110.pdf", 
    msUrl: "https://example.com/edexcel/4BI1_01_msc_20250306.pdf" 
  },
  { 
    id: "pp-edx-ig-chem-25j-1c", 
    courseId: "chem-edx-4ch1", 
    courseName: "Edexcel IGCSE Chemistry (4CH1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Chemistry", 
    subjectCode: "4CH1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 1C — Chemistry", 
    qpUrl: "https://example.com/edexcel/4CH1_01_que_20250520.pdf", 
    msUrl: "https://example.com/edexcel/4CH1_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ig-chem-25j-2c", 
    courseId: "chem-edx-4ch1", 
    courseName: "Edexcel IGCSE Chemistry (4CH1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Chemistry", 
    subjectCode: "4CH1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 2C — Chemistry", 
    qpUrl: "https://example.com/edexcel/4CH1_02_que_20250610.pdf", 
    msUrl: "https://example.com/edexcel/4CH1_02_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ig-phys-25j-1p", 
    courseId: "phys-edx-4ph1", 
    courseName: "Edexcel IGCSE Physics (4PH1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Physics", 
    subjectCode: "4PH1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 1P — Physics", 
    qpUrl: "https://example.com/edexcel/4PH1_01_que_20250522.pdf", 
    msUrl: "https://example.com/edexcel/4PH1_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ig-math-25j-1", 
    courseId: "math-edx-4pm1", 
    courseName: "Edexcel IGCSE Further Pure Mathematics (4PM1)", 
    board: "Edexcel", 
    category: "IGCSE", 
    subjectName: "Further Pure Maths", 
    subjectCode: "4PM1", 
    session: "June 2025", 
    year: 2025, 
    paper: "Paper 1 — Further Pure Mathematics", 
    qpUrl: "https://example.com/edexcel/4PM1_01_que_20250604.pdf", 
    msUrl: "https://example.com/edexcel/4PM1_01_msc_20250821.pdf" 
  },

  // Edexcel -> IAL
  { 
    id: "pp-edx-ial-chem-25j-u1", 
    courseId: "ial-chem-wch11", 
    courseName: "Edexcel IAL Chemistry (WCH11)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Chemistry (Unit 1)", 
    subjectCode: "WCH11", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit 1 — Structure, Bonding & Intro Organic (WCH11/01)", 
    qpUrl: "https://example.com/edexcel/WCH11_01_que_20250519.pdf", 
    msUrl: "https://example.com/edexcel/WCH11_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ial-chem-25j-u2", 
    courseId: "ial-chem-wch11", 
    courseName: "Edexcel IAL Chemistry (WCH12)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Chemistry (Unit 2)", 
    subjectCode: "WCH12", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit 2 — Energetics, Group 2 & 7 (WCH12/01)", 
    qpUrl: "https://example.com/edexcel/WCH12_01_que_20250602.pdf", 
    msUrl: "https://example.com/edexcel/WCH12_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ial-chem-25jan-u1", 
    courseId: "ial-chem-wch11", 
    courseName: "Edexcel IAL Chemistry (WCH11)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Chemistry (Unit 1)", 
    subjectCode: "WCH11", 
    session: "January 2025", 
    year: 2025, 
    paper: "Unit 1 — Structure, Bonding & Intro Organic (WCH11/01)", 
    qpUrl: "https://example.com/edexcel/WCH11_01_que_20250108.pdf", 
    msUrl: "https://example.com/edexcel/WCH11_01_msc_20250306.pdf" 
  },
  { 
    id: "pp-edx-ial-puremath-25j-p1", 
    courseId: "ial-pure-wma11", 
    courseName: "Edexcel IAL Pure Mathematics 1 (WMA11)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Pure Mathematics (P1)", 
    subjectCode: "WMA11", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit P1 — Pure Mathematics 1 (WMA11/01)", 
    qpUrl: "https://example.com/edexcel/WMA11_01_que_20250514.pdf", 
    msUrl: "https://example.com/edexcel/WMA11_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ial-puremath-25j-p2", 
    courseId: "ial-pure-wma11", 
    courseName: "Edexcel IAL Pure Mathematics 2 (WMA12)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Pure Mathematics (P2)", 
    subjectCode: "WMA12", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit P2 — Pure Mathematics 2 (WMA12/01)", 
    qpUrl: "https://example.com/edexcel/WMA12_01_que_20250529.pdf", 
    msUrl: "https://example.com/edexcel/WMA12_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ial-phys-25j-u1", 
    courseId: "ial-phys-wph11", 
    courseName: "Edexcel IAL Physics (WPH11)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Physics (Unit 1)", 
    subjectCode: "WPH11", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit 1 — Mechanics and Materials (WPH11/01)", 
    qpUrl: "https://example.com/edexcel/WPH11_01_que_20250521.pdf", 
    msUrl: "https://example.com/edexcel/WPH11_01_msc_20250821.pdf" 
  },
  { 
    id: "pp-edx-ial-m1-25j", 
    courseId: "ial-m1-wme01", 
    courseName: "Edexcel IAL Mechanics 1 (WME01)", 
    board: "Edexcel", 
    category: "IAL", 
    subjectName: "Mechanics 1 (M1)", 
    subjectCode: "WME01", 
    session: "June 2025", 
    year: 2025, 
    paper: "Unit M1 — Mechanics 1 (WME01/01)", 
    qpUrl: "https://example.com/edexcel/WME01_01_que_20250605.pdf", 
    msUrl: "https://example.com/edexcel/WME01_01_msc_20250821.pdf" 
  }
];

export const initialBilling: BillingInfo = {
  planName: "Full Course Bundle — A-Level Chemistry + IGCSE/Edexcel Biology",
  amount: "৳6,500 / month",
  nextRenewal: isoAt(21, 0, 0),
  status: "active",
  invoices: [
    { id: "INV-1042", date: isoAt(-9, 0, 0), description: "Monthly tuition — August 2026", amount: "৳6,500", status: "paid", orderUrl: "#" },
    { id: "INV-1031", date: isoAt(-39, 0, 0), description: "Monthly tuition — July 2026", amount: "৳6,500", status: "paid", orderUrl: "#" },
    { id: "INV-1019", date: isoAt(-70, 0, 0), description: "Monthly tuition — June 2026", amount: "৳6,500", status: "paid", orderUrl: "#" },
    { id: "INV-1006", date: isoAt(-101, 0, 0), description: "Monthly tuition — May 2026", amount: "৳6,500", status: "refunded", orderUrl: "#" },
    { id: "INV-0994", date: isoAt(-132, 0, 0), description: "Enrollment — Registration fee", amount: "৳1,500", status: "paid", orderUrl: "#" }
  ]
};

export const currentTeacherProfile: Teacher = {
  id: "t1",
  name: "Mr. Tanvir Ahmed",
  role: "Lead Instructor",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  email: "tanvir.ahmed@mindarcbd.com",
  qualification: "M.Sc. Chemistry (DU), Ex-Notre Dame College Faculty (14+ Yrs Teaching)",
  bio: "Lead CAIE & Pearson Edexcel Chemistry specialist. Author of Mind Arc Comprehensive A-Level Problem Solving Handbooks."
};

export const initialLectureSheets: LectureSheet[] = [
  {
    id: "ls-1",
    courseId: "chem-as",
    courseName: "A-Level Chemistry (9701) — AS Level",
    title: "Unit 3 — Advanced Reaction Kinetics & Rate Equations Master Sheet",
    topic: "Reaction Kinetics & Orders",
    uploadedBy: "Mr. Tanvir Ahmed (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "4.8 MB",
    downloads: 142,
    uploadedAt: isoAt(-2, 14, 30),
    board: "Cambridge",
    category: "A-Level"
  },
  {
    id: "ls-2",
    courseId: "chem-as",
    courseName: "A-Level Chemistry (9701) — AS Level",
    title: "Master Formula & Definition Booklet (2026 Cambridge 9701 Spec)",
    topic: "Complete Syllabus Reference",
    uploadedBy: "Mind Arc Academic Admin",
    uploaderRole: "admin",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "8.2 MB",
    downloads: 389,
    uploadedAt: isoAt(-10, 10, 0),
    board: "Cambridge",
    category: "A-Level"
  },
  {
    id: "ls-3",
    courseId: "chem-a2",
    courseName: "A-Level Chemistry (9701) — A2 Level",
    title: "Benzene & Aromatic Substitution Mechanism Slides",
    topic: "Organic Chemistry Mechanisms",
    uploadedBy: "Mr. Tanvir Ahmed (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "Slides",
    fileSize: "12.4 MB",
    downloads: 98,
    uploadedAt: isoAt(-3, 16, 0),
    board: "Cambridge",
    category: "A-Level"
  },
  {
    id: "ls-4",
    courseId: "chem-cie-olevel",
    courseName: "O-Level Chemistry (5070)",
    title: "Periodic Trends & Group VII Halogens Structured Worksheet",
    topic: "Inorganic Periodic Table",
    uploadedBy: "Mr. Tanvir Ahmed (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "Worksheet",
    fileSize: "2.1 MB",
    downloads: 215,
    uploadedAt: isoAt(-5, 11, 20),
    board: "Cambridge",
    category: "O-Levels"
  },
  {
    id: "ls-5",
    courseId: "ial-chem-wch11",
    courseName: "Edexcel IAL Chemistry (Units 1, 2 & 3)",
    title: "Edexcel IAL Unit 1 Bonding & Energetics Solved Master Sheet",
    topic: "Lattice Enthalpy & Hess Cycle",
    uploadedBy: "Mind Arc Academic Admin",
    uploaderRole: "admin",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "6.5 MB",
    downloads: 164,
    uploadedAt: isoAt(-7, 9, 15),
    board: "Edexcel",
    category: "IAL"
  },
  {
    id: "ls-6",
    courseId: "bio-edx",
    courseName: "Edexcel IGCSE Biology (4BI1)",
    title: "Human Digestive System & Enzyme Catalysis Summary Notes",
    topic: "Animal Physiology & Nutrition",
    uploadedBy: "Ms. Nusrat Jahan (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "3.9 MB",
    downloads: 188,
    uploadedAt: isoAt(-1, 15, 0),
    board: "Edexcel",
    category: "IGCSE"
  },
  {
    id: "ls-7",
    courseId: "ial-p1-wma11",
    courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)",
    title: "Integration & Calculus Master Formula Sheet with Worked Examples",
    topic: "Calculus & Integration Techniques",
    uploadedBy: "Engr. Rezaul Karim (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "5.4 MB",
    downloads: 276,
    uploadedAt: isoAt(-2, 10, 0),
    board: "Edexcel",
    category: "IAL"
  },
  {
    id: "ls-8",
    courseId: "bio-edx",
    courseName: "Edexcel IGCSE Biology (4BI1)",
    title: "Plant Physiology & Photosynthesis Master Question Bank",
    topic: "Plant Transport & Ecology",
    uploadedBy: "Ms. Nusrat Jahan (Lead Faculty)",
    uploaderRole: "teacher",
    fileUrl: "#",
    fileType: "Worksheet",
    fileSize: "2.8 MB",
    downloads: 145,
    uploadedAt: isoAt(-4, 12, 0),
    board: "Edexcel",
    category: "IGCSE"
  }
];

export const initialWeeklyAssessments: WeeklyAssessment[] = [
  {
    id: "wa-1",
    courseId: "chem-as",
    courseName: "A-Level Chemistry (9701) — AS Level",
    board: "Cambridge",
    category: "A-Level",
    title: "Weekly Assessment #4 — Enthalpy Changes & Hess Cycle Drill",
    topic: "Thermochemistry & Calorimetry Calculations",
    weekNumber: 4,
    durationMin: 45,
    totalMarks: 30,
    assignedBy: "Mr. Tanvir Ahmed",
    assignedByAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    assignedByRole: "Lead Chemistry Faculty",
    dueDate: isoAt(2, 23, 59),
    allowedFormats: ['PDF', 'DOC', 'DOCX'],
    instructions: "Answer all 4 structured calculation questions on lined paper. Show all derivation steps with appropriate thermodynamic units (kJ/mol). Upload as a clean Word document (.doc/.docx) or scanned PDF.",
    assessmentType: "mixed",
    questionPdfUrl: "#",
    teacherPrompt: "Ensure all bond energy calculations in Question 2 account for state changes from standard states. Remember: ΔH = Σ(bonds broken) - Σ(bonds formed).",
    attachments: [
      {
        id: "att-1a",
        type: "pdf",
        fileName: "9701_AS_Chem_WA4_Question_Paper.pdf",
        fileSize: "2.4 MB",
        fileUrl: "#",
        uploadedAt: isoAt(-1, 12, 0)
      },
      {
        id: "att-1b",
        type: "docx",
        fileName: "9701_AS_Chem_WA4_Editable_Answer_Sheet.docx",
        fileSize: "680 KB",
        fileUrl: "#",
        uploadedAt: isoAt(-1, 12, 0)
      }
    ],
    status: "active",
    submissionsCount: 18,
    totalStudents: 24,
    submissions: [
      {
        id: "sub-1",
        assessmentId: "wa-1",
        studentId: "std-001",
        studentName: "Safwan Al-Mahdi",
        studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        submittedAt: isoAt(-1, 21, 15),
        status: "graded",
        fileName: "Safwan_AlMahdi_Chem_WA4_HessCycles.pdf",
        fileType: "PDF",
        fileSize: "2.4 MB",
        marksObtained: 28,
        grade: "Grade 9 / A*",
        feedback: "Outstanding work on the Hess Cycle energy diagram! Take care with the negative sign in question 3(b) when calculating standard formation enthalpy.",
        gradedBy: "Mr. Tanvir Ahmed",
        gradedAt: isoAt(0, 10, 30)
      }
    ]
  },
  {
    id: "wa-2",
    courseId: "bio-cie",
    courseName: "O-Level Biology — Cambridge IGCSE (0590)",
    board: "Cambridge",
    category: "O-Levels",
    title: "Weekly Assessment #3 — Plant Transport & Transpiration Mechanisms",
    topic: "Xylem, Phloem & Environmental Factors on Transpiration",
    weekNumber: 3,
    durationMin: 40,
    totalMarks: 25,
    assignedBy: "Ms. Nusrat Jahan",
    assignedByAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    assignedByRole: "Senior Biology Faculty",
    dueDate: isoAt(3, 23, 59),
    allowedFormats: ['PDF', 'DOC', 'DOCX'],
    instructions: "Complete the photometer experiment data analysis and structured essay questions on potometer calibration. Upload as PDF or Word document before the deadline.",
    assessmentType: "file_upload",
    questionPdfUrl: "#",
    teacherPrompt: "Pay attention to the transpiration rate unit conversions (mm/min to cm³/hour) in table 3.2.",
    attachments: [
      {
        id: "att-2a",
        type: "pdf",
        fileName: "0590_Bio_WA3_Transpiration_Worksheet.pdf",
        fileSize: "1.8 MB",
        fileUrl: "#",
        uploadedAt: isoAt(-2, 16, 30)
      }
    ],
    status: "active",
    submissionsCount: 14,
    totalStudents: 26,
    submissions: []
  },
  {
    id: "wa-3",
    courseId: "chem-a2",
    courseName: "A-Level Chemistry (9701) — A2 Level",
    board: "Cambridge",
    category: "A-Level",
    title: "Weekly Assessment #5 — Direct Teacher Brief: Transition Metals & Complex Ions",
    topic: "Ligand Exchange & Colour Changes in Cobalt and Copper Ions",
    weekNumber: 5,
    durationMin: 50,
    totalMarks: 35,
    assignedBy: "Mr. Tanvir Ahmed",
    assignedByAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    assignedByRole: "Lead Chemistry Faculty",
    dueDate: isoAt(5, 23, 59),
    allowedFormats: ['PDF', 'DOC', 'DOCX'],
    instructions: "Read the teacher's direct message briefing below carefully. Answer both theoretical prompts and upload your handwritten scan or typed document.",
    assessmentType: "direct_message",
    teacherPrompt: "📝 DIRECT FACULTY BRIEFING:\n\n1. Explain in detail the split in 3d orbital energy levels when octahedral [Cu(H2O)6]2+ is formed compared to tetrahedral [CuCl4]2-.\n2. Write stepwise chemical equations and coordinate geometry changes when concentrated NH3(aq) is added dropwise until in excess to aqueous copper(II) sulfate.\n3. Draw the cis- and trans- stereoisomers of [Pt(NH3)2Cl2] and state their clinical significance in chemotherapy.",
    attachments: [
      {
        id: "att-3a",
        type: "direct_message",
        directMessageText: "Dear Students, please make sure to draw clear 3D wedge-and-dash bonds for octahedral and tetrahedral shapes. You can either type your answers directly in Word (.doc/.docx) or write on lined paper and scan as PDF.",
        uploadedAt: isoAt(-1, 15, 0)
      },
      {
        id: "att-3b",
        type: "doc",
        fileName: "9701_Transition_Metals_Template.doc",
        fileSize: "450 KB",
        fileUrl: "#",
        uploadedAt: isoAt(-1, 15, 0)
      }
    ],
    status: "active",
    submissionsCount: 9,
    totalStudents: 20,
    submissions: []
  },
  {
    id: "wa-4",
    courseId: "ial-chem-wch11",
    courseName: "Edexcel IAL Chemistry (Units 1, 2 & 3)",
    board: "Edexcel",
    category: "IAL",
    title: "Weekly Assessment #2 — Periodic Trends & First Ionisation Energy",
    topic: "Successive Ionisation Energies & Mass Spectrometry Isotopes",
    weekNumber: 2,
    durationMin: 35,
    totalMarks: 25,
    assignedBy: "Mr. Tanvir Ahmed",
    assignedByAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    assignedByRole: "Lead Chemistry Faculty",
    dueDate: isoAt(1, 23, 59),
    allowedFormats: ['PDF', 'DOC', 'DOCX'],
    instructions: "Analyze the graph of successive ionisation energies for element X. Identify the group and provide electron configurations.",
    assessmentType: "mixed",
    questionPdfUrl: "#",
    teacherPrompt: "Refer to the attached Question Paper PDF and Word document template. Ensure you justify why there is a huge jump between the 3rd and 4th ionisation energy values.",
    attachments: [
      {
        id: "att-4a",
        type: "pdf",
        fileName: "WCH11_Unit1_Assessment_PeriodicTrends.pdf",
        fileSize: "3.1 MB",
        fileUrl: "#",
        uploadedAt: isoAt(-2, 10, 0)
      },
      {
        id: "att-4b",
        type: "docx",
        fileName: "WCH11_Unit1_Student_Submission_Template.docx",
        fileSize: "520 KB",
        fileUrl: "#",
        uploadedAt: isoAt(-2, 10, 0)
      }
    ],
    status: "active",
    submissionsCount: 21,
    totalStudents: 25,
    submissions: []
  },
  {
    id: "wa-5",
    courseId: "math-wma11",
    courseName: "Edexcel IAL Pure Mathematics (P1–P4)",
    board: "Edexcel",
    category: "IAL",
    title: "Weekly Assessment #6 — Integration by Parts & Differential Equations",
    topic: "Definite Integrals & First-Order Differential Modelling",
    weekNumber: 6,
    durationMin: 60,
    totalMarks: 40,
    assignedBy: "Engr. Rezaul Karim",
    assignedByAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    assignedByRole: "Mathematics Lead Faculty",
    dueDate: isoAt(4, 23, 59),
    allowedFormats: ['PDF', 'DOC', 'DOCX'],
    instructions: "Solve all 6 integration proof problems with neat substitution notation. Export typed Word file or high resolution scan PDF.",
    assessmentType: "file_upload",
    teacherPrompt: "Show each stage of substitution explicitly. Don't omit integration constants (+C) in indefinite forms.",
    attachments: [
      {
        id: "att-5a",
        type: "pdf",
        fileName: "WMA11_P2_Integration_Worksheet.pdf",
        fileSize: "2.7 MB",
        fileUrl: "#",
        uploadedAt: isoAt(-3, 14, 0)
      },
      {
        id: "att-5b",
        type: "doc",
        fileName: "WMA11_Worked_Solutions_Format.doc",
        fileSize: "410 KB",
        fileUrl: "#",
        uploadedAt: isoAt(-3, 14, 0)
      }
    ],
    questionPdfUrl: "#",
    status: "active",
    submissionsCount: 11,
    totalStudents: 25,
    submissions: []
  }
];

export const initialClassSchedules: ClassScheduleItem[] = [
  {
    id: "sch-1",
    courseId: "bio-edx",
    courseName: "Edexcel IGCSE Biology (4BI1)",
    board: "Edexcel",
    category: "IGCSE",
    teacherName: "Ms. Nusrat Jahan",
    topic: "Module 5: Animal Physiology & Nutrition Live Practical Discussion",
    dayOfWeek: "Sunday & Tuesday",
    timeSlot: "06:00 PM – 07:15 PM BST",
    meetUrl: "https://meet.google.com/mindarc-bio-edx",
    isLiveNow: true,
    uploadedByAdmin: true
  },
  {
    id: "sch-2",
    courseId: "ial-p1-wma11",
    courseName: "Edexcel IAL Pure Mathematics 1 & 2 (P1/P2)",
    board: "Edexcel",
    category: "IAL",
    teacherName: "Engr. Rezaul Karim",
    topic: "Integration, Definite Integrals & Area Under Curves (Live Problem Solving)",
    dayOfWeek: "Monday & Thursday",
    timeSlot: "07:30 PM – 09:00 PM BST",
    meetUrl: "https://meet.google.com/mindarc-ial-math",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-3",
    courseId: "ial-chem-wch11",
    courseName: "Edexcel IAL Chemistry (Units 1, 2 & 3)",
    board: "Edexcel",
    category: "IAL",
    teacherName: "Mr. Tanvir Ahmed",
    topic: "Unit 2 — Energetics, Hess Law Cycles & Calculation Masterclass",
    dayOfWeek: "Wednesday & Saturday",
    timeSlot: "08:00 PM – 09:30 PM BST",
    meetUrl: "https://meet.google.com/mindarc-ial-chem",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-4",
    courseId: "bangla-edx",
    courseName: "Edexcel IGCSE Bangla (4BN1)",
    board: "Edexcel",
    category: "IGCSE",
    teacherName: "Prof. Anisur Rahman",
    topic: "Paper 1 Directed Writing & Grammatical Accuracy Workshop",
    dayOfWeek: "Tuesday & Friday",
    timeSlot: "05:00 PM – 06:30 PM BST",
    meetUrl: "https://meet.google.com/mindarc-bangla-edx",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-5",
    courseId: "chem-as",
    courseName: "A-Level Chemistry (9701) — AS Level",
    board: "Cambridge",
    category: "A-Level",
    teacherName: "Mr. Tanvir Ahmed",
    topic: "Equilibria, Le Chatelier & Kc Calculations (Live Drill)",
    dayOfWeek: "Tuesday & Thursday",
    timeSlot: "07:30 PM – 09:00 PM BST",
    meetUrl: "https://meet.google.com/mindarc-chem-as",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-6",
    courseId: "chem-a2",
    courseName: "A-Level Chemistry (9701) — A2 Level",
    board: "Cambridge",
    category: "A-Level",
    teacherName: "Mr. Tanvir Ahmed",
    topic: "NMR Spectroscopy Peak Splitting & Organic Analysis",
    dayOfWeek: "Monday & Wednesday",
    timeSlot: "08:00 PM – 09:30 PM BST",
    meetUrl: "https://meet.google.com/mindarc-chem-a2",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-7",
    courseId: "chem-cie-olevel",
    courseName: "O-Level Chemistry (5070)",
    board: "Cambridge",
    category: "O-Levels",
    teacherName: "Mr. Tanvir Ahmed",
    topic: "Acids, Bases & Salt Preparation Techniques",
    dayOfWeek: "Saturday & Sunday",
    timeSlot: "06:00 PM – 07:30 PM BST",
    meetUrl: "https://meet.google.com/mindarc-chem-olevel",
    isLiveNow: false,
    uploadedByAdmin: true
  },
  {
    id: "sch-8",
    courseId: "bio-cie",
    courseName: "O-Level Biology (5090 / 0590)",
    board: "Cambridge",
    category: "O-Levels",
    teacherName: "Ms. Nusrat Jahan",
    topic: "Human Circulatory System & Double Circulation",
    dayOfWeek: "Wednesday & Friday",
    timeSlot: "07:00 PM – 08:30 PM BST",
    meetUrl: "https://meet.google.com/mindarc-bio-cie",
    isLiveNow: false,
    uploadedByAdmin: true
  }
];

export const initialStudentDoubts: StudentDoubt[] = [
  {
    id: "dbt-1",
    studentName: "Safwan Al-Mahdi",
    studentId: "std-001",
    courseName: "A-Level Chemistry (9701)",
    topic: "Unit 3 Kinetics",
    question: "Sir, in question 4 of May/June 2024 Paper 22, why is the reaction zero order with respect to reactant B when B is in large excess?",
    askedAt: isoAt(0, 11, 20),
    status: "answered",
    answer: "Because when [B] is in massive excess, its concentration remains virtually constant during the progress of the reaction, so it merges into the observed rate constant k'.",
    answeredBy: "Mr. Tanvir Ahmed",
    answeredAt: isoAt(0, 12, 10)
  },
  {
    id: "dbt-2",
    studentName: "Areeb Rahman",
    studentId: "std-004",
    courseName: "A-Level Chemistry (9701)",
    topic: "Hess Cycle",
    question: "How do we decide whether combustion arrows go upwards or downwards in enthalpy cycles?",
    askedAt: isoAt(0, 14, 5),
    status: "pending"
  }
];

