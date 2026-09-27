import {
  SUPPORTED_PLATFORMS,
  detectPlatform,
} from '@/contants';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Fade,
  Flex,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import JSZip from 'jszip';
import { BsFillClipboardFill } from 'react-icons/bs';
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaReddit,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import {
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClear,
  MdContentCopy,
  MdDownload,
  MdFolderZip,
  MdHighQuality,
  MdImage,
  MdInfo,
  MdLink,
  MdMovie,
  MdMusicNote,
  MdOutlineLayers,
  MdPhotoLibrary,
  MdPlayArrow,
  MdShield,
  MdVideoLibrary,
} from 'react-icons/md';
import { SiBilibili } from 'react-icons/si';

export interface VideoFormat {
  quality: string;
  label: string;
  url: string;
  type: 'video' | 'audio' | 'image';
  extension: 'mp4' | 'mp3' | 'jpg' | 'png' | 'webp';
  badge?: string;
  thumbnail?: string;
}

export interface ExtractResponse {
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
}

const renderPlatformIcon = (id: string, size = 14) => {
  switch (id) {
    case 'tiktok':
    case 'douyin':
      return <FaTiktok size={size} />;
    case 'youtube':
      return <FaYoutube size={size} />;
    case 'facebook':
      return <FaFacebook size={size} />;
    case 'instagram':
      return <FaInstagram size={size} />;
    case 'twitter':
      return <FaTwitter size={size} />;
    case 'reddit':
      return <FaReddit size={size} />;
    case 'pinterest':
      return <FaPinterest size={size} />;
    case 'capcut':
      return <MdMovie size={size} />;
    case 'bilibili':
      return <SiBilibili size={size} />;
    default:
      return <MdVideoLibrary size={size} />;
  }
};

