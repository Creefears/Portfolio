import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { IconPicker } from '../ui/IconPicker';
import { Experience } from '../../types/experience';
import * as Icons from 'lucide-react';

interface ExperienceFormProps {
  data: Experience;
  editingIndex: number | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onReset: () => void;
}

export function ExperienceForm({
  data,
  editingIndex,
  onSubmit,
  onChange,
  onReset
}: ExperienceFormProps) {
  const IconComponent = (Icons as any)[data.icon] || Icons.Briefcase;

  const handleIconChange = (value: string) => {
    const event = {
      target: {
        name: 'icon',
        value
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const event = {
      target: {
        name: 'color',
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg text-white" style={{ backgroundColor: data.color }}>
            <IconComponent className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {editingIndex !== null ? 'Modifier une Expérience' : 'Ajouter une Expérience'}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="year"
            label="Année"
            value={data.year}
            onChange={onChange}
            required
          />
          <Input
            name="company"
            label="Entreprise"
            value={data.company}
            onChange={onChange}
            required
          />
        </div>

        <Input
          name="role"
          label="Rôle"
          value={data.role}
          onChange={onChange}
          required
        />

        <TextArea
          name="description"
          label="Description"
          value={data.description}
          onChange={onChange}
          required
        />

        <Input
          name="link"
          label="Lien (optionnel)"
          value={data.link}
          onChange={onChange}
          type="url"
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Icône
          </label>
          <IconPicker
            value={data.icon}
            onChange={handleIconChange}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Couleur
          </label>
          <input
            type="color"
            value={data.color}
            onChange={handleColorChange}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        <div className="pt-6 flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-5 h-5" />
            {editingIndex !== null ? "Mettre à jour l'Expérience" : "Sauvegarder l'Expérience"}
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