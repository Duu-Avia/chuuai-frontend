"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

type Plan = "starter" | "pro" | "enterprise";

const FacebookConnect = () => {
  const { getToken, isSignedIn } = useAuth();
  const [plan, setPlan] = useState<Plan>("starter"); // <-- user-selected plan

  useEffect(() => {
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
    return () => { document.body.removeChild(script); };
  }, []);

  function fbLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.FB) return reject(new Error("FB SDK not loaded"));
      window.FB.login(
        (resp: any) => (resp?.authResponse ? resolve(resp) : reject(new Error("Login cancelled or failed"))),
        { scope: "pages_manage_metadata,pages_messaging,pages_show_list" }
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

      // 1) exchange short-lived user token -> long-lived user token
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

      // 2) get pages
      window.FB.api("/me/accounts", "GET", { access_token: longLivedUserToken }, async (pagesResponse: any) => {
        const page = pagesResponse?.data?.[0];
        if (!page) {
          alert("⚠️ No Facebook pages found.");
          return;
        }

        const { id: pageId, access_token: pageAccessToken, name: pageName } = page;

        // 3) connect page
        const token = await getToken();
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connect-page`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ pageId, accessToken: pageAccessToken, pageName }),
        });
        const saveJson = await saveRes.json().catch(() => ({}));
        if (!saveRes.ok) {
          console.error("❌ Connect failed:", saveJson);
          alert("❌ Failed to connect page.");
          return;
        }

        // 4) ACTIVATE: set plan + subscriptionEndsAt = now + 1 month
        const activateRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/activate?pageId=${encodeURIComponent(pageId)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ plan }), // <-- send user-selected plan
          }
        );

        if (!activateRes.ok) {
          const txt = await activateRes.text();
          console.warn("⚠️ Subscription activate failed:", txt);
          alert("⚠️ Subscription activation failed.");
          return;
        }

        console.log("✅ Connected:", saveJson);
        alert("✅ Таны хуудас амжилттай холбогдлоо!");
        // window.location.href = `/admin-dashboard/${pageId}`;
      });
    } catch (e) {
      console.error(e);
      alert("❌ Хуудас холболтонд алдаа гарлаа.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border shadow-md rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Сошиал хуудсаа холбох</h1>

        {/* Simple plan selector */}
        <div className="mb-6 space-y-2 text-left">
          <label className="block text-sm font-medium">Сонгох багц</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as Plan)}
            className="w-full bg-background border border-border rounded-md px-3 py-2"
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <p className="text-xs text-muted-foreground">Сонгосон багц сервер дээр хадгалагдана.</p>
        </div>

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
