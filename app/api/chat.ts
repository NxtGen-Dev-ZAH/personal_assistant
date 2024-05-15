// pages/api/chat.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface ChatRequest {
  thread_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request received:', req.method, req.url);
    const { thread_id, message }: ChatRequest = req.body;
    const response = await axios.post<ChatResponse>('http://127.0.0.1:8000/api/chat', { thread_id, message});
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
