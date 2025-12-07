import React from 'react';
import { User, Role } from '../types';
import { LogOut, LayoutDashboard, UserCircle, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onChangeView }) => {
  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex flex-col justify-center">{children}</div>;
  }

  const isStudent = user.role === Role.STUDENT;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="bg-white border-r border-gray-200 md:w-64 flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ueh-blue rounded-lg flex items-center justify-center text-white font-bold">
              U
            </div>
            <h1 className="text-xl font-bold text-ueh-blue tracking-tight">UEH Mekong</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">English Tracker</p>
        </div>

        <nav className="p-4 space-y-2">
          {isStudent ? (
            <>
              <button
                onClick={() => onChangeView('STUDENT_DASHBOARD')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'STUDENT_DASHBOARD' ? 'bg-ueh-lightBlue text-ueh-blue font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard size={20} />
                Tổng quan
              </button>
              <button
                onClick={() => onChangeView('STUDENT_PROFILE')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'STUDENT_PROFILE' ? 'bg-ueh-lightBlue text-ueh-blue font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserCircle size={20} />
                Hồ sơ cá nhân
              </button>
            </>
          ) : (
            <button
              onClick={() => onChangeView('ADMIN_DASHBOARD')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'ADMIN_DASHBOARD' ? 'bg-ueh-lightBlue text-ueh-blue font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={20} />
              Quản trị viên
            </button>
          )}
          
          <div className="pt-8 mt-8 border-t border-gray-100">
             <div className="px-4 mb-4 flex items-center gap-3">
                 {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                 ) : (
                     <div className="w-8 h-8 rounded-full bg-ueh-yellow flex items-center justify-center text-ueh-blue font-bold text-xs">
                         {user.fullName.charAt(0)}
                     </div>
                 )}
                 <div className="overflow-hidden">
                     <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                     <p className="text-xs text-gray-500 truncate">{user.role}</p>
                 </div>
             </div>
             <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;