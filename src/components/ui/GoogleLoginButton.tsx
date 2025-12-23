import React, { useEffect } from "react";

interface GoogleLoginButtonProps {
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {
  useEffect(() => {
    // Google Identity Services 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      // Google 로그인 버튼 초기화
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Google Cloud Console에서 생성한 클라이언트 ID로 교체하세요.
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button")!,
        { theme: "outline", size: "large" } // 버튼 스타일 설정
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      onSuccess(response);
    } else {
      onFailure("Google login failed");
    }
  };

  return <div id="google-login-button"></div>;
};