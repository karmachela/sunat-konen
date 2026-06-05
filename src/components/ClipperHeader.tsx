import { Flame, Scissors, Sparkles } from "lucide-react";

export default function ClipperHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-rose-600 to-amber-500 p-2 rounded-xl text-white shadow-lg shadow-rose-950/20">
            <Scissors className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              Sunat Konten ✂️
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 uppercase">
              Pro Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>AI Strategist Mode</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400">Gemini 3.5 Engine</span>
          </div>
        </div>
      </div>
    </header>
  );
}
