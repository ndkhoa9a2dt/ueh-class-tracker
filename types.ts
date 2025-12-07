export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface StudentProfile {
  userId: string;
  studentId: string; // MSSV
  major: string;
  className: string;
  course: string; // Khoa
  currentLevel: EnglishLevel;
  // New fields for certificates
  hasCertificate: boolean;
  certificateType?: string; // e.g. 'IELTS', 'TOEIC', 'VSTEP'
  certificateScore?: string;
}

export interface LearningSession {
  id: string;
  userId: string;
  date: string; // ISO Date string
  durationHours: number;
  progressNotes: string;
  difficulties: string;
  skillsImproved: string[]; // e.g., ['Listening', 'Speaking']
}

export interface ClassCourseInfo {
  id: string;
  className: string;
  courseName: string;
  description: string;
  schedule: string;
}

export type ViewState = 'LOGIN' | 'STUDENT_DASHBOARD' | 'STUDENT_PROFILE' | 'ADMIN_DASHBOARD';