import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Input } from '../ui/Input';
import { Tool } from '../../types/project';
import { IconPicker } from '../ui/IconPicker';

interface ToolManagerProps {
  tools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (index: number) => void;
}

interface ToolFormData {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  category: string;
  description?: string;
}

const categories = ['3D', 'Video', 'Design', 'Business', 'Other'];

const ToolManager: React.FC<ToolManagerProps> = ({
  tools,
  onAddTool,
  onRemoveTool
}) => {
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    shortName: '',
    icon: 'Box',
    color: '#4F46E5',
    category: '3D'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Le nom ne doit pas dépasser 30 caractères';
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = 'Le nom court est requis';
    } else if (formData.shortName.length > 8) {
      newErrors.shortName = 'Le nom court ne doit pas dépasser 8 caractères';
    }

    if (tools.some(tool => tool.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Ce logiciel existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddTool({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        category: formData.category,
        description: formData.description
      });
      setFormData({
        name: '',
        shortName: '',
        icon: 'Box',
        color: '#4F46E5',
        category: '3D'
      });
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Gestionnaire de Logiciels
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom complet du logiciel"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          maxLength={30}
          required
        />

        <Input
          label="Nom court"
          value={formData.shortName}
          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
          error={errors.shortName}
          maxLength={8}
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
            Couleur
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <Input
          label="Description (optionnelle)"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Aperçu du logiciel
          </h4>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: formData.color }}
            >
              {Icons[formData.icon as keyof typeof Icons] && 
                React.createElement(Icons[formData.icon as keyof typeof Icons], {
                  className: "w-5 h-5 text-white"
                })
              }
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formData.name || 'Nom du logiciel'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({formData.shortName || 'Court'})
              </span>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter le logiciel</span>
        </motion.button>
      </form>

      {tools.length > 0 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un logiciel..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            {filteredTools.map((tool, index) => {
              const IconComponent = Icons[tool.icon as keyof typeof Icons];
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: tool.color }}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </span>
                    {tool.category && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({tool.category})
                      </span>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => onRemoveTool(index)}
                    className="p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolManager;