import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Input } from '../ui/Input';
import { IconPicker } from '../ui/IconPicker';
import { Tool } from '../../types/project';

interface BadgeCreatorProps {
  onSave: (badge: Tool) => void;
  onCancel?: () => void;
  existingBadges?: Tool[];
}

export function BadgeCreator({ onSave, onCancel, existingBadges = [] }: BadgeCreatorProps) {
  const [formData, setFormData] = useState<Tool>({
    name: '',
    icon: 'Code',
    color: '#4F46E5',
    category: '3D'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = ['3D', 'Video', 'Design', 'Business', 'Other'];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (existingBadges.some(badge => badge.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Ce logiciel existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      setFormData({
        name: '',
        icon: 'Code',
        color: '#4F46E5',
        category: '3D'
      });
    }
  };

  const IconComponent = (Icons as any)[formData.icon] || Icons.Code;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Créer un Badge Logiciel
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Nom du logiciel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icône
            </label>
            <IconPicker
              value={formData.icon}
              onChange={(value) => setFormData({ ...formData, icon: value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Couleur du badge
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Aperçu du badge
          </h4>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: formData.color }}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formData.name || 'Nom du logiciel'}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Créer le badge</span>
          </motion.button>

          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}