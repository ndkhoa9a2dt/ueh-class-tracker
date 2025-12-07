import { User, StudentProfile, LearningSession, Role, ClassCourseInfo } from '../types';
import { MOCK_USERS, MOCK_PROFILES, MOCK_SESSIONS } from '../constants';

// URL của Google Apps Script Web App
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9TqzsHBiJYLF3aYTst5JCPTutPY1d-sMWeunKA10SrV55Bi35Lm4e4HaTA2G6c2knxA/exec";

// Hàm hỗ trợ gửi dữ liệu sang Google Sheet
// Sử dụng mode 'no-cors' và content-type 'text/plain' để tránh lỗi CORS preflight
const sendToGoogleSheet = async (action: string, data: any) => {
  try {
    const payload = {
      action: action,
      timestamp: new Date().toISOString(),
      data: data
    };

    // Chúng ta sử dụng fetch với no-cors. 
    // Lưu ý: no-cors sẽ không trả về nội dung response (opaque response), 
    // nhưng request vẫn được gửi đi thành công.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`[DataService] Đã gửi ${action} tới Google Sheet thành công.`);
  } catch (error) {
    console.error(`[DataService] Lỗi khi gửi dữ liệu tới Google Sheet:`, error);
  }
};

// Simple in-memory storage simulation (would use localStorage or API in real app)
// For this demo, we initialize with constants but allow runtime updates.

let users = [...MOCK_USERS];
let profiles = { ...MOCK_PROFILES };
let sessions = [...MOCK_SESSIONS];

export const authService = {
  login: (username: string): User | null => {
    // Simplified login - just matching username
    return users.find(u => u.username === username) || null;
  }
};

export const dataService = {
  getStudentProfile: (userId: string): StudentProfile | undefined => {
    return profiles[userId];
  },

  updateStudentProfile: (userId: string, updates: Partial<StudentProfile>) => {
    if (profiles[userId]) {
      profiles[userId] = { ...profiles[userId], ...updates };
    } else {
        // Create if not exists (edge case)
        profiles[userId] = {
            userId,
            studentId: '',
            major: '',
            className: '',
            course: '',
            currentLevel: updates.currentLevel || 'A1',
            ...updates
        } as StudentProfile;
    }

    // Gửi dữ liệu cập nhật profile lên Google Sheet
    sendToGoogleSheet('UPDATE_PROFILE', profiles[userId]);

    return profiles[userId];
  },

  getLearningSessions: (userId: string): LearningSession[] => {
    return sessions.filter(s => s.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getAllSessions: (): LearningSession[] => {
    return sessions;
  },

  getAllStudents: () => {
    return users.filter(u => u.role === Role.STUDENT).map(u => ({
        ...u,
        profile: profiles[u.id],
        totalHours: sessions.filter(s => s.userId === u.id).reduce((acc, curr) => acc + curr.durationHours, 0)
    }));
  },

  addLearningSession: (session: Omit<LearningSession, 'id'>) => {
    const newSession: LearningSession = {
      ...session,
      id: Math.random().toString(36).substring(7)
    };
    sessions = [newSession, ...sessions];
    
    // Gửi dữ liệu session mới lên Google Sheet
    // Kèm theo thông tin user để script dễ xử lý
    const userProfile = profiles[session.userId];
    const enrichedData = {
        ...newSession,
        studentName: userProfile ? MOCK_USERS.find(u => u.id === session.userId)?.fullName : 'Unknown',
        studentId: userProfile?.studentId || 'N/A',
        className: userProfile?.className || 'N/A'
    };

    sendToGoogleSheet('ADD_SESSION', enrichedData);

    return newSession;
  },
  
  getClassInfo: (className: string): ClassCourseInfo => {
      // Mock lookup
      return {
          id: 'mock-class-id',
          className: className,
          schedule: 'Thứ 2, Thứ 4 7:30 Sáng',
          courseName: 'Tiếng Anh Tổng Quát',
          description: 'Học phần này giúp sinh viên cải thiện kỹ năng giao tiếp và ngữ pháp.'
      }
  }
};