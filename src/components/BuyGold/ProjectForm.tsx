import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { FormData, FormErrors, Video } from './types';
import { BasicInfo } from './sections/BasicInfo';
import { MediaSection } from './sections/MediaSection';
import { RolesSection } from './sections/RolesSection';
import { ToolsSection } from './sections/ToolsSection';
import { ProjectTypeSelect } from './sections/ProjectTypeSelect';
import { formatVideoUrl } from '../../utils/projectUtils';

interface ProjectFormProps {
  formData: FormData;
  errors: FormErrors;
  videos: Video[];
  selectedRoles: string[];
  editingIndex: number | null;
  videoTitle: string;
  videoUrl: string;
  setVideoTitle: (title: string) => void;
  setVideoUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onRoleToggle: (role: string) => void;
  onToolToggle: (toolName: string) => void;
  onVideoAdd: (title: string, url: string) => void;
  onVideoRemove: (index: number) => void;
  onImagesChange: (images: string[]) => void;
  onReset: () => void;
}

export function ProjectForm({
  formData,
  errors,
  videos,
  selectedRoles,
  editingIndex,
  videoTitle,
  videoUrl,
  setVideoTitle,
  setVideoUrl,
  onSubmit,
  onInputChange,
  onRoleToggle,
  onToolToggle,
  onVideoAdd,
  onVideoRemove,
  onImagesChange,
  onReset
}: ProjectFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format video URLs before submitting
    if (formData.video) {
      formData.video = formatVideoUrl(formData.video);
    }
    onSubmit(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Format video URL when it's changed
    if (name === 'video') {
      onInputChange({
        ...e,
        target: {
          ...e.target,
          value: formatVideoUrl(value)
        }
      });
    } else {
      onInputChange(e);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <ProjectTypeSelect
          value={formData.type}
          onChange={onInputChange}
        />
      </div>

      <div className="p-8 space-y-8">
        <BasicInfo
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        <MediaSection
          formData={formData}
          errors={errors}
          videos={videos}
          videoTitle={videoTitle}
          videoUrl={videoUrl}
          setVideoTitle={setVideoTitle}
          setVideoUrl={setVideoUrl}
          onChange={handleInputChange}
          onVideoAdd={onVideoAdd}
          onVideoRemove={onVideoRemove}
          onImagesChange={onImagesChange}
        />

        <RolesSection
          selectedRoles={selectedRoles}
          error={errors.role}
          onRoleToggle={onRoleToggle}
        />

        <ToolsSection
          tools={formData.tools}
          error={errors.tools}
          onToolToggle={onToolToggle}
        />

        <div className="pt-6 flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-5 h-5" />
            {editingIndex !== null ? 'Mettre à jour le Projet' : 'Sauvegarder le Projet'}
          </motion.button>

          {editingIndex !== null && (
            <motion.button
              type="button"
              onClick={onReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
          )}
        </div>
      </div>
    </motion.form>
  );
}