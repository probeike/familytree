'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export default function Navigation({ items, className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            )}
          >
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BreadcrumbNavigation({ 
  items 
}: { 
  items: Array<{ name: string; href?: string }> 
}) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}