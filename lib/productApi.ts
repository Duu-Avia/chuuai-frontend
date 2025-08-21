// lib/productApi.ts
export function makeProductApi(
  baseUrl: string,
  getToken: () => Promise<string | null>,
  pageId: string
) {
  const apiBase = `${baseUrl.replace(/\/$/, "")}/api/products`;
  const qs = `pageId=${encodeURIComponent(pageId)}`;

  const withAuth = async (init: RequestInit = {}): Promise<RequestInit> => {
    const t = (await getToken?.()) || "";

    // Make headers type-safe
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init.headers as HeadersInit),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    };

    return {
      ...init,
      headers,
      // 👇 Fix: assert the literal so it’s typed as RequestCredentials
      credentials: "include" as RequestCredentials,
    };
  };

  const fetchJSON = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, await withAuth(init));
    let data: any = null;
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) throw (data || { error: res.statusText });
    return data;
  };

  return {
    list() {
      return fetchJSON(`${apiBase}?${qs}`);
    },
    create(body: any) {
      return fetchJSON(`${apiBase}?${qs}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    update(id: string, body: any) {
      return fetchJSON(`${apiBase}/${id}?${qs}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    },
    remove(id: string) {
      return fetchJSON(`${apiBase}/${id}?${qs}`, { method: "DELETE" });
    },
    adjustStock(id: string, delta: number) {
      return fetchJSON(`${apiBase}/${id}/stock?${qs}`, {
        method: "POST",
        body: JSON.stringify({ delta }),
      });
    },
  };
}
