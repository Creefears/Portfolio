import React, { useState, useEffect, useRef } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Box, Gamepad2, Joystick, Film, FileSpreadsheet, Calendar, PenTool, Wand2, Palette, Play, Clapperboard, Cuboid as Cube, Brush } from 'lucide-react';
import { clsx } from 'clsx';

const toolColors: Record<string, { light: string; dark: string }> = {
  'Blender': { light: 'bg-orange-500', dark: 'bg-orange-800' },
  'Unity': { light: 'bg-blue-500', dark: 'bg-blue-800' },
  'Unreal Engine 5': { light: 'bg-purple-500', dark: 'bg-purple-800' },
  'Adobe Premiere': { light: 'bg-indigo-500', dark: 'bg-indigo-800' },
  'Adobe After Effects': { light: 'bg-pink-500', dark: 'bg-pink-800' },
  'Adobe Photoshop': { light: 'bg-sky-500', dark: 'bg-sky-800' },
  'Adobe Animate': { light: 'bg-yellow-500', dark: 'bg-yellow-800' },
  'Microsoft Office': { light: 'bg-emerald-500', dark: 'bg-emerald-800' },
  'Movie Magic Scheduling': { light: 'bg-red-500', dark: 'bg-red-800' },
  'Sony Vegas': { light: 'bg-violet-500', dark: 'bg-violet-800' },
  'DaVinci Resolve': { light: 'bg-teal-500', dark: 'bg-teal-800' },
  'Autodesk Maya': { light: 'bg-cyan-500', dark: 'bg-cyan-800' },
  'Substance Painter': { light: 'bg-rose-500', dark: 'bg-rose-800' },
};

const toolIcons: Record<string, React.ElementType> = {
  'Blender': Box,
  'Unity': Gamepad2,
  'Unreal Engine 5': Joystick,
  'Adobe Premiere': Film,
  'Adobe After Effects': Wand2,
  'Adobe Photoshop': PenTool,
  'Adobe Animate': Palette,
  'Microsoft Office': FileSpreadsheet,
  'Movie Magic Scheduling': Calendar,
  'Sony Vegas': Play,
  'DaVinci Resolve': Clapperboard,
  'Autodesk Maya': Cube,
  'Substance Painter': Brush,
};

// Shortened names for hover effect
const shortNames: Record<string, string> = {
  'Blender': 'Blender',
  'Unity': 'Unity',
  'Unreal Engine 5': 'UE5',
  'Adobe Premiere': 'Premiere',
  'Adobe After Effects': 'AE',
  'Adobe Photoshop': 'PS',
  'Adobe Animate': 'Animate',
  'Microsoft Office': 'Office',
  'Movie Magic Scheduling': 'MMS',
  'Sony Vegas': 'Vegas',
  'DaVinci Resolve': 'DaVinci',
  'Autodesk Maya': 'Maya',
  'Substance Painter': 'Substance',
};

// Static variable to track the currently expanded icon
let currentExpandedIcon: string | null = null;

interface ToolIconProps {
  name: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
}

const ToolIcon = React.memo(function ToolIcon({ name, className, size = 20, showLabel = false }: ToolIconProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const Icon = toolIcons[name] || Film;
  const colors = toolColors[name] || { light: 'bg-gray-500', dark: 'bg-gray-800' };
  const shortName = shortNames[name] || name;

  const closeIcon = () => {
    setIsExpanded(false);
    currentExpandedIcon = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isMobile) {
      // If another icon is expanded, close it
      if (currentExpandedIcon && currentExpandedIcon !== name) {
        document.dispatchEvent(new CustomEvent('closeToolIcon', { detail: currentExpandedIcon }));
      }

      // Toggle current icon
      setIsExpanded(!isExpanded);
      currentExpandedIcon = isExpanded ? null : name;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout if expanding
      if (!isExpanded) {
        timeoutRef.current = setTimeout(() => {
          closeIcon();
        }, 3000);
      }
    }
  };

  // Listen for close events from other icons
  useEffect(() => {
    const handleCloseEvent = (e: CustomEvent) => {
      if (e.detail === name) {
        closeIcon();
      }
    };

    document.addEventListener('closeToolIcon', handleCloseEvent as EventListener);
    return () => {
      document.removeEventListener('closeToolIcon', handleCloseEvent as EventListener);
    };
  }, [name]);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div 
            className="flex flex-col items-center gap-1"
            onTouchStart={handleTouchStart}
          >
            <div 
              className={clsx(
                "group relative p-1.5 md:p-2 rounded-lg",
                "transition-all duration-300 ease-in-out",
                isExpanded ? "scale-110 z-10" : "",
                "hover:scale-110 hover:z-10",
                "hover:shadow-lg dark:hover:shadow-black/30",
                colors.light,
                "dark:" + colors.dark,
                className
              )}
            >
              <div className="flex items-center">
                <Icon 
                  size={size} 
                  className="text-white transition-all duration-300" 
                />
                {(!showLabel && (isExpanded || !isMobile)) && (
                  <div 
                    className={clsx(
                      "overflow-hidden",
                      "transition-all duration-300 ease-in-out",
                      isExpanded ? "w-auto opacity-100 ml-2" : 
                      "w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-2"
                    )}
                  >
                    <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                      {shortName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {showLabel && (
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                {name}
              </span>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-xs md:text-sm"
            sideOffset={5}
          >
            {!showLabel && name}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

export default ToolIcon;