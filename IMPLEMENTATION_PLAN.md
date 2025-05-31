Family Tree Website - Commit Breakdown

  Phase 1: Project Foundation (Commits 1-8)

  1. Initial Setup

  feat: initialize Next.js project with TypeScript and Tailwind CSS
  - Create Next.js 14 project with App Router
  - Configure TypeScript with strict mode
  - Install and configure Tailwind CSS
  - Set up basic folder structure

  2. GitHub Pages Configuration

  feat: configure Next.js for static export and GitHub Pages deployment
  - Add next.config.js with output: 'export'
  - Configure basePath for GitHub Pages
  - Set up image optimization for static export
  - Add .nojekyll file for GitHub Pages

  3. Essential Dependencies

  feat: add core dependencies for family tree functionality
  - Install D3.js for tree visualization
  - Add Fuse.js for client-side search
  - Install date-fns for date handling
  - Add clsx for conditional styling
  - Install @types packages for TypeScript

  4. Project Structure

  feat: establish project folder structure and TypeScript types
  - Create src/components/ directory structure
  - Add src/lib/ for utilities and data functions
  - Create src/types/ with family tree interfaces
  - Add public/media/ for family photos and documents
  - Set up data/ directory for JSON files

  5. GitHub Actions Setup

  feat: add GitHub Actions workflow for automated deployment
  - Create .github/workflows/build-deploy.yml
  - Configure Node.js setup and dependency caching
  - Add build and deploy steps for GitHub Pages
  - Set up proper permissions for Pages deployment

  6. TypeScript Interfaces

  feat: define TypeScript interfaces for family tree data
  - Create Person interface with biographical data
  - Add Relationship interface for family connections
  - Define MediaItem interface for photos/documents
  - Add Family interface for surname groups
  - Create search and filter types

  7. Basic Layout Components

  feat: create basic layout components and navigation
  - Add Header component with site title and navigation
  - Create Footer with family information
  - Build responsive Navigation component
  - Add basic page layout structure
  - Configure Tailwind for consistent styling

  8. Initial Data Structure

  feat: establish JSON data structure and sample data
  - Create data/people/index.json with person list
  - Add sample person files in data/people/
  - Create data/relationships/relationships.json
  - Add data/media/index.json for media catalog
  - Include sample family data for testing

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☐ Add privacy and security protection
     ☐ Define data processing commits
     ☐ Plan core component development commits
     ☐ Outline feature implementation commits
     ☐ Define deployment and optimization commits

⏺ Phase 1.5: Privacy and Security Protection (Commits 9-12)

  9. Authentication Dependencies and Utilities

  feat: add authentication dependencies and utility functions
  - Install crypto and bcryptjs for password hashing
  - Add js-cookie for session management
  - Create src/lib/auth.ts with password verification utilities
  - Add session management and security helpers
  - Configure environment variable support

  10. Login Page and Authentication

  feat: implement password-based authentication system
  - Create app/login/page.tsx with password-only login form
  - Add authentication context and session management
  - Implement client-side password verification
  - Create protected route wrapper component
  - Add logout functionality and session timeout

  11. Private Repository Configuration

  feat: configure deployment for private repository access
  - Update GitHub Actions workflow for private repo deployment
  - Add environment variable configuration for passwords
  - Configure GitHub Pages with private repository settings
  - Add build-time password hashing and security measures
  - Update next.config.js for secure static generation

  12. Security Middleware and Route Protection

  feat: implement comprehensive route protection and security
  - Create middleware.ts for route protection
  - Add authentication checks to all family data routes
  - Implement session persistence and validation
  - Add security headers and CSRF protection
  - Create error pages for unauthorized access

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☒ Add privacy and security protection
     ☐ Define data processing commits
     ☐ Plan core component development commits
     ☐ Outline feature implementation commits
     ☐ Define deployment and optimization commits

