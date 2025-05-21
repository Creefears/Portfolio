import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const iconCategories = {
  'Design': [
    'Palette', 'PenTool', 'Brush', 'Wand2', 'Scissors', 'Layers', 'Image', 'Images',
    'Paintbrush', 'Pencil', 'Edit', 'Edit2', 'Edit3', 'Type', 'Typography', 'Underline',
    'Bold', 'Italic', 'Strikethrough', 'Eraser', 'Crop', 'ColorPicker'
  ],
  '3D & Animation': [
    'Box', 'Cube', 'Shapes', 'Component', 'Boxes', 'Gamepad2', 'Joystick', 'Dice',
    'Pyramid', 'Cylinder', 'Sphere', 'Codesandbox', 'Package', 'Package2', 'Perspective',
    'View', 'View360', 'ThreeDCubeSphere'
  ],
  'Video & Media': [
    'Film', 'Video', 'Camera', 'Clapperboard', 'PlaySquare', 'Play', 'PlayCircle',
    'Pause', 'Stop', 'FastForward', 'Rewind', 'SkipBack', 'SkipForward', 'Volume',
    'Volume1', 'Volume2', 'VolumeX', 'Mic', 'Mic2', 'Music', 'Music2', 'Music3', 'Music4'
  ],
  'Business': [
    'Briefcase', 'GraduationCap', 'Trophy', 'Target', 'Users', 'Star', 'Award',
    'Medal', 'Crown', 'Gift', 'Gem', 'Diamond', 'Coins', 'Wallet', 'CreditCard',
    'DollarSign', 'Percent', 'PieChart', 'BarChart', 'LineChart', 'TrendingUp'
  ],
  'Development': [
    'Code', 'Terminal', 'Database', 'GitBranch', 'Laptop', 'Server', 'Bug', 'Code2',
    'CodeSquare', 'CodeSquareBrackets', 'Binary', 'Braces', 'Brackets', 'Hash',
    'Webhook', 'Workflow', 'Api', 'Cloud', 'CloudCog', 'CloudOff'
  ],
  'Communication': [
    'MessageSquare', 'Mail', 'Send', 'Share2', 'Link', 'Link2', 'Phone', 'PhoneCall',
    'MessageCircle', 'Messages', 'MessagesSquare', 'BellRing', 'Bell', 'BellPlus',
    'AtSign', 'Inbox', 'SendHorizontal', 'Reply', 'Forward', 'Share'
  ],
  'Interface': [
    'Settings', 'Settings2', 'Cog', 'Sliders', 'Toggle', 'ToggleLeft', 'ToggleRight',
    'Menu', 'MenuSquare', 'MoreHorizontal', 'MoreVertical', 'List', 'ListOrdered',
    'Layout', 'LayoutGrid', 'LayoutList', 'Filter', 'Search', 'ZoomIn', 'ZoomOut'
  ],
  'Documents': [
    'File', 'FileText', 'FilePlus', 'FileMinus', 'FileCheck', 'FileX', 'FileJson',
    'FileCode', 'FileImage', 'FileVideo', 'FileAudio', 'FilePdf', 'FileArchive',
    'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'Archive', 'Box'
  ]
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get the current icon component safely
  const CurrentIcon = (Icons as any)[value] || Icons.Briefcase;

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let icons = selectedCategory 
      ? iconCategories[selectedCategory as keyof typeof iconCategories]
      : Object.values(iconCategories).flat();

    if (searchTerm) {
      icons = icons.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return icons;
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-3",
          "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg",
          "hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <CurrentIcon className="w-6 h-6" />
          </div>
          <span className="text-gray-700 dark:text-gray-300 text-lg">{value}</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-[90vw] max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Sélectionner une icône
                    </h2>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une icône..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-4 py-3",
                        "bg-gray-100 dark:bg-gray-700",
                        "border border-gray-200 dark:border-gray-600 rounded-lg",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500",
                        "text-base"
                      )}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 p-4 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                  {Object.keys(iconCategories).map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors",
                        selectedCategory === category
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>

                {/* Icons Grid */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                    {getFilteredIcons().map((iconName) => {
                      const Icon = (Icons as any)[iconName];
                      if (!Icon) return null;

                      return (
                        <motion.button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            onChange(iconName);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-xl",
                            "hover:bg-gray-100 dark:hover:bg-gray-700 transition-all",
                            value === iconName && "bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <Icon className="w-8 h-8" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                            {iconName}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}