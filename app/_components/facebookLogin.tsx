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

  const handleLogin = async () => {
  if (!window.FB) return;

  console.log("➡️ Attempting FB.login...");

  window.FB.login(
    async (loginResponse: any) => {
      if (loginResponse.authResponse) {
        console.log("✅ FB login success");

        const shortToken = loginResponse.authResponse.accessToken;

        // 🔁 1. Exchange short-lived token for long-lived token
        const exchangeRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-token?shortToken=${shortToken}`
        );
        const exchangeData = await exchangeRes.json();
        const longLivedUserToken = exchangeData.access_token;

        console.log("🔁 Long-lived token:", longLivedUserToken);

        // 🧾 2. Fetch the page access token using the long-lived user token
        window.FB.api(
          "/me/accounts",
          "GET",
          { access_token: longLivedUserToken },
          (pagesResponse: any) => {
            const page = pagesResponse.data?.[0];

            if (!page) {
              alert("⚠️ No Facebook pages found.");
              return;
            }

            const { id: pageId, access_token: pageAccessToken, name: pageName } = page;

            // 📤 3. Send to backend
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
                  alert("❌ Failed to connect page.");
                }
              })
              .catch((err) => {
                alert("❌ Error connecting page.");
                console.error(err);
              });
          }
        );
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
