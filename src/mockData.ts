export interface MockVideoResult {
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
  formats: Array<{
    quality: string;
    label: string;
    url: string;
    type: 'video' | 'audio';
    extension: 'mp4' | 'mp3';
    badge?: string;
  }>;
}

const PUBLIC_SAMPLE_MP4 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const PUBLIC_SAMPLE_MP4_ALT = 'https://www.w3schools.com/html/mov_bbb.mp4';
const PUBLIC_SAMPLE_AUDIO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';

export const MOCK_DATA_MAP: Record<string, MockVideoResult> = {
  tiktok: {
    platform: 'tiktok',
    platformName: 'TikTok',
    title: 'Biến hình siêu đỉnh triệu view trên TikTok #xuhuong #trending #fyp 2026',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    authorName: 'TikTokCreator_Pro',
    duration: '0:35',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    videoSdUrl: PUBLIC_SAMPLE_MP4_ALT,
    mp3Url: PUBLIC_SAMPLE_AUDIO,
    formats: [
      {
        quality: 'Full HD 1080p',
        label: 'Tải Video HD Gốc Không Logo',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Không Watermark',
      },
      {
        quality: 'SD 720p',
        label: 'Tải Video SD (Tiết kiệm dung lượng)',
        url: PUBLIC_SAMPLE_MP4_ALT,
        type: 'video',
        extension: 'mp4',
        badge: 'Tải Nhanh',
      },
      {
        quality: 'MP3 320kbps',
        label: 'Tải Nhạc Nền MP3 Chuẩn Cao',
        url: PUBLIC_SAMPLE_AUDIO,
        type: 'audio',
        extension: 'mp3',
        badge: 'Âm Thanh Gốc',
      },
    ],
  },
  douyin: {
    platform: 'douyin',
    platformName: 'Douyin (抖音)',
    title: '抖音热门创意短视频 - 超清 4K 原画无水印下载',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    authorName: '抖音热门创作者',
    duration: '0:45',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: PUBLIC_SAMPLE_AUDIO,
    formats: [
      {
        quality: 'Full HD 1080p',
        label: 'Tải Video Douyin Gốc Không Watermark',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Không Watermark',
      },
      {
        quality: 'MP3 320kbps',
        label: 'Tải Âm Thanh MP3 Douyin',
        url: PUBLIC_SAMPLE_AUDIO,
        type: 'audio',
        extension: 'mp3',
        badge: 'Audio',
      },
    ],
  },
  youtube: {
    platform: 'youtube',
    platformName: 'YouTube (Shorts & Video)',
    title: '10 Mẹo Công Nghệ Hay Nhất 2026 Bạn Nhất Định Phải Thử | Tech Tips',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    authorName: 'Tech Channel Official',
    duration: '8:42',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: PUBLIC_SAMPLE_AUDIO,
    formats: [
      {
        quality: 'Full HD 1080p',
        label: 'Tải Video HD 1080p (Âm thanh đầy đủ)',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Khuyên Dùng',
      },
      {
        quality: 'HD 720p',
        label: 'Tải Video 720p Tiêu Chuẩn',
        url: PUBLIC_SAMPLE_MP4_ALT,
        type: 'video',
        extension: 'mp4',
        badge: '720p',
      },
      {
        quality: 'SD 480p',
        label: 'Tải Video 480p Dung Lượng Nhẹ',
        url: PUBLIC_SAMPLE_MP4_ALT,
        type: 'video',
        extension: 'mp4',
        badge: 'Tiết Kiệm',
      },
      {
        quality: 'MP3 320kbps',
        label: 'Tải Tệp Âm Thanh MP3 320kbps',
        url: PUBLIC_SAMPLE_AUDIO,
        type: 'audio',
        extension: 'mp3',
        badge: 'HQ Audio',
      },
    ],
  },
  facebook: {
    platform: 'facebook',
    platformName: 'Facebook Reels & Watch',
    title: 'Khoảnh khắc giải trí vui nhộn cuối tuần cùng bạn bè | Facebook Reel',
    thumbnail: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&auto=format&fit=crop&q=80',
    authorName: 'Fanpage Giải Trí Việt',
    duration: '1:15',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    videoSdUrl: PUBLIC_SAMPLE_MP4_ALT,
    mp3Url: null,
    formats: [
      {
        quality: 'Full HD',
        label: 'Tải Video Facebook HD Độ Nét Cao',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Chất Lượng Cao',
      },
      {
        quality: 'SD Tiêu Chuẩn',
        label: 'Tải Video Facebook SD',
        url: PUBLIC_SAMPLE_MP4_ALT,
        type: 'video',
        extension: 'mp4',
        badge: 'Tải Nhanh',
      },
    ],
  },
  instagram: {
    platform: 'instagram',
    platformName: 'Instagram Reels',
    title: 'Hành trình du lịch khám phá vẻ đẹp thiên nhiên hùng vĩ #reels #travel',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    authorName: '@wanderlust_vietnam',
    duration: '0:30',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: null,
    formats: [
      {
        quality: 'HD Gốc',
        label: 'Tải Video Instagram Reels HD Gốc',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Gốc',
      },
    ],
  },
  capcut: {
    platform: 'capcut',
    platformName: 'CapCut Template',
    title: 'Mẫu CapCut giật giật theo điệu nhạc hot trend TikTok không logo',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    authorName: 'CapCut Creator VIP',
    duration: '0:22',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: null,
    formats: [
      {
        quality: 'HD Không Logo',
        label: 'Tải Video CapCut Xóa Logo Kết Thúc',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Không Watermark',
      },
    ],
  },
  twitter: {
    platform: 'twitter',
    platformName: 'Twitter / X',
    title: 'Bản tin công nghệ và trí tuệ nhân tạo mới nhất hôm nay trên X',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    authorName: '@TechAI_News',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: null,
    formats: [
      {
        quality: 'HD Gốc',
        label: 'Tải Video / GIF từ X (Twitter)',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Chất Lượng Cao',
      },
    ],
  },
  pinterest: {
    platform: 'pinterest',
    platformName: 'Pinterest',
    title: 'Ý tưởng thiết kế nội thất và phong cách sống hiện đại | Pinterest Idea',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    authorName: '@creative_interior',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: null,
    formats: [
      {
        quality: 'HD Gốc',
        label: 'Tải Video Pinterest Gốc',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Không Watermark',
      },
    ],
  },
  threads: {
    platform: 'threads',
    platformName: 'Threads',
    title: 'Khoảnh khắc chia sẻ cuộc sống thường ngày sống động | Threads Video',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    authorName: '@threads_creator',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: null,
    formats: [
      {
        quality: 'HD Gốc',
        label: 'Tải Video Threads Chất Lượng Gốc',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'Gốc',
      },
    ],
  },
  bilibili: {
    platform: 'bilibili',
    platformName: 'Bilibili',
    title: 'Bilibili 哔哩哔哩 高画质视频 - 原画无损画质',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    authorName: 'Bilibili UP主',
    videoUrl: PUBLIC_SAMPLE_MP4,
    videoHdUrl: PUBLIC_SAMPLE_MP4,
    mp3Url: PUBLIC_SAMPLE_AUDIO,
    formats: [
      {
        quality: '1080p 60fps',
        label: 'Tải Video Bilibili 1080p',
        url: PUBLIC_SAMPLE_MP4,
        type: 'video',
        extension: 'mp4',
        badge: 'HD',
      },
      {
        quality: 'MP3 320kbps',
        label: 'Tải Âm Thanh MP3 Bilibili',
        url: PUBLIC_SAMPLE_AUDIO,
        type: 'audio',
        extension: 'mp3',
        badge: 'Audio',
      },
    ],
  },
};

export function getMockVideoData(platformId: string, customUrl?: string): MockVideoResult {
  const match = MOCK_DATA_MAP[platformId] || MOCK_DATA_MAP.tiktok;
  return {
    ...match,
    title: match.title,
    authorName: match.authorName,
  };
}
