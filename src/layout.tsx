import { Outlet, Link } from "react-router-dom";
import { useState } from "react"; // 로그인 상태 관리를 위한 useState 추가
import "./globals.css";
import Login from "./pages/login";
import Home from "./pages/page"; // 홈 페이지 추가

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            📚<span>디비디비딥</span>
          </Link>

          <nav className="flex items-center gap-6">
            {isLoggedIn ? (
              // 로그인 상태일 때
              <>
                <Link to="/scan" className="text-sm font-medium transition-colors hover:text-primary">
                  책 등록
                </Link>
                <Link to="/bookshelf" className="text-sm font-medium transition-colors hover:text-primary">
                  내 책방
                </Link>
              </>
            ) : (
              // 로그아웃 상태일 때
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet context={{ isLoggedIn, setIsLoggedIn }} /> {/* 로그인 상태를 자식 컴포넌트에 전달 */}
      </main>
    </div>
  );
}
