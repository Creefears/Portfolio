import { Project } from '../types/project';

export const defaultCGIProjects: Project[] = [
  {
    title: "Naturewave",
    shortDescription: "Fond d'écran animé en cell-shading",
    fulldescription: "J'ai créé ce projet dans le but d'obtenir un fond d'écran animé pour mon double écran. Pour atteindre ce style d'aplats de couleurs dans un moteur 3D, j'ai opté pour un rendu en cell-shading, ce qui m'a permis de maîtriser pleinement la palette de couleurs, aussi bien pour l'ambiance de jour que pour celle de nuit.",
    image: "https://i.imgur.com/pq17cvI.jpg",
    video: "https://drive.google.com/file/d/1Z-szd00Icw4cDRkyRD186_a7Eb2U1DXD/preview",
    year: "2024",
    role: "Intégrale",
    tools: [
      { name: "Blender", icon: "Box" },
      { name: "Adobe Premiere", icon: "Film" }
    ]
  },
  {
    title: "CV Vidéo",
    shortDescription: "Présentation professionnelle animée avec MetaHuman",
    fulldescription: "Ce CV vidéo a été conçu pour mettre en lumière mes compétences, aussi bien en montage vidéo qu'en 3D. Pour donner vie à l'animation du personnage, j'ai mobilisé l'une des technologies que j'ai affinées : la création d'un MetaHuman à mon effigie, animé avec précision grâce à la facial capture de l'Arkit.",
    image: "https://i.imgur.com/Y4OX4J9.jpg",
    video: "https://drive.google.com/file/d/1-NJrI_yPyH44ljYPdIo3_RKP-JLgx8hK/preview",
    year: "2024",
    role: "Intégrale",
    tools: [
      { name: "Blender", icon: "Box" },
      { name: "Unreal Engine 5", icon: "Gamepad2" },
      { name: "Adobe Premiere", icon: "Film" },
      { name: "Adobe After Effects", icon: "Film" }
    ]
  },
  {
    title: "Pletory",
    shortDescription: "Création de métavers pour des clients prestigieux",
    fulldescription: "Après ma formation à Ynov Campus, j'ai été recruté par une start-up spécialisée dans la création d'univers virtuels, avec un focus particulier sur les métavers. Cette mission m'a conduit à concevoir et développer des métavers pour des clients prestigieux tels qu'Arkea et Swisslife. Ces univers étaient accessibles directement depuis un navigateur web, grâce à des environnements en WebGL développés avec Unity, intégrant des interfaces intuitives et des personnages interactifs pour une expérience immersive.",
    image: "https://i.imgur.com/qS47mep.jpg",
    video: "https://drive.google.com/file/d/1-OViIUZ3UuTrnDrutSJ7eoHEnNd8X0L1/preview",
    year: "2023",
    role: "Concepteur 3D, Modeleur, Animateur",
    tools: [
      { name: "Unity", icon: "Gamepad2" },
      { name: "Blender", icon: "Box" },
      { name: "Adobe Premiere", icon: "Film" },
      { name: "Substance Painter", icon: "Brush" }
    ]
  },
  {
    title: "Projets Scolaires",
    shortDescription: "Projets réalisés pendant ma formation",
    fulldescription: "Durant ma formation à Ynov, j'ai eu l'opportunité de travailler sur divers projets, notamment un temple aztèque et un parcours inspiré de Spider-Man. Ces projets m'ont permis d'explorer différentes techniques de modélisation, de texturing et d'animation, tout en développant mes compétences avec des outils professionnels comme Unreal Engine 5, Maya, Blender et Substance Painter.",
    image: "https://i.imgur.com/BygzETy.jpg",
    videos: [
      {
        title: "Temple Aztèque",
        url: "https://drive.google.com/file/d/1-sLAOBCl7BiosXr7oQ3e0SUYUe7NoPui/preview"
      },
      {
        title: "Miles's Parcour",
        url: "https://drive.google.com/file/d/1hixeHFrBo70C3Fs3EcJ6gfj1k0-5Bk--/preview"
      },
      {
        title: "Demo Reel 2021",
        url: "https://drive.google.com/file/d/17G_hj7ass2VF0uLskZAUViy1vg9Mj3Te/preview"
      }
    ],
    year: "2020-2023",
    role: "Intégrale",
    tools: [
      { name: "Unreal Engine 5", icon: "Gamepad2" },
      { name: "Autodesk Maya", icon: "Box" },
      { name: "Blender", icon: "Box" },
      { name: "Substance Painter", icon: "Brush" }
    ]
  },
  {
    title: "My Little Gravity Falls",
    shortDescription: "Animation parodique de Gravity Falls",
    fulldescription: "Ce projet YouTube a marqué ma toute première expérience dans le domaine de l'animation. Il s'agit d'une parodie du générique de Gravity Falls, une série animée de Disney, fusionnée avec l'univers du cartoon My Little Pony : Friendship is Magic d'Hasbro. Ce projet a été une étape clé dans l'éveil de ma passion pour l'animation. Bien que je disposais de peu de connaissances sur les techniques d'animation et les logiciels associés, j'ai progressivement trouvé mes marques et appris à maîtriser ce médium créatif.",
    image: "https://i.imgur.com/Cp2td6z.jpg",
    video: "https://www.youtube.com/embed/zg4LBVX0Ohg",
    year: "2015",
    role: "Intégrale",
    tools: [
      { name: "Adobe Animate", icon: "Film" },
      { name: "Adobe After Effects", icon: "Film" },
      { name: "Adobe Photoshop", icon: "Image" },
      { name: "Adobe Premiere", icon: "Film" }
    ]
  }
];

