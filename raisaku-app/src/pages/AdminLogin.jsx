import { useState } from "react";
import axios from "axios";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

export default function LoginAdmin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        username: username.trim(),
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        // Simpan sesi autentikasi admin di localStorage
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(user));

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    } catch (err) {
      console.error("Login admin error:", err);
      const message =
        err.response?.data?.message ||
        "Gagal terhubung ke server backend. Pastikan server aktif.";
      setError(message);
    } finally {
      setLoading(false);
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
          Masukkan kredensial admin untuk mengelola katalog produk.
        </p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block">
            <span className="block text-sm font-bold mb-2">Username atau Email</span>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-xl border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition disabled:bg-gray-100"
              placeholder="Masukkan username atau email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-bold mb-2">Password</span>
            <input
              type="password"
              className="w-full h-12 px-4 rounded-xl border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition disabled:bg-gray-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <Button type="submit" className="w-full h-12 mt-2" disabled={loading}>
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </Button>
        </form>

        <button
          onClick={onCancel}
          type="button"
          disabled={loading}
          className="w-full mt-6 text-sm font-bold text-muted hover:text-brand flex justify-center items-center gap-2 transition disabled:opacity-50"
        >
          <Icon name="arrow" className="rotate-180 size-4" />
          Kembali ke Katalog
        </button>
      </div>
    </div>
  );
}
