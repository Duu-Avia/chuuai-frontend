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
          console.log("✅ FB login success:");

          const userAccessToken = loginResponse.authResponse.accessToken;

          window.FB.api("/me/accounts", (pagesResponse: any) => {
            console.log("📘 Pages response:");

            const page = pagesResponse.data?.[0];

            if (!page) {
              console.log("⚠️ No pages found");
              return alert("No pages found.");
            }

            const { id: pageId, access_token: accessToken, name: pageName } = page;


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
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center px-4">
  <div className="max-w-md w-full bg-card border border-border shadow-md rounded-xl p-8 text-center">
    <h1 className="text-3xl font-bold text-foreground mb-4">Сошиал хуудсаа холбох</h1>
    <p className="text-muted-foreground mb-6">
      Facebook болон Instagram хуудсаа ChuuAI chatbot-д холбохын тулд доорх товчийг дарна уу.
    </p>
    <button
      onClick={handleLogin}
      className="cursor-pointer bg-[#527AFF] text-white ring-2 ring-[#527AFF] px-6 py-3 text-white font-semibold rounded-lg transition"
    >
      Сошиал хуудсаа холбох
    </button>
  </div>
</div>

  );
};

export default FacebookConnect;
