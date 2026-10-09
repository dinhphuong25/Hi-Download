import type { NextApiRequest, NextApiResponse } from 'next';
import { getMockVideoData } from '@/mockData';
import {
  ttdl,
  youtube,
  fbdown,
  igdl,
  twitter,
  threads,
  pinterest,
  capcut,
  douyin,
  aio,
} from 'btch-downloader';
// @ts-ignore
import getFBInfo from '@renpwn/fb-downloader';

// Self-contained server-side platform detector to avoid chunk-splitting cross-boundary runtime issues
function detectPlatform(url: string): { id: string; name: string } | null {
  if (!url) return null;
  const u = url.trim();
  if (/(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(u)) return { id: 'tiktok', name: 'TikTok' };
  if (/(douyin\.com|v\.douyin\.com)/i.test(u)) return { id: 'douyin', name: 'Douyin' };
  if (/(instagram\.com)/i.test(u)) return { id: 'instagram', name: 'Instagram' };
  if (/(facebook\.com|fb\.watch|fb\.gg)/i.test(u)) return { id: 'facebook', name: 'Facebook' };
  if (/(youtube\.com|youtu\.be)/i.test(u)) return { id: 'youtube', name: 'YouTube' };
  if (/(capcut\.com)/i.test(u)) return { id: 'capcut', name: 'CapCut' };
  if (/(twitter\.com|x\.com)/i.test(u)) return { id: 'twitter', name: 'Twitter/X' };
  if (/(threads\.net)/i.test(u)) return { id: 'threads', name: 'Threads' };
  if (/(pinterest\.com|pin\.it)/i.test(u)) return { id: 'pinterest', name: 'Pinterest' };
  if (/(bilibili\.com|b23\.tv)/i.test(u)) return { id: 'bilibili', name: 'Bilibili' };
  if (/(kuaishou\.com|v\.kuaishou\.com)/i.test(u)) return { id: 'kuaishou', name: 'Kuaishou' };
  return null;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return _;
      }
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return _;
      }
    })
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export type VideoFormat = {
  quality: string;
  label: string;
  url: string;
  type: 'video' | 'audio' | 'image';
  extension: 'mp4' | 'mp3' | 'jpg' | 'png' | 'webp';
  badge?: string;
  thumbnail?: string;
};

export type ExtractResponse = {
  success: boolean;
  platform: string;
  platformName: string;
  title: string;
  thumbnail: string;
  authorName: string;
  duration?: string;
  videoUrl: string;
  videoHdUrl?: string | null;
  videoSdUrl?: string | null;
  mp3Url: string | null;
  formats: VideoFormat[];
  mediaType?: 'video' | 'photo' | 'mixed';
  isPhotoSlide?: boolean;
  images?: string[];
  musicTitle?: string;
  isMock?: boolean;
};

export type ErrorResponse = {
  success: boolean;
  error: 'INVALID_URL' | 'PRIVATE_VIDEO' | 'EXPIRED_LINK' | 'SERVER_ERROR';
  message: string;
};

const TIKWM_API = 'https://www.tikwm.com/api/';

// High-speed In-Memory Cache (TTL: 2 Hours)
interface CacheEntry {
  data: ExtractResponse;
  expiresAt: number;
}
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const extractionCache = new Map<string, CacheEntry>();

// In-Flight Promise Deduplication to prevent redundant slow API hits
const inFlightRequests = new Map<string, Promise<ExtractResponse>>();

function getCached(key: string): ExtractResponse | null {
  const item = extractionCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    extractionCache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key: string, data: ExtractResponse) {
  if (extractionCache.size > 1000) {
    const firstKey = extractionCache.keys().next().value;
    if (firstKey) extractionCache.delete(firstKey);
  }
  extractionCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Security: Anti-SSRF URL validator
function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host === '0.0.0.0' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '169.254.169.254' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Security: In-memory sliding rate limiter (60 req/min per IP)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

// Fast unshortener for shortened URLs (vm.tiktok.com, youtu.be, fb.watch, pin.it, etc.)
async function unshortenUrl(rawUrl: string): Promise<string> {
  const isShortened = /(vm\.tiktok\.com|vt\.tiktok\.com|v\.douyin\.com|youtu\.be|fb\.watch|pin\.it|v\.kuaishou\.com|facebook\.com\/share\/|threads\.net\/share\/)/i.test(
    rawUrl,
  );
  if (!isShortened) return rawUrl;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const resp = await fetch(rawUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      },
    });
    clearTimeout(timeout);
    return resp.url || rawUrl;
  } catch {
    return rawUrl;
  }
}

