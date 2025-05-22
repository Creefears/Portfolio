import React from 'react';
import RoleBadges from './RoleBadges';
import ToolIcon from '../ToolIcon';
import { Tool } from '../../types/project';

interface ProjectInfoProps {
  year: string;
  role: string;
  tools: Tool[];
}

export function ProjectInfo({ year, role, tools }: ProjectInfoProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Année</h3>
        <p className="text-gray-600 dark:text-gray-400">{year}</p>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Rôle</h3>
        <div className="flex justify-center">
          <RoleBadges role={role} />
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Outils</h3>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <ToolIcon key={tool.id} id={tool.id} size={20} />
          ))}
        </div>
      </div>
    </div>
  );
}
