import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Mail, Link2, Twitter, Facebook, Linkedin, MessageCircle, Send } from 'lucide-react';

interface ShareOption {
  name: string;
  icon: React.ElementType;
  color: string;
  shareUrl: (url: string, title: string, description: string) => string;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description: string;
  image: string;
}

const shareOptions: ShareOption[] = [
  {
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'bg-black hover:bg-gray-900',
    shareUrl: (url, title, description) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${description}`)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877f2] hover:bg-[#1666d8]',
    shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-[#0a66c2] hover:bg-[#084e95]',
    shareUrl: (url, title, description) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-[#25d366] hover:bg-[#1fb959]',
    shareUrl: (url, title, description) => 
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`
  },
  {
    name: 'Teams',
    icon: Send,
    color: 'bg-[#6264a7] hover:bg-[#525591]',
    shareUrl: (url, title, description) => 
      `https://teams.microsoft.com/share?href=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${description}`)}`
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    shareUrl: (url, title, description) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  }
];

function ShareDialog({ isOpen, onClose, url, title, description, image }: ShareDialogProps) {
  const fullTitle = `Victor Jacob - ${title}`;

  useEffect(() => {
    if (isOpen) {
      // Update meta tags when dialog opens
      const metaTags = {
        'og:title': fullTitle,
        'og:description': description,
        'og:image': image,
        'og:url': url,
        'og:type': 'article',
        'og:site_name': 'Victor Jacob - Portfolio',
        'og:locale': 'fr_FR',
        'og:image:width': '1200',
        'og:image:height': '630',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@vicjacob',
        'twitter:creator': '@vicjacob',
        'twitter:title': fullTitle,
        'twitter:description': description,
        'twitter:image': image,
        'twitter:image:alt': fullTitle
      };

      // Update existing meta tags or create new ones
      Object.entries(metaTags).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      });
    }
  }, [isOpen, fullTitle, description, image, url]);

  const handleShare = async (option: ShareOption) => {
    // Try to use the Web Share API first on mobile devices
    if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: fullTitle,
          text: description,
          url: url
        });
        onClose();
        return;
      } catch (err) {
        console.error('Web Share API error:', err);
      }
    }
    
    // Regular sharing fallback
    window.open(option.shareUrl(url, fullTitle, description), '_blank');
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onClose();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <div className="fixed inset-0 overflow-y-auto z-[201]">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="sticky top-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Partager
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={image} 
                        alt={title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {fullTitle}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {shareOptions.map((option) => (
                      <motion.button
                        key={option.name}
                        onClick={() => handleShare(option)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg ${option.color} text-white transition-transform`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <option.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{option.name}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                    />
                    <motion.button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Copier</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ShareDialog;