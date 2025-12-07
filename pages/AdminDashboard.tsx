import React, { useState, useMemo } from 'react';
import { dataService } from '../services/dataService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Download, Filter, Search, User as UserIcon, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('Tất cả');
  
  const allStudents = dataService.getAllStudents();
  
  // Stats
  const stats = useMemo(() => {
    const studentsWithCert = allStudents.filter(s => s.profile?.hasCertificate);
    return {
      totalStudents: allStudents.length,
      totalHours: allStudents.reduce((acc, curr) => acc + curr.totalHours, 0),
      avgHours: allStudents.length ? (allStudents.reduce((acc, curr) => acc + curr.totalHours, 0) / allStudents.length).toFixed(1) : 0,
      totalCertificates: studentsWithCert.length,
      certificateRate: allStudents.length ? Math.round((studentsWithCert.length / allStudents.length) * 100) : 0
    };
  }, [allStudents]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = filterClass === 'Tất cả' || student.profile?.className === filterClass;
      return matchSearch && matchClass;
    });
  }, [allStudents, searchTerm, filterClass]);

  // Chart Data: Avg hours per Level
  const levelData = useMemo(() => {
      const levels: Record<string, { total: number, count: number }> = {};
      allStudents.forEach(s => {
          const lvl = s.profile?.currentLevel || 'Không rõ';
          if (!levels[lvl]) levels[lvl] = { total: 0, count: 0 };
          levels[lvl].total += s.totalHours;
          levels[lvl].count += 1;
      });
      
      return Object.keys(levels).map(key => ({
          name: key,
          avgHours: parseFloat((levels[key].total / levels[key].count).toFixed(1))
      }));
  }, [allStudents]);

  // Chart Data: Certificate Status
  const certificateData = useMemo(() => {
    const hasCert = allStudents.filter(s => s.profile?.hasCertificate).length;
    const noCert = allStudents.length - hasCert;
    return [
        { name: 'Đã có chứng chỉ', value: hasCert },
        { name: 'Chưa có', value: noCert }
    ];
  }, [allStudents]);

  const COLORS = ['#28a745', '#e9ecef'];

  const uniqueClasses = Array.from(new Set(allStudents.map(s => s.profile?.className).filter(Boolean)));

  const handleExport = () => {
      // Simulate CSV export
      const headers = "ID,HoTen,Lop,Level,ChungChi,LoaiChungChi,Diem,TongGioHoc\n";
      const rows = filteredStudents.map(s => 
        `${s.id},${s.fullName},${s.profile?.className || ''},${s.profile?.currentLevel || ''},${s.profile?.hasCertificate ? 'Co' : 'Khong'},${s.profile?.certificateType || ''},${s.profile?.certificateScore || ''},${s.totalHours}`
      ).join("\n");
      
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ueh-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Dashboard Quản trị</h2>
           <p className="text-gray-500">Giám sát tiến độ học tập sinh viên UEH Phân hiệu Vĩnh Long.</p>
        </div>
        <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
            <Download size={18} />
            Xuất Báo cáo
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-l-4 border-ueh-blue">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">Tổng sinh viên</p>
                      <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
                  </div>
                  <UserIcon className="text-ueh-blue opacity-20" size={40} />
              </div>
          </Card>
          <Card className="bg-white border-l-4 border-ueh-green">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">Tổng giờ học</p>
                      <h3 className="text-2xl font-bold">{stats.totalHours}</h3>
                  </div>
                  <div className="text-ueh-green font-bold text-xl">∑</div>
              </div>
          </Card>
          <Card className="bg-white border-l-4 border-ueh-yellow">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">TB Giờ/Sinh viên</p>
                      <h3 className="text-2xl font-bold">{stats.avgHours}</h3>
                  </div>
                  <div className="text-ueh-yellow font-bold text-xl">x̄</div>
              </div>
          </Card>
          <Card className="bg-white border-l-4 border-purple-500">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">Đã có chứng chỉ</p>
                      <h3 className="text-2xl font-bold">{stats.totalCertificates} <span className="text-sm font-normal text-gray-400">({stats.certificateRate}%)</span></h3>
                  </div>
                  <Award className="text-purple-500 opacity-20" size={40} />
              </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table Area */}
          <div className="lg:col-span-2">
              <Card title="Danh sách Sinh viên">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Tìm theo tên..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ueh-blue"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="relative">
                          <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          <select 
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ueh-blue bg-white appearance-none"
                            value={filterClass}
                            onChange={e => setFilterClass(e.target.value)}
                          >
                              <option value="Tất cả">Tất cả lớp</option>
                              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                              <tr>
                                  <th className="px-4 py-3">Sinh viên</th>
                                  <th className="px-4 py-3">Lớp</th>
                                  <th className="px-4 py-3">Level</th>
                                  <th className="px-4 py-3">Chứng chỉ</th>
                                  <th className="px-4 py-3 text-right">Giờ tích lũy</th>
                                  <th className="px-4 py-3 text-center">Thao tác</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {filteredStudents.length > 0 ? (
                                  filteredStudents.map(student => (
                                      <tr key={student.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3">
                                              <div className="font-medium text-gray-900">{student.fullName}</div>
                                              <div className="text-xs text-gray-500">{student.profile?.studentId || 'Chưa có ID'}</div>
                                          </td>
                                          <td className="px-4 py-3">{student.profile?.className || '-'}</td>
                                          <td className="px-4 py-3">
                                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                                  {student.profile?.currentLevel || 'N/A'}
                                              </span>
                                          </td>
                                          <td className="px-4 py-3">
                                              {student.profile?.hasCertificate ? (
                                                  <div>
                                                      <span className="text-green-600 font-semibold text-xs border border-green-200 bg-green-50 px-2 py-0.5 rounded-full">Đã có</span>
                                                      <div className="text-xs text-gray-500 mt-0.5">{student.profile.certificateType} ({student.profile.certificateScore})</div>
                                                  </div>
                                              ) : (
                                                  <span className="text-gray-400 text-xs">Chưa có</span>
                                              )}
                                          </td>
                                          <td className="px-4 py-3 text-right font-medium">{student.totalHours}</td>
                                          <td className="px-4 py-3 text-center">
                                              <button className="text-ueh-blue hover:underline text-xs">Chi tiết</button>
                                          </td>
                                      </tr>
                                  ))
                              ) : (
                                  <tr>
                                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                          Không tìm thấy sinh viên phù hợp.
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </Card>
          </div>

          {/* Stats Column */}
          <div className="space-y-6">
               <Card title="Tỷ lệ có chứng chỉ">
                  <div className="h-64 w-full flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={certificateData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {certificateData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                  </div>
              </Card>

              <Card title="TB Giờ học theo Level">
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={levelData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="avgHours" fill="#20c997" radius={[4, 4, 0, 0]} name="Giờ trung bình" />
                        </BarChart>
                      </ResponsiveContainer>
                  </div>
              </Card>

              <Card title="Cảnh báo học tập">
                  <div className="space-y-3">
                     {allStudents.filter(s => s.totalHours < 2).map(s => (
                         <div key={s.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg text-sm">
                             <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                             <div>
                                 <span className="font-semibold text-gray-800">{s.fullName}</span> có hoạt động thấp ({s.totalHours} giờ).
                             </div>
                         </div>
                     ))}
                     {allStudents.filter(s => s.totalHours < 2).length === 0 && (
                         <p className="text-gray-500 text-sm">Không có cảnh báo. Sinh viên đang học tập tốt!</p>
                     )}
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;