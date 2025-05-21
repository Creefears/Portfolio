import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { formatRoles } from '../../../utils/projectUtils';
import { RoleManager } from './RoleManager';

interface RolesSectionProps {
  selectedRoles: string[];
  error?: string;
  onRoleToggle: (role: string) => void;
}

const CUSTOM_ROLES_KEY = 'custom-roles-storage';

export function RolesSection({ selectedRoles, error, onRoleToggle }: RolesSectionProps) {
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [customRoles, setCustomRoles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_ROLES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Default roles
  const defaultRoles = [
    'Réalisateur',
    'Assistant Réalisateur',
    '1er Assistant Réalisateur',
    '2ème Assistant Réalisateur',
    'Monteur Vidéo',
    '1er Monteur Vidéo',
    'Chargé de Production',
    'Concepteur 3D',
    'Modeleur',
    'Animateur',
    'Intégrale'
  ];

  // Combine default and custom roles
  const availableRoles = [...defaultRoles, ...customRoles];

  // Persist custom roles to localStorage
  useEffect(() => {
    localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(customRoles));
  }, [customRoles]);

  const formattedRoles = formatRoles(selectedRoles.join(', '));

  const handleRoleClick = (e: React.MouseEvent, role: string) => {
    e.preventDefault();
    onRoleToggle(role);
  };

  const handleAddRole = (role: string) => {
    if (!customRoles.includes(role)) {
      setCustomRoles(prev => [...prev, role]);
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setCustomRoles(prev => prev.filter(role => role !== roleToRemove));
    if (selectedRoles.includes(roleToRemove)) {
      onRoleToggle(roleToRemove);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          <h2>Rôles</h2>
        </div>
        <motion.button
          onClick={() => setShowRoleManager(!showRoleManager)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau rôle</span>
        </motion.button>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
      )}

      {showRoleManager ? (
        <RoleManager
          roles={customRoles}
          onAddRole={handleAddRole}
          onRemoveRole={handleRemoveRole}
          onClose={() => setShowRoleManager(false)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <Badge
                key={role}
                isSelected={selectedRoles.includes(role)}
                onClick={(e) => handleRoleClick(e, role)}
                variant="role"
              >
                {role}
              </Badge>
            ))}
          </div>

          {selectedRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {formattedRoles.map((r, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${r.colors.bg} ${r.colors.text}`}
                >
                  {r.role}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}