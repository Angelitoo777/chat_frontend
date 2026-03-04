import { useEffect, useRef } from 'react';

export default function ChatContainer({ chat, currentUser }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
      {chat.map((msg, index) => {
        const isMe = msg.username === currentUser;
        return (
          <div 
            key={msg._id || index} 
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-xl border ${
              isMe 
                ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none shadow-blue-900/20' 
                : 'bg-[#161616] border-gray-800 text-gray-200 rounded-tl-none shadow-black/50'
            }`}>
              {!isMe && (
                <p className="text-[11px] font-bold text-blue-400 mb-1">
                  {msg.username}
                </p>
              )}
              <p className="text-[14px] leading-relaxed font-normal">{msg.text}</p>
              <div className="flex justify-end mt-1.5">
                <p className="text-[9px] opacity-40 font-mono italic">{msg.time}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
}