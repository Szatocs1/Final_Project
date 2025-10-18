// Egységes fetch helper + állapot kiírás

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include', // nagyon fontos a session cookie-hoz
    ...options
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const errMsg = (data && data.error) ? data.error : `Hiba (${res.status})`;
    throw new Error(errMsg);
  }
  return data;
}

// Chatgpt magyarázza el, szóról szóra

export async function getMe() {
  try {
    const { user } = await apiFetch('/api/auth/me', { method: 'GET' });
    return user;
  } catch {
    return null;
  }
}


export function writeStatus(el, text, type = '') {
  if (!el) return;
  el.className = `status ${type}`;
  el.textContent = text;
}
