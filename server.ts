import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to extract YouTube Video ID
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Scrape YouTube metadata
async function fetchYouTubeMetadata(videoId: string) {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) return null;
    const html = await response.text();

    let title = "";
    const titleMatch = html.match(/<meta property="og:title" content="(.*?)">/) || html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      title = titleMatch[1].replace(" - YouTube", "");
    }

    let author = "";
    const authorMatch = html.match(/<link itemprop="name" content="(.*?)">/) || html.match(/"author":"(.*?)"/);
    if (authorMatch) {
      author = authorMatch[1];
    } else {
      const channelMatch = html.match(/<meta itemprop="channelId" content="(.*?)">/);
      if (channelMatch) {
        author = "Channel " + channelMatch[1].substring(0, 8);
      }
    }

    let description = "";
    const descMatch = html.match(/<meta name="description" content="(.*?)">/) || html.match(/<meta property="og:description" content="(.*?)">/);
    if (descMatch) {
      description = descMatch[1];
    }

    // Unescape html entities briefly
    title = title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    author = author.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    description = description.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").substring(0, 500);

    return { title, author, description };
  } catch (error) {
    console.error("Gagal mengambil metadata YouTube langsung:", error);
    return null;
  }
}

// Initialize @google/genai (lazy initialized inside the route logic if needed, but safe here with key check)
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Silakan tambahkan kunci API Anda di panel Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API: Analyze YouTube URL
app.post("/api/analyze", async (req: Request, res: Response): Promise<any> => {
  try {
    const { url, transcript, targetPillar, clipDuration, customPrompt } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL YouTube harus diisi." });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: "Format URL YouTube tidak valid." });
    }

    // Step 1: Scrape original info if possible
    let meta = await fetchYouTubeMetadata(videoId);
    if (!meta || !meta.title) {
      meta = {
        title: `Video YouTube (ID: ${videoId})`,
        author: "Kreator Konten",
        description: "Video YouTube murni untuk analisis klip."
      };
    }

    // Step 2: Query Gemini
    const ai = getGeminiClient();

    const systemInstruction = `Anda adalah seorang Pembuat Aplikasi Klip Video Editor Profesional, Kurator Konten Viral, dan Ahli Strategi Pertumbuhan Algoritma di TikTok, Instagram Reels, dan YouTube Shorts.
Tugas utama Anda adalah menganalisis input metadata video (Title, Author, Description) dan TRANSKRIPSI VIDEO (jika disediakan oleh user) untuk mencarikan 3 hingga 5 cuplikan klip kliping dengan POTENSI VIRAL SANGAT TINGGI (skor viral tinggi, hook solid, penyampaian emosional, atau momen komedi pecah).

PILIHAN STRATEGI KONTEN:
- Target Pilar Konten: ${targetPillar || "Semua (Campuran Terbaik)"}
- Durasi Klip: ${clipDuration || "Standar (30-60 detik)"}
- Instruksi Khusus Kreator: ${customPrompt || "Tidak ada"}

Untuk setiap klip yang Anda temukan (maksimal 5 klip terbaik), sediakan:
1. Klikbait & Judul Klip yang sangat memikat untuk memancing klik.
2. Estimasi Stempel Waktu (Timestamp) yang akurat (Misalnya, jika video berdurasi panjang, letakkan klip pada stempel logis seperti 01:15 - 01:45).
3. Estimasikan startSeconds dan endSeconds dalam bentuk integer (misal: startSeconds: 75, endSeconds: 105). Pastikan selisih endSeconds dan startSeconds tidak melebihi 60 detik (durasi maksimal short-form video)!
4. Pilar Konten (Edukasi, Hiburan, Inspirasi, atau Promosi).
5. Hook 3 Detik Pertama: Teks visual pemancing klik yang HARUS muncul tebal di tengah layar untuk menahan retensi penonton.
6. Panduan Efek Visual & Efek Suara (SFX) detik-demi-detik yang sangat rinci untuk editor video, berikan gaya cinematic yang agresif (asumsi format potong cepat/jump cuts, zoom-in, b-roll, transisi whoosh).
7. Gaya Subtitle / Captions: Rekomendasi palet warna (misal: kuning neon, hijau lime), posisi teks (tengah bawah, tengah), dan gaya animasi (kata per kata / per suku kata).
8. Detail sfX yang direkomendasikan dan peletakannya.
9. Paket Sosmed Lengkap: Caption viral pendek penimbul rasa penasaran, dan tepat 5 hashtag relevan industri.
10. Penjelasan Logis kenapa klip ini bakal viral di TikTok/Shorts (pemicu emosi psikologis, kontroversi, drama, komedi, edukasi terobosan)`;

    const userPrompt = `
Berikut adalah data video YouTube yang ingin dianalisis:
ID Video: ${videoId}
Judul Video: ${meta.title}
Nama Channel / Author: ${meta.author}
Deskripsi Video: ${meta.description}

TRANSKRIP VIDEO YANG DISEDIAKAN OLEH USER (SANGAT UTAMAKAN INI JIKA TERSEDIA UNTUK TIMESTAMP YANG SANGAT AKURAT):
${transcript ? transcript : "(User tidak menyertakan transkrip teks mentah. Menggunakan metadata judul & deskripsi untuk menyusun 3-5 klip pemicu viral di YouTube Shorts/TikTok/Instagram Reels berdasarkan wawasan industri video)"}

Silakan analisis data di atas dan hasilkan output JSON terstruktur sesuai format skema yang telah ditentukan secara lengkap dalam Bahasa Indonesia yang profesional, penuh gaya, dan mudah dipahami oleh editor video.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metadata: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "author"]
            },
            clips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Judul klip clickbait yang sangat menarik" },
                  timestamp: { type: Type.STRING, description: "Format stempel waktu MM:SS - MM:SS" },
                  startSeconds: { type: Type.INTEGER, description: "Waktu mulai klip dalam detik (mulai dari 0)" },
                  endSeconds: { type: Type.INTEGER, description: "Waktu selesai klip dalam detik" },
                  viralScore: { type: Type.INTEGER, description: "Skor persentase potensi viral (0 hingga 100)" },
                  pillar: { type: Type.STRING, description: "Pilar Konten: Edukasi, Hiburan, Inspirasi, atau Promosi" },
                  hook: { type: Type.STRING, description: "Kalimat teks pemancing di layar di 3 detik pertama" },
                  visualAudioGuides: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeRange: { type: Type.STRING, description: "Rentang waktu, contoh: 'Detik 00:00 - 00:03' atau 'Detik 00:04 - 00:10'" },
                        guide: { type: Type.STRING, description: "Instruksi visual atau sound effect rinci" }
                      },
                      required: ["timeRange", "guide"]
                    }
                  },
                  subtitleStyle: {
                    type: Type.OBJECT,
                    properties: {
                      recommendation: { type: Type.STRING, description: "Rekomendasi warna, letak, & efek teks" },
                      textFormat: { type: Type.STRING, description: "Format animasi teks, contoh: muncul kata-per-kata bergantian" }
                    },
                    required: ["recommendation", "textFormat"]
                  },
                  sfxRecommendation: { type: Type.STRING, description: "Rekomendasi sound effects khusus" },
                  socialMediaKit: {
                    type: Type.OBJECT,
                    properties: {
                      caption: { type: Type.STRING, description: "Caption sosial media viral" },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Kumpulan 5 hashtag relevan"
                      }
                    },
                    required: ["caption", "hashtags"]
                  },
                  reason: { type: Type.STRING, description: "Mengapa klip ini direkomendasikan (alasan viral)" }
                },
                required: [
                  "id", "title", "timestamp", "startSeconds", "endSeconds", "viralScore",
                  "pillar", "hook", "visualAudioGuides", "subtitleStyle",
                  "sfxRecommendation", "socialMediaKit", "reason"
                ]
              }
            }
          },
          required: ["metadata", "clips"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      return res.status(500).json({ error: "Gagal memproses video menggunakan AI." });
    }

    const parsedJson = JSON.parse(outputText.trim());
    
    // Inject videoId into metadata
    if (parsedJson.metadata) {
      parsedJson.metadata.videoId = videoId;
    }

    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error saat menganalisis video:", error);
    return res.status(500).json({ 
      error: error.message || "Terjadi kesalahan internal ketika memproses analisis video." 
    });
  }
});

// Serve frontend build (production / development routing)
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
}

setupServer();
