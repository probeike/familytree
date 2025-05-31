export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  occupation?: string;
  biography?: string;
  photos: string[];
  documents: string[];
}

export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  type: 'parent' | 'spouse' | 'sibling';
  startDate?: string;
  endDate?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  type: 'photo' | 'document';
  title?: string;
  description?: string;
  date?: string;
  peopleIds: string[];
  tags: string[];
}

export interface Family {
  surname: string;
  origin?: string;
  description?: string;
  memberIds: string[];
}

export interface SearchFilters {
  surname?: string;
  birthYear?: { from?: number; to?: number };
  deathYear?: { from?: number; to?: number };
  birthPlace?: string;
  deathPlace?: string;
  occupation?: string;
}

export interface TreeNode {
  id: string;
  person: Person;
  x?: number;
  y?: number;
  children?: TreeNode[];
  parents?: TreeNode[];
}