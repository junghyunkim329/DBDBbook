import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        alert("회원가입 성공! 로그인 화면으로 이동합니다.");
        navigate("/login");
      } else if (res.status === 409) {
        alert("이미 존재하는 아이디입니다.");
      } else {
        const data = await res.json();
        alert(`회원가입 실패: ${data.error}`);
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">회원가입</h2>
        <input
          type="text"
          placeholder="닉네임"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-3"
        />
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
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}