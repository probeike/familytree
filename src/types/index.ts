export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  nickname?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  burialPlace?: string;
  occupation?: string;
  education?: string;
  religion?: string;
  nationality?: string;
  biography?: string;
  notes?: string;
  photos: string[];
  documents: string[];
  spouseIds: string[];
  childrenIds: string[];
  parentIds: string[];
  siblingIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  type: 'parent' | 'child' | 'spouse' | 'sibling' | 'partner';
  startDate?: string;
  endDate?: string;
  marriageDate?: string;
  marriagePlace?: string;
  divorceDate?: string;
  notes?: string;
  verified: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  type: 'photo' | 'document' | 'certificate' | 'letter' | 'newspaper' | 'other';
  mimeType: string;
  fileSize: number;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  peopleIds: string[];
  tags: string[];
  source?: string;
  copyright?: string;
  thumbnailPath?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  surname: string;
  alternateSpellings: string[];
  origin?: string;
  originCountry?: string;
  migrationHistory?: string;
  description?: string;
  coat_of_arms?: string;
  familyMotto?: string;
  memberIds: string[];
  statistics: {
    totalMembers: number;
    generations: number;
    oldestMember?: string;
    youngestMember?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  surname?: string;
  firstName?: string;
  birthYear?: { from?: number; to?: number };
  deathYear?: { from?: number; to?: number };
  birthPlace?: string;
  deathPlace?: string;
  occupation?: string;
  nationality?: string;
  religion?: string;
  hasPhotos?: boolean;
  hasDocuments?: boolean;
  gender?: 'male' | 'female' | 'unknown';
  living?: boolean;
}

export interface SearchResult {
  person: Person;
  score: number;
  matchedFields: string[];
}

export interface SearchOptions {
  filters: SearchFilters;
  sortBy: 'relevance' | 'lastName' | 'birthDate' | 'deathDate';
  sortOrder: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface TreeNode {
  id: string;
  person: Person;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  children?: TreeNode[];
  parents?: TreeNode[];
  spouses?: TreeNode[];
  siblings?: TreeNode[];
  generation: number;
  depth: number;
}

export interface TreeLink {
  id: string;
  source: string | TreeNode;
  target: string | TreeNode;
  type: 'parent' | 'spouse' | 'sibling';
  strength?: number;
}

export interface TreeData {
  nodes: TreeNode[];
  links: TreeLink[];
  rootNodeId: string;
  generations: number;
  totalNodes: number;
}

export interface TimelineEvent {
  id: string;
  personId: string;
  type: 'birth' | 'death' | 'marriage' | 'divorce' | 'migration' | 'education' | 'career' | 'other';
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  relatedPersonIds?: string[];
  mediaIds?: string[];
}

export interface Statistics {
  totalPeople: number;
  totalFamilies: number;
  totalMedia: number;
  totalRelationships: number;
  generationSpan: number;
  oldestPerson?: Person;
  youngestPerson?: Person;
  mostCommonSurnames: Array<{ surname: string; count: number }>;
  birthsByDecade: Array<{ decade: string; count: number }>;
  locationStats: Array<{ location: string; count: number }>;
}

export interface DataIndex {
  people: Record<string, Person>;
  relationships: Record<string, Relationship>;
  families: Record<string, Family>;
  media: Record<string, MediaItem>;
  searchIndex: any;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}