import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { useRoleStore } from '../../store/roleStore';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Toast } from '../ui/Toast';

export const RoleManager = ({ onClose }: { onClose: () => void }) => {
  const { roles, addRole, deleteRole } = useRoleStore();
  const [formData, setFormData] = useState({ name: '', color: '#FF5733' });
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast('Le nom est requis', 'error');
      return;
    }

    try {
      await addRole(formData);
      setFormData({ name: '', color: '#FF5733' });
      showToast('Rôle ajouté avec succès', 'success');
    } catch {
      showToast('Échec de l’ajout', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce rôle ?')) {
      try {
        await deleteRole(id);
        showToast('Rôle supprimé', 'success');
      } catch {
        showToast('Erreur lors de la suppression', 'error');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gestionnaire de Rôles</h3>

      <div className="space-y-4">
        <Input
          label="Nom du rôle"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength={30}
        />

        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-12 h-12 rounded-lg cursor-pointer"
          />
          <Input
            label="Code couleur"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>

        <motion.button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="inline mr-2" />
          Ajouter le rôle
        </motion.button>

        <motion.button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Annuler
        </motion.button>
      </div>

      {roles.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-gray-100" style={{ color: role.color }}>
                {role.name}
              </span>
              <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};
