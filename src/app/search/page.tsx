'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Person, SearchFilters } from '@/types';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import SearchResults from '@/components/SearchResults';
import PersonCard from '@/components/PersonCard';

// This would normally come from the data layer, but for client-side search we'll fetch it
async function fetchPeopleData(): Promise<Person[]> {
  try {
    // In a real app, this would be an API call
    // For now, we'll return empty array and handle data loading differently
    return [];
  } catch (error) {
    console.error('Error fetching people data:', error);
    return [];
  }
}

export default function SearchPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    if (people.length === 0) return null;
    
    return new Fuse(people, {
      keys: [
        { name: 'firstName', weight: 0.3 },
        { name: 'lastName', weight: 0.4 },
        { name: 'middleName', weight: 0.1 },
        { name: 'maidenName', weight: 0.2 },
        { name: 'nickname', weight: 0.1 },
        { name: 'birthPlace', weight: 0.1 },
        { name: 'deathPlace', weight: 0.1 },
        { name: 'occupation', weight: 0.2 },
        { name: 'biography', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2
    });
  }, [people]);

  // Load people data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // For static generation, we would load this data differently
        // This is a placeholder for the client-side implementation
        const data = await fetchPeopleData();
        setPeople(data);
      } catch (error) {
        console.error('Error loading people data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search people
  const filteredPeople = useMemo(() => {
    let results = people;

    // Apply filters first
    if (filters.surname) {
      results = results.filter(person => 
        person.lastName.toLowerCase().includes(filters.surname!.toLowerCase())
      );
    }

    if (filters.firstName) {
      results = results.filter(person => 
        person.firstName.toLowerCase().includes(filters.firstName!.toLowerCase())
      );
    }

    if (filters.birthPlace) {
      results = results.filter(person => 
        person.birthPlace?.toLowerCase().includes(filters.birthPlace!.toLowerCase())
      );
    }

    if (filters.deathPlace) {
      results = results.filter(person => 
        person.deathPlace?.toLowerCase().includes(filters.deathPlace!.toLowerCase())
      );
    }

    if (filters.occupation) {
      results = results.filter(person => 
        person.occupation?.toLowerCase().includes(filters.occupation!.toLowerCase())
      );
    }

    if (filters.birthYear) {
      results = results.filter(person => {
        if (!person.birthDate) return false;
        const year = parseInt(person.birthDate.match(/\\d{4}/)?.[0] || '0');
        const { from, to } = filters.birthYear!;
        return (!from || year >= from) && (!to || year <= to);
      });
    }

    if (filters.hasPhotos) {
      results = results.filter(person => person.photos.length > 0);
    }

    if (filters.hasDocuments) {
      results = results.filter(person => person.documents.length > 0);
    }

    // Apply search query using Fuse.js
    if (searchQuery.trim() && fuse) {
      const searchResults = fuse.search(searchQuery);
      const searchIds = new Set(searchResults.map(result => result.item.id));
      results = results.filter(person => searchIds.has(person.id));
      
      // Sort by search relevance
      results.sort((a, b) => {
        const scoreA = searchResults.find(r => r.item.id === a.id)?.score || 1;
        const scoreB = searchResults.find(r => r.item.id === b.id)?.score || 1;
        return scoreA - scoreB;
      });
    } else {
      // Sort alphabetically by last name, then first name
      results.sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.firstName.localeCompare(b.firstName);
      });
    }

    return results;
  }, [people, filters, searchQuery, fuse]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      surnames: [...new Set(people.map(p => p.lastName).filter(Boolean))].sort(),
      birthPlaces: [...new Set(people.map(p => p.birthPlace).filter(Boolean))].sort(),
      deathPlaces: [...new Set(people.map(p => p.deathPlace).filter(Boolean))].sort(),
      occupations: [...new Set(people.map(p => p.occupation).filter(Boolean))].sort()
    };
  }, [people]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Family Members</h1>
        <p className="text-gray-600">
          Search through {people.length.toLocaleString()} family members across generations
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, place, occupation..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            options={filterOptions}
          />
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing {filteredPeople.length.toLocaleString()} of {people.length.toLocaleString()} people
              {searchQuery && ` for "${searchQuery}"`}
            </>
          )}
        </p>
        
        {(searchQuery || Object.keys(filters).length > 0) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({});
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredPeople.length === 0 && people.length > 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No people found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or clearing the filters.
          </p>
        </div>
      )}

      {/* Search Results */}
      {!loading && filteredPeople.length > 0 && (
        <SearchResults people={filteredPeople} searchQuery={searchQuery} />
      )}

      {/* No Data State */}
      {!loading && people.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No family data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Family data is being processed or not yet available.
          </p>
        </div>
      )}
    </div>
  );
}