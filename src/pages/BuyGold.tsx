// Update the handleSubmit function to include video thumbnails
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    if (activeTab === 'projects') {
      // Ensure videos are properly formatted with string values
      const formattedVideos = videos?.map(video => ({
        title: typeof video.title === 'string' ? video.title : String(video.title || ''),
        url: typeof video.url === 'string' ? video.url : String(video.url || ''),
        thumbnail: video.thumbnail ? (typeof video.thumbnail === 'string' ? video.thumbnail : String(video.thumbnail)) : ''
      }));

      const projectData = {
        ...formData,
        videos: formattedVideos && formattedVideos.length > 0 ? formattedVideos : undefined
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