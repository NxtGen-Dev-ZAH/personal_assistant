"use client"
import React, { useState, useEffect, FC } from 'react';
import ChatInput from '../components/chatinput';
import ChatHistory from '../components/chathistory';
import axios from 'axios';

interface HomeProps {} 
interface Message {
    text: string;
    isFromUser: boolean;
  }
const Home: FC<HomeProps> = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get('/api/start');
        setThreadId(response.data.thread_id);
      } catch (error) {
        console.error(error);
        // Handle errors appropriately (e.g., display error message to user)
      }
    };
    fetchThread();
  }, []);

  const handleNewMessage = (message: string) => {
    setMessages([...messages, { text: message, isFromUser: true }]);
  };

  return (
    <div className="chat-container">
      {threadId && (
        <>
          <ChatInput threadId={threadId} onNewMessage={handleNewMessage} />
          <ChatHistory messages={messages} />
        </>
      )}
    </div>
  );
};

export default Home;
