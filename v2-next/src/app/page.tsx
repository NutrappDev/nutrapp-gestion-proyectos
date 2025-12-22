'use client';

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-white dark:bg-black">
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-wrap justify-center max-w-md w-full">
          
          <div className="p-2 w-full text-center">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Nutrapp
            </h1>
          </div>

          <div className="p-6 bg-white text-black rounded shadow w-full">
            <form onSubmit={handlerAuth} className="flex flex-col gap-4">
              
              <input
                type="email"
                placeholder="Email"
                value={email}
                className="w-full p-3 border rounded"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                className="w-full p-3 border rounded"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-blue-800 p-3 rounded text-white hover:bg-blue-900 transition"
              >
                Enviar
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
