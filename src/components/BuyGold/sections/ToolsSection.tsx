import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool as ToolIcon, Search, Plus } from 'lucide-react';
import { Tool } from '../../../types/project';
import { Badge } from '../../ui/Badge';
import { useProjectStore } from '../../../store/projectStore';
import * as Icons from 'lucide-react';

interface ToolsSectionProps {
  tools: Tool[];
  error?: string;
  onToolToggle: (toolName: string) => void;
}

const toolIcons = {
  'Blender': { icon: 'Box', color: '#EA7600' },
  'Adobe Premiere': { icon: 'Film', color: '#9999FF' },
  'Unreal Engine 5': { icon: 'Gamepad2', color: '#6C2B90' },
  'Adobe After Effects': { icon: 'Wand2', color: '#CF96FD' },
  'Unity': { icon: 'Gamepad2', color: '#4C9EDE' },
  'Substance Painter': { icon: 'Brush', color: '#C4282D' },
  'Autodesk Maya': { icon: 'Box', color: '#00A4E3' },
  'Adobe Animate': { icon: 'Palette', color: '#FF8AC9' },
  'Adobe Photoshop': { icon: 'Image', color: '#31A8FF' },
  'Microsoft Office': { icon: 'FileSpreadsheet', color: '#D83B01' },
  'Movie Magic Scheduling': { icon: 'Calendar', color: '#FF4B4B' },
  'Sony Vegas': { icon: 'Play', color: '#7B68EE' }
};

export function ToolsSection({ tools, error, onToolToggle }: ToolsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { userCGIProjects, userRealProjects } = useProjectStore();

  // Get all unique tools from projects
  const getAllProjectTools = () => {
    const toolsSet = new Set<string>();
    
    userCGIProjects.forEach(project => {
      project.tools.forEach(tool => toolsSet.add(tool.name));
    });
    
    userRealProjects.forEach(project => {
      project.tools.forEach(tool => toolsSet.add(tool.name));
    });

    return Array.from(toolsSet);
  };

  const allTools = getAllProjectTools();

  const getFilteredTools = () => {
    if (!searchTerm) return allTools;
    return allTools.filter(tool => 
      tool.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <ToolIcon className="w-6 h-6" />
          <h2>Outils</h2>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
      )}

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getFilteredTools().map((toolName, index) => {
          const toolConfig = toolIcons[toolName as keyof typeof toolIcons];
          const IconComponent = toolConfig ? Icons[toolConfig.icon as keyof typeof Icons] : Icons.Box;
          const isSelected = tools.some(t => t.name === toolName);

          return (
            <motion.button
              key={index}
              onClick={() => onToolToggle(toolName)}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
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
                    : toolConfig?.color || '#6366f1'
                }}
              >
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`} />
              </div>
              <span className="font-medium">{toolName}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}