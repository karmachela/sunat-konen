export interface EditSegment {
  timeRange: string;
  guide: string;
}

export interface Clip {
  id: number;
  title: string;
  timestamp: string;
  startSeconds: number;
  endSeconds: number;
  viralScore: number;
  pillar: string;
  hook: string;
  visualAudioGuides: EditSegment[];
  subtitleStyle: {
    recommendation: string;
    textFormat: string;
  };
  sfxRecommendation: string;
  socialMediaKit: {
    caption: string;
    hashtags: string[];
  };
  reason: string;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  author: string;
  description: string;
}

export interface AnalysisResult {
  metadata: VideoMetadata;
  clips: Clip[];
}
