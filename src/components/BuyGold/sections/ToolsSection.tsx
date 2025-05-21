import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool as Tool, Search, Film, Gamepad2, Plus } from 'lucide-react';
import { Tool as ToolType } from '../../../types/project';
import { Badge } from '../../ui/Badge';
import { useProjectStore } from '../../../store/projectStore';
import { useToolStore } from '../../../store/toolStore';
import ToolManager from '../ToolManager';
import * as Icons from 'lucide-react';

interface ToolsSectionProps {
  tools: ToolType[];
  error?: string;
  onToolToggle: (toolName: string) => void;
}

export function ToolsSection({ tools, error, onToolToggle }: ToolsSectionProps) {
  const [showToolManager, setShowToolManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fetchTools, tools: allTools } = useToolStore();

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const getFilteredTools = () => {
    let filteredTools = allTools;
    
    if (selectedCategory) {
      filteredTools = filteredTools.filter(tool => tool.category === selectedCategory);
    }

    if (searchTerm) {
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredTools;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <Tool className="w-6 h-6" />
          <h2>Outils</h2>
        </div>
        <motion.button
          onClick={() => setShowToolManager(!showToolManager)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau logiciel</span>
        </motion.button>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
      )}

      {showToolManager ? (
        <ToolManager
          tools={allTools}
          onClose={() => setShowToolManager(false)}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  !selectedCategory
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tous
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedCategory('3D')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
                  selectedCategory === '3D'
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 className="w-4 h-4" />
                3D
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedCategory('Video')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
                  selectedCategory === 'Video'
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Film className="w-4 h-4" />
                Vidéo
              </motion.button>
            </div>
          </div>

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getFilteredTools().map((tool, index) => {
              const IconComponent = Icons[tool.icon as keyof typeof Icons] || Icons.Box;
              const isSelected = tools.some(t => t.name === tool.name);

              return (
                <motion.button
                  key={tool.id || index}
                  onClick={() => onToolToggle(tool.name)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.2)'
                        : tool.color
                    }}
                  >
                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <span className="font-medium">{tool.name}</span>
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}