import React, { useState, useEffect, useMemo } from 'react';
import { User, LearningSession, ClassCourseInfo } from '../types';
import { dataService } from '../services/dataService';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { SKILL_OPTIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertCircle, BookOpen, Plus, Award } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [profile, setProfile] = useState(dataService.getStudentProfile(user.id));
  const [classInfo, setClassInfo] = useState<ClassCourseInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    durationHours: 1,
    progressNotes: '',
    difficulties: '',
    skillsImproved: [] as string[]
  });

  useEffect(() => {
    setSessions(dataService.getLearningSessions(user.id));
    if (profile) {
        setClassInfo(dataService.getClassInfo(profile.className));
    }
  }, [user.id, profile]);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const added = dataService.addLearningSession({
      userId: user.id,
      ...newSession
    });
    setSessions(prev => [added, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsModalOpen(false);
    // Reset form
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      durationHours: 1,
      progressNotes: '',
      difficulties: '',
      skillsImproved: []
    });
  };

  const toggleSkill = (skill: string) => {
    setNewSession(prev => {
      const exists = prev.skillsImproved.includes(skill);
      if (exists) return { ...prev, skillsImproved: prev.skillsImproved.filter(s => s !== skill) };
      return { ...prev, skillsImproved: [...prev.skillsImproved, skill] };
    });
  };

  // Chart Data Preparation
  const chartData = useMemo(() => {
    // Group by date (simplified) or last 7 sessions
    return sessions.slice(0, 7).reverse().map(s => ({
      date: new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit'}),
      hours: s.durationHours
    }));
  }, [sessions]);

  const totalHours = sessions.reduce((acc, curr) => acc + curr.durationHours, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-ueh-blue text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-ueh-lightBlue text-sm font-medium">Tổng giờ học</p>
              <h3 className="text-2xl font-bold">{totalHours.toFixed(1)} giờ</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Level hiện tại</p>
              <h3 className="text-2xl font-bold text-gray-800">{profile?.currentLevel || 'N/A'}</h3>
            </div>
          </div>
        </Card>
        <Card>
           <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <BookOpen size={24} />
            </div>
             <div>
              <p className="text-gray-500 text-sm font-medium">Lớp học</p>
              <h3 className="text-xl font-bold text-gray-800">{profile?.className || 'N/A'}</h3>
            </div>
           </div>
        </Card>
        <Card className="flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors border-dashed border-2 border-ueh-blue/30" onClick={() => setIsModalOpen(true)}>
             <div className="flex items-center gap-2 text-ueh-blue font-semibold">
                <Plus size={20} />
                <span>Ghi nhật ký học</span>
             </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Tiến độ học tập (7 lần gần nhất)">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="hours" fill="#0056b3" radius={[4, 4, 0, 0]} barSize={40} name="Số giờ" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Nhật ký hoạt động gần đây">
             {sessions.length === 0 ? (
                 <div className="text-center py-8 text-gray-500">
                     Chưa có nhật ký nào. Hãy bắt đầu ghi lại quá trình học của bạn!
                 </div>
             ) : (
                 <div className="space-y-4">
                     {sessions.map(session => (
                         <div key={session.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                             <div className="flex-shrink-0 text-center px-2">
                                 <div className="text-xs text-gray-500 uppercase font-bold">Tháng {new Date(session.date).getMonth() + 1}</div>
                                 <div className="text-xl font-bold text-ueh-blue">{new Date(session.date).getDate()}</div>
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between items-start mb-2">
                                     <h4 className="font-semibold text-gray-800">{session.durationHours} giờ</h4>
                                     <div className="flex gap-1">
                                         {session.skillsImproved.map(skill => (
                                             <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{skill}</span>
                                         ))}
                                     </div>
                                 </div>
                                 <p className="text-gray-600 text-sm mb-2">{session.progressNotes}</p>
                                 {session.difficulties && (
                                     <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
                                         <AlertCircle size={14} className="mt-0.5" />
                                         <span>{session.difficulties}</span>
                                     </div>
                                 )}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card title="Thông tin lớp học">
              {classInfo ? (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Tên học phần</label>
                          <p className="text-gray-900 font-medium">{classInfo.courseName}</p>
                      </div>
                      <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Lịch học</label>
                          <p className="text-gray-900">{classInfo.schedule}</p>
                      </div>
                       <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Mô tả</label>
                          <p className="text-gray-600 text-sm">{classInfo.description}</p>
                      </div>
                  </div>
              ) : (
                  <p className="text-gray-500 text-sm">Chưa có thông tin lớp học.</p>
              )}
          </Card>
          
          <Card title="Trạng thái chứng chỉ">
            {profile?.hasCertificate ? (
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">{profile.certificateType}</p>
                        <p className="text-gray-600">Kết quả: <span className="font-semibold text-ueh-blue">{profile.certificateScore}</span></p>
                        <p className="text-xs text-green-600 mt-1">Đã xác nhận</p>
                    </div>
                 </div>
            ) : (
                <div className="text-center py-2">
                    <p className="text-gray-500 text-sm mb-2">Bạn chưa cập nhật chứng chỉ Tiếng Anh.</p>
                    <p className="text-xs text-gray-400">Vào mục Hồ sơ cá nhân để cập nhật nếu đã có.</p>
                </div>
            )}
          </Card>

          <Card title="Mẹo học tập">
             <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                 <li>Cố gắng học ít nhất 15 phút mỗi ngày.</li>
                 <li>Tập trung vào <b>{profile?.currentLevel === 'A1' ? 'Từ vựng' : 'Kỹ năng Nghe'}</b> để cải thiện trình độ {profile?.currentLevel}.</li>
                 <li>Ghi lại những khó khăn để theo dõi sự tiến bộ.</li>
             </ul>
          </Card>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Ghi nhật ký học tập</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleAddSession} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    type="date" 
                    label="Ngày" 
                    value={newSession.date} 
                    onChange={e => setNewSession({...newSession, date: e.target.value})}
                    required
                />
                <Input 
                    type="number" 
                    label="Thời lượng (Giờ)" 
                    step="0.5"
                    min="0.5"
                    value={newSession.durationHours} 
                    onChange={e => setNewSession({...newSession, durationHours: parseFloat(e.target.value)})}
                    required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng cải thiện</label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        newSession.skillsImproved.includes(skill)
                          ? 'bg-ueh-blue text-white border-ueh-blue'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-ueh-blue'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bạn đã học được gì?</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ueh-blue focus:outline-none"
                    rows={3}
                    placeholder="VD: Học 20 động từ mới, luyện thì quá khứ..."
                    value={newSession.progressNotes}
                    onChange={e => setNewSession({...newSession, progressNotes: e.target.value})}
                    required
                  ></textarea>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khó khăn gặp phải</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:outline-none"
                    rows={2}
                    placeholder="VD: Khó phát âm âm đuôi..."
                    value={newSession.difficulties}
                    onChange={e => setNewSession({...newSession, difficulties: e.target.value})}
                  ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button type="submit">Lưu nhật ký</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;