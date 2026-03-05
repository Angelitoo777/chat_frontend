import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const socket = io(url);

export const useChatSocket = (username) => {
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    socket.on('previousMessages', (messages) => setChat(messages));
    socket.on('receiveMessage', (newMessage) => setChat((prev) => [...prev, newMessage]));
    
    socket.on('userTyping', (typingName) => {
      if (typingName !== username) setTypingUser(typingName);
    });

    socket.on('userStopTyping', () => setTypingUser(null));

    return () => {
      socket.off('previousMessages');
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [username]);

  const sendMessage = (text) => {
    const msgData = {
      username,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('sendMessage', msgData);
  };

  const sendTypingStatus = (isTyping) => {
    socket.emit(isTyping ? 'userTyping' : 'userStopTyping', username);
  };

  return { chat, typingUser, sendMessage, sendTypingStatus };
};