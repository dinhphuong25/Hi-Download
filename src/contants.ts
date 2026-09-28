export const LANGUAGES = [
  {
    alias: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
  {
    alias: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
];

export type PlatformId =
  | 'tiktok'
  | 'douyin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'capcut'
  | 'twitter'
  | 'threads'
  | 'pinterest'
  | 'bilibili'
  | 'kuaishou'
  | 'other';

export type PlatformCategory = 'short' | 'social';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tag: string;
  category: PlatformCategory;
  categoryLabel: string;
  badge: string;
  color: string;
  bgLight: string;
  regex: RegExp;
  placeholder: string;
  features: string[];
}

export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  // --- NHÓM VIDEO NGẮN (Short-form / Không Watermark) ---
  {
    id: 'tiktok',
    name: 'TikTok',
    tag: 'TikTok Video & MP3',
    category: 'short',
    categoryLabel: 'Video Ngắn',
    badge: 'Không Watermark',
    color: '#00f2fe',
    bgLight: 'rgba(0, 242, 254, 0.15)',
    regex: /(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i,
    placeholder: 'https://www.tiktok.com/@user/video/... hoặc https://vm.tiktok.com/...',
    features: ['Không dính logo ID', 'Không dính chữ chạy', 'Tách nhạc MP3', 'Chất lượng HD'],
  },
  {
    id: 'douyin',
    name: 'Douyin',
    tag: 'Douyin TikTok TQ',
    category: 'short',
    categoryLabel: 'Video Ngắn',
    badge: 'Bản Trung Quốc',
    color: '#00f2fe',
    bgLight: 'rgba(0, 242, 254, 0.15)',
    regex: /(douyin\.com|v\.douyin\.com)/i,
    placeholder: 'https://v.douyin.com/... hoặc douyin.com/...',
    features: ['Xử lý link đặc thù Douyin', 'Gốc HD không watermark', 'Tách âm thanh MP3'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    tag: 'Reels, Stories & Post',
    category: 'short',
    categoryLabel: 'Video Ngắn',
    badge: 'Reels & Post',
    color: '#e1306c',
    bgLight: 'rgba(225, 48, 108, 0.15)',
    regex: /(instagram\.com)/i,
    placeholder: 'https://www.instagram.com/reel/... hoặc instagram.com/p/...',
    features: ['Tải Reels HD', 'Stories & Video bài viết', 'Hỗ trợ bài đăng nhiều ảnh/video'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    tag: 'Reels & Watch',
    category: 'short',
    categoryLabel: 'Video Ngắn',
    badge: 'HD & SD',
    color: '#1877f2',
    bgLight: 'rgba(24, 119, 242, 0.15)',
    regex: /(facebook\.com|fb\.watch|fb\.gg)/i,
    placeholder: 'https://www.facebook.com/watch/?v=... hoặc fb.watch/...',
    features: ['Lưu video Reels nhanh chóng', 'Video bài đăng Watch', 'Lựa chọn luồng HD hoặc SD'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    tag: 'Shorts & Long-form',
    category: 'short',
    categoryLabel: 'Shorts & Dài',
    badge: 'Shorts & 1080p',
    color: '#ff0000',
    bgLight: 'rgba(255, 0, 0, 0.15)',
    regex: /(youtube\.com|youtu\.be)/i,
    placeholder: 'https://www.youtube.com/watch?v=... hoặc https://youtu.be/... hoặc shorts/...',
    features: ['Tải YouTube Shorts dạng dọc', 'Video dài Full HD / 720p', 'Trích xuất MP3 320kbps'],
  },
  {
    id: 'capcut',
    name: 'CapCut',
    tag: 'Templates & Video',
    category: 'short',
    categoryLabel: 'Video Ngắn',
    badge: 'Xoá Logo CapCut',
    color: '#00f2fe',
    bgLight: 'rgba(0, 242, 254, 0.15)',
    regex: /(capcut\.com)/i,
    placeholder: 'https://www.capcut.com/template-detail/...',
    features: ['Tải mẫu template CapCut', 'Video không dính đuôi logo CapCut kết thúc'],
  },

  // --- NHÓM MẠNG XÃ HỘI & GIẢI TRÍ KHÁC ---
  {
    id: 'twitter',
    name: 'Twitter / X',
    tag: 'Video & GIF',
    category: 'social',
    categoryLabel: 'Mạng Xã Hội',
    badge: 'Video & GIF',
    color: '#ffffff',
    bgLight: 'rgba(255, 255, 255, 0.15)',
    regex: /(twitter\.com|x\.com)/i,
    placeholder: 'https://x.com/user/status/... hoặc twitter.com/...',
    features: ['Tải video bài đăng X', 'Lưu file ảnh động GIF trực tiếp'],
  },
  {
    id: 'threads',
    name: 'Threads',
    tag: 'Video & Media',
    category: 'social',
    categoryLabel: 'Mạng Xã Hội',
    badge: 'Threads Media',
    color: '#a0aec0',
    bgLight: 'rgba(160, 174, 192, 0.15)',
    regex: /(threads\.net|threads\.com)/i,
    placeholder: 'https://www.threads.net/@user/post/...',
    features: ['Bóc tách video từ bài viết Threads', 'Tải ảnh chất lượng cao'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    tag: 'Idea Pins & Videos',
    category: 'social',
    categoryLabel: 'Mạng Xã Hội',
    badge: 'Video Ý Tưởng',
    color: '#e60023',
    bgLight: 'rgba(230, 0, 35, 0.15)',
    regex: /(pinterest\.com|pin\.it)/i,
    placeholder: 'https://pin.it/... hoặc pinterest.com/pin/...',
    features: ['Tải video hướng dẫn trực quan', 'Lưu ghim (Pin) chất lượng tốt nhất'],
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    tag: 'Anime & Videos TQ',
    category: 'social',
    categoryLabel: 'Giải Trí Châu Á',
    badge: 'Anime & TQ',
    color: '#00a1d6',
    bgLight: 'rgba(0, 161, 214, 0.15)',
    regex: /(bilibili\.com|b23\.tv)/i,
    placeholder: 'https://www.bilibili.com/video/... hoặc https://b23.tv/...',
    features: ['Hỗ trợ video Bilibili Trung Quốc', 'Tải nội dung anime & giải trí'],
  },
  {
    id: 'kuaishou',
    name: 'Kuaishou',
    tag: 'Kuaishou 快手',
    category: 'social',
    categoryLabel: 'Video Ngắn',
    badge: 'Kuaishou 快手',
    color: '#ff7700',
    bgLight: 'rgba(255, 119, 0, 0.15)',
    regex: /(kuaishou\.com|v\.kuaishou\.com)/i,
    placeholder: 'https://v.kuaishou.com/...',
    features: ['Tải video ngắn Kuaishou Trung Quốc', 'Bóc tách stream trực tiếp'],
  },
];

export function detectPlatform(url: string): PlatformConfig | null {
  if (!url) return null;
  const trimmed = url.trim();
  for (const item of SUPPORTED_PLATFORMS) {
    if (item.regex.test(trimmed)) {
      return item;
    }
  }
  return null;
}

export function isSupportedUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
  return detectPlatform(trimmed) !== null;
}

export const REGEX_LINK_TIKTOK = [
  /^(https?:\/\/)?(www\.)?(tiktok\.com\/(@\w+\/)?video\/(\d+)|vm\.tiktok\.com\/([\w-]+))$/,
  /^https?:\/\/(?:www\.)?tiktok\.com\/@(?:[\w-]+\.)+[\w-]+\/video\/(\d{19})/,
  /(?:http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/(?:@\w+\/)?video\/\d{19})/,
  /(?:http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/(?:\w{2}\/)?@[\w\.\d-]+\/video\/\d{19})/,
  /(?:http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/v\/\d{19})/,
  /^https?:\/\/(?:www\.)?tiktok\.com\/@[a-zA-Z0-9_.-]+\/video\/(\d{19,99})/,
];

export const REGEX_LINK_DOUYIN =
  /^(https?:\/\/)?(www\.)?(douyin\.com\/(@\w+\/)?\w+\/\w+\/\w+\/\w+\/(\w+)|v\.douyin\.com\/\w+\/\w+\/\w+\/\w+\/(\w+))$/;

export const openSans = {
  className: '',
  style: { fontFamily: 'inherit' },
};

export const keywords = [
  'Hi Download',
  'tải video đa nền tảng không quảng cáo',
  'tải video không logo không watermark',
  'tai video tiktok khong logo',
  'tải video douyin không watermark',
  'tải video youtube shorts 1080p',
  'tải reels facebook hd',
  'tải reels instagram',
  'tải video twitter x gif',
  'tải video capcut không logo',
  'tải video threads',
  'tải video pinterest',
  'tải video bilibili',
];
