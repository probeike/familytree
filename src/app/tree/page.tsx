import { Suspense } from 'react';
import { getAllPeople, getRelationships, getFamilies } from '@/lib/data';
import FamilyTree from '@/components/FamilyTree';
import Link from 'next/link';

interface TreePageProps {
  searchParams: {
    person?: string;
    family?: string;
  };
}

export default async function TreePage({ searchParams }: TreePageProps) {
  const { person: personId, family: familyName } = searchParams;
  
  // Fetch data
  const [allPeople, relationships, families] = await Promise.all([
    getAllPeople(),
    getRelationships(),
    getFamilies()
  ]);

  // Filter people if family is specified
  let filteredPeople = allPeople;
  if (familyName) {
    filteredPeople = allPeople.filter(person => 
      person.lastName.toLowerCase() === familyName.toLowerCase()
    );
  }

  // Find root person if specified
  const rootPerson = personId ? allPeople.find(p => p.id === personId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm mb-2">
                <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
                <span className="mx-2 text-gray-500">›</span>
                <span className="text-gray-700">Family Tree</span>
                {familyName && (
                  <>
                    <span className="mx-2 text-gray-500">›</span>
                    <span className="text-gray-700">{familyName} Family</span>
                  </>
                )}
              </nav>
              
              <h1 className="text-2xl font-bold text-gray-900">
                {familyName ? `${familyName} Family Tree` : 'Interactive Family Tree'}
              </h1>
              <p className="text-gray-600 mt-1">
                Explore {filteredPeople.length} family members and their relationships
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {familyName && (
                <Link
                  href={`/family/${familyName}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Family Details
                </Link>
              )}
              <Link
                href="/search"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Search People
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Suspense fallback={<TreeLoadingState />}>
            {filteredPeople.length > 0 ? (
              <FamilyTree
                people={filteredPeople}
                relationships={relationships}
                rootPersonId={rootPerson?.id}
                width={1400}
                height={900}
              />
            ) : (
              <EmptyTreeState familyName={familyName} />
            )}
          </Suspense>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">How to Use the Family Tree</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Navigation</h3>
              <ul className="space-y-1">
                <li>• Drag to pan around</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Use controls to reset view</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Interaction</h3>
              <ul className="space-y-1">
                <li>• Click nodes for details</li>
                <li>• Drag nodes to rearrange</li>
                <li>• Hover for quick info</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Node Colors</h3>
              <ul className="space-y-1">
                <li>• <span className="text-blue-600">Blue:</span> Adults</li>
                <li>• <span className="text-green-600">Green:</span> Children</li>
                <li>• <span className="text-red-600">Red:</span> Deceased</li>
                <li>• <span className="text-yellow-600">Orange:</span> Elderly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Link Types</h3>
              <ul className="space-y-1">
                <li>• <span className="text-blue-600">Blue:</span> Parent-Child</li>
                <li>• <span className="text-red-600">Red:</span> Marriage</li>
                <li>• <span className="text-green-600">Green:</span> Siblings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeLoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading family tree...</p>
      </div>
    </div>
  );
}

function EmptyTreeState({ familyName }: { familyName?: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Data Found</h3>
        <p className="text-gray-600 mb-4">
          {familyName 
            ? `No family members found for the ${familyName} family.`
            : 'No family data is currently available to display.'
          }
        </p>
        <Link
          href="/search"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All People
        </Link>
      </div>
    </div>
  );
}