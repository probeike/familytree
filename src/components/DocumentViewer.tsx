'use client';

import { useState } from 'react';
import { MediaItem } from '@/types';

interface DocumentViewerProps {
  documents: MediaItem[];
}

export default function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<MediaItem | null>(null);

  if (documents.length === 0) {
    return <p className="text-gray-500 italic">No documents available</p>;
  }

  return (
    <>
      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="flex items-center space-x-3">
              {/* Document type icon */}
              <div className="flex-shrink-0">
                {getDocumentIcon(doc.mimeType)}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">
                  {doc.title || doc.originalFilename}
                </h4>
                {doc.description && (
                  <p className="text-sm text-gray-600">{doc.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  {doc.date && <span>Date: {doc.date}</span>}
                  {doc.fileSize && <span>Size: {formatFileSize(doc.fileSize)}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                  )}
                </div>
              )}
              
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDocument(null)}
        >
          <div className="relative max-w-5xl max-h-full bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDocument.title || selectedDocument.originalFilename}
                </h3>
                {selectedDocument.description && (
                  <p className="text-sm text-gray-600">{selectedDocument.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Download link */}
                <a
                  href={`/media/${selectedDocument.filename}`}
                  download={selectedDocument.originalFilename}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
                
                {/* Close button */}
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-4" onClick={(e) => e.stopPropagation()}>
              {selectedDocument.mimeType === 'application/pdf' ? (
                <div className="w-full h-96">
                  <iframe
                    src={`/media/${selectedDocument.filename}`}
                    className="w-full h-full border-0"
                    title={selectedDocument.title || selectedDocument.originalFilename}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Document preview not available for this file type.
                  </p>
                  <a
                    href={`/media/${selectedDocument.filename}`}
                    download={selectedDocument.originalFilename}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                  >
                    Download to View
                  </a>
                </div>
              )}
            </div>

            {/* Document Details */}
            <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {selectedDocument.date && (
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">{selectedDocument.date}</p>
                  </div>
                )}
                {selectedDocument.location && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-600">{selectedDocument.location}</p>
                  </div>
                )}
                {selectedDocument.source && (
                  <div>
                    <span className="font-medium text-gray-700">Source:</span>
                    <p className="text-gray-600">{selectedDocument.source}</p>
                  </div>
                )}
                {selectedDocument.copyright && (
                  <div>
                    <span className="font-medium text-gray-700">Copyright:</span>
                    <p className="text-gray-600">{selectedDocument.copyright}</p>
                  </div>
                )}
              </div>
              
              {selectedDocument.tags.length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-gray-700 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDocument.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getDocumentIcon(mimeType: string) {
  if (mimeType === 'application/pdf') {
    return (
      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }
  
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}