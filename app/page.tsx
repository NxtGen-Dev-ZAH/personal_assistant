"use client"
import { useState } from 'react';
import axios from 'axios';

interface ChatRequest {
  thread_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
}

export default function AssistantPage() {
  const [userInput, setUserInput] = useState('');
  const [threadId, setThreadId] = useState('');
  const [messages, setMessages] = useState<{ user: string; assistant: string }[]>([]);

  const handleStartConversation = async () => {
    try {
      const response = await axios.get<{ thread_id: string }>('/api/start');
      setThreadId(response.data.thread_id);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const data: ChatRequest = {
        thread_id: threadId,
        message: userInput,
      };
      const response = await axios.post<ChatResponse>('/api/chat', data);
      setMessages([...messages, { user: userInput, assistant: response.data.response }]);
      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>  
    <div>
    <p className='flex text-3xl font-bold p-2 justify-center bg-slate-600 text-white' >Zaheer's Assistant</p>
    </div>  
    <div className=" flex flex-col gap-2 p-4 border-2 border-red-100 ">
      <div>
        <label className='font-extrabold' >User Input:</label>
        <br/>
        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} className='p-2 m-2 border-2 border-amber-400 w-3/4 rounded-lg
        ' />
      </div>
      <div>
        <label className='font-extrabold'>Thread ID:<br/></label>
        <input type="text" value={threadId} onChange={(e) => setThreadId(e.target.value)} className='p-2 m-2 border-2 border-amber-400 w-1/4 rounded-lg ' />
        <button onClick={handleStartConversation} className='border-2 border-amber-300 rounded-full bg-gray-300 hover:bg-slate-500 p-2'>Start Conversation</button>
        <p className='font-bold text-xl'>{threadId}</p>
      </div>

      <div>
        <button onClick={handleSendMessage} className='border-2 border-amber-300 rounded-full bg-gray-300 hover:bg-slate-500 p-2 font-bold ' >Send Message</button>
      </div>
      <div>
        <label className='font-extrabold '>Response:</label>
        <div className='border-2 border-red-100'>
          {messages.map((message, index) => (
            <div key={index}>
              <p className='font-semibold' >User: {message.user}</p>
              <p>Assistant: {message.assistant}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
