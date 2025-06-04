
export const transformGoogleDriveLink = (url: string): string => {
  // Handle direct Google Drive links
  const driveMatch = url.match(/\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Handle DrivePlyr links
  const drivePlyrMatch = url.match(/id=([^"&]+)/);
  if (drivePlyrMatch) {
    try {
      const decoded = JSON.parse(atob(drivePlyrMatch[1]));
      if (decoded.id?.[0]) {
        return `https://drive.google.com/file/d/${decoded.id[0]}/preview`;
      }
    } catch (e) {
      console.error('Error parsing DrivePlyr URL:', e);
    }
  }

  return url;
};

export const formatVideoUrl = (url: string): string => {
  if (!url) return '';

  try {
    // Handle YouTube playlist
    if (url.includes('videoseries')) {
      return url;
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId;
      
      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
      } else if (url.includes('watch?v=')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v');
      } else if (url.includes('/embed/')) {
        videoId = url.split('/embed/')[1].split('?')[0];
      }

      if (!videoId) return url;
      
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Google Drive
    if (url.includes('drive.google.com')) {
      return transformGoogleDriveLink(url);
    }

    // Handle iframe code
    if (url.startsWith('<iframe')) {
      return url;
    }
  } catch (error) {
    console.error('Error formatting video URL:', error);
    throw error;
  }

  return url;
};

export const createIframeElement = (url: string, title?: string): string => {
  if (url.startsWith('<iframe')) {
    return url;
  }

  const formattedUrl = formatVideoUrl(url);
  return `<iframe 
    src="${formattedUrl}"
    title="${title || 'Video'}"
    width="100%"
    height="100%"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="width:100%; height:100%; object-fit:contain;"
  ></iframe>`;
};