⏺ Phase 2: Data Processing and Migration (Commits 13-20)

  13. HTML Data Extraction Script

  feat: add script to extract person data from existing HTML files
  - Create scripts/extractFromHTML.ts
  - Parse HTML files for biographical information
  - Extract names, dates, places, and relationships
  - Generate JSON person records
  - Add error handling and validation

  14. PDF Document Processing

  feat: implement PDF text extraction for genealogy documents
  - Add pdf-parse dependency for PDF processing
  - Create scripts/extractFromPDF.ts
  - Extract metadata and biographical text
  - Link documents to specific people
  - Generate document index for search

  15. Media File Processing

  feat: add media processing and optimization pipeline
  - Create scripts/processImages.ts
  - Generate thumbnails and optimized versions
  - Extract EXIF data from photos
  - Organize files by family and person
  - Create media catalog with metadata

  16. Relationship Builder

  feat: implement relationship mapping and family tree generation
  - Create scripts/buildRelationships.ts
  - Parse family connections from source data
  - Generate relationship JSON structures
  - Validate family tree consistency
  - Handle complex family relationships

  17. Data Processing Workflow

  feat: add GitHub Actions workflow for data processing
  - Create .github/workflows/process-data.yml
  - Automate data extraction on family_data changes
  - Add commit and push of processed data
  - Include data validation checks
  - Set up manual trigger option

  18. Search Index Generation

  feat: create search indexes for client-side search functionality
  - Generate searchable indexes at build time
  - Create name, place, and date indexes
  - Add fuzzy search configuration
  - Optimize for fast client-side queries
  - Include relationship search data

  19. Data Validation Suite

  feat: implement comprehensive data validation and integrity checks
  - Create scripts/validateData.ts
  - Check for orphaned records and broken references
  - Validate date formats and ranges
  - Ensure media file existence
  - Generate data quality reports

  20. Migration of Existing Family Data

  feat: migrate all existing family data to JSON format
  - Process all HTML files from family_data/
  - Convert PDFs to structured data
  - Organize and optimize all media files
  - Generate complete family tree data
  - Validate migrated data integrity

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☒ Define data processing commits
     ☐ Plan core component development commits
     ☐ Outline feature implementation commits
     ☐ Define deployment and optimization commits

⏺ Phase 3: Core Components (Commits 21-30)

  21. Data Fetching Utilities

  feat: implement data fetching functions for static site generation
  - Create lib/data.ts with fetch functions
  - Add getAllPeople, getPerson, getRelationships
  - Implement caching for build-time data
  - Add error handling for missing data
  - Create type-safe data access layer

  22. Person Card Component

  feat: create PersonCard component for displaying person summaries
  - Build responsive card layout
  - Display photo, name, dates, and basic info
  - Add click handler for navigation
  - Include relationship badges
  - Style with Tailwind CSS

  23. Person Detail Page

  feat: implement person detail page with full biographical information
  - Create app/person/[id]/page.tsx
  - Display complete person information
  - Show relationships and family connections
  - Include photo gallery and documents
  - Add navigation to related people

  24. Family Tree Visualization

  feat: add D3.js family tree visualization component
  - Create FamilyTree component with D3.js
  - Implement force-directed graph layout
  - Add zoom and pan functionality
  - Style nodes based on person data
  - Include relationship links visualization

  25. Media Gallery Component

  feat: create responsive media gallery with lightbox functionality
  - Build PhotoGallery component
  - Add thumbnail grid layout
  - Implement lightbox for full-size viewing
  - Include photo metadata and captions
  - Add navigation between photos

  26. Search Components

  feat: implement search functionality with filters
  - Create SearchBar component
  - Add FilterPanel for advanced search options
  - Build SearchResults display component
  - Integrate Fuse.js for fuzzy search
  - Add search history and suggestions

  27. Family Group Pages

  feat: create family surname group pages and navigation
  - Add app/family/[surname]/page.tsx
  - Display all people with same surname
  - Show family tree for surname group
  - Include family history and origin information
  - Add inter-family relationship links

  28. Document Viewer

  feat: add PDF document viewer and text display
  - Create DocumentViewer component
  - Embed PDF viewer for genealogy documents
  - Display extracted text content
  - Add document metadata
  - Include download functionality

  29. Timeline Component

  feat: implement chronological timeline view of family events
  - Create Timeline component
  - Display births, deaths, marriages chronologically
  - Add filtering by family/person
  - Include historical context
  - Style with responsive design

  30. Navigation and Breadcrumbs

  feat: enhance navigation with breadcrumbs and family tree navigation
  - Add Breadcrumb component
  - Create FamilyTreeNavigation
  - Implement back/forward through relationships
  - Add quick family member switcher
  - Include search integration in navigation

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☒ Define data processing commits
     ☒ Plan core component development commits
     ☐ Outline feature implementation commits
     ☐ Define deployment and optimization commits

