"use client"

import React from 'react';

interface Message {
  text: string;
  isFromUser: boolean;
}

const ChatHistory: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="flex justify-center items-center">
      {messages.map((message, index) => (
        <div key={index} className="">
            <p>{`message ${message.isFromUser ? 'user' : ''}`}</p>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
