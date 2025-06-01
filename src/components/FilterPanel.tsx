'use client';

import { SearchFilters } from '@/types';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  options: {
    surnames: string[];
    birthPlaces: string[];
    deathPlaces: string[];
    occupations: string[];
  };
}

export default function FilterPanel({ filters, onFiltersChange, options }: FilterPanelProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Name Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={filters.firstName || ''}
            onChange={(e) => updateFilter('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <select
            value={filters.surname || ''}
            onChange={(e) => updateFilter('surname', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All surnames</option>
            {options.surnames.map((surname) => (
              <option key={surname} value={surname}>
                {surname}
              </option>
            ))}
          </select>
        </div>

        {/* Birth Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Year Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="From"
              value={filters.birthYear?.from || ''}
              onChange={(e) => updateFilter('birthYear', {
                ...filters.birthYear,
                from: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1600"
              max="2024"
            />
            <input
              type="number"
              placeholder="To"
              value={filters.birthYear?.to || ''}
              onChange={(e) => updateFilter('birthYear', {
                ...filters.birthYear,
                to: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1600"
              max="2024"
            />
          </div>
        </div>

        {/* Places */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Place
          </label>
          <select
            value={filters.birthPlace || ''}
            onChange={(e) => updateFilter('birthPlace', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All birth places</option>
            {options.birthPlaces.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Death Place
          </label>
          <select
            value={filters.deathPlace || ''}
            onChange={(e) => updateFilter('deathPlace', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All death places</option>
            {options.deathPlaces.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <select
            value={filters.occupation || ''}
            onChange={(e) => updateFilter('occupation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All occupations</option>
            {options.occupations.map((occupation) => (
              <option key={occupation} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
        </div>

        {/* Media Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasPhotos || false}
                onChange={(e) => updateFilter('hasPhotos', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Has photos</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasDocuments || false}
                onChange={(e) => updateFilter('hasDocuments', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Has documents</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}