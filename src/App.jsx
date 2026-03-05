import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';

const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const socket = io(url);

function App() {
  const [username, setUsername] = useState(localStorage.getItem('chat_user') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('chat_user'));
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    socket.on('previousMessages', (messages) => setChat(messages));
    socket.on('receiveMessage', (newMessage) => setChat((prev) => [...prev, newMessage]));

    socket.on('userTyping', (typingName) => {
      if (typingName !== username) {
        setTypingUser(typingName);
      }
    });

    socket.on('userStopTyping', () => setTypingUser(null));

    return () => {
      socket.off('previousMessages');
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [username]);

  const onLogin = (name) => {
    localStorage.setItem('chat_user', name);
    setUsername(name);
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem('chat_user');
    setIsLoggedIn(false);
    setUsername('');
  };

  const onSendMessage = (text) => {
    const msgData = {
      username,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('sendMessage', msgData);
  };

  const handleTyping = (isTypingNow) => {
    if (isTypingNow) {
      socket.emit('userTyping', username);
    } else {
      socket.emit('userStopTyping');
    }
  };

  if (!isLoggedIn) return <Login onLogin={onLogin} />;

  return (
    <div className="flex justify-center h-screen bg-[#050505] text-gray-100 font-sans">
      <div className="w-full max-w-2xl bg-[#0a0a0a] flex flex-col border-x border-gray-800 shadow-2xl relative">
        
        <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#111111]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-black text-blue-500 text-xl tracking-tighter uppercase">
              Chat Global <span className="text-gray-600 font-light text-sm normal-case">v1.0</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Usuario</p>
              <p className="text-sm font-medium text-blue-400">{username}</p>
            </div>
            <button 
              onClick={onLogout} 
              className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
            >
              SALIR
            </button>
          </div>
        </header>

        <ChatContainer chat={chat} currentUser={username} />

        <div className="h-8 px-6">
          {typingUser && (
            <div className="flex items-center gap-2 text-[11px] text-blue-400 font-semibold italic animate-pulse">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              {typingUser} está escribiendo...
            </div>
          )}
        </div>

        <div className="p-4 bg-[#0a0a0a]">
          <MessageInput onSendMessage={onSendMessage} onTyping={handleTyping} />
        </div>
      </div>
    </div>
  );
}

export default App;