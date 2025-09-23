export interface TagConfig {
  short: string;
  long: string;
  description: string;
}

export const tagsConfig: { [key: string]: TagConfig } = {
  "tech": {
    "short": "tech",
    "long": "tech",
    "description": "Websites, notes, projects, etc."
  },
  "thoughts": {
    "short": "THOUGHTS",
    "long": "thoughts",
    "description": "What's in Malaika's notes app?"
  },
  "craft": {
    "short": "craft",
    "long": "craft",
    "description": "The things I make by hand"
  }
};