⏺ Phase 4: Advanced Features (Commits 31-39)

  27. Homepage and Landing

  feat: create engaging homepage with family overview
  - Build homepage with family statistics
  - Add featured family members carousel
  - Include recent additions/updates
  - Display family tree overview
  - Add quick search and navigation

  28. Mobile Responsive Design

  feat: optimize all components for mobile devices
  - Update layouts for mobile screens
  - Add responsive navigation menu
  - Optimize family tree for touch devices
  - Improve photo gallery mobile experience
  - Test and fix mobile layout issues

  29. Advanced Search Features

  feat: implement advanced search with multiple filters
  - Add date range filtering
  - Include location-based search
  - Add occupation and relationship filters
  - Implement saved searches
  - Add search result sorting options

  30. Family Statistics and Analytics

  feat: add family statistics and data visualization
  - Create statistics dashboard
  - Add charts for family data (births by decade, etc.)
  - Include geographic distribution maps
  - Generate family size statistics
  - Add longevity and demographic insights

  31. Export and Sharing Features

  feat: implement data export and sharing functionality
  - Add GEDCOM export capability
  - Create PDF generation for family reports
  - Add social sharing for person pages
  - Include printable family tree views
  - Add email sharing functionality

  32. URL Routing and Deep Linking

  feat: enhance URL structure and add deep linking support
  - Improve SEO-friendly URLs
  - Add shareable links for search results
  - Implement proper routing for all views
  - Add URL state management
  - Include canonical URLs for better SEO

  33. Error Handling and Loading States

  feat: add comprehensive error handling and loading states
  - Create ErrorBoundary components
  - Add loading skeletons for all pages
  - Implement 404 page for missing people
  - Add error pages with helpful navigation
  - Include retry mechanisms for failed loads

  34. Accessibility Improvements

  feat: enhance accessibility and keyboard navigation
  - Add ARIA labels and roles
  - Implement keyboard navigation for family tree
  - Add screen reader support
  - Include focus management
  - Ensure color contrast compliance

  35. Performance Optimizations

  feat: optimize performance and bundle size
  - Implement code splitting for large components
  - Add image lazy loading
  - Optimize JSON data structure
  - Add service worker for caching
  - Minimize bundle size with tree shaking

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☒ Define data processing commits
     ☒ Plan core component development commits
     ☒ Outline feature implementation commits
     ☐ Define deployment and optimization commits

