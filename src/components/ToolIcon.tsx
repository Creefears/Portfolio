import React, { useState, useEffect, useRef } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Box } from 'lucide-react';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';
import { useToolStore } from '../store/toolStore';

interface ToolIconProps {
  name?: string;
  id?: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
}

const ToolIcon = React.memo(function ToolIcon({
  name,
  id,
  className,
  size = 20,
  showLabel = false
}: ToolIconProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { tools, fetchTools } = useToolStore();

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const tool = id 
    ? tools.find(t => t.id === id)
    : name 
      ? tools.find(t => t.name === name)
      : null;

  let IconComponent: React.ElementType = Box;

  if (!tool) {
    console.warn(`Tool not found: ${id || name}`);
  } else if (tool.icon && tool.icon in Icons) {
    IconComponent = Icons[tool.icon as keyof typeof Icons];
  } else {
    console.warn(`Invalid icon "${tool?.icon}" for tool "${tool?.name}"`);
  }

  const shortName = tool?.short_name || tool?.name || "Tool";

  const closeIcon = () => setIsExpanded(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isMobile) {
      setIsExpanded(!isExpanded);
      clearTimeout(timeoutRef.current);
      if (!isExpanded) {
        timeoutRef.current = setTimeout(closeIcon, 3000);
      }
    }
  };

  useEffect(() => {
    const handleCloseEvent = () => closeIcon();
    document.addEventListener('closeToolIcon', handleCloseEvent);
    return () => document.removeEventListener('closeToolIcon', handleCloseEvent);
  }, []);

  if (!tool) return null;

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
                className
              )}
              style={{ backgroundColor: tool.color }}
            >
              <div className="flex items-center">
                <IconComponent 
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
                {tool.name}
              </span>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-xs md:text-sm"
            sideOffset={5}
          >
            {!showLabel && tool.name}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

export default ToolIcon;