const Board: React.FC = () => {
  const trans = useTrans();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPreviewPlayer, setShowPreviewPlayer] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [zipping, setZipping] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const toast = useToast();

  // Modern Minimalist Toast Notification (Bottom-Right, Clean White Card, Non-intrusive)
  const showToast = useCallback(
    ({
      title,
      description,
      status = 'info',
      duration = 2600,
    }: {
      title: string;
      description?: string;
      status?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
    }) => {
      toast({
        position: 'bottom-right',
        duration,
        isClosable: true,
        render: ({ onClose }) => (
          <Flex
            align="flex-start"
            bg="#ffffff"
            border="1px solid #e2e8f0"
            borderRadius="12px"
            p="12px 14px"
            boxShadow="0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)"
            maxW="360px"
            gap="10px"
          >
            <Box pt="2px" flexShrink={0}>
              {status === 'success' && <MdCheckCircle color="#10b981" size="18px" />}
              {status === 'error' && <MdClear color="#ef4444" size="18px" />}
              {status === 'warning' && <MdShield color="#f59e0b" size="18px" />}
              {status === 'info' && <MdInfo color="#0ea5e9" size="18px" />}
            </Box>
            <Box flex={1} minW={0}>
              <Text fontSize="13px" fontWeight="700" color="#0f172a" lineHeight="1.4">
                {title}
              </Text>
              {description && (
                <Text fontSize="12px" color="#64748b" mt="2px" lineHeight="1.4" noOfLines={3}>
                  {description}
                </Text>
              )}
            </Box>
            <IconButton
              aria-label={trans.toast.close}
              icon={<MdClear size="13px" />}
              size="xs"
              variant="ghost"
              color="#94a3b8"
              _hover={{ color: '#0f172a', bg: '#f1f5f9' }}
              onClick={onClose}
              minW="20px"
              h="20px"
              mt="1px"
            />
          </Flex>
        ),
      });
    },
    [toast, trans],
  );

  const detectedPlatform = useMemo(() => detectPlatform(url), [url]);

  const onDeleteLink = useCallback(() => {
    setUrl('');
    setVideoData(null);
    setError(null);
    setShowPreviewPlayer(false);
    setActivePhotoIdx(0);
  }, []);

  const handleChangeLink = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  }, []);

  const onPasteClipboard = useCallback(() => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const clean = text.trim();
        setUrl(clean);
        setError(null);
        showToast({
          title: trans.toast.pastedTitle,
          description: clean.slice(0, 45) + (clean.length > 45 ? '...' : ''),
          status: 'info',
          duration: 2000,
        });
      })
      .catch((_) => {
        showToast({
          title: trans.toast.pasteManualTitle,
          description: trans.toast.pasteManualDesc,
          status: 'warning',
          duration: 2500,
        });
      });
  }, [showToast, trans]);

  // Safe Direct Download trigger avoiding CORS via universal proxy streaming
  const triggerDirectDownload = useCallback(
    (downloadTargetUrl: string, extension = 'mp4', qualityTag = '') => {
      if (!downloadTargetUrl) return;
      const platformName = videoData?.platform || detectedPlatform?.id || 'video';
      const cleanTitle = (videoData?.title || platformName)
        .slice(0, 30)
        .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_');
      const filename = `HiDownload_${cleanTitle}${qualityTag ? `_${qualityTag}` : ''}.${extension}`;

      const proxyUrl = `/api/proxy-download/?url=${encodeURIComponent(
        downloadTargetUrl,
      )}&filename=${encodeURIComponent(filename)}`;

      const linkA = document.createElement('a');
      linkA.href = proxyUrl;
      linkA.download = filename;
      document.body.appendChild(linkA);
      linkA.click();
      document.body.removeChild(linkA);

      showToast({
        title: trans.toast.downloadStartTitle,
        description: trans.toast.downloadFileDesc.replace('{filename}', filename),
        status: 'success',
        duration: 2500,
      });
    },
    [videoData, detectedPlatform, showToast, trans],
  );

  // 1-Click ZIP Download for all Photos in Album
  const handleDownloadAllZip = useCallback(async () => {
    const photos =
      videoData?.images && videoData.images.length > 0
        ? videoData.images
        : videoData?.formats.filter((f) => f.type === 'image').map((f) => f.url) || [];

    if (photos.length === 0) return;

    setZipping(true);
    showToast({
      title: trans.toast.zipPreparingTitle,
      description: trans.toast.zipPreparingDesc.replace('{count}', photos.length.toString()),
      status: 'info',
      duration: 3500,
    });

    try {
      const zip = new JSZip();
      const folder = zip.folder('hi-download-photos') || zip;

      await Promise.all(
        photos.map(async (imgUrl, idx) => {
          try {
            const proxyUrl = `/api/proxy-download/?url=${encodeURIComponent(
              imgUrl,
            )}&filename=photo_${idx + 1}.jpg`;
            const resp = await fetch(proxyUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              folder.file(`photo_${idx + 1}.jpg`, blob);
              return;
            }
          } catch (_) {}

          try {
            const directResp = await fetch(imgUrl);
            const blob = await directResp.blob();
            folder.file(`photo_${idx + 1}.jpg`, blob);
          } catch (_) {}
        }),
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `HiDownload_${videoData?.platform || 'album'}_photos_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      showToast({
        title: trans.toast.zipSuccessTitle,
        description: trans.toast.zipSuccessDesc.replace('{count}', photos.length.toString()),
        status: 'success',
        duration: 3500,
      });
    } catch (err) {
      showToast({
        title: trans.toast.zipErrorTitle,
        description: trans.toast.zipErrorDesc,
        status: 'error',
        duration: 3500,
      });
    } finally {
      setZipping(false);
    }
  }, [videoData, showToast, trans]);

  // Core API Extraction workflow
  const runExtraction = useCallback(
    async (targetUrl: string) => {
      const cleanUrl = targetUrl.trim();

      if (!cleanUrl) {
        setError(trans.toast.emptyUrlDesc);
        showToast({
          title: trans.toast.emptyUrlTitle,
          description: trans.toast.emptyUrlDesc,
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        setError(trans.toast.invalidUrlDesc);
        showToast({
          title: trans.toast.invalidUrlTitle,
          description: trans.toast.invalidUrlDesc,
          status: 'error',
          duration: 3000,
        });
        return;
      }

      setError(null);
      setVideoData(null);
      setLoading(true);
      setShowPreviewPlayer(false);
      setActivePhotoIdx(0);

      try {
        const res = await fetch('/api/extract/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanUrl }),
        });

        const data = await res.json();
        setLoading(false);

        const hasMedia = Boolean(
          data.videoUrl ||
          data.mp3Url ||
          (data.images && data.images.length > 0) ||
          (data.formats && data.formats.length > 0),
        );

        if (!res.ok || !data.success || !hasMedia) {
          const errorMsg =
            data.message ||
            trans.toast.defaultExtractError;
          setError(errorMsg);
          showToast({
            title: trans.toast.cannotExtractTitle,
            description: errorMsg,
            status: 'error',
            duration: 3500,
          });
          return;
        }

        setVideoData(data);
        setActivePhotoIdx(0);

        // Auto smooth scroll down to result card
        setTimeout(() => {
          if (resultRef.current) {
            const yOffset = -75; // Account for sticky navbar height
            const y =
              resultRef.current.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 150);

        showToast({
          title: trans.toast.doneTitle,
          description: data.isPhotoSlide
            ? trans.toast.doneAlbumDesc.replace('{count}', (data.images?.length || data.formats?.length || 0).toString())
            : trans.toast.doneVideoDesc.replace('{platform}', data.platformName || data.platform || ''),
          status: 'success',
          duration: 2800,
        });
      } catch (_) {
        setLoading(false);
        const netErr = trans.toast.networkErrorDesc;
        setError(netErr);
        showToast({
          title: trans.toast.networkErrorTitle,
          description: netErr,
          status: 'error',
          duration: 3500,
        });
      }
    },
    [showToast, trans],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      runExtraction(url);
    },
    [url, runExtraction],
  );

  const handleDownloadFormat = useCallback(
    (format: VideoFormat, id: string) => {
      setDownloadingId(id);
      triggerDirectDownload(format.url, format.extension, format.quality);
      setTimeout(() => setDownloadingId(null), 1500);
    },
    [triggerDirectDownload],
  );

  const handleCopyDirectLink = useCallback((linkToCopy: string) => {
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch((_) => {});
  }, []);

  const isPhotoMode = Boolean(
    videoData?.isPhotoSlide ||
    videoData?.mediaType === 'photo' ||
    (videoData?.images && videoData.images.length > 0)
  );

  const photoList: string[] = useMemo(() => {
    if (!videoData) return [];
    if (videoData.images && videoData.images.length > 0) {
      return videoData.images;
    }
    const imgFmts = videoData.formats.filter((f) => f.type === 'image');
    if (imgFmts.length > 0) {
      return imgFmts.map((f) => f.url);
    }
    return [];
  }, [videoData]);

  return (
    <Box w="100%" id="tong-quan">
      {/* Clean Modern Hero Headline */}
      <VStack spacing={{ base: '10px', md: '14px' }} align="center" textAlign="center" mb={{ base: '20px', md: '28px' }}>
        <Text
          as="h1"
          fontSize={{ base: '22px', sm: '28px', md: '34px', lg: '38px' }}
          fontWeight="800"
          color="#0f172a"
          letterSpacing="-0.03em"
          lineHeight={{ base: '1.3', md: '1.25' }}
          whiteSpace={{ base: 'normal', md: 'nowrap' }}
        >
          {trans.hero.titleLine1}{' '}
          <Text
            as="span"
            bgGradient="linear(to-r, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)"
            bgClip="text"
            letterSpacing="-0.03em"
          >
            {trans.hero.titleLine2}
          </Text>
        </Text>

        <Text
          fontSize={{ base: '13px', md: '14px' }}
          color="#64748b"
          maxW="560px"
          lineHeight="1.6"
          fontWeight="400"
        >
          {trans.hero.subtitlePart1}
          <strong>TikTok</strong>, <strong>Douyin</strong>, <strong>YouTube Shorts</strong>, <strong>Facebook Reels</strong>, <strong>Instagram</strong>, <strong>CapCut</strong>
          {trans.hero.subtitlePart2}
        </Text>
      </VStack>

      {/* Input Box Card with Ambient Glow */}
      <Box
        bg="#ffffff"
        border="1px solid #cbd5e1"
        borderRadius="22px"
        p={{ base: '18px', md: '24px' }}
        boxShadow="0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 2px 8px -2px rgba(15, 23, 42, 0.04)"
        transition="all 0.2s ease"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing="14px" w="100%">
            <Box
              w="100%"
              bg="#f8fafc"
              border="2px solid"
              borderColor={detectedPlatform ? '#0284c7' : '#475569'}
              borderRadius="16px"
              px="14px"
              h="54px"
              pr="8px"
              display="flex"
              alignItems="center"
              gap="10px"
              transition="all 0.2s ease"
              _hover={{
                borderColor: detectedPlatform ? '#0284c7' : '#0f172a',
              }}
              _focusWithin={{
                bg: '#ffffff',
                borderColor: '#0284c7',
                boxShadow: '0 0 0 4px rgba(2, 132, 199, 0.18)',
              }}
            >
              <Box color={detectedPlatform ? '#0284c7' : '#475569'} flexShrink={0}>
                {detectedPlatform ? renderPlatformIcon(detectedPlatform.id, 19) : <MdLink size="19px" />}
              </Box>

              <input
                value={url}
                onChange={handleChangeLink}
                placeholder={
                  detectedPlatform
                    ? trans.hero.detectedPlaceholder.replace('{platform}', detectedPlatform.name)
                    : trans.hero.inputPlaceholder
                }
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  fontSize: '14.5px',
                  fontWeight: '500',
                  minWidth: 0,
                }}
              />

              {detectedPlatform && (
                <Badge
                  bg="#e0f2fe"
                  color="#0284c7"
                  fontSize="11px"
                  fontWeight="700"
                  px="8px"
                  py="3px"
                  borderRadius="6px"
                  display={{ base: 'none', sm: 'inline-flex' }}
                >
                  {detectedPlatform.name}
                </Badge>
              )}

              {url ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDeleteLink}
                  color="#64748b"
                  _hover={{ color: '#ef4444', bg: '#fee2e2' }}
                  borderRadius="10px"
                  leftIcon={<MdClear />}
                  px="10px"
                  fontSize="12px"
                  h="34px"
                >
                  {trans.hero.clearBtn}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onPasteClipboard}
                  bg="#ffffff"
                  color="#0f172a"
                  border="1.5px solid #94a3b8"
                  borderRadius="10px"
                  fontSize="12.5px"
                  fontWeight="600"
                  px="12px"
                  h="36px"
                  boxShadow="0 1px 2px rgba(0,0,0,0.04)"
                  _hover={{ bg: '#f1f5f9', borderColor: '#475569' }}
                  _active={{ transform: 'scale(0.98)' }}
                  leftIcon={<BsFillClipboardFill size="11px" />}
                >
                  {trans.hero.pasteBtn}
                </Button>
              )}
            </Box>

            <Button
              isLoading={loading}
              loadingText={trans.hero.loadingBtn}
              type="submit"
              w="100%"
              h="50px"
              borderRadius="14px"
              fontSize="14.5px"
              fontWeight="700"
              letterSpacing="-0.01em"
              bg="linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
              color="#ffffff"
              border="1px solid rgba(255, 255, 255, 0.12)"
              boxShadow="0 4px 14px -2px rgba(15, 23, 42, 0.2)"
              _hover={{
                bg: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.28)',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'translateY(0) scale(0.99)',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.2)',
              }}
              leftIcon={<MdDownload size="19px" />}
              transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            >
              {trans.hero.submitBtn}
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Inline Error */}
      {error && (
        <Fade in={!!error} style={{ width: '100%', marginTop: '16px' }}>
          <Alert
            status="error"
            borderRadius="12px"
            bg="#fef2f2"
            border="1px solid #fecaca"
            color="#991b1b"
            fontSize="13px"
          >
            <AlertIcon color="#ef4444" />
            {error}
          </Alert>
        </Fade>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <Box
          w="100%"
          mt="20px"
          bg="#ffffff"
          border="1px solid #e2e8f0"
          borderRadius="18px"
          p="20px"
          boxShadow="0 2px 10px -2px rgba(15, 23, 42, 0.05)"
        >
          <HStack spacing="10px" mb="16px" align="center">
            <Spinner size="sm" color="#0f172a" thickness="2px" speed="0.75s" />
            <Text fontSize="13px" fontWeight="600" color="#0f172a">
              {trans.hero.connectingStream}
            </Text>
          </HStack>

          <Flex direction={{ base: 'column', sm: 'row' }} gap="16px">
            <Skeleton
              w={{ base: '100%', sm: '130px' }}
              h={{ base: '160px', sm: '130px' }}
              borderRadius="12px"
              startColor="#f1f5f9"
              endColor="#e2e8f0"
            />
            <VStack flex={1} align="stretch" spacing="10px">
              <Skeleton h="20px" w="100px" borderRadius="6px" startColor="#f1f5f9" endColor="#e2e8f0" />
              <Skeleton h="16px" w="90%" borderRadius="4px" startColor="#f1f5f9" endColor="#e2e8f0" />
              <Skeleton h="16px" w="60%" borderRadius="4px" startColor="#f1f5f9" endColor="#e2e8f0" />
              <HStack spacing="10px" pt="6px">
                <Skeleton h="38px" flex={1} borderRadius="10px" startColor="#f1f5f9" endColor="#e2e8f0" />
                <Skeleton h="38px" w="100px" borderRadius="10px" startColor="#f1f5f9" endColor="#e2e8f0" />
              </HStack>
            </VStack>
          </Flex>
        </Box>
      )}

      {/* Result Display Card */}
      <Fade in={!loading && !!videoData} style={{ width: '100%', marginTop: '20px' }}>
        {videoData && (
          <Box
            ref={resultRef}
            id="result-box"
            w="100%"
            bg="#ffffff"
            border="1px solid #e2e8f0"
            borderRadius="18px"
            p={{ base: '18px', md: '22px' }}
            boxShadow="0 4px 16px -2px rgba(15, 23, 42, 0.06)"
          >
            {videoData.isMock && (
              <HStack
                mb="14px"
                p="6px 10px"
                borderRadius="8px"
                bg="#f8fafc"
                border="1px dashed #cbd5e1"
                justify="space-between"
              >
                <Text fontSize="12px" color="#475569" fontWeight="500">
                  {trans.result.demoNotice}
                </Text>
                <Badge bg="#e2e8f0" color="#334155" fontSize="10px">
                  DEMO
                </Badge>
              </HStack>
            )}

            {isPhotoMode && photoList.length > 0 ? (
              /* PHOTO ALBUM / SLIDESHOW RESULT VIEW */
              <Box>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  gap="20px"
                  align="flex-start"
                  mb="18px"
                >
                  {/* Photo Carousel Preview */}
                  <Box w={{ base: '100%', md: '280px' }} flexShrink={0}>
                    <Box
                      position="relative"
                      borderRadius="14px"
                      overflow="hidden"
                      border="1px solid #e2e8f0"
                      bg="#f8fafc"
                      h={{ base: '320px', md: '280px' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Image
                        src={photoList[activePhotoIdx]}
                        w="100%"
                        h="100%"
                        objectFit="contain"
                        alt={`${trans.result.photoPrefix} ${activePhotoIdx + 1}`}
                      />

                      {/* Photo Index Badge */}
                      <Badge
                        position="absolute"
                        top="8px"
                        left="8px"
                        bg="rgba(15, 23, 42, 0.85)"
                        color="#ffffff"
                        fontSize="10px"
                        px="7px"
                        py="2px"
                        borderRadius="6px"
                        backdropFilter="blur(4px)"
                      >
                        {trans.result.photoPrefix} {activePhotoIdx + 1} / {photoList.length}
                      </Badge>

                      {/* Navigation Arrows if multiple photos */}
                      {photoList.length > 1 && (
                        <>
                          <Button
                            position="absolute"
                            left="6px"
                            top="50%"
                            transform="translateY(-50%)"
                            size="xs"
                            minW="28px"
                            h="28px"
                            borderRadius="full"
                            bg="rgba(15, 23, 42, 0.75)"
                            color="#ffffff"
                            _hover={{ bg: '#0f172a' }}
                            onClick={() =>
                              setActivePhotoIdx((prev) =>
                                prev > 0 ? prev - 1 : photoList.length - 1,
                              )
                            }
                            aria-label="Previous"
                          >
                            <MdChevronLeft size="18px" />
                          </Button>
                          <Button
                            position="absolute"
                            right="6px"
                            top="50%"
                            transform="translateY(-50%)"
                            size="xs"
                            minW="28px"
                            h="28px"
                            borderRadius="full"
                            bg="rgba(15, 23, 42, 0.75)"
                            color="#ffffff"
                            _hover={{ bg: '#0f172a' }}
                            onClick={() =>
                              setActivePhotoIdx((prev) =>
                                prev < photoList.length - 1 ? prev + 1 : 0,
                              )
                            }
                            aria-label="Next"
                          >
                            <MdChevronRight size="18px" />
                          </Button>
                        </>
                      )}
                    </Box>

                    {/* Thumbnail Strip */}
                    {photoList.length > 1 && (
                      <Flex
                        gap="6px"
                        mt="8px"
                        overflowX="auto"
                        py="4px"
                        css={{
                          '&::-webkit-scrollbar': { height: '4px' },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#cbd5e1',
                            borderRadius: '4px',
                          },
                        }}
                      >
                        {photoList.map((imgUrl, i) => (
                          <Box
                            key={i}
                            w="44px"
                            h="44px"
                            flexShrink={0}
                            borderRadius="6px"
                            overflow="hidden"
                            cursor="pointer"
                            border={
                              i === activePhotoIdx
                                ? '2px solid #0f172a'
                                : '1px solid #e2e8f0'
                            }
                            opacity={i === activePhotoIdx ? 1 : 0.65}
                            _hover={{ opacity: 1 }}
                            onClick={() => setActivePhotoIdx(i)}
                          >
                            <Image
                              src={imgUrl}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              alt={`Thumbnail ${i + 1}`}
                            />
                          </Box>
                        ))}
                      </Flex>
                    )}
                  </Box>

                  {/* Album Info & Primary Actions */}
                  <Box flex={1} minW={0} w="100%">
                    <HStack spacing="6px" mb="6px" flexWrap="wrap">
                      <Badge
                        bg="#f1f5f9"
                        color="#0f172a"
                        fontSize="11px"
                        px="6px"
                        py="2px"
                        borderRadius="4px"
                        fontWeight="700"
                      >
                        {videoData.platformName?.toUpperCase() || videoData.platform?.toUpperCase()} {trans.result.albumBadge}
                      </Badge>
                      <Badge
                        bg="#ecfdf5"
                        color="#059669"
                        fontSize="10px"
                        px="5px"
                        py="1px"
                        borderRadius="4px"
                      >
                        {photoList.length} {trans.result.originalPhotos}
                      </Badge>
                      <Badge
                        bg="#eff6ff"
                        color="#2563eb"
                        fontSize="10px"
                        px="5px"
                        py="1px"
                        borderRadius="4px"
                      >
                        {trans.result.noWatermark}
                      </Badge>
                      {videoData.authorName && (
                        <Text fontSize="12px" color="#0ea5e9" fontWeight="600">
                          @{videoData.authorName}
                        </Text>
                      )}
                    </HStack>

                    <Text
                      fontSize="14px"
                      fontWeight="700"
                      color="#0f172a"
                      lineHeight="1.5"
                      noOfLines={2}
                      mb="14px"
                    >
                      {videoData.title || trans.result.albumDefaultTitle.replace('{count}', photoList.length.toString())}
                    </Text>

                    {/* Primary Photo Action Buttons */}
                    <Flex gap="8px" flexWrap="wrap">
                      <Button
                        onClick={handleDownloadAllZip}
                        isLoading={zipping}
                        loadingText={trans.result.zipping}
                        flex={1}
                        minW="180px"
                        h="40px"
                        borderRadius="10px"
                        fontSize="13px"
                        fontWeight="700"
                        bg="#0f172a"
                        color="#ffffff"
                        _hover={{ bg: '#1e293b' }}
                        leftIcon={<MdFolderZip size="17px" />}
                      >
                        {trans.result.downloadAllZip.replace('{count}', photoList.length.toString())}
                      </Button>

                      <Button
                        onClick={() => {
                          const targetImg = photoList[activePhotoIdx];
                          triggerDirectDownload(targetImg, 'jpg', `Photo_${activePhotoIdx + 1}`);
                        }}
                        minW="150px"
                        h="40px"
                        borderRadius="10px"
                        fontSize="13px"
                        fontWeight="600"
                        bg="#f8fafc"
                        border="1px solid #e2e8f0"
                        color="#0f172a"
                        _hover={{ bg: '#f1f5f9' }}
                        leftIcon={<MdImage size="16px" />}
                      >
                        {trans.result.downloadThisPhoto.replace('{index}', (activePhotoIdx + 1).toString())}
                      </Button>

                      {videoData.mp3Url && (
                        <Button
                          onClick={() => {
                            triggerDirectDownload(videoData.mp3Url!, 'mp3', 'Audio');
                          }}
                          minW="120px"
                          h="40px"
                          borderRadius="10px"
                          fontSize="13px"
                          fontWeight="600"
                          bg="#f8fafc"
                          border="1px solid #e2e8f0"
                          color="#0f172a"
                          _hover={{ bg: '#f1f5f9' }}
                          leftIcon={<MdMusicNote size="15px" />}
                        >
                          {trans.result.downloadMp3}
                        </Button>
                      )}
                    </Flex>
                  </Box>
                </Flex>

                {/* Individual Photo Download List */}
                <Box mt="14px" pt="14px" borderTop="1px solid #f1f5f9">
                  <HStack spacing="6px" mb="10px">
                    <MdPhotoLibrary size="14px" color="#64748b" />
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#64748b"
                      textTransform="uppercase"
                      letterSpacing="0.04em"
                    >
                      {trans.result.photoListTitle}
                    </Text>
                  </HStack>

                  <VStack spacing="6px" align="stretch">
                    {photoList.map((imgUrl, idx) => (
                      <Flex
                        key={idx}
                        align="center"
                        justify="space-between"
                        p="6px 12px"
                        borderRadius="8px"
                        bg="#f8fafc"
                        border="1px solid #f1f5f9"
                        _hover={{ bg: '#f1f5f9' }}
                      >
                        <HStack spacing="10px">
                          <Box
                            w="32px"
                            h="32px"
                            borderRadius="6px"
                            overflow="hidden"
                            border="1px solid #e2e8f0"
                            flexShrink={0}
                          >
                            <Image
                              src={imgUrl}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              alt={`${trans.result.photoPrefix} ${idx + 1}`}
                            />
                          </Box>
                          <Badge
                            bg="#e0f2fe"
                            color="#0369a1"
                            fontSize="10px"
                            px="5px"
                            py="1px"
                            borderRadius="4px"
                          >
                            {trans.result.photoPrefix} #{idx + 1}
                          </Badge>
                          <Text fontSize="12px" color="#334155" fontWeight="500">
                            {trans.result.photoHdDesc.replace('{index}', (idx + 1).toString())}
                          </Text>
                        </HStack>

                        <Button
                          size="xs"
                          h="28px"
                          borderRadius="6px"
                          fontSize="11px"
                          fontWeight="600"
                          isLoading={downloadingId === `photo-${idx}`}
                          onClick={() => {
                            setDownloadingId(`photo-${idx}`);
                            triggerDirectDownload(imgUrl, 'jpg', `Photo_${idx + 1}`);
                            setTimeout(() => setDownloadingId(null), 1500);
                          }}
                          bg="#0f172a"
                          color="#ffffff"
                          _hover={{ bg: '#1e293b' }}
                          leftIcon={<MdDownload size="12px" />}
                        >
                          {trans.result.downloadPhoto} #{idx + 1}
                        </Button>
                      </Flex>
                    ))}

                    {videoData.mp3Url && (
                      <Flex
                        align="center"
                        justify="space-between"
                        p="6px 12px"
                        borderRadius="8px"
                        bg="#fffbeb"
                        border="1px solid #fef3c7"
                        _hover={{ bg: '#fef3c7' }}
                      >
                        <HStack spacing="10px">
                          <Badge
                            bg="#fef3c7"
                            color="#92400e"
                            fontSize="10px"
                            px="5px"
                            py="1px"
                            borderRadius="4px"
                          >
                            MP3 320KBPS
                          </Badge>
                          <Text fontSize="12px" color="#92400e" fontWeight="600">
                            {trans.result.bgMusic.replace('{title}', videoData.musicTitle || trans.result.originalAudio)}
                          </Text>
                        </HStack>

                        <Button
                          size="xs"
                          h="28px"
                          borderRadius="6px"
                          fontSize="11px"
                          fontWeight="600"
                          isLoading={downloadingId === 'photo-mp3'}
                          onClick={() => {
                            setDownloadingId('photo-mp3');
                            triggerDirectDownload(videoData.mp3Url!, 'mp3', 'Audio');
                            setTimeout(() => setDownloadingId(null), 1500);
                          }}
                          bg="#92400e"
                          color="#ffffff"
                          _hover={{ bg: '#78350f' }}
                          leftIcon={<MdDownload size="12px" />}
                        >
                          {trans.result.downloadMp3}
                        </Button>
                      </Flex>
                    )}
                  </VStack>
                </Box>
              </Box>
            ) : (
              /* REGULAR VIDEO RESULT VIEW */
              <Box>
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  gap="16px"
                  align="flex-start"
                  mb="16px"
                >
                  {/* Thumbnail Preview */}
                  {videoData.thumbnail ? (
                    <Box
                      flexShrink={0}
                      borderRadius="12px"
                      overflow="hidden"
                      w={{ base: '100%', sm: '130px' }}
                      h={{ base: '180px', sm: '130px' }}
                      bg="#f1f5f9"
                      position="relative"
                      border="1px solid #e2e8f0"
                    >
                      <Image
                        src={videoData.thumbnail}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        alt={videoData.title || 'Video preview'}
                      />
                      <Badge
                        position="absolute"
                        bottom="6px"
                        right="6px"
                        bg="#0f172a"
                        color="#ffffff"
                        fontSize="9px"
                        px="5px"
                        py="1px"
                        borderRadius="4px"
                      >
                        {videoData.platform?.toUpperCase()}
                      </Badge>
                    </Box>
                  ) : (
                    <Flex
                      flexShrink={0}
                      w={{ base: '100%', sm: '130px' }}
                      h={{ base: '100px', sm: '130px' }}
                      bg="#f8fafc"
                      borderRadius="12px"
                      border="1px solid #e2e8f0"
                      align="center"
                      justify="center"
                      color="#64748b"
                    >
                      {renderPlatformIcon(videoData.platform, 36)}
                    </Flex>
                  )}

                  {/* Video Info Details */}
                  <Box flex={1} minW={0} w="100%">
                    <HStack spacing="6px" mb="6px" flexWrap="wrap">
                      <Badge
                        bg="#f1f5f9"
                        color="#0f172a"
                        fontSize="11px"
                        px="6px"
                        py="2px"
                        borderRadius="4px"
                        fontWeight="700"
                      >
                        {videoData.platformName?.toUpperCase() || videoData.platform?.toUpperCase()}
                      </Badge>
                      {videoData.authorName && (
                        <Text fontSize="12px" color="#0ea5e9" fontWeight="600">
                          @{videoData.authorName}
                        </Text>
                      )}
                      <Badge
                        bg="#ecfdf5"
                        color="#059669"
                        fontSize="10px"
                        px="5px"
                        py="1px"
                        borderRadius="4px"
                      >
                        {trans.result.noWatermark}
                      </Badge>
                    </HStack>

                    <Text
                      fontSize="14px"
                      fontWeight="700"
                      color="#0f172a"
                      lineHeight="1.5"
                      noOfLines={2}
                      mb="14px"
                    >
                      {videoData.title || trans.result.videoDefaultTitle}
                    </Text>

                    {/* Primary 1-Click Action Buttons */}
                    <Flex gap="8px" flexWrap="wrap">
                      <Button
                        onClick={() => {
                          const bestVideo = videoData.videoHdUrl || videoData.videoUrl;
                          triggerDirectDownload(bestVideo, 'mp4', 'HD_NoWatermark');
                        }}
                        flex={1}
                        minW="160px"
                        h="40px"
                        borderRadius="10px"
                        fontSize="13px"
                        fontWeight="700"
                        bg="#0f172a"
                        color="#ffffff"
                        _hover={{ bg: '#1e293b' }}
                        leftIcon={<MdHighQuality size="16px" />}
                      >
                        {trans.result.downloadVideoHd}
                      </Button>

                      {videoData.mp3Url && (
                        <Button
                          onClick={() => {
                            triggerDirectDownload(videoData.mp3Url!, 'mp3', 'Audio');
                          }}
                          minW="120px"
                          h="40px"
                          borderRadius="10px"
                          fontSize="13px"
                          fontWeight="600"
                          bg="#f8fafc"
                          border="1px solid #e2e8f0"
                          color="#0f172a"
                          _hover={{ bg: '#f1f5f9' }}
                          leftIcon={<MdMusicNote size="15px" />}
                        >
                          {trans.result.downloadMp3}
                        </Button>
                      )}

                      <Tooltip label={copiedLink ? trans.result.copiedLink : trans.result.copyLink}>
                        <Button
                          h="40px"
                          px="12px"
                          borderRadius="10px"
                          variant="outline"
                          borderColor="#e2e8f0"
                          color="#64748b"
                          _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                          onClick={() =>
                            handleCopyDirectLink(
                              videoData.videoHdUrl || videoData.videoUrl || videoData.mp3Url || '',
                            )
                          }
                        >
                          {copiedLink ? <MdCheckCircle color="#059669" size="16px" /> : <MdContentCopy size="16px" />}
                        </Button>
                      </Tooltip>
                    </Flex>

                    {videoData.videoUrl && (
                      <Button
                        size="xs"
                        variant="ghost"
                        mt="8px"
                        color="#64748b"
                        leftIcon={<MdPlayArrow size="13px" />}
                        _hover={{ color: '#0f172a' }}
                        onClick={() => setShowPreviewPlayer((prev) => !prev)}
                      >
                        {showPreviewPlayer ? trans.result.hidePreview : trans.result.showPreview}
                      </Button>
                    )}
                  </Box>
                </Flex>

                {/* Collapsible HTML5 Preview Player */}
                <Collapse in={showPreviewPlayer} animateOpacity>
                  {videoData.videoUrl && (
                    <Box
                      mb="16px"
                      p="8px"
                      borderRadius="10px"
                      bg="#000000"
                      overflow="hidden"
                    >
                      <video
                        src={videoData.videoHdUrl || videoData.videoUrl}
                        controls
                        style={{
                          width: '100%',
                          maxHeight: '320px',
                          borderRadius: '6px',
                        }}
                      />
                    </Box>
                  )}
                </Collapse>

                {/* Detailed Format Selection Table */}
                {videoData.formats && videoData.formats.length > 0 && (
                  <Box mt="14px" pt="14px" borderTop="1px solid #f1f5f9">
                    <HStack spacing="6px" mb="10px">
                      <MdOutlineLayers size="14px" color="#64748b" />
                      <Text
                        fontSize="12px"
                        fontWeight="700"
                        color="#64748b"
                        textTransform="uppercase"
                        letterSpacing="0.04em"
                      >
                        {trans.result.formatTableTitle}
                      </Text>
                    </HStack>

                    <VStack spacing="6px" align="stretch">
                      {videoData.formats.map((fmt, idx) => (
                        <Flex
                          key={idx}
                          align="center"
                          justify="space-between"
                          p="8px 12px"
                          borderRadius="8px"
                          bg="#f8fafc"
                          border="1px solid #f1f5f9"
                          _hover={{ bg: '#f1f5f9' }}
                        >
                          <HStack spacing="8px">
                            <Badge
                              bg={fmt.type === 'audio' ? '#fef3c7' : '#e0f2fe'}
                              color={fmt.type === 'audio' ? '#92400e' : '#0369a1'}
                              fontSize="10px"
                              px="5px"
                              py="1px"
                              borderRadius="4px"
                            >
                              {fmt.quality}
                            </Badge>
                            <Text fontSize="12px" color="#334155" fontWeight="500">
                              {fmt.label}
                            </Text>
                          </HStack>

                          <Button
                            size="xs"
                            h="28px"
                            borderRadius="6px"
                            fontSize="11px"
                            fontWeight="600"
                            isLoading={downloadingId === `fmt-${idx}`}
                            onClick={() => handleDownloadFormat(fmt, `fmt-${idx}`)}
                            bg="#0f172a"
                            color="#ffffff"
                            _hover={{ bg: '#1e293b' }}
                            leftIcon={<MdDownload size="12px" />}
                          >
                            {trans.result.downloadBtn}
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            )}

            {/* Quick Reset & Download Another Video Action */}
            <Flex
              mt="18px"
              pt="14px"
              borderTop="1px solid #f1f5f9"
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap="10px"
            >
              <Text fontSize="12px" color="#94a3b8">
                {trans.result.securityNotice}
              </Text>
              <Button
                size="sm"
                variant="outline"
                borderColor="#e2e8f0"
                color="#0f172a"
                borderRadius="8px"
                fontSize="12px"
                fontWeight="600"
                h="32px"
                _hover={{ bg: '#f1f5f9' }}
                onClick={onDeleteLink}
                leftIcon={<MdClear size="14px" />}
              >
                {trans.result.downloadAnother}
              </Button>
            </Flex>
          </Box>
        )}
      </Fade>
    </Box>
  );
};

export default Board;
