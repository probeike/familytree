'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Person, Relationship } from '@/types';

interface TimelineEvent {
  id: string;
  type: 'birth' | 'death' | 'marriage' | 'other';
  year: number;
  date: string;
  person: Person;
  relatedPerson?: Person;
  description: string;
}

interface FamilyTimelineProps {
  people: Person[];
  relationships: Relationship[];
}

export default function FamilyTimeline({ people, relationships }: FamilyTimelineProps) {
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  
  // Create timeline events
  const events = createTimelineEvents(people, relationships);
  
  // Group events by decade
  const eventsByDecade = groupEventsByDecade(events);
  
  // Get decades in chronological order
  const decades = Object.keys(eventsByDecade).sort();
  
  // Filter events if a decade is selected
  const filteredEvents = selectedDecade 
    ? eventsByDecade[selectedDecade] || []
    : events.slice(0, 20); // Show first 20 events if no decade selected

  return (
    <div>
      {/* Decade Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDecade(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedDecade === null 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          {decades.map((decade) => (
            <button
              key={decade}
              onClick={() => setSelectedDecade(decade)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedDecade === decade 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {decade}s ({eventsByDecade[decade].length})
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline events */}
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start">
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-4 border-white shadow-sm ${getEventColor(event.type)}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>
              </div>
              
              {/* Event content */}
              <div className="ml-6 flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">{event.date}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEventBadgeClass(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 mb-2">{event.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/person/${event.person.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {event.person.firstName} {event.person.lastName}
                        </Link>
                        
                        {event.relatedPerson && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Link
                              href={`/person/${event.relatedPerson.id}`}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {event.relatedPerson.firstName} {event.relatedPerson.lastName}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Show more button */}
        {!selectedDecade && events.length > 20 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setSelectedDecade('all')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Show All {events.length} Events
            </button>
          </div>
        )}
        
        {/* No events message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events found for the selected time period.
          </div>
        )}
      </div>
    </div>
  );
}

function createTimelineEvents(people: Person[], relationships: Relationship[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  
  // Add birth events
  people.forEach(person => {
    if (person.birthDate) {
      const year = extractYear(person.birthDate);
      if (year > 0) {
        events.push({
          id: `birth-${person.id}`,
          type: 'birth',
          year,
          date: person.birthDate,
          person,
          description: `Born${person.birthPlace ? ` in ${person.birthPlace}` : ''}`
        });
      }
    }
  });
  
  // Add death events
  people.forEach(person => {
    if (person.deathDate) {
      const year = extractYear(person.deathDate);
      if (year > 0) {
        events.push({
          id: `death-${person.id}`,
          type: 'death',
          year,
          date: person.deathDate,
          person,
          description: `Died${person.deathPlace ? ` in ${person.deathPlace}` : ''}${person.birthDate ? ` at age ${calculateAge(person.birthDate, person.deathDate)}` : ''}`
        });
      }
    }
  });
  
  // Add marriage events
  relationships.forEach(rel => {
    if (rel.type === 'spouse' && rel.marriageDate) {
      const year = extractYear(rel.marriageDate);
      if (year > 0) {
        const person1 = people.find(p => p.id === rel.person1Id);
        const person2 = people.find(p => p.id === rel.person2Id);
        
        if (person1 && person2) {
          events.push({
            id: `marriage-${rel.id}`,
            type: 'marriage',
            year,
            date: rel.marriageDate,
            person: person1,
            relatedPerson: person2,
            description: `Married${rel.marriagePlace ? ` in ${rel.marriagePlace}` : ''}`
          });
        }
      }
    }
  });
  
  // Sort events chronologically
  return events.sort((a, b) => a.year - b.year);
}

function groupEventsByDecade(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const groups: Record<string, TimelineEvent[]> = {};
  
  events.forEach(event => {
    const decade = Math.floor(event.year / 10) * 10;
    const decadeKey = decade.toString();
    
    if (!groups[decadeKey]) {
      groups[decadeKey] = [];
    }
    groups[decadeKey].push(event);
  });
  
  return groups;
}

function extractYear(dateString: string): number {
  const match = dateString.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function calculateAge(birthDate: string, deathDate: string): number {
  const birthYear = extractYear(birthDate);
  const deathYear = extractYear(deathDate);
  return deathYear - birthYear;
}

function getEventColor(type: string): string {
  switch (type) {
    case 'birth': return 'bg-green-500';
    case 'death': return 'bg-red-500';
    case 'marriage': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
}

function getEventIcon(type: string): React.ReactNode {
  const iconClass = "w-3 h-3 text-white";
  
  switch (type) {
    case 'birth':
      return <span className="text-xs">👶</span>;
    case 'death':
      return <span className="text-xs">🕊️</span>;
    case 'marriage':
      return <span className="text-xs">💑</span>;
    default:
      return <div className={`w-1 h-1 bg-white rounded-full`}></div>;
  }
}

function getEventBadgeClass(type: string): string {
  switch (type) {
    case 'birth': return 'bg-green-100 text-green-800';
    case 'death': return 'bg-red-100 text-red-800';
    case 'marriage': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}