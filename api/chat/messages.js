import { Agent, fetch as undiciFetch } from 'undici';

const API_BASE = process.env.CHATBOT_API_BASE_URL || 'https://mau-call-center.onrender.com';
const AGENT_ID = process.env.CHATBOT_AGENT_ID || 'agent_2102692c-a4b6-4c98-9280-0490719442b7';
const API_KEY = process.env.CHATBOT_API_KEY;
const MAX_TEXT_LENGTH = 2000;
const MESSAGE_LIMIT = 30;

export const maxDuration = 60;

const upstreamAgent = new Agent({
  keepAliveTimeout: 60_000,
  keepAliveMaxTimeout: 600_000,
  connections: 10,
});

function upstreamUrl(conversationId, { after, limit } = {}) {
  const base = `${API_BASE}/api/bots/${AGENT_ID}/messages`;
  const params = new URLSearchParams();
  if (conversationId) params.set('conversationId', conversationId);
  if (after) params.set('after', after);
  if (limit) params.set('limit', String(limit));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function jsonResponse(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function trimMessages(data) {
  if (!data?.messages?.length || data.messages.length <= MESSAGE_LIMIT) {
    return data;
  }
  return { ...data, messages: data.messages.slice(-MESSAGE_LIMIT) };
}

async function forwardUpstream(method, url, body) {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    Accept: 'application/json',
    Connection: 'keep-alive',
  };
  if (body) headers['Content-Type'] = 'application/json';

  const response = await undiciFetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    dispatcher: upstreamAgent,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: 'Invalid upstream response' };
  }

  return { status: response.status, data };
}

export default async function handler(req, res) {
  if (!API_KEY) {
    return jsonResponse(res, 401, { error: 'Chatbot API key is not configured' });
  }

  if (req.method === 'GET') {
    const conversationId = req.query?.conversationId;
    if (!conversationId || typeof conversationId !== 'string') {
      return jsonResponse(res, 400, { error: 'conversationId is required' });
    }

    const after = typeof req.query?.after === 'string' ? req.query.after : undefined;

    try {
      const { status, data } = await forwardUpstream(
        'GET',
        upstreamUrl(conversationId, { after, limit: MESSAGE_LIMIT })
      );
      return jsonResponse(res, status, trimMessages(data));
    } catch {
      return jsonResponse(res, 502, { error: 'Failed to reach chatbot service' });
    }
  }

  if (req.method === 'POST') {
    const { text, conversationId } = req.body || {};

    if (!conversationId || typeof conversationId !== 'string') {
      return jsonResponse(res, 400, { error: 'conversationId is required' });
    }
    if (!text || typeof text !== 'string' || !text.trim()) {
      return jsonResponse(res, 400, { error: 'text is required' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return jsonResponse(res, 400, { error: `text must be at most ${MAX_TEXT_LENGTH} characters` });
    }

    try {
      const { status, data } = await forwardUpstream('POST', upstreamUrl(), {
        text: text.trim(),
        conversationId,
      });
      return jsonResponse(res, status, trimMessages(data));
    } catch {
      return jsonResponse(res, 502, { error: 'Failed to reach chatbot service' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return jsonResponse(res, 405, { error: 'Method not allowed' });
}
