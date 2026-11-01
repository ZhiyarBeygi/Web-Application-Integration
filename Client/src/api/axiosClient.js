const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers: {
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      `ارتباط با سرویس برقرار نشد. مطمئن شوید بک‌اند Tender Management روی پورت 5046 در حال اجرا است.`,
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.title || "خطا در ارتباط با سرور";
    throw new Error(message);
  }

  return data;
}

const axiosClient = {
  get(path, options = {}) {
    return request(path, { ...options, method: "GET" });
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(path, options = {}) {
    return request(path, { ...options, method: "DELETE" });
  },
};

export default axiosClient;
