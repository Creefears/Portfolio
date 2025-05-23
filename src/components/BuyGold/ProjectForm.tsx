import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { FormData, FormErrors, Video } from './types';
import { BasicInfo } from './sections/BasicInfo';
import { MediaSection } from './sections/MediaSection';
import { RolesSection } from './sections/RolesSection';
import { ToolsSection } from './sections/ToolsSection';
import { ProjectTypeSelect } from './sections/ProjectTypeSelect';

interface ProjectFormProps {
  formData: FormData;
  errors: FormErrors;
  videos: Video[];
  selectedRoles: string[];
  editingIndex: number | null;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onRoleToggle: (role: string) => void;
  onToolToggle: (toolName: string) => void;
  onVideoAdd: (title: string, url: string, thumbnail?: string) => void;
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
  onSubmit,
  onInputChange,
  onRoleToggle,
  onToolToggle,
  onVideoAdd,
  onVideoRemove,
  onImagesChange,
  onReset
}: ProjectFormProps) {
  return (
    <motion.form 
      onSubmit={onSubmit}
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
          onChange={onInputChange}
        />

        <MediaSection
          formData={formData}
          errors={errors}
          videos={videos}
          onChange={onInputChange}
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