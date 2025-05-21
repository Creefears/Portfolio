import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileVideo, Code, Plus } from 'lucide-react';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Badge } from './Badge';
import { MediaPreview } from './MediaPreview';
import { formatVideoUrl } from '../../utils/projectUtils';

interface VideoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
}

export function VideoInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'URL de la vidéo',
  showPreview = true,
  className = ''
}: VideoInputProps) {
  const [videoType, setVideoType] = useState<'video' | 'iframe'>('video');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (value) {
      const formattedUrl = videoType === 'iframe' ? value : formatVideoUrl(value);
      onChange(formattedUrl);
      if (onSubmit) onSubmit(e);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2 justify-end">
        <Badge
          isSelected={videoType === 'video'}
          onClick={() => setVideoType('video')}
          icon={<FileVideo className="w-4 h-4" />}
        >
          Vidéo
        </Badge>
        <Badge
          isSelected={videoType === 'iframe'}
          onClick={() => setVideoType('iframe')}
          icon={<Code className="w-4 h-4" />}
        >
          iframe
        </Badge>
      </div>

      <div className="flex gap-4">
        {videoType === 'iframe' ? (
          <TextArea
            value={value}
            onChange={handleChange}
            placeholder="Code iframe"
            className="flex-1 min-h-[120px]"
          />
        ) : (
          <Input
            type="url"
            value={value}
            onChange={handleChange}
            placeholder="URL de la vidéo (YouTube ou Google Drive)"
            className="flex-1"
          />
        )}

        {onSubmit && (
          <motion.button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter</span>
          </motion.button>
        )}
      </div>

      {showPreview && value && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <MediaPreview 
            type="video" 
            url={value}
            onClose={() => {
              onChange('');
            }}
          />
        </div>
      )}
    </div>
  );
}