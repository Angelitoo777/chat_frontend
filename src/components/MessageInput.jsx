import { useState, useEffect } from 'react';

export default function MessageInput({ onSendMessage, onTyping }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length > 0) {
      onTyping(true);
      const timeout = setTimeout(() => onTyping(false), 2000);
      return () => clearTimeout(timeout);
    } else {
      onTyping(false);
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 bg-[#111111] p-2 rounded-xl border border-gray-800">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-transparent p-2 outline-none text-sm text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button 
        disabled={!text.trim()} 
        className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 text-white"
      >
        Enviar
      </button>
    </form>
  );
}