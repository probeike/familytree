import Link from 'next/link';
import { Person, Relationship } from '@/types';

interface PersonCardProps {
  person: Person;
  relationship?: Relationship;
  showDetails?: boolean;
}

export default function PersonCard({ person, relationship, showDetails = true }: PersonCardProps) {
  const fullName = `${person.firstName} ${person.lastName}`;
  const lifeDates = [person.birthDate, person.deathDate].filter(Boolean).join(' - ');
  
  return (
    <Link 
      href={`/person/${person.id}`}
      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{fullName}</h4>
          
          {showDetails && (
            <>
              {lifeDates && (
                <p className="text-sm text-gray-600 mb-1">{lifeDates}</p>
              )}
              
              {person.birthPlace && (
                <p className="text-sm text-gray-500">{person.birthPlace}</p>
              )}
              
              {relationship?.marriageDate && (
                <p className="text-sm text-green-600 mt-1">
                  Married: {relationship.marriageDate}
                  {relationship.marriagePlace && ` in ${relationship.marriagePlace}`}
                </p>
              )}
            </>
          )}
        </div>
        
        {/* Relationship indicator */}
        {relationship && (
          <div className="ml-3 flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getRelationshipLabel(relationship.type)}
            </span>
          </div>
        )}
      </div>
      
      {/* Show occupation if available */}
      {showDetails && person.occupation && (
        <p className="text-sm text-gray-600 mt-2 italic">{person.occupation}</p>
      )}
    </Link>
  );
}

function getRelationshipLabel(type: string): string {
  switch (type) {
    case 'parent': return 'Parent';
    case 'child': return 'Child';
    case 'spouse': return 'Spouse';
    case 'sibling': return 'Sibling';
    case 'partner': return 'Partner';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}