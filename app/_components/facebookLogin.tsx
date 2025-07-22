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
        console.log("✅ FB SDK initialized");
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    if (!window.FB) return;

    console.log("➡️ Attempting FB.login...");

    window.FB.login(
      (loginResponse: any) => {
        if (loginResponse.authResponse) {
          console.log("✅ FB login success:", loginResponse);

          const userAccessToken = loginResponse.authResponse.accessToken;

          window.FB.api("/me/accounts", (pagesResponse: any) => {
            console.log("📘 Pages response:", pagesResponse);

            const page = pagesResponse.data?.[0];

            if (!page) {
              console.log("⚠️ No pages found");
              return alert("No pages found.");
            }

            const { id: pageId, access_token: accessToken, name: pageName } = page;

            console.log("📤 Sending to backend:", { pageId, accessToken, pageName });

            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connect-page`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ pageId, accessToken, pageName }),
            })
              .then((res) => {
                if (res.ok) {
                  console.log("✅ Page successfully saved to backend");
                  alert("✅ Facebook Page connected successfully!");
                } else {
                  console.error("❌ Backend save failed:", res.status);
                  alert("❌ Failed to save page on backend.");
                }
              })
              .catch((err) => {
                console.error("❌ Error sending to backend:", err);
                alert("❌ Error connecting page.");
              });
          });
        } else {
          console.warn("❌ FB login cancelled or failed:", loginResponse);
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
