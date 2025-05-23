// Update the handleSubmit function to include video thumbnails
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    if (activeTab === 'projects') {
      const projectData = {
        ...formData,
        videos: videos.length > 0 ? videos.map(video => ({
          title: video.title,
          url: video.url,
          thumbnail: video.thumbnail
        })) : undefined
      };

      if (editingIndex !== null) {
        await updateProject(projectData, editingType, editingIndex);
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