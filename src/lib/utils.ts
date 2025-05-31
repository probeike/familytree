import { clsx, type ClassValue } from 'clsx';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function calculateAge(birthDate: string | undefined, deathDate?: string | undefined): number | null {
  if (!birthDate) return null;
  
  try {
    const birth = parseISO(birthDate);
    const end = deathDate ? parseISO(deathDate) : new Date();
    
    if (!isValid(birth) || (deathDate && !isValid(end))) return null;
    
    const ageInMs = end.getTime() - birth.getTime();
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  } catch {
    return null;
  }
}

export function getPersonDisplayName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}