"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "../../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/home");
    } catch (error) {
      alert("Error al iniciar sesión");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-mono">
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute right-0 h-60 w-px bg-gray-600 opacity-50"></div>
        <div className="flex flex-col items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={220}
            height={220}
            className="mb-4"
          />
          <p className="text-6xl font-bold text-green-900 mb-5">Pedro Paulet</p>
          <p className="text-green-900 text-xl">Dios - Estudio - Disciplina</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl  text-center text-gray-800 mb-6 font-mono">
            Iniciar Sesión
          </h1>

          <div>
            <label htmlFor="email" className="sr-only ">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white border hover:bg-green-500 font-bold text-green-700 hover:text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Ingresar
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
