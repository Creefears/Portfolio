import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tool as ToolIcon, Search, Film, Gamepad2, Plus } from 'lucide-react';
import { Tool } from '../../../types/project';
import { BadgeCreator } from '../BadgeCreator';
import { useProjectStore } from '../../../store/projectStore';
import * as Icons from 'lucide-react';
import { getTools, saveTool } from '../../../lib/supabase';

interface ToolsSectionProps {
  tools: Tool[];
  error?: string;
  onToolToggle: (toolName: string) => void;
}

export function ToolsSection({ tools, error, onToolToggle }: ToolsSectionProps) {
  const { userCGIProjects, userRealProjects } = useProjectStore();
  const [showBadgeCreator, setShowBadgeCreator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cgi' | 'real'>('all');
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const tools = await getTools();
        setAvailableTools(tools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchTools();
  }, []);

  const handleSaveBadge = async (badge: Tool) => {
    try {
      const savedTool = await saveTool(badge);
      setAvailableTools(prev => [...prev, savedTool]);
      onToolToggle(savedTool.name);
      setShowBadgeCreator(false);
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  const getFilteredTools = () => {
    let filteredTools = availableTools;
    
    if (selectedCategory !== 'all') {
      filteredTools = filteredTools.filter(tool => {
        const inCGI = userCGIProjects.some(project => 
          project.tools.some(t => t.name === tool.name)
        );
        const inReal = userRealProjects.some(project => 
          project.tools.some(t => t.name === tool.name)
        );
        return selectedCategory === 'cgi' ? inCGI : inReal;
      });
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
          <ToolIcon className="w-6 h-6" />
          <h2>Outils</h2>
        </div>
        <motion.button
          onClick={() => setShowBadgeCreator(!showBadgeCreator)}
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

      {showBadgeCreator ? (
        <BadgeCreator
          onSave={handleSaveBadge}
          onCancel={() => setShowBadgeCreator(false)}
          existingBadges={availableTools}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === 'all'
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
                onClick={() => setSelectedCategory('cgi')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
                  selectedCategory === 'cgi'
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 className="w-4 h-4" />
                CGI
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedCategory('real')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${
                  selectedCategory === 'real'
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Film className="w-4 h-4" />
                Réel
              </motion.button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un logiciel..."
              className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getFilteredTools().map((tool, index) => {
              const isSelected = tools.some(t => t.name === tool.name);
              const IconComponent = Icons[tool.icon as keyof typeof Icons] || Icons.Code;

              return (
                <motion.button
                  key={index}
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