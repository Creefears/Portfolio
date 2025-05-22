import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Input } from '../ui/Input';
import { IconPicker } from '../ui/IconPicker';
import { useRoleStore } from '../../store/roleStore';
import { Toast } from '../ui/Toast';
import { Role } from '../../types/role';

interface RoleManagerProps {
  roles: Role[];
  onClose: () => void;
}

interface RoleFormData {
  id?: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  permissions?: any;
}

const RoleManager: React.FC<RoleManagerProps> = ({ roles, onClose }) => {
  const { addRole, deleteRole, updateRole } = useRoleStore();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    icon: 'Briefcase',
    color: '#4F46E5'
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

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Le nom ne doit pas dépasser 30 caractères';
    }

    // Only check for existing role if we're not editing
    if (!editingId && roles.some(role => role.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Ce rôle existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (editingId) {
          await updateRole({
            ...formData,
            id: editingId
          });
          showToast('Rôle mis à jour avec succès', 'success');
        } else {
          await addRole(formData);
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
      id: role.id,
      name: role.name,
      description: role.description,
      icon: role.icon,
      color: role.color,
      permissions: role.permissions
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
      icon: 'Briefcase',
      color: '#4F46E5'
    });
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Gestionnaire de Rôles
      </h3>

      <div className="space-y-4" onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}>
        <Input
          label="Nom du rôle"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          maxLength={30}
          required
        />

        <Input
          label="Description (optionnelle)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={100}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icône</label>
          <IconPicker
            value={formData.icon}
            onChange={(value) => setFormData({ ...formData, icon: value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Couleur</label>
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
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>{editingId ? 'Mettre à jour' : 'Ajouter'} le rôle</span>
          </motion.button>

          {editingId ? (
            <motion.button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Fermer
            </motion.button>
          )}
        </div>
      </div>

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

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {roles
              .filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((role) => {
                const IconComponent = Icons[role.icon as keyof typeof Icons];
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
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: role.color }}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                    </div>
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
};

export default RoleManager;