import axios from 'axios';

// Set your backend API base URL here
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

/**
 * Registers a new user.
 */
export async function register(email: string, password: string, name: string) {
  const res = await axios.post(`${API_BASE}/users/register`, { email, password, name });
  return res.data;
}

/**
 * Logs in a user and returns the JWT token.
 */
export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
}

/**
 * Adds a document to the vector DB.
 */
export async function addVectorDoc(token: string, id: string, text: string, metadata: any, provider?: 'openai' | 'gemini') {
  const res = await axios.post(
    `${API_BASE}/vector/add`,
    { id, text, metadata, provider },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

/**
 * Searches the vector DB by text.
 */
export async function searchVector(token: string, text: string, topK = 5, provider?: 'openai' | 'gemini') {
  const res = await axios.post(
    `${API_BASE}/vector/search`,
    { text, topK, provider },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
} 