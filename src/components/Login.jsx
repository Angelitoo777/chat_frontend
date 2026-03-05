import { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(name);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-500">Chat Global</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            placeholder="Ingresa tu nombre de usuario..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-all">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}