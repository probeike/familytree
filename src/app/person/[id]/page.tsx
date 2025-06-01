import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPerson, getPersonRelationships, getPersonMedia, getAllPeople } from '@/lib/data';
import { Person, Relationship, MediaItem } from '@/types';
import PhotoGallery from '@/components/PhotoGallery';
import PersonCard from '@/components/PersonCard';
import DocumentViewer from '@/components/DocumentViewer';

interface PersonPageProps {
  params: {
    id: string;
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = params;
  
  // Fetch person data
  const person = await getPerson(id);
  if (!person) {
    notFound();
  }

  // Fetch related data
  const [relationships, media, allPeople] = await Promise.all([
    getPersonRelationships(id),
    getPersonMedia(id),
    getAllPeople()
  ]);

  // Create lookup for people by ID
  const peopleById = allPeople.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, Person>);

  // Group relationships by type
  const relationshipGroups = {
    spouses: [] as Array<{ person: Person; relationship: Relationship }>,
    children: [] as Array<{ person: Person; relationship: Relationship }>,
    parents: [] as Array<{ person: Person; relationship: Relationship }>,
    siblings: [] as Array<{ person: Person; relationship: Relationship }>
  };

  relationships.forEach(rel => {
    const relatedPersonId = rel.person1Id === id ? rel.person2Id : rel.person1Id;
    const relatedPerson = peopleById[relatedPersonId];
    
    if (relatedPerson) {
      const relType = rel.person1Id === id ? rel.type : getInverseRelationType(rel.type);
      
      switch (relType) {
        case 'spouse':
          relationshipGroups.spouses.push({ person: relatedPerson, relationship: rel });
          break;
        case 'child':
          relationshipGroups.children.push({ person: relatedPerson, relationship: rel });
          break;
        case 'parent':
          relationshipGroups.parents.push({ person: relatedPerson, relationship: rel });
          break;
        case 'sibling':
          relationshipGroups.siblings.push({ person: relatedPerson, relationship: rel });
          break;
      }
    }
  });

  const photos = media.filter(item => item.type === 'photo');
  const documents = media.filter(item => item.type === 'document');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2 text-gray-500">›</span>
        <Link href="/search" className="text-blue-600 hover:text-blue-800">People</Link>
        <span className="mx-2 text-gray-500">›</span>
        <span className="text-gray-700">{person.firstName} {person.lastName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Person Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {person.firstName} {person.middleName} {person.lastName}
                  {person.maidenName && (
                    <span className="text-lg text-gray-600 ml-2">(née {person.maidenName})</span>
                  )}
                </h1>
                {person.nickname && (
                  <p className="text-lg text-gray-600 mb-4">"{person.nickname}"</p>
                )}
                
                {/* Life Dates */}
                <div className="text-gray-700 mb-4">
                  {person.birthDate && (
                    <p>
                      <span className="font-medium">Born:</span> {person.birthDate}
                      {person.birthPlace && <span> in {person.birthPlace}</span>}
                    </p>
                  )}
                  {person.deathDate && (
                    <p>
                      <span className="font-medium">Died:</span> {person.deathDate}
                      {person.deathPlace && <span> in {person.deathPlace}</span>}
                    </p>
                  )}
                  {person.burialPlace && (
                    <p><span className="font-medium">Buried:</span> {person.burialPlace}</p>
                  )}
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {person.occupation && (
                    <p><span className="font-medium text-gray-900">Occupation:</span> {person.occupation}</p>
                  )}
                  {person.education && (
                    <p><span className="font-medium text-gray-900">Education:</span> {person.education}</p>
                  )}
                  {person.religion && (
                    <p><span className="font-medium text-gray-900">Religion:</span> {person.religion}</p>
                  )}
                  {person.nationality && (
                    <p><span className="font-medium text-gray-900">Nationality:</span> {person.nationality}</p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/family/${person.lastName}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm text-center"
                >
                  View Family
                </Link>
                <Link
                  href={`/tree?person=${person.id}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm text-center"
                >
                  Family Tree
                </Link>
              </div>
            </div>
          </div>

          {/* Biography */}
          {person.biography && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Biography</h2>
              <div className="prose max-w-none">
                {person.biography.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
              <PhotoGallery photos={photos} />
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
              <DocumentViewer documents={documents} />
            </div>
          )}

          {/* Notes */}
          {person.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700">{person.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Relationships */}
        <div className="lg:col-span-1">
          {/* Parents */}
          {relationshipGroups.parents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Parents</h3>
              <div className="space-y-3">
                {relationshipGroups.parents.map(({ person, relationship }) => (
                  <PersonCard key={person.id} person={person} relationship={relationship} />
                ))}
              </div>
            </div>
          )}

          {/* Spouses */}
          {relationshipGroups.spouses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {relationshipGroups.spouses.length === 1 ? 'Spouse' : 'Spouses'}
              </h3>
              <div className="space-y-3">
                {relationshipGroups.spouses.map(({ person, relationship }) => (
                  <PersonCard key={person.id} person={person} relationship={relationship} />
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {relationshipGroups.children.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Children</h3>
              <div className="space-y-3">
                {relationshipGroups.children.map(({ person, relationship }) => (
                  <PersonCard key={person.id} person={person} relationship={relationship} />
                ))}
              </div>
            </div>
          )}

          {/* Siblings */}
          {relationshipGroups.siblings.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Siblings</h3>
              <div className="space-y-3">
                {relationshipGroups.siblings.map(({ person, relationship }) => (
                  <PersonCard key={person.id} person={person} relationship={relationship} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getInverseRelationType(type: string): string {
  switch (type) {
    case 'parent': return 'child';
    case 'child': return 'parent';
    case 'spouse': return 'spouse';
    case 'sibling': return 'sibling';
    default: return type;
  }
}