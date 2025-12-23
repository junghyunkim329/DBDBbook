import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const HamburgerMenu = ({ isOpen, setIsOpen, handleLoginClick, handleLogoutClick, isLoggedIn }) => (
  <>
    <button 
      onClick={() => setIsOpen(!isOpen)} 
      className="absolute top-4 right-4 z-50 text-black p-2"
    >
      {isOpen ? <X size={28} /> : <Menu size={30} />}
    </button>

    <div
      className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ul className="p-6 space-y-4">
        <li className="flex justify-between items-center border-b border-gray-300 pb-2">
          <Link to="/" onClick={() => setIsOpen(false)}>홈</Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm shadow"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-green-500 text-white px-2 py-1 rounded-md text-sm shadow"
            >
              로그인
            </button>
          )}
        </li>
        <li><Link to="/scan" onClick={() => setIsOpen(false)}>책 등록</Link></li>
        <li><Link to="/bookshelf" onClick={() => setIsOpen(false)}>내 책방</Link></li>
      </ul>
    </div>
    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)} />}
  </>
);

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/session`, { credentials: 'include' });
        const data = await res.json();
        setIsLoggedIn(data.authenticated);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/basic-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('로그인 성공!');
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(`로그인 실패: ${data.error}`);
      }
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      if (res.ok) {
        alert('회원가입 성공! 로그인 화면으로 이동합니다.');
        setIsLogin(true);
      } else {
        const data = await res.json();
        alert(`회원가입 실패: ${data.error}`);
      }
    } catch (err) {
      console.error('Signup Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <HamburgerMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoggedIn={isLoggedIn}
        handleLoginClick={() => setIsLogin(true)}
        handleLogoutClick={() => setIsLoggedIn(false)}
      />

      <div className="relative w-full max-w-[700px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-1000 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}>
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">LOGIN</h2>
            <input
              type="email"
              placeholder="이메일"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button
              onClick={handleLogin}
              className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
            >
              Log in
            </button>
          </div>

          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">SIGN UP</h2>
            <input
              type="text"
              placeholder="이름"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-3"
            />
            <input
              type="email"
              placeholder="이메일"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button
              onClick={handleSignup}
              className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="absolute top-5 right-5">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline"
          >
            {isLogin ? 'Go to Sign up' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupLogin;