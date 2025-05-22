import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { formatRoles } from '../../../utils/projectUtils';
import { RoleManager } from './RoleManager';
import { useRoleStore } from '../../../store/roleStore';

interface RolesSectionProps {
  selectedRoles: string[];
  error?: string;
  onRoleToggle: (role: string) => void;
}

export function RolesSection({ selectedRoles, error, onRoleToggle }: RolesSectionProps) {
  const [showRoleManager, setShowRoleManager] = useState(false);
  const { roles, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, showRoleManager]); // Add showRoleManager as dependency to refresh when modal closes

  const formattedRoles = formatRoles(selectedRoles.join(', '));

  const handleRoleClick = (e: React.MouseEvent, role: string) => {
    e.preventDefault();
    onRoleToggle(role);
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
          onClose={() => setShowRoleManager(false)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge
                key={role.id}
                isSelected={selectedRoles.includes(role.name)}
                onClick={(e) => handleRoleClick(e, role.name)}
                variant="role"
                style={{
                  backgroundColor: selectedRoles.includes(role.name) ? role.color : undefined,
                  color: selectedRoles.includes(role.name) ? 'white' : undefined
                }}
              >
                {role.name}
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