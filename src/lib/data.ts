import { Person, Relationship, MediaItem, Family, SearchFilters, SearchResult } from '@/types';
import fs from 'fs';
import path from 'path';

// Data source paths - these will be populated by GitHub Actions
const DATA_DIR = path.join(process.cwd(), 'data');
const FAMILY_DATA_DIR = path.join(process.cwd(), 'family-tree-data', 'processed');

// Cache for data to avoid repeated file reads
let dataCache: {
  people?: Person[];
  relationships?: Relationship[];
  families?: Family[];
  media?: MediaItem[];
  peopleIndex?: Record<string, Person>;
} = {};

// Helper function to get data directory (prioritizes local data, falls back to family-tree-data)
function getDataPath(subPath: string): string {
  const localPath = path.join(DATA_DIR, subPath);
  const familyDataPath = path.join(FAMILY_DATA_DIR, subPath);
  
  // Check if local data exists first (for build-time copied data)
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  
  // Fall back to family-tree-data directory
  if (fs.existsSync(familyDataPath)) {
    return familyDataPath;
  }
  
  throw new Error(`Data file not found: ${subPath}`);
}

// Helper function to safely read JSON files
function readJsonFile<T>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
}

// Helper function to safely check if file exists
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export async function getAllPeople(): Promise<Person[]> {
  if (dataCache.people) {
    return dataCache.people;
  }

  try {
    // Try to read people index first
    const indexPath = getDataPath('people/index.json');
    const peopleIndex = readJsonFile<Array<{id: string}>>(indexPath);
    
    // Load individual person files
    const people: Person[] = [];
    
    for (const { id } of peopleIndex) {
      try {
        const personPath = getDataPath(`people/${id}.json`);
        const person = readJsonFile<Person>(personPath);
        people.push(person);
      } catch (error) {
        console.warn(`Could not load person ${id}:`, error);
      }
    }
    
    dataCache.people = people;
    return people;
  } catch (error) {
    console.error('Error loading people data:', error);
    return [];
  }
}

export async function getPerson(id: string): Promise<Person | null> {
  if (!dataCache.peopleIndex) {
    const people = await getAllPeople();
    dataCache.peopleIndex = people.reduce((acc, person) => {
      acc[person.id] = person;
      return acc;
    }, {} as Record<string, Person>);
  }

  return dataCache.peopleIndex[id] || null;
}

export async function getRelationships(): Promise<Relationship[]> {
  if (dataCache.relationships) {
    return dataCache.relationships;
  }

  try {
    const relationshipsPath = getDataPath('relationships/relationships.json');
    const relationships = readJsonFile<Relationship[]>(relationshipsPath);
    
    dataCache.relationships = relationships;
    return relationships;
  } catch (error) {
    console.error('Error loading relationships:', error);
    return [];
  }
}

export async function getPersonRelationships(personId: string): Promise<Relationship[]> {
  const allRelationships = await getRelationships();
  return allRelationships.filter(
    rel => rel.person1Id === personId || rel.person2Id === personId
  );
}

export async function getMediaItems(): Promise<MediaItem[]> {
  if (dataCache.media) {
    return dataCache.media;
  }

  try {
    const mediaPath = getDataPath('media/index.json');
    const media = readJsonFile<MediaItem[]>(mediaPath);
    
    dataCache.media = media;
    return media;
  } catch (error) {
    console.error('Error loading media:', error);
    return [];
  }
}

export async function getFamilies(): Promise<Family[]> {
  if (dataCache.families) {
    return dataCache.families;
  }

  try {
    const familiesPath = getDataPath('families.json');
    const families = readJsonFile<Family[]>(familiesPath);
    
    dataCache.families = families;
    return families;
  } catch (error) {
    console.error('Error loading families:', error);
    return [];
  }
}

export async function getFamilyMembers(surname: string): Promise<Person[]> {
  const allPeople = await getAllPeople();
  return allPeople.filter(person => 
    person.lastName.toLowerCase() === surname.toLowerCase()
  );
}

// Additional utility functions
export async function searchPeople(filters: SearchFilters): Promise<SearchResult[]> {
  const people = await getAllPeople();
  const results: SearchResult[] = [];
  
  for (const person of people) {
    const score = calculateSearchScore(person, filters);
    if (score > 0) {
      results.push({
        person,
        score,
        matchedFields: getMatchedFields(person, filters)
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

export async function getPersonMedia(personId: string): Promise<MediaItem[]> {
  const allMedia = await getMediaItems();
  return allMedia.filter(media => media.peopleIds.includes(personId));
}

export async function getStatistics() {
  const [people, families, media, relationships] = await Promise.all([
    getAllPeople(),
    getFamilies(),
    getMediaItems(),
    getRelationships()
  ]);
  
  return {
    totalPeople: people.length,
    totalFamilies: families.length,
    totalMedia: media.length,
    totalRelationships: relationships.length,
    // Add more statistics as needed
  };
}

// Helper functions for search
function calculateSearchScore(person: Person, filters: SearchFilters): number {
  let score = 0;
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    if (fullName.includes(query)) score += 10;
    if (person.biography?.toLowerCase().includes(query)) score += 5;
  }
  
  if (filters.surname && person.lastName.toLowerCase() === filters.surname.toLowerCase()) {
    score += 15;
  }
  
  if (filters.firstName && person.firstName.toLowerCase() === filters.firstName.toLowerCase()) {
    score += 15;
  }
  
  // Add more filter matching logic as needed
  
  return score;
}

function getMatchedFields(person: Person, filters: SearchFilters): string[] {
  const matched: string[] = [];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    if (`${person.firstName} ${person.lastName}`.toLowerCase().includes(query)) {
      matched.push('name');
    }
    if (person.biography?.toLowerCase().includes(query)) {
      matched.push('biography');
    }
  }
  
  return matched;
}

// Clear cache function (useful for development)
export function clearDataCache(): void {
  dataCache = {};
}