import React, { useState, useEffect } from 'react';
import { User, EnglishLevel, StudentProfile as IStudentProfile } from '../types';
import { dataService } from '../services/dataService';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Save, Check, Award } from 'lucide-react';

interface StudentProfileProps {
  user: User;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  const [formData, setFormData] = useState<Partial<IStudentProfile>>({
    studentId: '',
    major: '',
    className: '',
    course: '',
    currentLevel: EnglishLevel.A1,
    hasCertificate: false,
    certificateType: '',
    certificateScore: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const profile = dataService.getStudentProfile(user.id);
    if (profile) {
      setFormData(profile);
    }
  }, [user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      dataService.updateStudentProfile(user.id, formData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hồ sơ của tôi</h2>
        <p className="text-gray-500">Quản lý thông tin học tập và cấp độ tiếng Anh hiện tại.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cá nhân */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ueh-blue border-b pb-2">Thông tin Cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                 <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                   {user.fullName}
                 </div>
              </div>

              <Input
                label="Mã số sinh viên (MSSV)"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="VD: 312010..."
              />

              <Input
                label="Ngành học"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="VD: Kinh doanh Quốc tế"
              />

              <Input
                label="Lớp"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="VD: IB001"
              />

              <Input
                label="Khóa"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="VD: K46"
              />
            </div>
          </div>

          {/* Trình độ tiếng Anh & Chứng chỉ */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-ueh-blue border-b pb-2 flex items-center gap-2">
               <Award size={20} />
               Trình độ Tiếng Anh & Chứng chỉ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ hiện tại (Tự đánh giá/Lớp học)</label>
                <select
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ueh-blue focus:border-ueh-blue bg-white"
                >
                  {Object.values(EnglishLevel).map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Dựa trên bài kiểm tra gần nhất hoặc lớp đang học.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="hasCertificate" 
                        name="hasCertificate" 
                        checked={formData.hasCertificate} 
                        onChange={handleChange}
                        className="w-5 h-5 text-ueh-blue border-gray-300 rounded focus:ring-ueh-blue"
                    />
                    <label htmlFor="hasCertificate" className="font-medium text-gray-800">Tôi đã có chứng chỉ Tiếng Anh (IELTS, TOEIC, VSTEP...)</label>
                </div>

                {formData.hasCertificate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-in fade-in slide-in-from-top-2">
                        <Input
                            label="Loại chứng chỉ"
                            name="certificateType"
                            value={formData.certificateType}
                            onChange={handleChange}
                            placeholder="VD: IELTS Academic"
                        />
                        <Input
                            label="Điểm số / Kết quả"
                            name="certificateScore"
                            value={formData.certificateScore}
                            onChange={handleChange}
                            placeholder="VD: 6.5"
                        />
                    </div>
                )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {success ? (
                <span className="text-green-600 flex items-center gap-2 font-medium">
                    <Check size={18} />
                    Cập nhật thành công!
                </span>
            ) : <span></span>}
            
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfile;