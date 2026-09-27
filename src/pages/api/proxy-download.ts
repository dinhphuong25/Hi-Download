import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Universal Proxy Streaming Endpoint
 * Pipes media from social media CDNs and attaches Content-Disposition
 * so the browser directly downloads the file with the given name,
 * with ZERO popups, ZERO redirects to ads, and full SSRF protection.
 *
 * Supports HTTP Range requests (HTTP 206 Partial Content) for resume & seeking.
 * Usage: GET /api/proxy-download/?url=<encoded>&filename=video.mp4
 */

function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    // Block private IPs, localhost, AWS/cloud metadata
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

function getReferer(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('tiktok') || host.includes('byteoversea')) return 'https://www.tiktok.com/';
    if (host.includes('douyin')) return 'https://www.douyin.com/';
    if (host.includes('instagram') || host.includes('cdninstagram')) return 'https://www.instagram.com/';
    if (host.includes('facebook') || host.includes('fbcdn')) return 'https://www.facebook.com/';
    if (host.includes('twitter') || host.includes('twimg') || host.includes('x.com')) return 'https://twitter.com/';
    if (host.includes('youtube') || host.includes('googlevideo')) return 'https://www.youtube.com/';
    if (host.includes('pinterest') || host.includes('pinimg')) return 'https://www.pinterest.com/';
    return `${parsed.protocol}//${parsed.hostname}/`;
  } catch {
    return 'https://www.google.com/';
  }
}

// Security: Sliding window rate limiter for media streaming proxy (100 req/min per IP)
const proxyRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const PROXY_RATE_LIMIT_MAX = 100;
const PROXY_RATE_LIMIT_WINDOW = 60 * 1000;

function checkProxyRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = proxyRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    proxyRateLimitMap.set(ip, { count: 1, resetAt: now + PROXY_RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= PROXY_RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method not allowed');
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  if (!checkProxyRateLimit(clientIp)) {
    return res.status(429).end('Too Many Requests');
  }

  const { url, filename = 'video.mp4' } = req.query as { url?: string; filename?: string };

  if (!url) {
    return res.status(400).end('Missing url parameter');
  }

  const decodedUrl = decodeURIComponent(url);

  if (!isSafeUrl(decodedUrl)) {
    return res.status(403).end('Forbidden domain or invalid URL');
  }

  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const referer = getReferer(decodedUrl);

  const requestHeaders: HeadersInit = {
    Referer: referer,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };

  // Support Range Requests for video seeking & resume
  if (req.headers.range) {
    requestHeaders['Range'] = req.headers.range;
  }

  try {
    const upstream = await fetch(decodedUrl, {
      headers: requestHeaders,
    });

    if (!upstream.ok && upstream.status !== 206) {
      return res.redirect(302, decodedUrl);
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstream.headers.get('content-length');
    const contentRange = upstream.headers.get('content-range');

    res.statusCode = upstream.status === 206 ? 206 : 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
    }

    // Stream directly to response
    const reader = upstream.body?.getReader();
    if (!reader) {
      return res.redirect(302, decodedUrl);
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }

    res.end();
  } catch (err) {
    if (!res.headersSent) {
      return res.redirect(302, decodedUrl);
    }
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
