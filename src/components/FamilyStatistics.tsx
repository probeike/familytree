import { Person, Family, Relationship } from '@/types';

interface FamilyStatisticsProps {
  family?: Family;
  members: Person[];
  relationships: Relationship[];
}

export default function FamilyStatistics({ family, members, relationships }: FamilyStatisticsProps) {
  // Calculate statistics
  const stats = calculateFamilyStats(members, relationships);
  
  return (
    <div className="space-y-4">
      {/* Basic counts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{members.length}</div>
          <div className="text-sm text-blue-700">Members</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.generations}</div>
          <div className="text-sm text-green-700">Generations</div>
        </div>
      </div>

      {/* Detailed statistics */}
      <div className="space-y-3 text-sm">
        {stats.livingMembers > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Living members:</span>
            <span className="font-medium">{stats.livingMembers}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total relationships:</span>
          <span className="font-medium">{relationships.length}</span>
        </div>

        {stats.marriageCount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Marriages recorded:</span>
            <span className="font-medium">{stats.marriageCount}</span>
          </div>
        )}

        {stats.earliestBirth && (
          <div className="flex justify-between">
            <span className="text-gray-600">Earliest birth:</span>
            <span className="font-medium">{stats.earliestBirth}</span>
          </div>
        )}

        {stats.latestBirth && (
          <div className="flex justify-between">
            <span className="text-gray-600">Latest birth:</span>
            <span className="font-medium">{stats.latestBirth}</span>
          </div>
        )}

        {stats.averageLifespan && (
          <div className="flex justify-between">
            <span className="text-gray-600">Average lifespan:</span>
            <span className="font-medium">{stats.averageLifespan} years</span>
          </div>
        )}
      </div>

      {/* Most common places */}
      {stats.commonPlaces.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Most Common Places</h4>
          <div className="space-y-1">
            {stats.commonPlaces.slice(0, 3).map((place, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate">{place.place}</span>
                <span className="font-medium ml-2">{place.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most common occupations */}
      {stats.commonOccupations.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Common Occupations</h4>
          <div className="space-y-1">
            {stats.commonOccupations.slice(0, 3).map((occupation, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate">{occupation.occupation}</span>
                <span className="font-medium ml-2">{occupation.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media counts */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Media Collection</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">With photos:</span>
            <span className="font-medium">{stats.membersWithPhotos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">With documents:</span>
            <span className="font-medium">{stats.membersWithDocuments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateFamilyStats(members: Person[], relationships: Relationship[]) {
  const currentYear = new Date().getFullYear();
  
  // Basic counts
  const livingMembers = members.filter(person => !person.deathDate).length;
  const marriageCount = relationships.filter(rel => rel.type === 'spouse').length;
  
  // Birth/death year calculations
  const birthYears = members
    .map(person => extractYear(person.birthDate))
    .filter(year => year > 1600 && year <= currentYear);
  
  const deathYears = members
    .map(person => extractYear(person.deathDate))
    .filter(year => year > 1600 && year <= currentYear);
  
  const earliestBirth = birthYears.length > 0 ? Math.min(...birthYears).toString() : null;
  const latestBirth = birthYears.length > 0 ? Math.max(...birthYears).toString() : null;
  
  // Calculate average lifespan for deceased members
  const lifespans = members
    .filter(person => person.birthDate && person.deathDate)
    .map(person => {
      const birthYear = extractYear(person.birthDate);
      const deathYear = extractYear(person.deathDate);
      return deathYear - birthYear;
    })
    .filter(lifespan => lifespan > 0 && lifespan < 120);
  
  const averageLifespan = lifespans.length > 0 
    ? Math.round(lifespans.reduce((sum, age) => sum + age, 0) / lifespans.length)
    : null;

  // Calculate generations based on birth year spread
  const generations = birthYears.length > 0 
    ? Math.ceil((Math.max(...birthYears) - Math.min(...birthYears)) / 25) + 1
    : 1;

  // Common places
  const places: Record<string, number> = {};
  members.forEach(person => {
    if (person.birthPlace) places[person.birthPlace] = (places[person.birthPlace] || 0) + 1;
    if (person.deathPlace) places[person.deathPlace] = (places[person.deathPlace] || 0) + 1;
  });
  
  const commonPlaces = Object.entries(places)
    .map(([place, count]) => ({ place, count }))
    .sort((a, b) => b.count - a.count);

  // Common occupations
  const occupations: Record<string, number> = {};
  members.forEach(person => {
    if (person.occupation) {
      occupations[person.occupation] = (occupations[person.occupation] || 0) + 1;
    }
  });
  
  const commonOccupations = Object.entries(occupations)
    .map(([occupation, count]) => ({ occupation, count }))
    .sort((a, b) => b.count - a.count);

  // Media statistics
  const membersWithPhotos = members.filter(person => person.photos.length > 0).length;
  const membersWithDocuments = members.filter(person => person.documents.length > 0).length;

  return {
    livingMembers,
    marriageCount,
    earliestBirth,
    latestBirth,
    averageLifespan,
    generations,
    commonPlaces,
    commonOccupations,
    membersWithPhotos,
    membersWithDocuments
  };
}

function extractYear(dateString?: string): number {
  if (!dateString) return 0;
  const match = dateString.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}