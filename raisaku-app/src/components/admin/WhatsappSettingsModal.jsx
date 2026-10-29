import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

export default function WhatsappSettingsModal({ onClose }) {
  const [waNumber, setWaNumber] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCurrentSettings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/whatsapp/settings");
      if (response.data.success) {
        const number = response.data.data.whatsapp_number;
        setCurrentNumber(number);
        setWaNumber(number);
      }
    } catch (error) {
      console.error("Gagal mengambil nomor WhatsApp:", error);
      setMessage({
        type: "error",
        text: "Gagal mengambil data nomor WhatsApp dari server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!waNumber.trim()) {
      setMessage({ type: "error", text: "Nomor WhatsApp wajib diisi." });
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put("http://localhost:5001/api/whatsapp/settings", {
        whatsapp_number: waNumber.trim(),
      });

      if (response.data.success) {
        setCurrentNumber(response.data.data.whatsapp_number);
        setMessage({
          type: "success",
          text: "Nomor WhatsApp toko berhasil diperbarui!",
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Gagal memperbarui nomor WhatsApp:", error);
      const msg =
        error.response?.data?.message || "Gagal memperbarui nomor WhatsApp.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Icon name="whatsapp" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-ink">
                Pengaturan WhatsApp Toko
              </h2>
              <p className="text-xs text-muted">
                Kontak tujuan checkout pesanan pembeli
              </p>
            </div>
          </div>
          <Button className="size-9" onClick={onClose} variant="ghost">
            <Icon name="close" className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
          {message.text && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {message.type === "success" ? "✓ " : "⚠️ "}
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3 py-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-11 bg-gray-200 rounded-xl w-full" />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-ink">
                  Nomor WhatsApp CS / Toko <span className="text-red-500">*</span>
                </label>
                {currentNumber && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Aktif: +{currentNumber}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  placeholder="Contoh: 08123456789 atau 628123456789"
                  disabled={isSaving}
                  className="w-full h-12 px-4 rounded-xl border border-line text-sm font-semibold outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition disabled:bg-gray-100"
                  required
                />
              </div>

              <p className="mt-2 text-xs text-muted leading-relaxed">
                Bisa ditulis dengan awalan <strong>08...</strong> atau{" "}
                <strong>628...</strong>. Sistem otomatis menyesuaikan ke format
                internasional WhatsApp.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              className="h-11 px-5 text-sm"
              onClick={onClose}
              disabled={isSaving}
              variant="secondary"
            >
              Batal
            </Button>
            <Button
              className="h-11 px-6 text-sm"
              type="submit"
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Nomor Baru"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
