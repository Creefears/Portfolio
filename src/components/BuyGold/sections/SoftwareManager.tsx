import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Input } from '../../ui/Input';
import { Tool } from '../../../types/project';
import { SoftwareFormData } from '../types';

interface SoftwareManagerProps {
  tools: Tool[];
  roles: string[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (index: number) => void;
}

const iconList = Object.entries(Icons).map(([name]) => ({
  name,
  icon: Icons[name as keyof typeof Icons]
}));

export function SoftwareManager({
  tools,
  roles,
  onAddTool,
  onRemoveTool
}: SoftwareManagerProps) {
  const [formData, setFormData] = useState<SoftwareFormData>({
    title: '',
    icon: 'Code',
    color: '#4F46E5',
    role: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconList.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      onAddTool({
        name: formData.title,
        icon: formData.icon,
        color: formData.color,
        role: formData.role
      });
      setFormData({
        title: '',
        icon: 'Code',
        color: '#4F46E5',
        role: ''
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Logiciels
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nom du logiciel"
          required
        />

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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Icône
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une icône..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, icon: name })}
                className={`p-2 rounded-lg transition-all ${
                  formData.icon === name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rôle associé (optionnel)
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="">Aucun rôle</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
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
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Logiciels existants
          </h4>
          <div className="space-y-2">
            {tools.map((tool, index) => {
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
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </span>
                    {tool.role && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({tool.role})
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
}