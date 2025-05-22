import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { useRoleStore } from '../../store/roleStore';
import { Toast } from '../ui/Toast';
import { Role } from '../../types/role';

interface RoleManagerProps {
  onClose: () => void;
}

export function RoleManager({ onClose }: RoleManagerProps) {
  const { roles, addRole, updateRole, deleteRole } = useRoleStore();
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    color: '#4F46E5',
    permissions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      admin: false
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Le nom ne doit pas dépasser 30 caractères';
    }

    if (!editingId && roles.some(role => role.name.toLowerCase() === formData.name?.toLowerCase())) {
      newErrors.name = 'Ce rôle existe déjà';
    }

    if (!formData.color?.match(/^#[0-9A-F]{6}$/i)) {
      newErrors.color = 'La couleur doit être au format hexadécimal (ex: #FF0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (editingId) {
          await updateRole({
            ...formData,
            id: editingId
          } as Role);
          showToast('Rôle mis à jour avec succès', 'success');
        } else {
          await addRole(formData as Role);
          showToast('Rôle ajouté avec succès', 'success');
        }

        resetForm();
      } catch (error) {
        console.error('Error saving role:', error);
        showToast(editingId ? 'Échec de la mise à jour' : 'Échec de l\'ajout du rôle', 'error');
      }
    }
  };

  const handleEdit = (role: Role) => {
    setEditingId(role.id);
    setFormData({
      ...role
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      try {
        await deleteRole(id);
        showToast('Rôle supprimé avec succès', 'success');
        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        showToast('Échec de la suppression', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4F46E5',
      permissions: {
        create: false,
        read: true,
        update: false,
        delete: false,
        admin: false
      }
    });
    setEditingId(null);
    setErrors({});
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Gestionnaire de Rôles
        </h3>
        <motion.button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du rôle"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (optionnelle)
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Couleur du badge
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#000000"
              error={errors.color}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.permissions || {}).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      [key]: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {key}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>{editingId ? 'Mettre à jour' : 'Ajouter'} le rôle</span>
          </motion.button>

          {editingId && (
            <motion.button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
          )}
        </div>
      </form>

      {roles.length > 0 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un rôle..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            {filteredRoles.map((role) => {
              const isEditing = editingId === role.id;
              
              return (
                <div
                  key={role.id}
                  className={`flex items-center gap-3 p-3 rounded-lg group transition-colors ${
                    isEditing 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {role.name}
                    </span>
                    {role.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      type="button"
                      onClick={() => handleEdit(role)}
                      className={`p-1 ${
                        isEditing 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleDelete(role.id!)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}