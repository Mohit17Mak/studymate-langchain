const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail || `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export async function createSession() {
  return request("/sessions", {
    method: "POST",
  });
}

export async function analyzePrompt(sessionId, prompt) {
  return request("/analyze", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      prompt,
    }),
  });
}

export async function evaluatePrompt(
  sessionId,
  originalPrompt,
  revisedPrompt
) {
  return request("/evaluate", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      original_prompt: originalPrompt,
      revised_prompt: revisedPrompt,
    }),
  });
}

export async function getChallenge(sessionId) {
  return request("/challenge", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}

export async function getProfile(sessionId) {
  return request(`/profile/${sessionId}`);
}