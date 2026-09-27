import type { NextApiRequest, NextApiResponse } from 'next';
import { detectPlatform } from '@/contants';
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
  kuaishou,
  aio,
} from 'btch-downloader';

export type MediaItem = {
  type: 'video' | 'image' | 'audio';
  url: string;
  quality?: string;
};

export type VideoFormat = {
  quality: string;
  label: string;
  url: string;
  type: 'video' | 'audio';
  extension: 'mp4' | 'mp3';
  badge?: string;
};

export type SuccessResponse = {
  platform: string;
  videoUrl: string;
  videoHdUrl?: string | null;
  videoSdUrl?: string | null;
  mp3Url: string | null;
  title: string;
  thumbnail: string;
  authorName: string;
  formats: VideoFormat[];
  medias?: MediaItem[];
};

export type ErrorResponse = {
  error: string;
};

const TIKWM_API = 'https://www.tikwm.com/api/';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body as { url: string };

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'NOT_A_VALID_LINK' });
  }

  const cleanUrl = url.trim();
  const platformMeta = detectPlatform(cleanUrl);
  const platformId = platformMeta?.id || 'other';

  try {
    // 1. TikTok & Douyin (Nhóm Video Ngắn - Không Watermark)
    if (platformId === 'tiktok' || platformId === 'douyin') {
      try {
        const noQueryUrl = cleanUrl.split('?')[0];
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
            const hdUrl = v.hdplay || '';
            const sdUrl = v.play || '';
            const musicUrl = v.music || null;
            const primaryVideo = hdUrl || sdUrl;

            const formats: VideoFormat[] = [];
            if (hdUrl) {
              formats.push({
                quality: 'Full HD 1080p',
                label: 'Tải Video HD Không Logo',
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
                badge: 'Âm Thanh',
              });
            }

            if (primaryVideo) {
              return res.status(200).json({
                platform: platformId,
                videoUrl: primaryVideo,
                videoHdUrl: hdUrl || null,
                videoSdUrl: sdUrl || null,
                mp3Url: musicUrl,
                title: v.title || (platformId === 'douyin' ? 'Douyin Video' : 'TikTok Video'),
                thumbnail: v.cover || '',
                authorName: v.author?.nickname || '',
                formats,
              });
            }
          }
        }
      } catch (_) {
        // Fallback below
      }

      // Fallback for Douyin
      if (platformId === 'douyin') {
        const douyinData = await douyin(cleanUrl);
        const dUrl = (douyinData as any)?.url;
        if (dUrl) {
          return res.status(200).json({
            platform: 'douyin',
            videoUrl: dUrl,
            videoHdUrl: dUrl,
            mp3Url: null,
            title: (douyinData as any).title || 'Douyin Video HD',
            thumbnail: '',
            authorName: '',
            formats: [
              {
                quality: 'HD Không Logo',
                label: 'Tải Video Douyin HD Gốc',
                url: dUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Không Watermark',
              },
            ],
          });
        }
      } else {
        const ttData = await ttdl(cleanUrl);
        const vUrl = ttData?.video?.[0] || '';
        const aUrl = ttData?.audio?.[0] || null;
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
              badge: 'Âm Thanh',
            });
          }
          return res.status(200).json({
            platform: 'tiktok',
            videoUrl: vUrl,
            videoHdUrl: vUrl,
            mp3Url: aUrl,
            title: ttData.title || 'TikTok Video',
            thumbnail: ttData.thumbnail || '',
            authorName: '',
            formats,
          });
        }
      }
    }

    // 2. YouTube (Shorts & Long-form)
    if (platformId === 'youtube') {
      const ytData = await youtube(cleanUrl);
      if (ytData && (ytData.mp4 || ytData.mp3)) {
        const formats: VideoFormat[] = [];
        if (ytData.mp4) {
          formats.push({
            quality: 'HD 1080p / 720p',
            label: 'Tải Video HD (Âm thanh đầy đủ)',
            url: ytData.mp4,
            type: 'video',
            extension: 'mp4',
            badge: 'Khuyên dùng',
          });
        }
        if (ytData.mp3) {
          formats.push({
            quality: 'MP3 320kbps',
            label: 'Tải Âm Thanh MP3 Chất Lượng Cao',
            url: ytData.mp3,
            type: 'audio',
            extension: 'mp3',
            badge: 'Audio',
          });
        }
        return res.status(200).json({
          platform: 'youtube',
          videoUrl: ytData.mp4 || '',
          videoHdUrl: ytData.mp4 || null,
          videoSdUrl: null,
          mp3Url: ytData.mp3 || null,
          title: ytData.title || 'YouTube Video',
          thumbnail: ytData.thumbnail || '',
          authorName: ytData.author || '',
          formats,
        });
      }
    }

    // 3. Facebook (Reels & Watch)
    if (platformId === 'facebook') {
      try {
        const fbData = await fbdown(cleanUrl);
        if (fbData && (fbData.HD || fbData.Normal_video)) {
          const formats: VideoFormat[] = [];
          if (fbData.HD) {
            formats.push({
              quality: 'Full HD',
              label: 'Tải Video HD Độ Phân Giải Cao',
              url: fbData.HD,
              type: 'video',
              extension: 'mp4',
              badge: 'Chất lượng cao',
            });
          }
          if (fbData.Normal_video && fbData.Normal_video !== fbData.HD) {
            formats.push({
              quality: 'SD Tiêu Chuẩn',
              label: 'Tải Video SD (Tiết kiệm dung lượng)',
              url: fbData.Normal_video,
              type: 'video',
              extension: 'mp4',
              badge: 'Tải nhanh',
            });
          }
          return res.status(200).json({
            platform: 'facebook',
            videoUrl: fbData.HD || fbData.Normal_video || '',
            videoHdUrl: fbData.HD || null,
            videoSdUrl: fbData.Normal_video || null,
            mp3Url: null,
            title: 'Facebook Reels / Watch Video',
            thumbnail: '',
            authorName: '',
            formats,
          });
        }
      } catch (_) {}

      // Fallback with aio
      const aioData = await aio(cleanUrl);
      if (aioData?.result?.links) {
        const mp4Links = aioData.result.links.mp4 || {};
        const firstKey = Object.keys(mp4Links)[0];
        const downloadUrl = (aioData.result as any).url || (firstKey ? mp4Links[firstKey]?.k : null);
        if (downloadUrl) {
          return res.status(200).json({
            platform: 'facebook',
            videoUrl: downloadUrl,
            videoHdUrl: downloadUrl,
            mp3Url: null,
            title: aioData.result.title || 'Facebook Video',
            thumbnail: '',
            authorName: '',
            formats: [
              {
                quality: 'HD',
                label: 'Tải Video Facebook HD',
                url: downloadUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Gốc',
              },
            ],
          });
        }
      }
    }

    // 4. Instagram (Reels & Stories & Post)
    if (platformId === 'instagram') {
      const igData = await igdl(cleanUrl);
      if (igData && Array.isArray(igData.result) && igData.result.length > 0) {
        const first = igData.result[0];
        const medias: MediaItem[] = igData.result.map((item) => ({
          type: 'video',
          url: item.url,
          quality: 'Original',
        }));

        const formats: VideoFormat[] = igData.result.map((item, idx) => ({
          quality: `Media #${idx + 1}`,
          label: `Tải Video/Ảnh #${idx + 1}`,
          url: item.url,
          type: 'video',
          extension: 'mp4',
          badge: idx === 0 ? 'Gốc' : undefined,
        }));

        return res.status(200).json({
          platform: 'instagram',
          videoUrl: first.url,
          videoHdUrl: first.url,
          videoSdUrl: null,
          mp3Url: null,
          title: 'Instagram Reel / Post Media',
          thumbnail: first.thumbnail || '',
          authorName: '',
          formats,
          medias,
        });
      }
    }

    // 5. CapCut (Mẫu template & video không watermark)
    if (platformId === 'capcut') {
      const capData = await capcut(cleanUrl);
      if (capData && capData.originalVideoUrl) {
        return res.status(200).json({
          platform: 'capcut',
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
              label: 'Tải Video Mẫu CapCut Không Watermark',
              url: capData.originalVideoUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Không Watermark',
            },
          ],
        });
      }
    }

    // 6. Twitter / X (Video & GIF)
    if (platformId === 'twitter') {
      const twData = await twitter(cleanUrl);
      if (twData && twData.url) {
        return res.status(200).json({
          platform: 'twitter',
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
              badge: 'Chất lượng cao',
            },
          ],
        });
      }
    }

    // 7. Threads (Video & Media)
    if (platformId === 'threads') {
      const thData = await threads(cleanUrl);
      const thMedia = thData?.result || (thData as any);
      if (thMedia && (thMedia.video || thMedia.image)) {
        const mediaUrl = thMedia.video || thMedia.image || '';
        return res.status(200).json({
          platform: 'threads',
          videoUrl: mediaUrl,
          videoHdUrl: thMedia.video || null,
          videoSdUrl: null,
          mp3Url: null,
          title: 'Threads Post Media',
          thumbnail: thMedia.image || '',
          authorName: '',
          formats: [
            {
              quality: 'HD Gốc',
              label: 'Tải Video Threads Chất Lượng Cao',
              url: mediaUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Gốc',
            },
          ],
        });
      }
    }

    // 8. Pinterest (Idea Pins & Video ý tưởng)
    if (platformId === 'pinterest') {
      const pinData = await pinterest(cleanUrl);
      const mediaUrl = pinData?.result?.video_url || pinData?.result?.image;
      if (mediaUrl) {
        return res.status(200).json({
          platform: 'pinterest',
          videoUrl: mediaUrl,
          videoHdUrl: pinData?.result?.video_url || null,
          videoSdUrl: null,
          mp3Url: null,
          title: pinData?.result?.title || 'Pinterest Pin Video',
          thumbnail: pinData?.result?.image || '',
          authorName: pinData?.result?.user?.username || '',
          formats: [
            {
              quality: 'HD Gốc',
              label: 'Tải Video Ghim Pinterest',
              url: mediaUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Ý Tưởng Gốc',
            },
          ],
        });
      }
    }

    // 9. Kuaishou (Video ngắn TQ)
    if (platformId === 'kuaishou') {
      try {
        const ksData = await kuaishou(cleanUrl);
        const ks = ksData?.result || (ksData as any);
        if (ks && ks.videoUrl) {
          return res.status(200).json({
            platform: 'kuaishou',
            videoUrl: ks.videoUrl,
            videoHdUrl: ks.videoUrl,
            mp3Url: null,
            title: ks.title || 'Kuaishou Video',
            thumbnail: '',
            authorName: ks.author || '',
            formats: [
              {
                quality: 'HD Gốc',
                label: 'Tải Video Kuaishou HD',
                url: ks.videoUrl,
                type: 'video',
                extension: 'mp4',
                badge: 'Gốc',
              },
            ],
          });
        }
      } catch (_) {}
    }

    // 10. Bilibili / General All-In-One Fallback
    try {
      const aioFallback = await aio(cleanUrl);
      if (aioFallback && aioFallback.result) {
        const resObj = aioFallback.result as any;
        const mp4Links = resObj.links?.mp4 || {};
        const firstKey = Object.keys(mp4Links)[0];
        const directUrl = resObj.url || (firstKey ? mp4Links[firstKey]?.k : null);

        if (directUrl) {
          const mp3Raw = resObj.links?.mp3 ? (Object.values(resObj.links.mp3)[0] as any)?.k || null : null;
          const formats: VideoFormat[] = [
            {
              quality: 'HD Gốc',
              label: 'Tải Video Trực Tiếp',
              url: directUrl,
              type: 'video',
              extension: 'mp4',
              badge: 'Chất lượng cao',
            },
          ];
          if (mp3Raw) {
            formats.push({
              quality: 'MP3 Audio',
              label: 'Tải Âm Thanh MP3',
              url: mp3Raw,
              type: 'audio',
              extension: 'mp3',
              badge: 'Audio',
            });
          }

          return res.status(200).json({
            platform: platformId,
            videoUrl: directUrl,
            videoHdUrl: directUrl,
            videoSdUrl: null,
            mp3Url: mp3Raw,
            title: resObj.title || 'Video Media',
            thumbnail: '',
            authorName: '',
            formats,
          });
        }
      }
    } catch (_) {}

    return res.status(502).json({ error: 'HAVE_ERROR' });
  } catch (err: any) {
    console.error('Download API error:', err?.message || err);
    return res.status(500).json({ error: 'HAVE_ERROR' });
  }
}
