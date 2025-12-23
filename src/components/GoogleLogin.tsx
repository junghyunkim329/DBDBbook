import { useEffect } from 'react';

const CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLogin = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  useEffect(() => {
    /* global google */
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: any) => onSuccess(response.credential),
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, [onSuccess]);

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLogin;