⏺ Phase 5: Testing, Polish & Deployment (Commits 36-45)

  36. Testing Setup and Unit Tests

  feat: add testing framework and unit tests for core functions
  - Set up Jest and React Testing Library
  - Add tests for data fetching functions
  - Test component rendering and interactions
  - Include utility function tests
  - Add test coverage reporting

  37. Component Integration Tests

  feat: add integration tests for complex components
  - Test family tree rendering and interactions
  - Add search functionality tests
  - Test navigation and routing
  - Include form validation tests
  - Add accessibility testing

  38. SEO and Meta Tags

  feat: implement SEO optimization and meta tags
  - Add dynamic meta tags for person pages
  - Include Open Graph tags for social sharing
  - Add structured data for search engines
  - Implement sitemap generation
  - Add robots.txt configuration

  39. Documentation and Contributing Guide

  docs: add comprehensive documentation and contributing guidelines
  - Create README.md with setup instructions
  - Add CONTRIBUTING.md for family members
  - Include data structure documentation
  - Add troubleshooting guide
  - Create issue templates for GitHub

  40. Final Data Migration and Validation

  feat: complete final data migration and quality assurance
  - Process all remaining family data
  - Validate all relationships and connections
  - Ensure all media files are properly linked
  - Run comprehensive data integrity checks
  - Generate final data statistics report

  41. Production Build Optimization

  feat: optimize production build for GitHub Pages deployment
  - Configure Next.js for optimal static generation
  - Minimize asset sizes and optimize images
  - Add compression and caching headers
  - Optimize CSS and JavaScript bundles
  - Test production build locally

  42. Custom Domain and CNAME Setup

  feat: configure custom domain for GitHub Pages (optional)
  - Add CNAME file for custom domain
  - Update basePath configuration if needed
  - Test SSL certificate and HTTPS
  - Update social sharing URLs
  - Verify all links work with custom domain

  43. Analytics and Monitoring Setup

  feat: add analytics and error monitoring
  - Integrate Google Analytics or privacy-friendly alternative
  - Add error tracking with Sentry (optional)
  - Include performance monitoring
  - Add user interaction tracking
  - Set up uptime monitoring

  44. Final Testing and Bug Fixes

  fix: final round of testing and bug fixes
  - Test all functionality across browsers
  - Fix any remaining mobile issues
  - Ensure accessibility compliance
  - Test loading performance
  - Fix any broken links or missing data

  45. Launch and Initial Content

  feat: launch website with complete family tree data
  - Deploy final version to GitHub Pages
  - Verify all data is accessible
  - Test family tree visualization with full dataset
  - Ensure search functionality works with all data
  - Add launch announcement content

⏺ Update Todos
  ⎿  ☒ Create initial project setup commits
     ☒ Define data processing commits
     ☒ Plan core component development commits
     ☒ Outline feature implementation commits
     ☒ Define deployment and optimization commits

⏺ Post-Launch Maintenance (Commits 46+)

  Ongoing Development Commits

  feat: add new family member - [Name]
  docs: update family history with new information
  fix: correct relationship data for [Family Name]
  feat: add newly discovered historical documents
  chore: optimize image sizes and loading performance
  feat: implement user feedback suggestions

  Commit Strategy Best Practices

  Commit Message Format

  <type>(<scope>): <description>

  [optional body]

  [optional footer]

  Types Used:

  - feat: - New features
  - fix: - Bug fixes
  - docs: - Documentation changes
  - style: - Code style changes
  - refactor: - Code refactoring
  - test: - Adding tests
  - chore: - Maintenance tasks

  Branching Strategy

  main              # Production branch (auto-deploys to GitHub Pages)
  ├── feature/data-migration
  ├── feature/family-tree-viz
  ├── feature/search-functionality
  └── hotfix/broken-links

  Development Workflow

  1. Create feature branch from main
  2. Make incremental commits following the list above
  3. Test locally before pushing
  4. Create pull request for review
  5. Merge to main triggers auto-deployment
  6. Monitor GitHub Pages deployment

  This commit breakdown provides a clear roadmap with 45 well-defined commits that build the family tree website incrementally, ensuring each commit adds
   value and maintains a working state of the application.

> Compress all the necessary context from this conversation necessary for the construction of this website, implementation plan, etc. into a minimally
  sized text file for use in future LLM development.

