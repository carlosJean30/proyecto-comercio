"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (locked) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError("Credenciales incorrectas");

      if (newAttempts >= 2) {
        setLocked(true);
        setError("Demasiados intentos. Espera 30 segundos.");
        setTimeout(() => {
          setAttempts(0);
          setLocked(false);
          setError("");
        }, 30000);
      }
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="login-container"> {/* ← AQUI SE AGREGA ESTA CLASE */}

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-6">

        <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30">

          <h2 className="text-4xl font-extrabold text-center text-white drop-shadow mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-white font-semibold pl-1">Correo</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 rounded-lg bg-white/80 text-gray-900 outline-none border border-gray-300 focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>

            <div>
              <label className="text-white font-semibold pl-1">Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 rounded-lg bg-white/80 text-gray-900 outline-none border border-gray-300 focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={locked}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold p-3 rounded-lg shadow-lg transition disabled:bg-gray-400"
            >
              {locked ? "Bloqueado 30s" : "Entrar"}
            </button>

            {error && (
              <p className="text-red-300 text-center font-semibold">{error}</p>
            )}
          </form>

          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full text-white/90 hover:text-white font-semibold underline text-center transition"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
