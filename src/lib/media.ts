const videoExtensions = /\.(mp4|webm|mov)$/i;

export function isVideoMediaUrl(url?: string | null) {
  if (!url) return false;

  try {
    return videoExtensions.test(new URL(url).pathname);
  } catch {
    return videoExtensions.test(url.split("?")[0] ?? url);
  }
}
