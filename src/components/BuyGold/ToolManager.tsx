import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Input } from '../ui/Input';
import { Tool } from '../../types/project';
import { IconPicker } from '../ui/IconPicker';
import { useToolStore } from '../../store/toolStore';

interface ToolManagerProps {
  tools: Tool[];
  onClose: () => void;
}

interface ToolFormData {
  name: string;
  short_name: string;
  icon: string;
  color: string;
}

const ToolManager: React.FC<ToolManagerProps> = ({ tools, onClose }) => {
  const { addTool, deleteTool } = useToolStore();
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    short_name: '',
    icon: 'Box',
    color: '#4F46E5'
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

    if (!formData.short_name.trim()) {
      newErrors.short_name = 'Le nom court est requis';
    } else if (formData.short_name.length > 10) {
      newErrors.short_name = 'Le nom court ne doit pas dépasser 10 caractères';
    }

    if (tools.some(tool => tool.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Ce logiciel existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await addTool({
          name: formData.name,
          short_name: formData.short_name,
          icon: formData.icon,
          color: formData.color
        });

        setFormData({
          name: '',
          short_name: '',
          icon: 'Box',
          color: '#4F46E5'
        });
      } catch (error) {
        console.error('Error saving tool:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Échec de l’enregistrement du logiciel.'
        }));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce logiciel ?')) {
      try {
        await deleteTool(id);
      } catch (error) {
        console.error('Error deleting tool:', error);
      }
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Gestionnaire de Logiciels
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du logiciel"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          maxLength={30}
          required
        />

        <Input
          label="Nom court (affiché au survol)"
          value={formData.short_name}
          onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
          error={errors.short_name}
          maxLength={10}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icône</label>
          <IconPicker
            value={formData.icon}
            onChange={(value) => setFormData({ ...formData, icon: value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Couleur</label>
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

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter le logiciel</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annuler
          </motion.button>
        </div>
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
            {filteredTools.map((tool) => {
              const IconComponent = Icons[tool.icon as keyof typeof Icons];
              return (
                <div
                  key={tool.id}
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
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({tool.short_name})
                    </span>
                  </div>
                  {tool.id && (
                    <motion.button
                      type="button"
                      onClick={() => handleDelete(tool.id!)}
                      className="p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
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