⏺ # Family Tree Website Implementation Guide

  ## Project Overview
  Static family tree website deployed on GitHub Pages using Next.js 14 with TypeScript. Existing data: 32 HTML files, 23 PDFs, 51 images (1400+ people
  across Goitein, Rosner, Botha, Gouws families).

  ## Tech Stack
  - Next.js 14 (SSG, output: 'export')
  - TypeScript + Tailwind CSS
  - D3.js (family tree viz)
  - Fuse.js (client search)
  - GitHub Actions (CI/CD)
  - JSON files (data storage)

  ## Data Schema
  ```typescript
  interface Person {
    id: string; firstName: string; lastName: string;
    birthDate?: string; birthPlace?: string;
    deathDate?: string; deathPlace?: string;
    occupation?: string; biography?: string;
    photos: string[]; documents: string[];
  }

  interface Relationship {
    id: string; person1Id: string; person2Id: string;
    type: 'parent'|'spouse'|'sibling';
    startDate?: string; endDate?: string;
  }

  Project Structure

  family-tree-app/
  ├── .github/workflows/
  │   ├── build-deploy.yml
  │   └── process-data.yml
  ├── src/
  │   ├── app/
  │   │   ├── person/[id]/page.tsx
  │   │   └── family/[surname]/page.tsx
  │   ├── components/
  │   │   ├── FamilyTree.tsx (D3.js)
  │   │   ├── PersonCard.tsx
  │   │   └── SearchBar.tsx
  │   └── lib/data.ts
  ├── data/
  │   ├── people/{id}.json
  │   ├── relationships/relationships.json
  │   └── media/index.json
  ├── public/media/
  └── scripts/
      ├── extractFromHTML.ts
      ├── processImages.ts
      └── buildRelationships.ts

  GitHub Actions Workflows

  # .github/workflows/build-deploy.yml
  name: Build and Deploy
  on: push: branches: [main]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: node-version: '18'
        - run: npm ci && npm run process-data && npm run build
        - uses: actions/upload-pages-artifact@v2
          with: path: ./dist
    deploy:
      needs: build
      runs-on: ubuntu-latest
      steps:
        - uses: actions/deploy-pages@v2

  Next.js Config

  module.exports = {
    output: 'export',
    trailingSlash: true,
    basePath: '/family-tree-app',
    images: { unoptimized: true }
  }

  Data Processing Pipeline

  1. extractFromHTML.ts - Parse existing HTML genealogy files
  2. extractFromPDF.ts - Extract text from PDF documents
  3. processImages.ts - Optimize and catalog photos
  4. buildRelationships.ts - Create family tree connections
  5. generateIndexes.ts - Build search indexes

  Core Components

  - FamilyTree: D3.js force-directed graph with zoom/pan
  - PersonCard: Summary display with photo, dates, relationships
  - PersonDetail: Full biography with media gallery
  - SearchBar: Fuse.js fuzzy search with filters
  - Timeline: Chronological family events

  Key Features

  - Interactive family tree visualization
  - Advanced search (name, date, location, relationship)
  - Photo galleries with lightbox
  - PDF document viewer
  - Mobile-responsive design
  - GEDCOM export capability
  - SEO optimization with meta tags

  45-Commit Development Plan

  1-8: Project setup, config, types, layout
  9-16: Data processing scripts and migration
  17-26: Core components (PersonCard, FamilyTree, Search)
  27-35: Advanced features (mobile, analytics, export)
  36-45: Testing, SEO, documentation, launch

  Deployment Benefits

  - Free hosting (GitHub Pages)
  - Automatic SSL/CDN
  - Version control for family data
  - Collaborative editing via GitHub
  - Zero server maintenance

  Development Workflow

  1. Create feature branch
  2. Incremental commits per plan
  3. Local testing
  4. Pull request review
  5. Auto-deploy on merge to main

  Cost: $0-15/year (optional custom domain only)

  Timeline: 12 weeks solo dev or 8 weeks with team

  Capacity: 1400+ people, unlimited growth within GitHub limits