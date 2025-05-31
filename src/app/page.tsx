import { PageLayout } from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  const familyStats = [
    { name: 'People Documented', value: '1,400+' },
    { name: 'Generations Tracked', value: '8+' },
    { name: 'Family Lines', value: '4' },
    { name: 'Countries Covered', value: '6+' },
  ];

  const featuredFamilies = [
    { name: 'Goitein', description: 'Scholarly tradition from Germany', href: '/family/goitein' },
    { name: 'Rosner', description: 'European heritage and migration', href: '/family/rosner' },
    { name: 'Botha', description: 'South African farming roots', href: '/family/botha' },
    { name: 'Gouws', description: 'Cape Colony descendants', href: '/family/gouws' },
  ];

  return (
    <PageLayout
      title="Welcome to Our Family Tree"
      description="Discover the rich history and connections of our family across generations and continents"
    >
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {familyStats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {stat.value.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Families */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Lines</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredFamilies.map((family) => (
            <Link
              key={family.name}
              href={family.href}
              className="group relative bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {family.name}
              </div>
              <p className="text-gray-600 text-sm">
                {family.description}
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Explore family →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Our Heritage</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/tree"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Family Tree</h3>
              <p className="text-gray-600 text-sm">Interactive tree visualization</p>
            </div>
          </Link>

          <Link
            href="/search"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🔍</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Search</h3>
              <p className="text-gray-600 text-sm">Find family members</p>
            </div>
          </Link>

          <Link
            href="/media"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📷</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Media Gallery</h3>
              <p className="text-gray-600 text-sm">Photos and documents</p>
            </div>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}