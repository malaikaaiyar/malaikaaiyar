export interface TagConfig {
  short: string;
  long: string;
  description: string;
}

export const tagsConfig: { [key: string]: TagConfig } = {
  "tech": {
    "short": "technical",
    "long": "technical",
    "description": "on the computer!"
  },
  "craft": {
    "short": "visual",
    "long": "visual",
    "description": "the visual arts"
  },
  "thoughts": {
    "short": "THOUGHTS",
    "long": "thoughts",
    "description": "What's in Malaika's notes app?"
  },
};