export const defaultRealProjects: Project[] = [
  {
    title: "Sarenza.com",
    shortDescription: "Production visuelle pour une plateforme e-commerce",
    fulldescription: "Pendant mon stage de fin d'études à l'EICAR, j'ai rejoint l'équipe de production visuelle de Sarenza.com, la célèbre plateforme de vente en ligne spécialisée dans les chaussures. Une expérience super enrichissante où j'ai eu la chance de m'impliquer à fond dans l'organisation et la réalisation de tournages et shootings photo pour mettre en valeur les produits et événements de la marque.",
    image: "https://i.imgur.com/nvlr9T3.jpg",
    video: "https://drive.google.com/file/d/1s2YxnP0QuJdvVcHs8UpKjGxoVFHxU9F_/preview",
    images: [
      "https://i.imgur.com/skbjcbK.jpg",
      "https://i.imgur.com/NqqAgMH.jpg",
      "https://i.imgur.com/uNjQEb8.jpg",
      "https://i.imgur.com/1Jgi1I6.jpg",
      "https://i.imgur.com/FRZjdp0.jpg",
      "https://i.imgur.com/s8EANqu.jpg",
      "https://i.imgur.com/584Lry9.jpg",
      "https://i.imgur.com/jL8jqgs.jpg"
    ],
    year: "2018",
    role: "Chargé de Production",
    tools: [
      { name: "Microsoft Office", icon: "FileSpreadsheet" }
    ]
  },
  {
    title: "Nobodies",
    shortDescription: "Clip musical horrifique en extérieur",
    fulldescription: "Ce clip musical horrifique, réalisé par Antoine Beaudet, a été une expérience aussi captivante qu'enrichissante. Tourner exclusivement en extérieur, souvent dans des conditions exigeantes et imprévisibles, et principalement de nuit, a apporté une dimension unique au projet.",
    image: "https://i.imgur.com/0RunzIX.jpg",
    video: "https://drive.google.com/file/d/1IpnljpGJfGQ5BzejAFmk-D2Qit_dw9LJ/preview",
    year: "2017",
    role: "1er Assistant Réalisateur",
    tools: [
      { name: "Movie Magic Scheduling", icon: "Calendar" },
      { name: "Microsoft Office", icon: "FileSpreadsheet" }
    ]
  },
  {
    title: "It's Jack",
    shortDescription: "Spot publicitaire années 50",
    fulldescription: "Ce spot publicitaire, réalisé par François Gastinel, m'a permis de mettre en pratique mes compétences en montage vidéo tout en assistant le réalisateur dans la production. Lors de la phase de montage, j'ai suivi les directives et respecté la vision artistique du réalisateur, qui souhaitait donner au projet une esthétique noir des années 50.",
    image: "https://i.imgur.com/7upuHV4.jpg",
    video: "https://drive.google.com/file/d/1xonu8bs0YZc8lhDQFVmPPFLURrT0aYtD/preview",
    year: "2017",
    role: "2ème Assistant Réalisateur, 1er Monteur Vidéo",
    tools: [
      { name: "Adobe Premiere", icon: "Film" },
      { name: "Movie Magic Scheduling", icon: "Calendar" },
      { name: "Microsoft Office", icon: "FileSpreadsheet" }
    ]
  },
  {
    title: "Timelapse Go",
    shortDescription: "Production de timelapses de construction",
    fulldescription: "Ma première expérience professionnelle en tant qu'intermittent du spectacle s'est déroulée au sein de la société multimédia polyvalente Timelapse Go. Cette entreprise était spécialisée dans la création de vidéos timelapse documentant la construction de bâtiments. Mon rôle était très diversifié, incluant le montage des vidéos timelapse.",
    image: "https://i.imgur.com/ohaBOrG.jpg",
    video: "https://www.youtube.com/embed/5AOWbQHeoHI",
    year: "2016",
    role: "Monteur Vidéo, Chargé de Production",
    tools: [
      { name: "Adobe Premiere", icon: "Film" },
      { name: "Adobe After Effects", icon: "Film" },
      { name: "Adobe Photoshop", icon: "Image" }
    ]
  },
  {
    title: "Pratiks",
    shortDescription: "Production de tutoriels YouTube",
    fulldescription: "En parallèle de Timelapse Go, j'ai participé à la production de tutoriels variés pour la chaîne YouTube Pratiks. Mon rôle incluait l'écriture, la captation d'images et la réalisation des vidéos tutoriels.",
    image: "https://i.imgur.com/isL0Oc3.jpg",
    video: "https://www.youtube.com/embed/KYRVvtuq3zY",
    year: "2016",
    role: "Réalisateur, Monteur Vidéo",
    tools: [
      { name: "Adobe Premiere", icon: "Film" },
      { name: "Adobe After Effects", icon: "Film" },
      { name: "Adobe Photoshop", icon: "Image" }
    ]
  },
  {
    title: "Madness",
    shortDescription: "Court-métrage psychologique et horrifique",
    fulldescription: "Ce court-métrage psychologique et horrifique, réalisé par François Gastinel, a marqué ma toute première expérience en tant qu'Assistant Réalisateur sur un tournage. Pour ce projet, j'ai pris en charge l'organisation des journées de tournage, l'élaboration du plan de travail, ainsi que la coordination des décors et des lieux de tournage.",
    image: "https://i.imgur.com/LTPbXZQ.jpg",
    video: "https://drive.google.com/file/d/1DjEq9iovIQBFCK4MotEOeOJzOYxLpolb/preview",
    year: "2016",
    role: "1er Assistant Réalisateur",
    tools: [
      { name: "Movie Magic Scheduling", icon: "Calendar" },
      { name: "Microsoft Office", icon: "FileSpreadsheet" }
    ]
  },
  {
    title: "Creefears",
    shortDescription: "Chaîne YouTube Gaming Horror",
    fulldescription: "Cette playlist représente mes premiers pas dans la production vidéo, un domaine qui me passionnait déjà et qui a solidifié mon intérêt pour les années à venir. À travers cette chaîne YouTube dédiée au Gaming Horror, j'ai eu l'opportunité de développer et perfectionner mes compétences en montage vidéo, captation, storytelling, et même en réalisation de courts-métrages, notamment pour les introductions de certaines vidéos nécessitant une attention particulière aux détails.",
    image: "https://i.imgur.com/V00RlDs.jpg",
    video: "https://www.youtube.com/embed/videoseries?si=cLL57PWpQmja-TdV&list=PL26TfmA2gBYFBng9aldgU-PfCh1sZZN_p",
    year: "2014",
    role: "Intégrale",
    tools: [
      { name: "Sony Vegas", icon: "Film" },
      { name: "Adobe After Effects", icon: "Film" },
      { name: "Adobe Photoshop", icon: "Image" },
      { name: "Microsoft Office", icon: "FileSpreadsheet" }
    ]
  }
];