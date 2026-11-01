const API_BASE = "/api/usersettings";

export async function getUserSettings(userId) {
  const response = await fetch(`${API_BASE}/${userId}`);
  if (!response.ok) {
    throw new Error(`GET usersettings failed: ${response.status}`);
  }
  return response.json();
}

export async function setTheme(userId, theme) {
  const response = await fetch(`${API_BASE}/theme`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, theme }),
  });
  if (!response.ok) {
    throw new Error(`PUT theme failed: ${response.status}`);
  }
  return response.json();
}

export async function addBookmark(userId, itemPath) {
  const response = await fetch(`${API_BASE}/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, itemPath }),
  });
  if (!response.ok) {
    throw new Error(`POST bookmark failed: ${response.status}`);
  }
  return response.json();
}

export async function removeBookmark(userId, itemPath) {
  const response = await fetch(`${API_BASE}/bookmarks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, itemPath }),
  });
  if (!response.ok) {
    throw new Error(`DELETE bookmark failed: ${response.status}`);
  }
  return response.json();
}