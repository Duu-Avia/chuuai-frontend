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
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!, 
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

          window.FB.api("/me/accounts", (pagesResponse: any) => {
            const page = pagesResponse.data?.[0];

            if (!page) return alert("No pages found.");

            const { id: pageId, access_token: pageAccessToken, name: pageName } = page;

            // Send data to backend API
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connect-page`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ pageId, accessToken: pageAccessToken, pageName }),
            })
              .then((res) => {
                if (res.ok) {
                  alert("✅ Facebook Page connected successfully!");
                } else {
                  alert("❌ Failed to save page on backend.");
                }
              })
              .catch((err) => {
                console.error("Error sending to backend:", err);
                alert("❌ Error connecting page.");
              });
          });
        } else {
          alert("Facebook login was cancelled or failed.");
        }
      },
      {
        scope:
          "pages_manage_metadata,pages_messaging,pages_read_engagement,pages_show_list",
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
