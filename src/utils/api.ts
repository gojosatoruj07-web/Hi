export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const customKey = localStorage.getItem('shadow_custom_gemini_key') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (customKey.trim()) {
    headers['x-gemini-api-key'] = customKey.trim();
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
