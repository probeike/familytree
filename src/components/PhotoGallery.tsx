'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types';

interface PhotoGalleryProps {
  photos: MediaItem[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);

  if (photos.length === 0) {
    return <p className="text-gray-500 italic">No photos available</p>;
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border border-gray-200"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative w-full h-full bg-gray-100">
              <Image
                src={`/media/${photo.filename}`}
                alt={photo.title || photo.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
            </div>
            
            {/* Photo info overlay */}
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{photo.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative">
              <Image
                src={`/media/${selectedPhoto.filename}`}
                alt={selectedPhoto.title || selectedPhoto.filename}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Photo details */}
            {(selectedPhoto.title || selectedPhoto.description || selectedPhoto.date) && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-white">
                  {selectedPhoto.title && (
                    <h3 className="text-lg font-medium mb-2">{selectedPhoto.title}</h3>
                  )}
                  {selectedPhoto.description && (
                    <p className="text-sm text-gray-300 mb-2">{selectedPhoto.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {selectedPhoto.date && (
                      <span>Date: {selectedPhoto.date}</span>
                    )}
                    {selectedPhoto.location && (
                      <span>Location: {selectedPhoto.location}</span>
                    )}
                    {selectedPhoto.source && (
                      <span>Source: {selectedPhoto.source}</span>
                    )}
                  </div>
                  {selectedPhoto.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedPhoto.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation arrows if multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
                  setSelectedPhoto(photos[prevIndex]);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
                  const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
                  setSelectedPhoto(photos[nextIndex]);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}