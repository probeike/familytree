import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const familyLinks = [
    { name: 'Goitein Family', href: '/family/goitein' },
    { name: 'Rosner Family', href: '/family/rosner' },
    { name: 'Botha Family', href: '/family/botha' },
    { name: 'Gouws Family', href: '/family/gouws' },
  ];

  const resourceLinks = [
    { name: 'Family Tree', href: '/tree' },
    { name: 'Search', href: '/search' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Statistics', href: '/statistics' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Family info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FT</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Family Tree</h3>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Preserving our family history and genealogy across generations. 
              Documenting the stories, relationships, and heritage of the Goitein, 
              Rosner, Botha, and Gouws families.
            </p>
            <div className="text-sm text-gray-500">
              <p>Over 1,400 family members documented</p>
              <p>Spanning multiple generations and countries</p>
            </div>
          </div>

          {/* Family links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Family Lines
            </h4>
            <ul className="space-y-2">
              {familyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Family Tree Project. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/about"
                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}