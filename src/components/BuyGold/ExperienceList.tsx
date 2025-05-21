import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Experience } from '../../types/experience';
import * as Icons from 'lucide-react';

interface ExperienceListProps {
  experiences: Experience[];
  onEdit: (experience: Experience, index: number) => void;
  onDelete: (index: number) => void;
}

export function ExperienceList({ experiences, onEdit, onDelete }: ExperienceListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Expériences ({experiences.length})
      </h2>
      <div className="space-y-4">
        {experiences.map((experience, index) => {
          const IconComponent = Icons[experience.icon as keyof typeof Icons] || Icons.Briefcase;
          
          return (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-3 rounded-lg text-white" style={{ backgroundColor: experience.color }}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {experience.role}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    • {experience.year}
                  </span>
                </div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {experience.company}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {experience.description}
                </p>
                {experience.link && (
                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block"
                  >
                    Voir le projet →
                  </a>
                )}
              </div>
              <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <motion.button
                  type="button"
                  onClick={() => onEdit(experience, index)}
                  className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}