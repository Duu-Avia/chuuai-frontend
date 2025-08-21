"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"; // 👈 add this

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

const FacebookConnect = () => {
  const { getToken, isSignedIn } = useAuth(); // 👈 get Clerk token

  useEffect(() => {
    // Initialize FB SDK
    window.fbAsyncInit = function () {
      window.FB?.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
      console.log("✅ FB SDK initialized");
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function fbLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.FB) return reject(new Error("FB SDK not loaded"));
      window.FB.login(
        (resp: any) => {
          if (resp?.authResponse) return resolve(resp);
          reject(new Error("Login cancelled or failed"));
        },
        {
          scope: "pages_manage_metadata,pages_messaging,pages_show_list",
        }
      );
    });
  }

  const handleLogin = async () => {
    try {
      if (!isSignedIn) {
        alert("Please sign in first.");
        return;
      }

      console.log("➡️ Attempting FB.login...");
      const loginResponse = await fbLogin();
      console.log("✅ FB login success");

      const shortToken = loginResponse.authResponse.accessToken;

      // 1) Exchange short-lived user token -> long-lived user token (backend)
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

      // 2) Fetch pages using the long-lived user token (client)
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

          const { id: pageId, access_token: pageAccessToken, name: pageName } = page;

          // 3) Connect page on backend — 👇 INCLUDE CLERK TOKEN!
          const token = await getToken();
          const saveRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connect-page`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}), // 👈 critical
              },
              body: JSON.stringify({
                pageId,
                accessToken: pageAccessToken,
                pageName,
              }),
            }
          );

          const saveJson = await saveRes.json().catch(() => ({}));
          if (!saveRes.ok) {
            console.error("❌ Connect failed:", saveJson);
            alert("❌ Failed to connect page.");
            return;
          }

          console.log("✅ Connected:", saveJson);
          alert("✅ Таны хуудас амжилттай холбогдлоо!");
          // Optional: redirect to your dashboard route
          // window.location.href = `/admin-dashboard/${pageId}`;
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
