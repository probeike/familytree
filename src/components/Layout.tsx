'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { AuthProvider } from '@/lib/AuthContext';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className={`flex-1 ${className || ''}`}>
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export function PageLayout({ 
  children, 
  title, 
  description,
  breadcrumbs,
  actions 
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ name: string; href?: string }>;
  actions?: ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {breadcrumbs && (
        <div className="mb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((item, index) => (
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
                    <a
                      href={item.href}
                      className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      {(title || description || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-lg text-gray-600">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="mt-4 sm:mt-0 sm:ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}