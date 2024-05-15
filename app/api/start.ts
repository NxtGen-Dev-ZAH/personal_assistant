
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request received:', req.method, req.url);
    const response = await axios.get<{ thread_id: string }>('http://127.0.0.1:8000/api/start');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
}
