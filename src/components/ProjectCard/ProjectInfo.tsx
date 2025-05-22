import React from 'react';
import RoleBadges from './RoleBadges';
import ToolIcon from '../ToolIcon';
import { Tool } from '../../types/project';

interface ProjectInfoProps {
  year: string;
  role: string;
  tools: Tool[];
  shortDescription: string;
}

export function ProjectInfo({ year, role, tools, shortDescription }: ProjectInfoProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-4">
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
          <div className="flex flex-wrap justify-center gap-2">
            {tools.map((tool, idx) => (
              <ToolIcon key={idx} name={tool.name} size={20} />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Ajout de la description courte */}
      {shortDescription && (
        <div className="mt-4 text-center px-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">{shortDescription}</p>
        </div>
      )}
    </div>
  );
}
