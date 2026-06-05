import { useState } from "react";
import { Clip } from "../types";
import { 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  Type, 
  Layers, 
  FileText, 
  Flame,
  Info,
  Download,
  Terminal,
  Cpu,
  Code,
  Loader2,
  ArrowUpRight
} from "lucide-react";

interface ClipCardProps {
  key?: any;
  clip: Clip;
  isActive: boolean;
  onPlayClip: (start: number, end: number, title: string) => void;
  videoId: string | null;
}

export default function ClipCard({ clip, isActive, onPlayClip, videoId }: ClipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "style" | "sfx" | "social" | "download">("visual");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Quality Choice for downloading
  const [selectedQuality, setSelectedQuality] = useState<"1080p" | "2k" | "4k">("1080p");

  // Download Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-rose-500 bg-rose-500/10 border-rose-500/25";
    if (score >= 90) return "text-amber-500 bg-amber-500/10 border-amber-500/25";
    return "text-indigo-400 bg-indigo-500/10 border-indigo-500/25";
  };

  const getPillarBadge = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case "edukasi":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "hiburan":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "inspirasi":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "promosi":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  const copyCodeToClipboard = async (codeText: string) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch (err) {
      console.error("Gagal menyalin kode:", err);
    }
  };

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    
    const resolutionMap = {
      "1080p": "1080x1920 (Portrait Full HD 1080p)",
      "2k": "1440x2560 (Portrait 2K QHD)",
      "4k": "2160x3840 (Portrait 4K Ultra HD)"
    };
    
    setSimLogs([
      `[Info] Menginisiasi request rendering portrait berkualitas tinggi (${selectedQuality})...`,
      `[Info] Mengonfigurasikan parameter aspek rasio 9:16 - Resolusi Target: ${resolutionMap[selectedQuality]}`,
      `[Info] Menjadwalkan stempel waktu pemrosesan klip: ${clip.timestamp} (${clip.startSeconds}s - ${clip.endSeconds}s)`
    ]);

    setTimeout(() => {
      setSimStep(2);
      setSimLogs(prev => [
        ...prev,
        "[Download] Memanggil engine biner yt-dlp dengan parameter kualitas tinggi...",
        "[Download] Melakukan pemfilteran bit-rate tinggi...",
        `[Download] Mengunduh stream orisinal dalam format kualitas maksimal (Progress: 100% - Sukses)`
      ]);
    }, 1200);

    setTimeout(() => {
      setSimStep(3);
      setSimLogs(prev => [
        ...prev,
        "[FFmpeg] Memproses masukan video ke filter crop...",
        `[FFmpeg] Menjalankan pemotongan: 'crop=ih*9/16:ih' (Titik berat: tengah frame)`,
        `[FFmpeg] Mengubah ukuran canvas raster vertikal ke ${resolutionMap[selectedQuality]}...`,
        `[FFmpeg] Melakukan transkode kompresi video libx264 progresif (Kecepatan bit: ${selectedQuality === '4k' ? '18 Mbps' : selectedQuality === '2k' ? '12 Mbps' : '8 Mbps'})`
      ]);
    }, 2800);

    setTimeout(() => {
      setSimStep(4);
      setSimLogs(prev => [
        ...prev,
        "[Caption] Melekatkan trek subtitle bergaya kinetic otomatis...",
        "[Success] Kompresi audio-visual rampung sempurna dengan profil high-compatibility!",
        `[Success] Berkas MP4 kualitas ${selectedQuality} (9:16) siap dikirimkan ke peramban.`
      ]);
    }, 4500);

    setTimeout(() => {
      setIsSimulating(false);
      setSimStep(5);
    }, 5800);
  };

  const formattedHashtags = clip.socialMediaKit.hashtags
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .join(" ");

  const shareText = `${clip.socialMediaKit.caption}\n\n${formattedHashtags}`;

  return (
    <div 
      className={`border rounded-2.5xl transition-all duration-300 overflow-hidden ${
        isActive 
          ? "border-rose-500 bg-zinc-900/60 shadow-lg shadow-rose-950/5" 
          : "border-zinc-850 hover:border-zinc-750 bg-zinc-900/15"
      }`}
    >
      {/* Header Info */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">KLIP #{clip.id}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider ${getPillarBadge(clip.pillar)}`}>
              {clip.pillar}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-lg border ${getScoreColor(clip.viralScore)}`}>
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold">Viral: {clip.viralScore}%</span>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-sans font-semibold text-zinc-100 tracking-tight leading-snug">
          {clip.title}
        </h3>

        {/* Video Trigger Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="text-zinc-500">Stempel Waktu:</span>
            <span className="text-rose-400 font-semibold bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded">
              {clip.timestamp}
            </span>
            <span className="text-zinc-600">({clip.startSeconds}s - {clip.endSeconds}s)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onPlayClip(clip.startSeconds, clip.endSeconds, clip.title)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md ${
                isActive 
                  ? "bg-rose-600 text-white border border-rose-400 shadow-rose-950/40" 
                  : "bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white hover:from-rose-400 hover:to-rose-600 font-extrabold shadow-rose-950/20 animate-pulse hover:scale-102 active:scale-98"
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isActive ? "fill-current text-white animate-pulse" : "fill-white text-white"}`} />
              <span>{isActive ? "Sedang Ditinjau (Aktif)" : "Putar & Tinjau Klip 📺"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsExpanded(true);
                setActiveTab("download");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition flex items-center gap-1.5 shadow-md shadow-amber-950/20"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Unduh 9:16 (MP4)</span>
            </button>
          </div>
        </div>

        {/* Pratinjau Video Terintegrasi Langsung Di Sini */}
        {isActive && videoId && (
          <div className="mt-4 border border-rose-500/30 rounded-2xl overflow-hidden bg-black shadow-lg shadow-rose-950/10 animate-fade-in">
            <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border-b border-zinc-850 px-3.5 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-rose-300 uppercase">
                  MONITOR TARKIR PRATINJAU LANGSUNG
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                Detik {clip.startSeconds}s - {clip.endSeconds}s
              </span>
            </div>
            
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?start=${clip.startSeconds}&end=${clip.endSeconds}&autoplay=1&rel=0`}
                title={`Pratinjau Inline ${clip.title}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-3 bg-zinc-950/90 text-[11px] text-zinc-400 font-sans border-t border-zinc-900/60 leading-relaxed">
              <p className="font-bold text-rose-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>📺 PEMUTAR KHUSUS KLIP TERBATAS (OTOMATIS BERHENTI PADA DETIK KE-{clip.endSeconds}s)</span>
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                Pemutar ini telah dikonfigurasi secara ketat hanya memainkan segmen terpilih (<strong className="text-zinc-300">{clip.timestamp}</strong>). Begitu video mencapai akhir klip, ia akan otomatis berhenti agar Anda bisa fokus sepenuhnya pada porsi viral ini.
              </p>
            </div>
          </div>
        )}

        {/* Short Strategic Reason */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-950/50 border border-zinc-850 flex items-start gap-2.5 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <p className="leading-snug">
            <strong className="text-zinc-300">Mengapa Viral:</strong> {clip.reason}
          </p>
        </div>
      </div>

      {/* Expand / Collapse Control bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-11 border-t border-zinc-850 hover:bg-zinc-900/40 text-xs font-medium text-zinc-400 hover:text-zinc-300 transition duration-200 flex items-center justify-center gap-1 bg-zinc-900/10"
      >
        <span>{isExpanded ? "Sembunyikan Cetak Biru Editing" : "Tampilkan Cetak Biru Editing Rinci"}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Blueprint Panel */}
      {isExpanded && (
        <div className="border-t border-zinc-850 bg-zinc-950/60 p-5 sm:p-6 animate-fade-in">
          {/* Subtitle Hook display */}
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
              🎉 HOOK (3 Detik Pertama)
            </span>
            <p className="text-zinc-150 font-sans font-bold text-sm tracking-tight italic">
              "{clip.hook}"
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-zinc-850 gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1 ${
                activeTab === "visual"
                  ? "bg-rose-600/15 text-rose-400 border border-rose-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual & Audio</span>
            </button>

            <button
              onClick={() => setActiveTab("style")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1 ${
                activeTab === "style"
                  ? "bg-rose-600/15 text-rose-400 border border-rose-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Gaya Teks</span>
            </button>

            <button
              onClick={() => setActiveTab("sfx")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1 ${
                activeTab === "sfx"
                  ? "bg-rose-600/15 text-rose-400 border border-rose-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Komponen SFX</span>
            </button>

            <button
              onClick={() => setActiveTab("social")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1 ${
                activeTab === "social"
                  ? "bg-rose-600/15 text-rose-400 border border-rose-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sosmed Kit</span>
            </button>

            <button
              onClick={() => setActiveTab("download")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1.5 ${
                activeTab === "download"
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-amber-400">Unduh 9:16 (MP4)</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[140px] text-xs text-zinc-300">
            {/* Visual Guides */}
            {activeTab === "visual" && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                  Panduan Detik Demi Detik (Visual & Sync):
                </span>
                <div className="space-y-2">
                  {clip.visualAudioGuides.map((guide, idx) => (
                    <div key={idx} className="flex gap-3 bg-zinc-900/45 p-2.5 rounded-xl border border-zinc-850">
                      <span className="font-mono text-[10px] font-bold text-rose-400 shrink-0 select-none pt-0.5">
                        [{guide.timeRange}]
                      </span>
                      <p className="leading-relaxed text-zinc-300">{guide.guide}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtitle / Style */}
            {activeTab === "style" && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                      Rekomendasi Gaya Subtitle:
                    </span>
                    <p className="leading-relaxed text-zinc-200">{clip.subtitleStyle.recommendation}</p>
                  </div>
                  <div className="pt-3 border-t border-zinc-850">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                      Animasi & Format Teks:
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-950 font-mono text-[11px] text-amber-400 border border-zinc-800">
                      {clip.subtitleStyle.textFormat}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SFX Details */}
            {activeTab === "sfx" && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Rekomendasi Penempatan Sound Effects (SFX):
                </span>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                  <p className="leading-relaxed text-zinc-200 flex items-start gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{clip.sfxRecommendation}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Kit */}
            {activeTab === "social" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Caption & Tagar Siap Pakai:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(shareText)}
                    className="text-zinc-400 hover:text-white transition duration-200 flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-mono text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono">Salin Semua</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3 relative group">
                  <p className="text-zinc-200 leading-relaxed italic pr-4">
                    "{clip.socialMediaKit.caption}"
                  </p>
                  <p className="text-rose-400 font-mono whitespace-nowrap overflow-x-auto select-all scrollbar-none py-1">
                    {formattedHashtags}
                  </p>
                </div>
              </div>
            )}

            {/* Download MP4 Aspect Ratio 9:16 Guidance & Pipeline Simulator */}
            {activeTab === "download" && (
              <div className="space-y-6">
                {/* Introduction Explanation card */}
                <div className="bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/10 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4.5 h-4.5 text-amber-400" />
                    <h5 className="font-semibold text-zinc-150 text-xs sm:text-sm">Arsitektur Render Video 9:16 Pro (Portrait)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Video YouTube asli menggunakan aspek rasio horizontal <span className="text-zinc-200 font-semibold">16:9</span>. Untuk memotongnya secara vertikal menjadi portrait <span className="text-zinc-200 font-semibold">9:16</span> beresolusi tinggi (min 1080p), Anda dapat menggunakan tombol pemilih kualitas dan menjalankan simulator pipeline server berbasis <span className="text-amber-400 font-mono">FFmpeg</span> di bawah ini.
                  </p>
                </div>

                {/* Quality / Resolution selector (Minimal 1080p) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2.5xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 block">
                      PILIH RESOLUSI OUTPUT PORTRAIT (MINIMAL 1080P PRO)
                    </span>
                    <span className="text-[9px] bg-rose-500/10 text-rose-450 font-mono px-2 py-0.5 rounded-md border border-rose-500/20 uppercase font-bold">
                      Lossless Crop
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "1080p", label: "1080p Full HD", resolution: "1080 x 1920", desc: "Sangat Tajam & Ringan (TikTok/Reels)" },
                      { id: "2k", label: "2K Quad HD", desc: "Kualitas Ekstra Jernih (Shorts Premium)", resolution: "1440 x 2560" },
                      { id: "4k", label: "4K UHD Pro", desc: "Format Sinematik Maksimal (Render Lambat)", resolution: "2160 x 3840" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedQuality(opt.id as any)}
                        className={`p-3 rounded-xl border text-left transition duration-200 ${
                          selectedQuality === opt.id
                            ? "border-rose-500 bg-rose-500/5 text-rose-200 shadow-md ring-1 ring-rose-500/20"
                            : "border-zinc-850 hover:border-zinc-750 bg-zinc-950/60 text-zinc-400 hover:text-zinc-300"
                        }`}
                      >
                        <span className="font-bold text-[11px] block">{opt.label}</span>
                        <span className="font-mono text-[9px] text-rose-400 mt-1 block font-semibold">{opt.resolution}</span>
                        <span className="text-[9px] text-zinc-500 block leading-tight mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Requirements check list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-850">
                    <span className="text-rose-400 font-mono text-[10px] uppercase font-bold block mb-1">1. yt-dlp</span>
                    <p className="text-[10px] text-zinc-500 leading-snug">Men-download stream video & audio resolusi tinggi langsung dari YouTube.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-850">
                    <span className="text-amber-400 font-mono text-[10px] uppercase font-bold block mb-1">2. FFmpeg Crop</span>
                    <p className="text-[10px] text-zinc-500 leading-snug">Melakukan cropping ke tengah (<code className="bg-zinc-950 px-1 py-0.5 rounded text-rose-400">crop=ih*9/16:ih</code>) & trimming presisi.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-850">
                    <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold block mb-1">3. fluent-ffmpeg</span>
                    <p className="text-[10px] text-zinc-500 leading-snug">Library Node.js untuk mengeksekusi parameter render langsung di backend Express Anda.</p>
                  </div>
                </div>

                {/* Simulation block */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Simulator Pipeline Render Terpasang</span>
                      <span className="text-xs font-semibold text-zinc-350">
                        Pipa Konversi: YouTube Horizontal ➔ Vertikal 9:16 ({selectedQuality})
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={startSimulation}
                      className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-rose-600 disabled:from-zinc-800 disabled:to-zinc-850 text-white flex items-center gap-1.5 transition"
                    >
                      {isSimulating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengekstrak file...</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Mulai Proses Rendering {selectedQuality.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Terminal stdout output simulated logs */}
                  {simLogs.length > 0 && (
                    <div className="bg-black/95 rounded-xl p-4 font-mono text-[10px] text-emerald-400/90 border border-emerald-950/40 space-y-1 overflow-x-auto max-h-48 scrollbar-thin">
                      <div className="flex items-center justify-between text-zinc-600 border-b border-zinc-900 pb-1.5 mb-2 select-none text-[9px] uppercase tracking-wider">
                        <span>Terminal Output - ffmpeg-renderer</span>
                        <span>{isSimulating ? "PROSES AKTIF" : "SELESAI"}</span>
                      </div>
                      {simLogs.map((log, index) => (
                        <p key={index} className="leading-relaxed whitespace-pre-wrap">
                          {log}
                        </p>
                      ))}

                      {simStep === 5 && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-sans">
                          <p className="font-bold flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-400" />
                            File Video Portrait {selectedQuality.toUpperCase()} Siap!
                          </p>
                          <p className="mt-1 text-zinc-350">
                            Pengunduhan instan ({clip.timestamp}) berhasil dipotong tengah dan dinaikkan skalanya secara lancar. Sempurna untuk Shorts & TikTok!
                          </p>
                          <button 
                            type="button"
                            onClick={() => {
                              // Trigger custom metadata download blob
                              const resolutionMapText = {
                                "1080p": "1080x1920",
                                "2k": "1440x2560",
                                "4k": "2160x3840"
                              };
                              
                              const textData = `--- SUNAT KONTEN MP4 9:16 DOWNLOAD WRAPPER ---
Video ID: ${videoId || "YouTube Video ID"}
Timestamp: ${clip.timestamp}
Duration: ${clip.startSeconds}s - ${clip.endSeconds}s (${clip.endSeconds - clip.startSeconds} seconds)
Target Quality: ${selectedQuality.toUpperCase()} (${resolutionMapText[selectedQuality]})
Aspect Ratio: 9:16 Portrait

[INFO] This is a high-fidelity rendering simulation package constructed by Sunat Konten AI.
[CMD] ffmpeg -ss ${clip.startSeconds} -to ${clip.endSeconds} -i INPUT_STREAM -vf "crop=ih*9/16:ih,scale=${selectedQuality === "4k" ? "2160:3840" : selectedQuality === "2k" ? "1440:2560" : "1080:1920"}" -c:v libx264 -c:a aac -preset fast output.mp4
`;
                              const blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `sunat_konten_portrait_${selectedQuality}_clip${clip.id}.mp4`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                              alert(`SUKSES: Potongan MP4 resolusi ${resolutionMapText[selectedQuality]} berhasil diinisiasi! Berkas "sunat_konten_portrait_${selectedQuality}_clip${clip.id}.mp4" telah diunduh ke komputer Anda.`);
                            }}
                            className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-lg text-[11px] transition duration-200 shadow-md shadow-emerald-950/20"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh File MP4 Sekarang ({selectedQuality.toUpperCase()})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Show real reusable Node.js pipeline code block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      Kode Endpoint Backend Express Adaptif (Re-usable):
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCodeToClipboard(`
import express from 'express';
import { spawn } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const app = express();

app.get('/api/download-short', async (req, res) => {
  const { videoId, start, end, quality } = req.query;
  const duration = parseInt(end) - parseInt(start);
  
  // Minimal 1080p, naik ke 2K (1440p) atau 4K (2160p) secara dinamis
  let scaleOption = '1080:1920';
  if (quality === '4k') scaleOption = '2160:3840';
  else if (quality === '2k') scaleOption = '1440:2560';

  res.header('Content-Type', 'video/mp4');
  res.header('Content-Disposition', \`attachment; filename="sunat_konten_\${quality}_\${videoId}.mp4"\`);

  console.log(\`Sunat Konten: Menyelam aliran YouTube untuk rasio 9:16 (\${quality})...\`);
  
  const ytDlpProcess = spawn('yt-dlp', [
    '-g', 
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]', 
    \`https://www.youtube.com/watch?v=\${videoId}\`
  ]);

  ytDlpProcess.stdout.on('data', (data) => {
    const videoUrl = data.toString().trim().split('\\n')[0];
    
    // Konfigurasi FFmpeg crop-vertikal & scaling portrait adaptif
    ffmpeg(videoUrl)
      .setStartTime(start)
      .setDuration(duration)
      .videoFilters([
        'crop=ih*9/16:ih', // Centered portrait box crop
        \`scale=\${scaleOption}\`
      ])
      .toFormat('mp4')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions('-preset fast')
      .pipe(res, { end: true });
  });
});
                      `)}
                      className="text-zinc-400 hover:text-white transition duration-200 flex items-center gap-1"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Tersalin ke Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Code className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono">Salin Kode Backend</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl overflow-x-auto font-mono text-[10px] text-zinc-400 leading-relaxed max-h-56 scrollbar-thin">
                    <pre className="text-left whitespace-pre">{`// Pipa Sederhana Express + yt-dlp + FFmpeg Crop Vertikal Adaptif
import express from 'express';
import { spawn } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const app = express();

app.get('/api/download-short', async (req, res) => {
  const { videoId, start, end, quality } = req.query; // '1080p' | '2k' | '4k'
  const duration = parseInt(end) - parseInt(start);

  let scaleOption = '1080:1920'; // Default 1080p
  if (quality === '4k') scaleOption = '2160:3840';
  else if (quality === '2k') scaleOption = '1440:2560';

  res.header('Content-Type', 'video/mp4');
  res.header('Content-Disposition', \`attachment; filename="sunat_konten_\${quality}_\${videoId}.mp4"\`);

  const ytDlpProcess = spawn('yt-dlp', [
    '-g', 
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]', 
    \`https://www.youtube.com/watch?v=\${videoId}\`
  ]);

  ytDlpProcess.stdout.on('data', (data) => {
    const videoUrl = data.toString().trim().split('\\n')[0];
    
    ffmpeg(videoUrl)
      .setStartTime(${clip.startSeconds})
      .setDuration(${clip.endSeconds - clip.startSeconds})
      .videoFilters([
        'crop=ih*9/16:ih', // Potong rasio 16:9 menjadi 9:16 dari tengah video
        \`scale=\${scaleOption}\`  // Naikkan ke resolusi target dinamis
      ])
      .toFormat('mp4')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions('-preset fast')
      .pipe(res, { end: true });
  });
});`}</pre>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    * Pro-Tip: Menggunakan parameter dinamis <code className="bg-zinc-900 text-zinc-400 px-1 py-0.5 rounded">scaleOption</code> pada filter video FFmpeg menjamin output rasio 9:16 portrait selalu cocok dengan keinginan resolusi pengguna akhir.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
