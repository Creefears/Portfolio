import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Toast } from '../ui/Toast';
import { Role } from '../../types/role';

interface RoleManagerProps {
  onClose: () => void;
}

const defaultRoles = [
  { name: 'Réalisateur', colors: { bg: 'bg-purple-100', text: 'text-purple-800' } },
  { name: 'Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: '1er Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: '2ème Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: 'Monteur Vidéo', colors: { bg: 'bg-green-100', text: 'text-green-800' } },
  { name: '1er Monteur Vidéo', colors: { bg: 'bg-green-100', text: 'text-green-800' } },
  { name: 'Chargé de Production', colors: { bg: 'bg-yellow-100', text: 'text-yellow-800' } },
  { name: 'Concepteur 3D', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Modeleur', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Animateur', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Intégrale', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } }
];

export function RoleManager({ onClose }: RoleManagerProps) {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [formData, setFormData] = useState<Role>({
    name: '',
    colors: { bg: 'bg-blue-100', text: 'text-blue-800' }
  });
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      showToast('Le nom du rôle est requis', 'error');
      return;
    }

    if (roles.some(role => role.name.toLowerCase() === formData.name.toLowerCase())) {
      showToast('Ce rôle existe déjà', 'error');
      return;
    }

    setRoles(prev => [...prev, formData]);
    showToast('Rôle ajouté avec succès', 'success');
    setFormData({ name: '', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } });
  };

  const handleDelete = (name: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      setRoles(prev => prev.filter(role => role.name !== name));
      showToast('Rôle supprimé avec succès', 'success');
    }
  };

  const handleColorChange = (type: 'bg' | 'text') => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
      green: { bg: 'bg-green-100', text: 'text-green-800' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      red: { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const nextColor = Object.values(colors)[
      (Object.values(colors).findIndex(c => c[type] === formData.colors[type]) + 1) % Object.keys(colors).length
    ];

    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [type]: nextColor[type]
      }
    }));
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Gestionnaire de Rôles
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du rôle"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Réalisateur, Assistant Réalisateur..."
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Couleurs du badge
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleColorChange('bg')}
              className={`px-4 py-2 rounded-lg ${formData.colors.bg} ${formData.colors.text} transition-colors`}
            >
              Changer la couleur de fond
            </button>
            <button
              type="button"
              onClick={() => handleColorChange('text')}
              className={`px-4 py-2 rounded-lg ${formData.colors.bg} ${formData.colors.text} transition-colors`}
            >
              Changer la couleur du texte
            </button>
          </div>
          <div className={`p-3 rounded-lg ${formData.colors.bg} ${formData.colors.text}`}>
            Aperçu du badge
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
            <span>Ajouter le rôle</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fermer
          </motion.button>
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

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {filteredRoles.map((role) => (
              <div
                key={role.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <span className={`px-3 py-1 rounded-full ${role.colors.bg} ${role.colors.text}`}>
                  {role.name}
                </span>
                <motion.button
                  type="button"
                  onClick={() => handleDelete(role.name)}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}