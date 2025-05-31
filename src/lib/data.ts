import { Person, Relationship, MediaItem, Family } from '@/types';

export async function getAllPeople(): Promise<Person[]> {
  // TODO: Implement data fetching from JSON files
  return [];
}

export async function getPerson(id: string): Promise<Person | null> {
  // TODO: Implement person fetching by ID
  return null;
}

export async function getRelationships(): Promise<Relationship[]> {
  // TODO: Implement relationships fetching
  return [];
}

export async function getPersonRelationships(personId: string): Promise<Relationship[]> {
  // TODO: Implement person-specific relationships fetching
  return [];
}

export async function getMediaItems(): Promise<MediaItem[]> {
  // TODO: Implement media catalog fetching
  return [];
}

export async function getFamilies(): Promise<Family[]> {
  // TODO: Implement families fetching
  return [];
}

export async function getFamilyMembers(surname: string): Promise<Person[]> {
  // TODO: Implement family members fetching by surname
  return [];
}