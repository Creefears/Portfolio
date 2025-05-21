import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectListProps {
  title: string;
  projects: Project[];
  onEdit: (project: Project, type: 'cgi' | 'real', index: number) => void;
  onDelete: (type: 'cgi' | 'real', index: number) => void;
  type: 'cgi' | 'real';
}

export function ProjectList({ title, projects, onEdit, onDelete, type }: ProjectListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {title} ({projects.length})
      </h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.shortDescription}
              </p>
            </div>
            <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <motion.button
                type="button"
                onClick={() => onEdit(project, type, index)}
                className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => onDelete(type, index)}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}