// Multi-Tier Facebook Media Extractor
async function extractFacebookMedia(expandedUrl: string): Promise<{
  hdUrl: string | null;
  sdUrl: string | null;
  title: string;
  thumbnail: string;
  authorName: string;
} | null> {
  // Method 1: @renpwn/fb-downloader with 8.5s timeout protection
  try {
    const fbInfoPromise = getFBInfo(expandedUrl);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8500));
    const info = await Promise.race([fbInfoPromise, timeoutPromise]);
    if (info && (info.hd || info.sd)) {
      return {
        hdUrl: info.hd || null,
        sdUrl: info.sd || null,
        title: decodeHtmlEntities(info.title || 'Facebook Video HD'),
        thumbnail: info.thumbnail || '',
        authorName: 'Facebook User',
      };
    }
  } catch (_) {}

  // If URL has reel ID, try /watch/?v=
  const reelIdMatch = expandedUrl.match(/facebook\.com\/reel\/(\d+)/i);
  if (reelIdMatch && reelIdMatch[1]) {
    try {
      const fbInfoPromise = getFBInfo(`https://www.facebook.com/watch/?v=${reelIdMatch[1]}`);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8500));
      const info = await Promise.race([fbInfoPromise, timeoutPromise]);
      if (info && (info.hd || info.sd)) {
        return {
          hdUrl: info.hd || null,
          sdUrl: info.sd || null,
          title: decodeHtmlEntities(info.title || 'Facebook Reel HD'),
          thumbnail: info.thumbnail || '',
          authorName: 'Facebook User',
        };
      }
    } catch (_) {}
  }

  // Method 2: Direct Facebook HTML Scraping
  try {
    const res = await fetch(expandedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
      },
    });
    if (res.ok) {
      const html = await res.text();
      const hdMatch =
        html.match(/"browser_native_hd_url":"([^"]+)"/) ||
        html.match(/"playable_url_quality_hd":"([^"]+)"/);
      const sdMatch =
        html.match(/"browser_native_sd_url":"([^"]+)"/) ||
        html.match(/"playable_url":"([^"]+)"/);

      const cleanJson = (str?: string) => {
        if (!str) return null;
        try {
          return JSON.parse(`{"u":"${str}"}`).u;
        } catch {
          return str.replace(/\\u0025/g, '%').replace(/\\u0026/g, '&').replace(/\\\//g, '/');
        }
      };

      const hdUrl = cleanJson(hdMatch?.[1]);
      const sdUrl = cleanJson(sdMatch?.[1]);

      if (hdUrl || sdUrl) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(/ \| Facebook/g, '').trim() : 'Facebook Video HD';
        return {
          hdUrl: hdUrl || null,
          sdUrl: sdUrl || null,
          title,
          thumbnail: '',
          authorName: 'Facebook User',
        };
      }
    }
  } catch (_) {}

  // Method 3: btch.fbdown with generous timeout
  try {
    const fbPromise = fbdown(expandedUrl);
    const fbTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
    const fbData = await Promise.race([fbPromise, fbTimeout]);
    if (fbData && (fbData.HD || fbData.Normal_video)) {
      return {
        hdUrl: fbData.HD || null,
        sdUrl: fbData.Normal_video || null,
        title: 'Facebook Video HD',
        thumbnail: '',
        authorName: 'Facebook User',
      };
    }
  } catch (_) {}

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractResponse | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Phương thức không được hỗ trợ. Vui lòng gửi POST request.',
    });
  }

  // Security: Client IP Rate Limiting
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Hệ thống phát hiện tần suất yêu cầu cao. Vui lòng thử lại sau ít phút.',
    });
  }

  const { url, forceMock } = req.body as { url: string; forceMock?: boolean };

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_URL',
      message: 'Đường dẫn video không được để trống. Vui lòng nhập link cần tải.',
    });
  }

  const cleanUrl = url.trim();

  // Security: Payload length check & Anti-SSRF check
  if (cleanUrl.length > 2048 || !isSafeUrl(cleanUrl)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_URL',
      message: 'Đường dẫn không hợp lệ hoặc bị chặn bởi hệ thống phòng vệ an ninh.',
    });
  }

  // Check in-memory fast cache first (0ms instant response)
  const cacheKey = cleanUrl.toLowerCase();
  const cachedResult = getCached(cacheKey);
  if (cachedResult && !forceMock) {
    return res.status(200).json(cachedResult);
  }

  // Deduplicate concurrent in-flight extractions for the exact same URL
  if (inFlightRequests.has(cacheKey) && !forceMock) {
    try {
      const activeResult = await inFlightRequests.get(cacheKey)!;
      return res.status(200).json(activeResult);
    } catch (_) {}
  }

  // Resolve shortened redirects if applicable
  const expandedUrl = await unshortenUrl(cleanUrl);

  const platformMeta = detectPlatform(expandedUrl) || detectPlatform(cleanUrl);
  const platformId = platformMeta?.id || 'tiktok';

  // If forceMock requested or user testing sample mock
  if (forceMock) {
    const mock = getMockVideoData(platformId, expandedUrl);
    const result: ExtractResponse = {
      success: true,
      ...mock,
      isMock: true,
    };
    setCached(cacheKey, result);
    return res.status(200).json(result);
  }

  try {
    // 1. TikTok & Douyin
    if (platformId === 'tiktok' || platformId === 'douyin') {
      try {
        const noQueryUrl = expandedUrl.split('?')[0];
        const tikwmRes = await fetch(
          `${TIKWM_API}?url=${encodeURIComponent(noQueryUrl)}&hd=1`,
          {
            method: 'GET',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            },
          },
        );

        if (tikwmRes.ok) {
          const tikwmData = await tikwmRes.json();
          if (tikwmData.code === 0 && tikwmData.data) {
            const v = tikwmData.data;

            // Check if this is a Photo Slide / Album post (like /photo/ or v.images present)
            const isPhotoMode = Boolean(
              (v.images && Array.isArray(v.images) && v.images.length > 0) ||
              expandedUrl.includes('/photo/')
            );

            if (isPhotoMode) {
              const rawImages: string[] =
                v.images && Array.isArray(v.images) && v.images.length > 0
                  ? v.images
                  : v.cover
                  ? [v.cover]
                  : [];
              const musicUrl = v.music || v.play || null;

              const formats: VideoFormat[] = rawImages.map((imgUrl: string, idx: number) => ({
                quality: `Ảnh HD #${idx + 1}`,
                label: `Tải Ảnh #${idx + 1} (Gốc Không Watermark)`,
                url: imgUrl,
                type: 'image',
                extension: 'jpg',
                badge: idx === 0 ? 'Ảnh Bìa' : `Ảnh ${idx + 1}`,
                thumbnail: imgUrl,
              }));

              if (musicUrl) {
                formats.push({
                  quality: 'MP3 320kbps',
                  label: `Tải Nhạc Nền MP3 (${v.music_info?.title || 'Âm Thanh Gốc'})`,
                  url: musicUrl,
                  type: 'audio',
                  extension: 'mp3',
                  badge: 'Audio Gốc',
                });
              }

              const result: ExtractResponse = {
                success: true,
                platform: platformId,
                platformName: platformMeta?.name || 'TikTok',
                mediaType: 'photo',
                isPhotoSlide: true,
                images: rawImages,
                musicTitle: v.music_info?.title || 'Nhạc nền TikTok',
                videoUrl: rawImages[0] || '',
                videoHdUrl: null,
                videoSdUrl: null,
                mp3Url: musicUrl,
                title:
                  v.title ||
                  (v.author?.nickname
                    ? `Album ảnh TikTok của @${v.author.unique_id || v.author.nickname}`
                    : 'TikTok Photo Album'),
                thumbnail: rawImages[0] || v.cover || '',
                authorName: v.author?.nickname || (v.author?.unique_id ? `@${v.author.unique_id}` : 'TikTok User'),
                formats,
                isMock: false,
              };
              setCached(cacheKey, result);
              return res.status(200).json(result);
            }

            // Normal Video Mode
            const hdUrl = v.hdplay || '';
            const sdUrl = v.play || '';
            const musicUrl = v.music || null;
            const primaryVideo = hdUrl || sdUrl;

            const formats: VideoFormat[] = [];
            if (hdUrl) {
              formats.push({
                quality: 'Full HD 1080p',
                label: 'Tải Video HD Gốc Không Logo',
                url: hdUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Không Watermark',
              });
            }
            if (sdUrl && sdUrl !== hdUrl) {
              formats.push({
                quality: 'SD 720p',
                label: 'Tải Video SD (Nhẹ hơn)',
                url: sdUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Tải Nhanh',
              });
            }
            if (musicUrl) {
              formats.push({
                quality: 'MP3 320kbps',
                label: 'Tải Nhạc Nền MP3 Gốc',
                url: musicUrl,
                type: 'audio',
                extension: 'mp3',
                badge: 'Âm Thanh Gốc',
              });
            }

            if (primaryVideo) {
              const result: ExtractResponse = {
                success: true,
                platform: platformId,
                platformName: platformMeta?.name || 'TikTok',
                mediaType: 'video',
                videoUrl: primaryVideo,
                videoHdUrl: hdUrl || null,
                videoSdUrl: sdUrl || null,
                mp3Url: musicUrl,
                title: v.title || (platformId === 'douyin' ? 'Douyin Video' : 'TikTok Video'),
                thumbnail: v.cover || '',
                authorName: v.author?.nickname || 'TikTok User',
                formats,
                isMock: false,
              };
              setCached(cacheKey, result);
              return res.status(200).json(result);
            }
          }
        }
      } catch (_) {}

      // Fallback parser for Douyin / TikTok
      if (platformId === 'douyin') {
        const dData = await douyin(expandedUrl);
        const dUrl = (dData as any)?.url;
        if (dUrl) {
          const result: ExtractResponse = {
            success: true,
            platform: 'douyin',
            platformName: 'Douyin',
            mediaType: 'video',
            videoUrl: dUrl,
            videoHdUrl: dUrl,
            videoSdUrl: null,
            mp3Url: null,
            title: (dData as any).title || 'Douyin Video HD',
            thumbnail: '',
            authorName: '',
            formats: [
              {
                quality: 'HD Không Logo',
                label: 'Tải Video Douyin Gốc',
                url: dUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Không Watermark',
              },
            ],
            isMock: false,
          };
          setCached(cacheKey, result);
          return res.status(200).json(result);
        }
      } else {
        const ttData = await ttdl(expandedUrl);
        const isPhotoMode =
          expandedUrl.includes('/photo/') ||
          (Array.isArray(ttData?.video) && ttData.video.length > 1);

        if (isPhotoMode && ttData) {
          const rawImages: string[] = Array.isArray(ttData.video)
            ? ttData.video
            : [ttData.thumbnail || ''].filter(Boolean);
          const aUrl = ttData.audio?.[0] || null;

          const formats: VideoFormat[] = rawImages.map((imgUrl: string, idx: number) => ({
            quality: `Ảnh HD #${idx + 1}`,
            label: `Tải Ảnh #${idx + 1} (Gốc Không Watermark)`,
            url: imgUrl,
            type: 'image',
            extension: 'jpg',
            badge: idx === 0 ? 'Ảnh Bìa' : `Ảnh ${idx + 1}`,
            thumbnail: imgUrl,
          }));

          if (aUrl) {
            formats.push({
              quality: 'MP3 320kbps',
              label: 'Tải Nhạc Nền MP3 Gốc',
              url: aUrl,
              type: 'audio',
              extension: 'mp3',
              badge: 'Audio Gốc',
            });
          }

          const result: ExtractResponse = {
            success: true,
            platform: 'tiktok',
            platformName: 'TikTok',
            mediaType: 'photo',
            isPhotoSlide: true,
            images: rawImages,
            musicTitle: ttData.title_audio || 'Nhạc nền TikTok',
            videoUrl: rawImages[0] || '',
            videoHdUrl: null,
            videoSdUrl: null,
            mp3Url: aUrl,
            title: ttData.title || 'TikTok Photo Album',
            thumbnail: rawImages[0] || ttData.thumbnail || '',
            authorName: 'TikTok User',
            formats,
            isMock: false,
          };
          setCached(cacheKey, result);
          return res.status(200).json(result);
        }

        const vUrl = (ttData as any)?.video?.[0] || (ttData as any)?.video || '';
        const aUrl = (ttData as any)?.audio?.[0] || null;
        if (vUrl || aUrl) {
          const formats: VideoFormat[] = [];
          if (vUrl) {
            formats.push({
              quality: 'HD Không Logo',
              label: 'Tải Video TikTok HD',
              url: vUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Không Watermark',
            });
          }
          if (aUrl) {
            formats.push({
              quality: 'MP3 Gốc',
              label: 'Tải Nhạc Nền MP3',
              url: aUrl,
              type: 'audio',
              extension: 'mp3',
              badge: 'Âm Thanh Gốc',
            });
          }
          const result: ExtractResponse = {
            success: true,
            platform: 'tiktok',
            platformName: 'TikTok',
            mediaType: 'video',
            videoUrl: vUrl,
            videoHdUrl: vUrl,
            videoSdUrl: null,
            mp3Url: aUrl,
            title: ttData.title || 'TikTok Video',
            thumbnail: ttData.thumbnail || '',
            authorName: 'TikTok User',
            formats,
            isMock: false,
          };
          setCached(cacheKey, result);
          return res.status(200).json(result);
        }
      }
    }

    // 2. YouTube: Fast parallel oEmbed + 4.5s stream race
    if (platformId === 'youtube') {
      const ytIdMatch = expandedUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/i,
      );
      const ytId = ytIdMatch ? ytIdMatch[1] : null;

      // Start fast oEmbed fetch in parallel (takes ~80ms)
      const oEmbedPromise = ytId
        ? fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`,
            {
              headers: { 'User-Agent': 'Mozilla/5.0' },
            },
          )
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        : Promise.resolve(null);

      // Race youtube(...) with 12s timeout
      const ytPromise = youtube(expandedUrl).catch(() => null);
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 12000),
      );

      const [oEmbedData, ytData] = await Promise.all([
        oEmbedPromise,
        Promise.race([ytPromise, timeoutPromise]),
      ]);

      const title = ytData?.title || oEmbedData?.title || 'YouTube Video HD';
      const author = ytData?.author || oEmbedData?.author_name || 'YouTube Creator';
      const thumbnail =
        ytData?.thumbnail ||
        (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

      const formats: VideoFormat[] = [];

      if (ytData?.mp4) {
        formats.push({
          quality: 'Full HD 1080p / 720p',
          label: 'Tải Video HD Gốc (Âm thanh đầy đủ)',
          url: ytData.mp4,
          type: 'video',
          extension: 'mp4',
          badge: 'Siêu Nét',
        });
      }

      if (ytData?.mp3) {
        formats.push({
          quality: 'MP3 320kbps',
          label: 'Tải Âm Thanh MP3 Studio Cao Cấp',
          url: ytData.mp3,
          type: 'audio',
          extension: 'mp3',
          badge: 'Audio Gốc',
        });
      }

      if (formats.length > 0) {
        const result: ExtractResponse = {
          success: true,
          platform: 'youtube',
          platformName: 'YouTube',
          videoUrl: ytData?.mp4 || formats[0]?.url || '',
          videoHdUrl: ytData?.mp4 || formats[0]?.url || null,
          videoSdUrl: null,
          mp3Url: ytData?.mp3 || formats.find((f) => f.type === 'audio')?.url || null,
          title,
          thumbnail,
          authorName: author,
          formats,
          isMock: false,
        };
        setCached(cacheKey, result);
        return res.status(200).json(result);
      }
    }

    // 3. Facebook
    if (platformId === 'facebook') {
      try {
        const fbResult = await extractFacebookMedia(expandedUrl);
        if (fbResult && (fbResult.hdUrl || fbResult.sdUrl)) {
          const formats: VideoFormat[] = [];
          if (fbResult.hdUrl) {
            formats.push({
              quality: 'Full HD 1080p',
              label: 'Tải Video HD Gốc Không Logo',
              url: fbResult.hdUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Siêu Nét',
            });
          }
          if (fbResult.sdUrl && fbResult.sdUrl !== fbResult.hdUrl) {
            formats.push({
              quality: 'SD 720p',
              label: 'Tải Video SD Tiết Kiệm Dung Lượng',
              url: fbResult.sdUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Tải Nhanh',
            });
          }
          const primaryVideo = fbResult.hdUrl || fbResult.sdUrl || '';
          const result: ExtractResponse = {
            success: true,
            platform: 'facebook',
            platformName: 'Facebook',
            videoUrl: primaryVideo,
            videoHdUrl: fbResult.hdUrl || null,
            videoSdUrl: fbResult.sdUrl || null,
            mp3Url: null,
            title: fbResult.title || 'Facebook Reels / Watch Video HD',
            thumbnail: fbResult.thumbnail || '',
            authorName: fbResult.authorName || 'Facebook User',
            formats,
            isMock: false,
          };
          setCached(cacheKey, result);
          return res.status(200).json(result);
        }
      } catch (_) {}
    }

    // 4. Instagram
    if (platformId === 'instagram') {
      const igData = await igdl(expandedUrl);
      if (igData && Array.isArray(igData.result) && igData.result.length > 0) {
        const isAllImages = igData.result.every((item: any) => !item.url?.includes('.mp4'));
        const images = igData.result
          .filter((item: any) => !item.url?.includes('.mp4'))
          .map((item: any) => item.url);

        const formats: VideoFormat[] = igData.result.map((item: any, idx: number) => {
          const isVideo = item.url?.includes('.mp4');
          return {
            quality: isVideo ? `Video #${idx + 1}` : `Ảnh #${idx + 1}`,
            label: isVideo
              ? `Tải Video #${idx + 1} (Gốc HD)`
              : `Tải Ảnh #${idx + 1} (Gốc Không Watermark)`,
            url: item.url,
            type: isVideo ? 'video' : 'image',
            extension: isVideo ? 'mp4' : 'jpg',
            badge: idx === 0 ? 'Mục #1' : `Mục #${idx + 1}`,
            thumbnail: item.thumbnail || item.url,
          };
        });

        const first = igData.result[0];
        const result: ExtractResponse = {
          success: true,
          platform: 'instagram',
          platformName: 'Instagram',
          mediaType: isAllImages ? 'photo' : images.length > 0 ? 'mixed' : 'video',
          isPhotoSlide: isAllImages || images.length > 0,
          images: images.length > 0 ? images : undefined,
          videoUrl: first.url,
          videoHdUrl: first.url,
          videoSdUrl: null,
          mp3Url: null,
          title: isAllImages ? 'Instagram Photo Carousel' : 'Instagram Post / Reel',
          thumbnail: first.thumbnail || first.url || '',
          authorName: '',
          formats,
          isMock: false,
        };
        setCached(cacheKey, result);
        return res.status(200).json(result);
      }
    }

    // 5. CapCut
    if (platformId === 'capcut') {
      const capData = await capcut(expandedUrl);
      if (capData && capData.originalVideoUrl) {
        const result: ExtractResponse = {
          success: true,
          platform: 'capcut',
          platformName: 'CapCut',
          videoUrl: capData.originalVideoUrl,
          videoHdUrl: capData.originalVideoUrl,
          videoSdUrl: null,
          mp3Url: null,
          title: capData.title || 'CapCut Template Video',
          thumbnail: capData.coverUrl || '',
          authorName: capData.authorName || '',
          formats: [
            {
              quality: 'HD Không Logo',
              label: 'Tải Video CapCut Xóa Logo Kết Thúc',
              url: capData.originalVideoUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Không Watermark',
            },
          ],
          isMock: false,
        };
        setCached(cacheKey, result);
        return res.status(200).json(result);
      }
    }

    // 6. Twitter / X
    if (platformId === 'twitter') {
      const twData = await twitter(expandedUrl);
      if (twData && twData.url) {
        const result: ExtractResponse = {
          success: true,
          platform: 'twitter',
          platformName: 'Twitter / X',
          videoUrl: twData.url,
          videoHdUrl: twData.url,
          videoSdUrl: null,
          mp3Url: null,
          title: twData.title || 'Twitter / X Media',
          thumbnail: '',
          authorName: '',
          formats: [
            {
              quality: 'HD Gốc',
              label: 'Tải Video / GIF từ X (Twitter)',
              url: twData.url,
              type: 'video',
              extension: 'mp4',
              badge: 'Chất Lượng Cao',
            },
          ],
          isMock: false,
        };
        setCached(cacheKey, result);
        return res.status(200).json(result);
      }
    }

    // 7. General AI fallback / threads / pinterest
    try {
      const aioData = await aio(expandedUrl);
      if (aioData?.result) {
        const resObj = aioData.result as any;
        const mp4Links = resObj.links?.mp4 || {};
        const firstKey = Object.keys(mp4Links)[0];
        const directUrl = resObj.url || (firstKey ? mp4Links[firstKey]?.k : null);

        if (directUrl) {
          const mp3Raw = resObj.links?.mp3 ? (Object.values(resObj.links.mp3)[0] as any)?.k || null : null;
          const result: ExtractResponse = {
            success: true,
            platform: platformId,
            platformName: platformMeta?.name || 'Media',
            videoUrl: directUrl,
            videoHdUrl: directUrl,
            videoSdUrl: null,
            mp3Url: mp3Raw,
            title: resObj.title || 'Video Media',
            thumbnail: '',
            authorName: '',
            formats: [
              {
                quality: 'HD Gốc',
                label: 'Tải Video Trực Tiếp',
                url: directUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Không Watermark',
              },
            ],
            isMock: false,
          };
          setCached(cacheKey, result);
          return res.status(200).json(result);
        }
      }
    } catch (_) {}

    // Return mock data ONLY if forceMock was explicitly requested
    if (forceMock) {
      const smartMock = getMockVideoData(platformId, expandedUrl);
      const result: ExtractResponse = {
        success: true,
        ...smartMock,
        platform: platformId,
        platformName: platformMeta?.name || smartMock.platformName,
        isMock: true,
      };
      setCached(cacheKey, result);
      return res.status(200).json(result);
    }

    return res.status(400).json({
      success: false,
      error: 'SERVER_ERROR',
      message:
        'Không thể bóc tách video từ liên kết này. Vui lòng đảm bảo bài viết/video ở chế độ công khai hoặc thử lại sau ít phút.',
    });
  } catch (err: any) {
    if (forceMock) {
      const fallbackMock = getMockVideoData(platformId, cleanUrl);
      const result: ExtractResponse = {
        success: true,
        ...fallbackMock,
        platform: platformId,
        platformName: platformMeta?.name || fallbackMock.platformName,
        isMock: true,
      };
      setCached(cacheKey, result);
      return res.status(200).json(result);
    }

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Có lỗi xảy ra trong quá trình xử lý video. Vui lòng thử lại.',
    });
  }
}
