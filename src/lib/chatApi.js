const API_PATH = '/api/chat/messages';

async function parseResponse(response) {
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || `Chat request failed (${response.status})`);
  }
  return data;
}

export async function fetchMessages(conversationId) {
  const url = `${API_PATH}?conversationId=${encodeURIComponent(conversationId)}`;
  const response = await fetch(url);
  return parseResponse(response);
}

export async function sendMessage(conversationId, text) {
  const response = await fetch(API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, text }),
  });
  return parseResponse(response);
}
