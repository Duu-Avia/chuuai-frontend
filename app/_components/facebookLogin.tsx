"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

const FacebookConnect = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "YOUR_FACEBOOK_APP_ID", // 👉 солино
          cookie: true,
          xfbml: false,
          version: "v19.0",
        });
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      (loginResponse: any) => {
        if (loginResponse.authResponse) {
          const userAccessToken = loginResponse.authResponse.accessToken;

          // Get Pages the user manages
          window.FB.api('/me/accounts', (pagesResponse: any) => {
            const page = pagesResponse.data?.[0]; // ❗ TODO: UI дээр олон page-с сонголт хийх боломж нэмээрэй

            if (!page) return alert("No pages found.");

            const { id: pageId, access_token: pageAccessToken, name: pageName } = page;

            // Send to your backend to save
            fetch("https://your-backend-url.com/api/connect-page", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ pageId, pageAccessToken, pageName }),
            }).then(() => alert("Page connected! ✅"));
          });
        } else {
          alert("Facebook login failed.");
        }
      },
      {
        scope: "pages_manage_metadata,pages_messaging,pages_read_engagement,pages_show_list",
      }
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Connect My Facebook Page
      </button>
    </div>
  );
};

export default FacebookConnect;
