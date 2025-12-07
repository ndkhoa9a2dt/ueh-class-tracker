import { EnglishLevel, Role, User, StudentProfile, LearningSession, ClassCourseInfo } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'student1',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@st.ueh.edu.vn',
    role: Role.STUDENT,
    avatarUrl: 'https://picsum.photos/200'
  },
  {
    id: 'u2',
    username: 'student2',
    fullName: 'Trần Thị B',
    email: 'tranthib@st.ueh.edu.vn',
    role: Role.STUDENT,
    avatarUrl: 'https://picsum.photos/201'
  },
  {
    id: 'a1',
    username: 'admin',
    fullName: 'Thầy Nguyễn (Admin)',
    email: 'admin@ueh.edu.vn',
    role: Role.ADMIN
  }
];

export const MOCK_PROFILES: Record<string, StudentProfile> = {
  'u1': {
    userId: 'u1',
    studentId: '31201020304',
    major: 'Kinh doanh Quốc tế',
    className: 'IB001',
    course: 'K46',
    currentLevel: EnglishLevel.B1,
    hasCertificate: true,
    certificateType: 'IELTS',
    certificateScore: '6.0'
  },
  'u2': {
    userId: 'u2',
    studentId: '31201020305',
    major: 'Marketing',
    className: 'MK002',
    course: 'K47',
    currentLevel: EnglishLevel.A2,
    hasCertificate: false,
    certificateType: '',
    certificateScore: ''
  }
};

export const MOCK_SESSIONS: LearningSession[] = [
  {
    id: 's1',
    userId: 'u1',
    date: '2023-10-01',
    durationHours: 2.5,
    progressNotes: 'Học 50 từ vựng mới về Kinh doanh.',
    difficulties: 'Phát âm từ "Entrepreneurship"',
    skillsImproved: ['Từ vựng', 'Đọc']
  },
  {
    id: 's2',
    userId: 'u1',
    date: '2023-10-03',
    durationHours: 1.0,
    progressNotes: 'Nghe BBC 6 Minute English.',
    difficulties: 'Tốc độ nói nhanh.',
    skillsImproved: ['Nghe']
  },
  {
    id: 's3',
    userId: 'u1',
    date: '2023-10-05',
    durationHours: 3.0,
    progressNotes: 'Viết bài luận về biến đổi khí hậu.',
    difficulties: 'Cấu trúc ngữ pháp cho câu phức.',
    skillsImproved: ['Viết', 'Ngữ pháp']
  },
  {
    id: 's4',
    userId: 'u2',
    date: '2023-10-02',
    durationHours: 1.5,
    progressNotes: 'Luyện tập hội thoại cơ bản.',
    difficulties: 'Thiếu tự tin khi nói.',
    skillsImproved: ['Nói']
  }
];

export const MOCK_CLASS_INFO: ClassCourseInfo[] = [
  {
    id: 'c1',
    className: 'IB001',
    courseName: 'Tiếng Anh Thương mại 2',
    description: 'Kỹ năng giao tiếp và viết trong kinh doanh nâng cao.',
    schedule: 'Thứ 2 - Thứ 4 (07:00 - 09:15)'
  }
];

export const SKILL_OPTIONS = ['Nghe', 'Nói', 'Đọc', 'Viết', 'Ngữ pháp', 'Từ vựng'];
export const API_URL = "https://script.google.com/macros/s/AKfycbx9TqzsHBiJYLF3aYTst5JCPTutPY1d-sMWeunKA10SrV55Bi35Lm4e4HaTA2G6c2knxA/exec"
