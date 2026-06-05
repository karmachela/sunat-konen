import { Play, ExternalLink, Clock, Sparkles } from "lucide-react";

interface VideoPlayerProps {
  videoId: string | null;
  videoTitle?: string;
  videoAuthor?: string;
  startSeconds: number;
  endSeconds: number;
  clipTitle?: string;
}

export default function VideoPlayer({
  videoId,
  videoTitle = "",
  videoAuthor = "",
  startSeconds = 0,
  endSeconds = 0,
  clipTitle = "",
}: VideoPlayerProps) {
  
  if (!videoId) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-[350px] sm:h-[455px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-zinc-950/20 to-zinc-950 pointer-events-none" />
        <div className="bg-zinc-850 p-4 rounded-2xl border border-zinc-800 text-rose-500 mb-4 group-hover:scale-105 transition-transform duration-300">
          <Play className="w-10 h-10 fill-rose-500" />
        </div>
        <h3 className="text-lg font-sans font-semibold text-zinc-100 tracking-tight">Studio Review Klip</h3>
        <p className="text-sm text-zinc-400 max-w-sm mt-2">
          Tempel tautan video YouTube di bilah kiri, lalu klik <span className="text-zinc-200 font-medium">"Analisis Klip Viral"</span> untuk memuat instansi player dan cetak biru editing secara otomatis.
        </p>
      </div>
    );
  }

  // Create YouTube Embed URL with timestamps
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}&autoplay=1&rel=0`;
  const duration = endSeconds - startSeconds;

  return (
    <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl overflow-hidden shadow-xl flex flex-col">
      {/* Embedded Iframe */}
      <div className="relative aspect-video w-full bg-black border-b border-zinc-850">
        <iframe
          src={embedUrl}
          title={videoTitle || "Pratinjau Video YouTube"}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* Metadata Panel */}
      <div className="p-6 bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
              <Sparkles className="w-3 h-3 animate-pulse" /> Sedang Ditinjau
            </span>
            <h4 className="text-sm font-semibold text-zinc-300 truncate" title={videoTitle}>
              {videoTitle}
            </h4>
            <p className="text-xs text-zinc-500 mt-1">Oleh: {videoAuthor || "Kreator Konten"}</p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10">
              <Clock className="w-3.5 h-3.5" />
              <span>Durasi Klip: {duration} detik</span>
            </div>
          </div>
        </div>

        {clipTitle && (
          <div className="mt-4 pt-4 border-t border-zinc-850">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Fokus Klip Aktif</span>
            <div className="flex items-start justify-between gap-4 mt-1">
              <h3 className="text-sm font-sans font-medium text-zinc-100 tracking-tight leading-snug">
                "{clipTitle}"
              </h3>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}`}
                target="_blank"
                rel="noreferrer referrer"
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 shrink-0 transition"
              >
                <span>Buka YT</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="mt-3 flex gap-2">
              <span className="text-[11px] font-mono text-zinc-500">Stempel Detik:</span>
              <span className="text-[11px] font-mono font-semibold text-zinc-300">
                {startSeconds}s - {endSeconds}s
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
