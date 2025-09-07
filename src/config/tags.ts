export interface TagConfig {
  short: string;
  long: string;
  description: string;
}

export const tagsConfig: { [key: string]: TagConfig } = {
  "tech": {
    "short": "TECH",
    "long": "Technology & Programming",
    "description": "Posts about technology, programming, and technical projects"
  },
  "art": {
    "short": "ART",
    "long": "Art & Craft",
    "description": "Making things by hand and creative expression"
  },
  "thoughts": {
    "short": "THOUGHTS",
    "long": "Notes & Thoughts",
    "description": "Ideas, reflections, and philosophical musings"
  },
  "projects": {
    "short": "PROJECTS",
    "long": "Projects & Experiments",
    "description": "Specific projects, experiments, and work"
  },
  "learning": {
    "short": "LEARNING",
    "long": "Learning & Education",
    "description": "Posts about studying, learning techniques, and educational experiences"
  }
}; 