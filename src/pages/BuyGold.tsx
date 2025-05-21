import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Project } from '../types/project';
import { Experience } from '../types/experience';
import { useProjectStore } from '../store/projectStore';
import { useCareerStore } from '../store/careerStore';
import { FormData, FormErrors, Video } from '../components/BuyGold/types';
import { ProjectForm } from '../components/BuyGold/ProjectForm';
import { ProjectList } from '../components/BuyGold/ProjectList';
import { ExperienceForm } from '../components/BuyGold/ExperienceForm';
import { ExperienceList } from '../components/BuyGold/ExperienceList';
import { Toast } from '../components/ui/Toast';

function BuyGold() {
  const { userCGIProjects, userRealProjects, addProject, updateProject, deleteProject, isLoading: projectsLoading, error: projectsError } = useProjectStore();
  const { experiences, addExperience, updateExperience, deleteExperience, isLoading: experiencesLoading, error: experiencesError } = useCareerStore();
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences'>('projects');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'cgi' | 'real'>('cgi');
  const [formData, setFormData] = useState<FormData>({
    type: 'cgi',
    title: '',
    shortdescription: '',
    fulldescription: '',
    image: '',
    video: '',
    images: [],
    year: '',
    role: '',
    tools: []
  });

  const [experienceData, setExperienceData] = useState<Experience>({
    year: '',
    role: '',
    company: '',
    description: '',
    icon: 'Briefcase',
    color: '#6366f1',
    link: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  const resetForm = () => {
    if (activeTab === 'projects') {
      setFormData({
        type: 'cgi',
        title: '',
        shortdescription: '',
        fulldescription: '',
        image: '',
        video: '',
        images: [],
        year: '',
        role: '',
        tools: []
      });
      setSelectedRoles([]);
      setVideos([]);
      setErrors({});
      setEditingIndex(null);
      setEditingType('cgi');
    } else {
      setExperienceData({
        year: '',
        role: '',
        company: '',
        description: '',
        icon: 'Briefcase',
        color: '#6366f1',
        link: ''
      });
      setEditingIndex(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (activeTab === 'projects') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setExperienceData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role];
      setFormData(prevData => ({ ...prevData, role: newRoles.join(', ') }));
      return newRoles;
    });
  };

  const handleToolToggle = (toolName: string) => {
    setFormData(prev => {
      const toolExists = prev.tools.some(t => t.name === toolName);
      const newTools = toolExists
        ? prev.tools.filter(t => t.name !== toolName)
        : [...prev.tools, { name: toolName, icon: '' }];
      return { ...prev, tools: newTools };
    });
  };

  const handleVideoAdd = (title: string, url: string) => {
    if (title && url) {
      setVideos(prev => [...prev, { title, url }]);
    }
  };

  const handleVideoRemove = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validateForm = (): boolean => {
    if (activeTab === 'projects') {
      const newErrors: FormErrors = {};
      if (!formData.title) newErrors.title = 'Le titre est requis';
      if (!formData.shortdescription) newErrors.shortdescription = 'La description courte est requise';
      if (!formData.fulldescription) newErrors.fulldescription = 'La description complète est requise';
      if (!formData.image) newErrors.image = "L'image est requise";
      if (!formData.year) newErrors.year = "L'année est requise";
      if (!formData.role) newErrors.role = 'Au moins un rôle est requis';
      if (formData.tools.length === 0) newErrors.tools = 'Au moins un outil est requis';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else {
      return !!(experienceData.year && experienceData.role && experienceData.company && experienceData.description);
    }
  };

  const handleEdit = (item: Project | Experience, type?: 'cgi' | 'real', index: number) => {
    if (activeTab === 'projects' && type) {
      const project = item as Project;
      setFormData({
        type,
        title: project.title,
        shortdescription: project.shortDescription,
        fulldescription: project.fullDescription,
        image: project.image,
        video: project.video || '',
        images: project.images || [],
        year: project.year,
        role: project.role,
        tools: project.tools
      });
      setSelectedRoles(project.role.split(', '));
      setVideos(project.videos || []);
      setEditingIndex(index);
      setEditingType(type);
    } else {
      setExperienceData(item as Experience);
      setEditingIndex(index);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (type: 'cgi' | 'real' | 'experience', index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (type === 'experience') {
        deleteExperience(index)
          .then(() => {
            showToast('Expérience supprimée avec succès', 'success');
          })
          .catch(() => {
            showToast('Erreur lors de la suppression', 'error');
          });
      } else {
        deleteProject(type, index)
          .then(() => {
            showToast('Projet supprimé avec succès', 'success');
          })
          .catch(() => {
            showToast('Erreur lors de la suppression', 'error');
          });
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (activeTab === 'projects') {
        const projectData = {
          ...formData,
          videos: videos.length > 0 ? videos : undefined,
          shortDescription: formData.shortdescription,
          fullDescription: formData.fulldescription
        };

        if (editingIndex !== null) {
          // Get the current project being edited
          const currentProjects = formData.type === 'cgi' ? userCGIProjects : userRealProjects;
          const projectToUpdate = currentProjects[editingIndex];

          // Check if the project exists and has an ID before updating
          if (!projectToUpdate?.id) {
            showToast('Erreur: Impossible de mettre à jour le projet', 'error');
            console.error('Project update failed: No project ID found');
            return;
          }

          await updateProject(projectData, editingIndex);
          showToast('Projet mis à jour avec succès !', 'success');
        } else {
          await addProject(projectData, formData.type as 'cgi' | 'real');
          showToast('Projet ajouté avec succès !', 'success');
        }
      } else {
        if (editingIndex !== null) {
          await updateExperience(experienceData, editingIndex);
          showToast('Expérience mise à jour avec succès !', 'success');
        } else {
          await addExperience(experienceData);
          showToast('Expérience ajoutée avec succès !', 'success');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Une erreur est survenue', 'error');
    }
  };

  useEffect(() => {
    if (projectsError || experiencesError) {
      showToast('Erreur de connexion à la base de données. Mode hors ligne activé.', 'error');
    }
  }, [projectsError, experiencesError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Gérez vos projets et expériences depuis cette interface.
            {(projectsLoading || experiencesLoading) && " Chargement en cours..."}
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'projects' | 'experiences')}>
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="experiences">Expériences</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === 'projects' ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ProjectForm
                  formData={formData}
                  errors={errors}
                  videos={videos}
                  selectedRoles={selectedRoles}
                  editingIndex={editingIndex}
                  onSubmit={handleSubmit}
                  onInputChange={handleInputChange}
                  onRoleToggle={handleRoleToggle}
                  onToolToggle={handleToolToggle}
                  onVideoAdd={handleVideoAdd}
                  onVideoRemove={handleVideoRemove}
                  onImagesChange={handleImagesChange}
                  onReset={resetForm}
                />

                <div className="space-y-8 mt-8">
                  <ProjectList
                    title="Projets CGI"
                    projects={userCGIProjects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    type="cgi"
                  />

                  <ProjectList
                    title="Projets Prise de Vue Réel"
                    projects={userRealProjects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    type="real"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ExperienceForm
                  data={experienceData}
                  editingIndex={editingIndex}
                  onSubmit={handleSubmit}
                  onChange={handleInputChange}
                  onReset={resetForm}
                />

                <div className="mt-8">
                  <ExperienceList
                    experiences={experiences}
                    onEdit={(experience, index) => handleEdit(experience, undefined, index)}
                    onDelete={(index) => handleDelete('experience', index)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </div>

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </motion.div>
  );
}

export default BuyGold;