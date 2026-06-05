import { useState } from "react";
import ClipperHeader from "./components/ClipperHeader";
import ClipboardInput from "./components/ClipboardInput";
import VideoPlayer from "./components/VideoPlayer";
import ClipCard from "./components/ClipCard";
import { AnalysisResult } from "./types";
import { 
  Flame, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  Tv, 
  Scissors, 
  Check, 
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Active clip preview in the YouTube Iframe player
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeClip, setActiveClip] = useState<{
    startSeconds: number;
    endSeconds: number;
    title: string;
  } | null>(null);

  // Triggered when submitted configuration options
  const handleAnalyze = async (config: {
    url: string;
    transcript: string;
    targetPillar: string;
    clipDuration: string;
    customPrompt: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveVideoId(null);
    setActiveClip(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperoleh analisis video.");
      }

      setResult(data);
      if (data.metadata?.videoId) {
        setActiveVideoId(data.metadata.videoId);
        // Default play clip #1
        if (data.clips && data.clips.length > 0) {
          const firstClip = data.clips[0];
          setActiveClip({
            startSeconds: firstClip.startSeconds,
            endSeconds: firstClip.endSeconds,
            title: firstClip.title,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Koneksi ke backend server gagal. Pastikan API Key diisi dan server berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayClip = (start: number, end: number, title: string) => {
    if (!activeVideoId) return;
    setActiveClip({
      startSeconds: start,
      endSeconds: end,
      title: title,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased pb-20">
      <ClipperHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Title Block */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase font-mono">Platform Strategist Konten</span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-zinc-100 tracking-tight leading-none sm:text-4xl">
            Sunat Konten AI ✂️
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Potong adegan, rapikan durasi, dan persiapkan cetak biru editing klip video YouTube berpotensi viral tinggi untuk TikTok, Instagram Reels, dan YouTube Shorts secara instan.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-semibold text-zinc-100 mb-1">Gagal Menganalisis Video</p>
              <p>{error}</p>
              <p className="mt-2 text-zinc-400 font-mono text-[11px]">
                Solusi: Pastikan kunci API Anda sudah dikonfigurasi di menu <span className="text-zinc-200 font-bold">Settings &gt; Secrets</span> dengan nama variabel <span className="text-rose-400 font-bold">GEMINI_API_KEY</span>.
              </p>
            </div>
          </div>
        )}

        {/* Main Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Controls / Input form (occupies 1/3 when no result, or side banner) */}
          <div className={`${result ? "lg:col-span-4" : "lg:col-span-6"} space-y-6 transition-all duration-300`}>
            {/* Input config */}
            <ClipboardInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Editing cheat sheet */}
            <div className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tips Memotong Video</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>Hook Retensi:</strong> Potong langsung ke inti pembicaraan. Hindari intro visual logo bertele-tele.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>Kecepatan Tempo:</strong> Gunakan cut agresif pada bagian jeda napas kosong untuk retensi maksimal.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>Efek Multi-Sensory:</strong> Gabungkan subtittle dinamis yang berganti tiap 1-2 kata dengan audio swoosh.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Dashboard & Preview Video Player */}
          <div className={`${result ? "lg:col-span-8" : "lg:col-span-6"} space-y-8 transition-all duration-300`}>
            
            {result ? (
              /* Display Results - Full Width Single Column layout for optimum workspace focus */
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      {result.clips?.length || 0} Rekomendasi Hasil Sunat Konten Ditemukan
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 font-sans">
                    Monitor pratinjau terintegrasi langsung pada setiap kartu dibawah.
                  </span>
                </div>

                <div className="space-y-5">
                  {result.clips && result.clips.map((clip) => {
                    const isClipActive = activeClip?.startSeconds === clip.startSeconds && activeClip?.endSeconds === clip.endSeconds;
                    return (
                      <ClipCard
                        key={clip.id}
                        clip={clip}
                        isActive={isClipActive}
                        onPlayClip={handlePlayClip}
                        videoId={activeVideoId}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Strategist Guide / Standard View dashboard */
              <div className="space-y-6">
                <div className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none select-none">
                    <TrendingUp className="w-96 h-96 text-white" />
                  </div>

                  <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-xs font-semibold tracking-wider font-mono">Panduan Strategis</span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-sans font-bold text-zinc-100 tracking-tight">
                    Cetak Biru Video Pendek (Viral Loop Blueprint)
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                    Setiap platform short-form seperti TikTok, Instagram Reels, dan YouTube Shorts didorong oleh algoritma retensi (viewer retention). Berikut adalah formula emas yang direkomendasikan sistem ini untuk membuat klip Anda menonjol:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        Aturan Hook 3 Detik
                      </span>
                      <p className="text-xs text-zinc-350 mt-2.5 leading-relaxed">
                        Tiga detik pertama mengesampingkan segalanya. Layar harus memuat teks pemicu rasa penasaran yang kontradiktif atau emosional untuk menghentikan jempol penonton agar tidak mengusap ke video lain.
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        Pacing Tempo Cepat
                      </span>
                      <p className="text-xs text-zinc-350 mt-2.5 leading-relaxed">
                        Kecepatan frame adalah segalanya. Gunakan zoom-in kilat pada intonasi meninggi, letakkan emoji ilustrasi di atas kata-kata spesifik, dan pakai sound effect swoosh pada transisi berganti adegan.
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        Kinetic Subtitle
                      </span>
                      <p className="text-xs text-zinc-350 mt-2.5 leading-relaxed">
                        Gunakan font dengan ketebalan tinggi (Bold Sans) diletakkan tepat di tengah layar. Munculkan per kata dengan warna penekanan (kuning neon) pada kata kunci penting untuk menjaga stimulasi mata.
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        Audio Loop Sempurna
                      </span>
                      <p className="text-xs text-zinc-350 mt-2.5 leading-relaxed">
                        Gunting kalimat terakhir yang bernada menggantung sehingga saat video berulang kembali ke detik nol pendengar tidak sadar bahwa video telah berulang. Hal ini melipatgandakan metrik retensi penonton.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ section */}
                <div className="border border-zinc-850 rounded-3xl p-6 space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-zinc-400" />
                    <span>Tanya Jawab Clipper</span>
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <p className="font-semibold text-zinc-200">Q: Apakah skema timestamps AI ini benar-benar akurat?</p>
                      <p className="text-zinc-500 mt-1 leading-relaxed">A: Sangat Akurat! Terutama ketika Anda menyalin & menempelkan Transkrip Teks mentah asli dari YouTube beserta stempel menitnya. AI mendeteksi puncak klimaks narasi untuk merancang blueprint-nya.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200">Q: Platform apa yang cocok menggunakan cetak biru ini?</p>
                      <p className="text-zinc-500 mt-1 leading-relaxed">A: Dirancang universal untuk TikTok, Instagram Reels, dan YouTube Shorts dengan target durasi di bawah 60 detik.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer Area with BABE ODED TikTok Recommendation */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="font-sans font-extrabold text-base tracking-tight bg-gradient-to-r from-rose-400 via-amber-300 to-rose-350 bg-clip-text text-transparent">
              Sunat Konten AI ✂️
            </span>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">
              Solusi cetak biru AI termutakhir untuk kreator konten portrait Indonesia. Mengubah video horizontal panjang menjadi magnet viral 9:16 instan.
            </p>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-2.5">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wide uppercase">
              Dibuat untuk Komunitas Kreator Indonesia 🇮🇩
            </span>
            <a
              href="https://www.tiktok.com/@babeoded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#000000] hover:bg-zinc-900 text-white font-sans text-xs font-bold border border-zinc-800 transition-all duration-300 shadow-lg hover:shadow-rose-950/20 group active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>Follow TikTok <strong className="text-rose-400 group-hover:text-amber-300 transition-colors">BABE ODED</strong></span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
        <div className="text-center text-[10px] text-zinc-600 mt-8 border-t border-zinc-900/40 pt-4">
          © 2026 Sunat Konten AI. Seluruh hak cipta dilindungi. Dikembangkan bersama @babeoded.
        </div>
      </footer>
    </div>
  );
}
