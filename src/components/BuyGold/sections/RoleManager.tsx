import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/Input';

interface RoleManagerProps {
  roles: string[];
  onAddRole: (role: string) => void;
  onRemoveRole: (role: string) => void;
  onClose: () => void;
}

export function RoleManager({ roles, onAddRole, onRemoveRole, onClose }: RoleManagerProps) {
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRole.trim()) {
      setError('Le nom du rôle est requis');
      return;
    }

    if (roles.includes(newRole.trim())) {
      setError('Ce rôle existe déjà');
      return;
    }

    onAddRole(newRole.trim());
    setNewRole('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Rôles Personnalisés
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Nom du rôle"
          error={error}
        />

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter le rôle</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annuler
          </motion.button>
        </div>
      </form>

      {roles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Rôles personnalisés existants
          </h4>
          <div className="space-y-2">
            {roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {role}
                </span>
                <motion.button
                  type="button"
                  onClick={() => onRemoveRole(role)}
                  className="p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}