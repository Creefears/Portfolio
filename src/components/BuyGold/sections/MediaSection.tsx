import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Film, Plus, Trash2, Edit2 } from 'lucide-react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { FormData, FormErrors, Video } from '../types';
import { MediaPreview } from '../../ui/MediaPreview';
import { VideoInput } from '../../ui/VideoInput';

interface MediaSectionProps {
  formData: FormData;
  errors: FormErrors;
  videos: Video[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onVideoAdd: (title: string, url: string, thumbnail?: string) => void;
  onVideoRemove: (index: number) => void;
  onImagesChange: (images: string[]) => void;
}

export function MediaSection({
  formData,
  errors,
  videos,
  onChange,
  onVideoAdd,
  onVideoRemove,
  onImagesChange
}: MediaSectionProps) {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);

  const handleAddVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoTitle && videoUrl) {
      if (editingVideoIndex !== null) {
        // Update existing video
        const updatedVideos = [...videos];
        updatedVideos[editingVideoIndex] = {
          title: videoTitle,
          url: videoUrl,
          thumbnail: videoThumbnail || undefined
        };
        videos = updatedVideos;
        setEditingVideoIndex(null);
      } else {
        // Add new video
        onVideoAdd(videoTitle, videoUrl, videoThumbnail || undefined);
      }
      setVideoTitle('');
      setVideoUrl('');
      setVideoThumbnail('');
    }
  };

  const handleEditVideo = (index: number) => {
    const video = videos[index];
    setVideoTitle(video.title);
    setVideoUrl(video.url);
    setVideoThumbnail(video.thumbnail || '');
    setEditingVideoIndex(index);
  };

  const handleAddImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (imageUrl) {
      const newImages = [...(formData.images || []), imageUrl];
      onImagesChange(newImages);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleVideoChange = (value: string) => {
    const event = {
      target: {
        name: 'video',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        <Image className="w-6 h-6" />
        <h2>Médias</h2>
      </div>

      {/* Image Principale */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Image Principale
        </h3>
        <Input
          name="image"
          type="url"
          value={formData.image}
          onChange={onChange}
          error={errors.image}
          required
          placeholder="URL de l'image"
        />
        {formData.image && (
          <MediaPreview type="image" url={formData.image} />
        )}
      </div>

      {/* Images Carousel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Images Carousel
        </h3>
        <div className="flex gap-4">
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL de l'image"
            className="flex-1"
          />
          <motion.button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter</span>
          </motion.button>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <MediaPreview type="image" url={image} />
                <motion.button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Vidéos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Film className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vidéo Principale
          </h3>
        </div>

        <VideoInput
          value={formData.video || ''}
          onChange={handleVideoChange}
          placeholder="URL de la vidéo"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Vidéos Additionnelles
        </h3>
        <div className="space-y-4">
          <Input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Titre de la vidéo"
          />
          <VideoInput
            value={videoUrl}
            onChange={setVideoUrl}
            onSubmit={handleAddVideo}
            showPreview={false}
          />
          <Input
            value={videoThumbnail}
            onChange={(e) => setVideoThumbnail(e.target.value)}
            placeholder="URL de l'image de couverture (optionnel)"
            type="url"
          />
          <motion.button
            type="button"
            onClick={handleAddVideo}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>{editingVideoIndex !== null ? 'Mettre à jour' : 'Ajouter'} la vidéo</span>
          </motion.button>
        </div>
        
        {videos.length > 0 && (
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg group hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
              >
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-16 h-9 object-cover rounded"
                  />
                ) : (
                  <Film className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
                <span className="flex-1 text-gray-700 dark:text-gray-300">{video.title}</span>
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    onClick={() => handleEditVideo(index)}
                    className="p-1 text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onVideoRemove(index);
                    }}
                    className="p-1 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}