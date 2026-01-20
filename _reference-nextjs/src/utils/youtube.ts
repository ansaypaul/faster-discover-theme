export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Patterns possibles pour les URLs YouTube
  const patterns = [
    // youtu.be URLs
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/watch URLs
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed URLs
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Patterns plus larges en fallback
    /youtu\.be\/([^?&#\s]+)/,
    /youtube\.com\/watch\?.*v=([^?&#\s]+)/,
    /youtube\.com\/embed\/([^?&#\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
} 