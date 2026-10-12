import { useState } from "react";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

export default function LoginAdmin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      onLoginSuccess();
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-5 text-ink">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-line p-8">
        <div className="flex justify-center mb-6">
          <Brand />
        </div>

        <h2 className="text-2xl font-extrabold text-center mb-2">
          Login Admin
        </h2>
        <p className="text-sm text-muted text-center mb-8">
          Masukkan kredensial untuk mengelola katalog.
        </p>

        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block">
            <span className="block text-sm font-bold mb-2">Username</span>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-xl border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-bold mb-2">Password</span>
            <input
              type="password"
              className="w-full h-12 px-4 rounded-xl border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <Button type="submit" className="w-full h-12 mt-2">
            Masuk ke Dashboard
          </Button>
        </form>

        <button
          onClick={onCancel}
          type="button"
          className="w-full mt-6 text-sm font-bold text-muted hover:text-brand flex justify-center items-center gap-2 transition"
        >
          <Icon name="arrow" className="rotate-180 size-4" />
          Kembali ke Katalog
        </button>
      </div>
    </div>
  );
}
