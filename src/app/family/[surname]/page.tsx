import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFamilyMembers, getFamilies, getRelationships } from '@/lib/data';
import { Person, Family } from '@/types';
import PersonCard from '@/components/PersonCard';
import FamilyStatistics from '@/components/FamilyStatistics';
import FamilyTimeline from '@/components/FamilyTimeline';

interface FamilyPageProps {
  params: {
    surname: string;
  };
}

export default async function FamilyPage({ params }: FamilyPageProps) {
  const { surname } = params;
  const decodedSurname = decodeURIComponent(surname);
  
  // Fetch family data
  const [familyMembers, allFamilies, relationships] = await Promise.all([
    getFamilyMembers(decodedSurname),
    getFamilies(),
    getRelationships()
  ]);

  if (familyMembers.length === 0) {
    notFound();
  }

  // Find the family record for this surname
  const family = allFamilies.find(f => 
    f.surname.toLowerCase() === decodedSurname.toLowerCase()
  );

  // Group family members by generation (rough estimation based on birth years)
  const membersByGeneration = groupByGeneration(familyMembers);
  
  // Get family relationships
  const familyRelationships = relationships.filter(rel => {
    const person1 = familyMembers.find(p => p.id === rel.person1Id);
    const person2 = familyMembers.find(p => p.id === rel.person2Id);
    return person1 && person2;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2 text-gray-500">›</span>
        <Link href="/search" className="text-blue-600 hover:text-blue-800">Families</Link>
        <span className="mx-2 text-gray-500">›</span>
        <span className="text-gray-700">{decodedSurname} Family</span>
      </nav>

      {/* Family Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              The {decodedSurname} Family
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''} across multiple generations
            </p>
            
            {family && (
              <div className="space-y-2 text-sm text-gray-700">
                {family.origin && (
                  <p><span className="font-medium">Origin:</span> {family.origin}</p>
                )}
                {family.originCountry && (
                  <p><span className="font-medium">Country:</span> {family.originCountry}</p>
                )}
                {family.alternateSpellings.length > 0 && (
                  <p>
                    <span className="font-medium">Alternate spellings:</span>{' '}
                    {family.alternateSpellings.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/tree?family=${encodeURIComponent(decodedSurname)}`}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
            >
              View Family Tree
            </Link>
            <Link
              href={`/search?surname=${encodeURIComponent(decodedSurname)}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Search Family
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Family Description */}
          {family?.description && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Family History</h2>
              <div className="prose max-w-none">
                {family.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Family Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Family Timeline</h2>
            <FamilyTimeline people={familyMembers} relationships={familyRelationships} />
          </div>

          {/* Family Members by Generation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Family Members by Generation</h2>
            
            <div className="space-y-8">
              {Object.entries(membersByGeneration)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([generation, members]) => (
                  <div key={generation}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {getGenerationLabel(parseInt(generation), membersByGeneration)}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({members.length} member{members.length !== 1 ? 's' : ''})
                      </span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members
                        .sort((a, b) => {
                          // Sort by birth year, then by name
                          const birthYearA = extractYear(a.birthDate);
                          const birthYearB = extractYear(b.birthDate);
                          if (birthYearA !== birthYearB) {
                            return birthYearA - birthYearB;
                          }
                          return a.firstName.localeCompare(b.firstName);
                        })
                        .map((person) => (
                          <PersonCard key={person.id} person={person} showDetails={true} />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Family Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Family Statistics</h3>
            <FamilyStatistics 
              family={family} 
              members={familyMembers} 
              relationships={familyRelationships} 
            />
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/search?surname=${encodeURIComponent(decodedSurname)}&hasPhotos=true`}
                className="block w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                📷 View Family Photos
              </Link>
              <Link
                href={`/search?surname=${encodeURIComponent(decodedSurname)}&hasDocuments=true`}
                className="block w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                📄 View Family Documents
              </Link>
              <Link
                href={`/timeline?family=${encodeURIComponent(decodedSurname)}`}
                className="block w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                📅 Family Timeline
              </Link>
            </div>
          </div>

          {/* Notable Members */}
          {familyMembers.length > 10 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notable Members</h3>
              <div className="space-y-3">
                {getNotableMembers(familyMembers).map((person) => (
                  <PersonCard key={person.id} person={person} showDetails={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function groupByGeneration(people: Person[]): Record<string, Person[]> {
  const generations: Record<string, Person[]> = {};
  
  people.forEach((person) => {
    const birthYear = extractYear(person.birthDate);
    const generation = Math.floor((2024 - birthYear) / 25); // Rough 25-year generations
    
    const generationKey = generation.toString();
    if (!generations[generationKey]) {
      generations[generationKey] = [];
    }
    generations[generationKey].push(person);
  });
  
  return generations;
}

function extractYear(dateString?: string): number {
  if (!dateString) return 2024; // Default to current year if no date
  const match = dateString.match(/\d{4}/);
  return match ? parseInt(match[0]) : 2024;
}

function getGenerationLabel(generation: number, allGenerations: Record<string, Person[]>): string {
  const totalGenerations = Object.keys(allGenerations).length;
  
  if (generation === 0) return 'Current Generation';
  if (generation === 1) return 'Previous Generation';
  if (generation === totalGenerations - 1) return 'Earliest Generation';
  
  return `${generation + 1} Generation${generation > 0 ? 's' : ''} Ago`;
}

function getNotableMembers(people: Person[]): Person[] {
  // Sort by various criteria to identify "notable" members
  return people
    .filter(person => 
      person.biography?.length && person.biography.length > 100 || 
      person.photos.length > 0 || 
      person.occupation
    )
    .sort((a, b) => {
      // Prioritize people with more information
      const scoreA = (a.biography?.length || 0) + (a.photos.length * 50) + (a.occupation ? 25 : 0);
      const scoreB = (b.biography?.length || 0) + (b.photos.length * 50) + (b.occupation ? 25 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);
}