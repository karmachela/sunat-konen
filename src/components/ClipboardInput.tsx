import React, { useState, useEffect } from "react";
import { 
  Link, 
  HelpCircle, 
  FileText, 
  Target, 
  Clock, 
  Sparkles, 
  Zap, 
  Loader2, 
  Eye, 
  MessageSquareOff 
} from "lucide-react";

interface ClipboardInputProps {
  onAnalyze: (config: {
    url: string;
    transcript: string;
    targetPillar: string;
    clipDuration: string;
    customPrompt: string;
  }) => void;
  isLoading: boolean;
}

const ANALYSIS_STEPS = [
  "Mendownload metadata video & menganalisis deskripsi...",
  "Memproses struktur transkrip dan isyarat teks...",
  "Mengevaluasi kurva retensi potensial & hook 3 detik...",
  "Merancang edit blueprint & isyarat visual detik-demi-detik...",
  "Menyusun takarir sosial media (caption) & tagar viral..."
];

export default function ClipboardInput({ onAnalyze, isLoading }: ClipboardInputProps) {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [targetPillar, setTargetPillar] = useState("Semua (Saran Terbaik)");
  const [clipDuration, setClipDuration] = useState("Standar Shorts (30-60 detik)");
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Rotating loading step indicator
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze({
      url,
      transcript,
      targetPillar,
      clipDuration,
      customPrompt,
    });
  };

  // Quick preset loader to help testing
  const loadPreset = () => {
    setUrl("https://www.youtube.com/watch?v=coUv24Vf5mE");
    setTranscript(`[00:00] Berhenti kerja sembilan ke lima itu bukan tentang kemandirian finansial aja, tapi tentang memiliki waktu tidur yang nyenyak.
[00:15] Banyak orang mengira punya aset 10 miliar baru bisa pensiun. Salah besar!
[00:25] Kuncinya ada di pengeluaran bulanan yang terkontrol dan melipatgandakan passive income dari dividen saham blue chip atau properti sewaan.
[00:40] Kalau biaya hidupmu cuma 5 juta sebulan, kamu hanya butuh modal 1,2 miliar dengan dividen 5% setahun untuk lepas dari bos kamu selamanya.
[00:55] Jauh lebih masuk akal dibanding ambisi beli mobil sport tapi dicicil 10 tahun.`);
    setTargetPillar("Edukasi");
    setClipDuration("Standar Shorts (30-60 detik)");
    setCustomPrompt("Fokus ke bagian hitungan matematika finansialnya agar audiens tercengang.");
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-sans font-semibold text-zinc-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-rose-500" />
          Konfigurasi Clipper AI
        </h3>
        <button
          type="button"
          onClick={loadPreset}
          className="text-xs text-zinc-500 hover:text-rose-400 font-mono transition duration-200 border border-zinc-800 hover:border-rose-950 px-2 py-1 rounded bg-zinc-950/40 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Gunakan Demo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YT Link */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Tautan Video YouTube</span>
            <span className="text-[10px] text-zinc-500 normal-case font-normal flex items-center gap-1">
              <Link className="w-3 h-3" /> Mendukung Shorts & Standard
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Contoh: https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-600 focus:ring-1 focus:ring-rose-600/35 rounded-2xl py-3 pl-4 pr-12 text-sm text-zinc-200 placeholder-zinc-650 transition duration-350"
            />
            {url && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400">
                URL Terbaca
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Grid for Option Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Pillar */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-rose-500" />
              <span>Pilar Konten Target</span>
            </label>
            <select
              value={targetPillar}
              disabled={isLoading}
              onChange={(e) => setTargetPillar(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-600 rounded-2xl py-3 px-4 text-xs text-zinc-300 focus:ring-0"
            >
              <option value="Semua (Saran Terbaik)">Semua (Saran Terbaik)</option>
              <option value="Edukasi">Edukasi (Wawasan & Pembelajaran)</option>
              <option value="Hiburan">Hiburan (Humor & Komedi)</option>
              <option value="Inspirasi">Inspirasi (Cerita & Emosi)</option>
              <option value="Promosi">Promosi (Penjualan & Produk)</option>
            </select>
          </div>

          {/* Clip Duration */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Target Durasi Klip</span>
            </label>
            <select
              value={clipDuration}
              disabled={isLoading}
              onChange={(e) => setClipDuration(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-600 rounded-2xl py-3 px-4 text-xs text-zinc-300 focus:ring-0"
            >
              <option value="Sangat Singkat (15-30 detik)">Sangat Singkat (15-30 detik)</option>
              <option value="Standar Shorts (30-60 detik)">Standar Shorts (30-60 detik)</option>
            </select>
          </div>
        </div>

        {/* Optional Custom Instructions / Prompt */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Fokus / Instruksi Khusus AI (Opsional)</span>
          </label>
          <input
            type="text"
            disabled={isLoading}
            placeholder="Contoh: 'Hanya cari bagian kontroversial' atau 'Berfokus pada lelucon lucu'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-600 rounded-2xl py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650"
          />
        </div>

        {/* Optional Transcript Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              Manuskrip / Transkrip Teks (Sangat Direkomendasikan!)
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">Opsional</span>
          </label>
          <textarea
            disabled={isLoading}
            rows={4}
            placeholder="Tempel transkrip percakapan video di sini untuk mendapatkan pencocokan stempel waktu (timestamps) yang SANGAT AKURAT detik-demi-detik. Jauh lebih presisi dibanding analisis deskripsi saja!"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-600 focus:ring-0 rounded-2xl p-4 text-xs text-zinc-300 placeholder-zinc-700 font-mono"
          />
          <p className="text-[10px] text-zinc-500 mt-2">
            * Tips: Anda bisa menyalin transkrip bawaan (auto-generated) langsung dari menu subtitle YouTube, lalu tempel di atas.
          </p>
        </div>

        {/* Action button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 disabled:from-zinc-800 disabled:to-zinc-850 hover:opacity-95 text-white font-semibold text-sm py-4 px-6 rounded-2xl transition duration-300 shadow-lg shadow-rose-950/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses dengan AI...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Analisis Klip Viral</span>
            </>
          )}
        </button>

        {/* Analysis loading state sequence */}
        {isLoading && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="bg-rose-500/15 p-1.5 rounded-lg text-rose-500 font-bold shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-zinc-300">
                  Langkah {stepIndex + 1} dari 5:
                </p>
                <p className="text-xs text-zinc-400 mt-1 transition-all duration-300 ease-in-out">
                  {ANALYSIS_STEPS[stepIndex]}
                </p>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-500"
                    style={{ width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
