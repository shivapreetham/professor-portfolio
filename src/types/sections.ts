export interface AboutSection {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    displayOrder: number;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    projectUrl?: string;
    imageUrl?: string;
    technologies: string[];
  }