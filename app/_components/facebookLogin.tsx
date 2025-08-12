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

  // Promise wrapper so we don't pass an async function directly to FB.login
  function fbLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.FB) return reject(new Error("FB SDK not loaded"));
      window.FB.login(
        (resp: any) => {
          if (resp?.authResponse) return resolve(resp);
          reject(new Error("Login cancelled or failed"));
        },
        {
          scope:
            "pages_manage_metadata,pages_messaging,pages_read_engagement,pages_show_list",
        }
      );
    });
  }

  const handleLogin = async () => {
    try {
      console.log("➡️ Attempting FB.login...");
      const loginResponse = await fbLogin();
      console.log("✅ FB login success");

      const shortToken = loginResponse.authResponse.accessToken;

      // 1) exchange short-lived user token -> long-lived user token (backend)
      const exchangeRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-token?shortToken=${shortToken}`
      );
      const exchangeData = await exchangeRes.json();
      if (!exchangeRes.ok || !exchangeData.access_token) {
        console.error("❌ Token exchange failed:", exchangeData);
        alert("❌ Failed to exchange token.");
        return;
      }
      const longLivedUserToken = exchangeData.access_token;

      // 2) get pages with the long-lived user token (client)
      window.FB.api(
        "/me/accounts",
        "GET",
        { access_token: longLivedUserToken },
        async (pagesResponse: any) => {
          const page = pagesResponse?.data?.[0];
          if (!page) {
            alert("⚠️ No Facebook pages found.");
            return;
          }

          const {
            id: pageId,
            access_token: pageAccessToken,
            name: pageName,
          } = page;

          // 3) save (encrypted) and subscribe via backend
          const saveRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connect-page`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pageId,
                accessToken: pageAccessToken, // this should be long-lived now
                pageName,
              }),
            }
          );

          if (!saveRes.ok) {
            const err = await saveRes.json().catch(() => ({}));
            console.error("❌ Connect failed:", err);
            alert("❌ Failed to connect page.");
            return;
          }

          alert("✅ Таны хуудас амжилттай холбогдлоо");
        }
      );
    } catch (e) {
      console.error(e);
      alert("❌ Хуудас холболтонд алдаа гарлаа.");
    }
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
          className="cursor-pointer bg-[#527AFF] text-white ring-2 ring-[#527AFF] px-6 py-3 font-semibold rounded-lg transition"
        >
          Сошиал хуудсаа холбох
        </button>
      </div>
    </div>
  );
};

export default FacebookConnect;
