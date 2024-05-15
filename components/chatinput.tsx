"use client"

import React, { useState, FC } from 'react';
import axios from 'axios';

interface ChatInputProps {
  threadId: string;
  onNewMessage: (message: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({ threadId, onNewMessage }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message) return;

    try {
      const response = await axios.post('/api/chat', {
        thread_id: threadId,
        message,
      });
      onNewMessage(response.data.response);
      setMessage('');
    } catch (error) {
      console.error(error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  return (
    <div className="p-3 bg-slate-400 text-cyan-100 font-bold">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
