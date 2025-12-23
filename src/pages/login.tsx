import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; // useOutletContext 추가

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext(); // Layout에서 전달된 setIsLoggedIn 사용

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/basic-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('로그인 성공!');
        setIsLoggedIn(true); // 로그인 상태 업데이트
        navigate('/');
      } else {
        if (res.status === 401) {
          alert('정보가 없습니다');
          return;
        }
        alert(`로그인 실패: ${data.error}`);
      }
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
