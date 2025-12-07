import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { authService } from '../services/dataService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authService.login(username);
    if (user) {
      onLogin(user);
    } else {
      setError('Tên đăng nhập không đúng. Thử "student1", "student2" hoặc "admin".');
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ueh-blue mb-2">UEH Mekong</h1>
        <h2 className="text-xl text-gray-600">Nền tảng Theo dõi Tiếng Anh</h2>
      </div>
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập của bạn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error}
          />
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-semibold">Tài khoản Demo:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Sinh viên: <code>student1</code></li>
              <li>Quản trị: <code>admin</code></li>
            </ul>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Đăng nhập
          </Button>
        </form>
      </Card>
      <p className="text-center text-gray-400 text-sm mt-8">
        &copy; {new Date().getFullYear()} Phân hiệu UEH tại Vĩnh Long
      </p>
    </div>
  );
};

export default Login;