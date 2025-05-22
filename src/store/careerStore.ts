import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Experience } from '../types/experience';
import { supabase, saveExperience, updateExperience, deleteExperience, getExperiences } from '../lib/supabase';

const defaultExperiences: Experience[] = [
  {
    year: "Futur",
    role: "Votre Entreprise ?",
    company: "À définir",
    description: "Ensemble, créons des expériences visuelles exceptionnelles et donnons vie à vos projets les plus ambitieux.",
    icon: "Briefcase",
    color: "#6366f1",
    link: "mailto:vics.jacob@gmail.com"
  },
  {
    year: "2024-Présent",
    role: "3D Artist",
    company: "Eco-Campus du Bâtiment",
    description: "Création de chantiers en 3D, animation de personnages, intégration des éléments et déploiement dans Unity, au service de formations dédiées aux métiers du bâtiment.",
    icon: "Building2",
    color: "#8b5cf6"
  },
  {
    year: "2023",
    role: "Lead 3D Artist",
    company: "PLETORY",
    description: "Modélisation d'univers 3D, modélisation et animation de personnages 3D, intégration des éléments et mise en production dans Unity.",
    icon: "Gamepad2",
    color: "#ec4899",
    link: "/cgi"
  },
  {
    year: "2022-2023",
    role: "Lead Artist 3D",
    company: "DIMOBA",
    description: "Création de personnages réalistes et cartoons, configuration pour utilisation en motion et facial capture, développement sous Unreal Engine 5.",
    icon: "Users",
    color: "#f43f5e"
  },
  {
    year: "2020-2023",
    role: "Licence Animation & Game Design",
    company: "YNOV",
    description: "Animation et Conception 3D, Réalisation Court Métrage et Jeu Vidéo.",
    icon: "GraduationCap",
    color: "#a855f7"
  },
  {
    year: "2018-2019",
    role: "Chargé de Production",
    company: "Sarenza",
    description: "Production image et audiovisuelle, organisation des shootings photos et tournages vidéos, gestion de projet.",
    icon: "Camera",
    color: "#3b82f6"
  },
  {
    year: "2018",
    role: "Assistant Montage",
    company: "TF1 Production - 50 Minutes Inside",
    description: "Dérushage des documentaires et reportages, liaison entre le service montage et archive, montage vidéo.",
    icon: "Film",
    color: "#0ea5e9"
  },
  {
    year: "2016-2017",
    role: "Monteur & Chargé de Production",
    company: "Timelapse Go & Pratiks",
    description: "Production et montage de vidéos timelapse d'entreprise, création de tutoriels, captation et installation des matériels vidéos.",
    icon: "Video",
    color: "#06b6d4"
  },
  {
    year: "2015-2018",
    role: "Licence Réalisation Cinéma & Télévision",
    company: "EICAR",
    description: "Formation approfondie en réalisation audiovisuelle, techniques de production et direction artistique.",
    icon: "GraduationCap",
    color: "#a855f7"
  },
  {
    year: "2012-2015",
    role: "Bac STMG Option SIG",
    company: "Montalembert",
    description: "Spécialisation en Systèmes d'Information de Gestion (SIG), formation en informatique et gestion.",
    icon: "GraduationCap",
    color: "#a855f7"
  }
];

const getYearValue = (year: string): number => {
  if (year.toLowerCase() === "futur") return Infinity;
  
  // Extract the first year from the range
  const match = year.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const sortExperiences = (experiences: Experience[]): Experience[] => {
  const futureExperience = experiences.find(exp => exp.year.toLowerCase() === "futur");
  const sortedExperiences = experiences
    .filter(exp => exp.year.toLowerCase() !== "futur")
    .sort((a, b) => {
      const yearA = getYearValue(a.year);
      const yearB = getYearValue(b.year);
      return yearB - yearA;
    });
  return futureExperience ? [futureExperience, ...sortedExperiences] : sortedExperiences;
};

interface CareerStore {
  experiences: Experience[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  addExperience: (experience: Experience) => Promise<void>;
  updateExperience: (experience: Experience, index: number) => Promise<void>;
  deleteExperience: (index: number) => Promise<void>;
  fetchExperiences: () => Promise<void>;
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      experiences: sortExperiences(defaultExperiences),
      isLoading: false,
      error: null,
      initialized: false,
      
      addExperience: async (experience) => {
        set({ isLoading: true, error: null });
        try {
          const savedExperience = await saveExperience(experience);
          set((state) => ({
            experiences: sortExperiences([...state.experiences, savedExperience]),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add experience';
          console.error('Error adding experience:', error);
          set({ isLoading: false, error: errorMessage });
          
          // Fallback to local storage if network fails
          set((state) => ({
            experiences: sortExperiences([...state.experiences, experience])
          }));
        }
      },
      
      updateExperience: async (experience, index) => {
        set({ isLoading: true, error: null });
        try {
          const experienceToUpdate = get().experiences[index];
          
          if (experienceToUpdate.id) {
            await updateExperience(experience, experienceToUpdate.id);
          }
          
          set((state) => ({
            experiences: sortExperiences(
              state.experiences.map((e, i) => i === index ? experience : e)
            ),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update experience';
          console.error('Error updating experience:', error);
          set({ isLoading: false, error: errorMessage });
          
          // Fallback to local storage if network fails
          set((state) => ({
            experiences: sortExperiences(
              state.experiences.map((e, i) => i === index ? experience : e)
            )
          }));
        }
      },
      
      deleteExperience: async (index) => {
        set({ isLoading: true, error: null });
        try {
          const experienceToDelete = get().experiences[index];
          
          if (experienceToDelete.id) {
            await deleteExperience(experienceToDelete.id);
          }
          
          set((state) => ({
            experiences: sortExperiences(
              state.experiences.filter((_, i) => i !== index)
            ),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete experience';
          console.error('Error deleting experience:', error);
          set({ isLoading: false, error: errorMessage });
          
          // Fallback to local storage if network fails
          set((state) => ({
            experiences: sortExperiences(
              state.experiences.filter((_, i) => i !== index)
            )
          }));
        }
      },
      
      fetchExperiences: async () => {
        set({ isLoading: true, error: null });
        try {
          const experiences = await getExperiences();
          
          // If we get an empty array from Supabase (possibly due to network issues),
          // fall back to default experiences
          set({
            experiences: experiences.length > 0 ? sortExperiences(experiences) : sortExperiences(defaultExperiences),
            isLoading: false,
            initialized: true,
            error: experiences.length === 0 ? 'Unable to fetch experiences from server, showing default data' : null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch experiences';
          console.error('Error fetching experiences:', error);
          set({ 
            isLoading: false, 
            error: errorMessage,
            initialized: true,
            experiences: sortExperiences(defaultExperiences) // Fallback to default experiences
          });
        }
      }
    }),
    {
      name: 'career-storage-v4',
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          return { 
            experiences: sortExperiences(defaultExperiences),
            isLoading: false,
            error: null,
            initialized: false
          };
        }
        return {
          experiences: sortExperiences(persistedState?.experiences || defaultExperiences),
          isLoading: false,
          error: null,
          initialized: false
        };
      }
    }
  )
);