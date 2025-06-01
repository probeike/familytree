#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const GenealogyDataProcessor = require('./process-genealogy-data');

/**
 * Build script to process genealogy data and prepare it for the application
 * This script runs during the GitHub Actions build process
 */
async function buildData() {
  console.log('🚀 Starting family tree data build process...');
  
  const familyDataDir = path.join(process.cwd(), 'family-tree-data');
  const appDataDir = path.join(process.cwd(), 'data');
  
  // Check if family-tree-data directory exists
  if (!fs.existsSync(familyDataDir)) {
    console.log('⚠️  family-tree-data directory not found. Skipping data processing.');
    console.log('   This is normal for local development without the data repository.');
    return;
  }
  
  try {
    // Process the raw genealogy data
    console.log('📊 Processing genealogy data...');
    const processor = new GenealogyDataProcessor();
    await processor.processAll();
    
    // Copy processed data to app data directory for build
    console.log('📁 Copying processed data to app...');
    await copyProcessedData(familyDataDir, appDataDir);
    
    // Generate search indexes
    console.log('🔍 Generating search indexes...');
    await generateSearchIndexes(appDataDir);
    
    // Optimize media assets
    console.log('🖼️  Processing media assets...');
    await processMediaAssets(familyDataDir, path.join(process.cwd(), 'public'));
    
    console.log('✅ Data build process completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data build process:', error);
    process.exit(1);
  }
}

async function copyProcessedData(familyDataDir, appDataDir) {
  const processedDir = path.join(familyDataDir, 'processed');
  
  if (!fs.existsSync(processedDir)) {
    console.log('⚠️  No processed data found. Run data processing first.');
    return;
  }
  
  // Ensure app data directory exists
  if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
  }
  
  // Copy all processed data
  await copyDirectory(processedDir, appDataDir);
}

async function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function generateSearchIndexes(dataDir) {
  try {
    // Read all people data
    const peopleIndexPath = path.join(dataDir, 'people', 'index.json');
    if (!fs.existsSync(peopleIndexPath)) {
      console.log('⚠️  No people index found. Skipping search index generation.');
      return;
    }
    
    const peopleIndex = JSON.parse(fs.readFileSync(peopleIndexPath, 'utf-8'));
    const searchIndex = {
      people: [],
      surnames: new Set(),
      places: new Set(),
      dates: new Set()
    };
    
    // Process each person for search indexing
    for (const { id } of peopleIndex) {
      try {
        const personPath = path.join(dataDir, 'people', `${id}.json`);
        if (fs.existsSync(personPath)) {
          const person = JSON.parse(fs.readFileSync(personPath, 'utf-8'));
          
          // Add to search index
          searchIndex.people.push({
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            fullName: `${person.firstName} ${person.lastName}`,
            birthDate: person.birthDate,
            birthPlace: person.birthPlace,
            deathDate: person.deathDate,
            deathPlace: person.deathPlace,
            occupation: person.occupation
          });
          
          // Collect unique values for filters
          if (person.lastName) searchIndex.surnames.add(person.lastName);
          if (person.birthPlace) searchIndex.places.add(person.birthPlace);
          if (person.deathPlace) searchIndex.places.add(person.deathPlace);
          if (person.birthDate) {
            const year = person.birthDate.match(/\\d{4}/);
            if (year) searchIndex.dates.add(year[0]);
          }
        }
      } catch (error) {
        console.warn(`Error processing person ${id} for search:`, error.message);
      }
    }
    
    // Convert sets to sorted arrays
    const finalIndex = {
      people: searchIndex.people,
      surnames: Array.from(searchIndex.surnames).sort(),
      places: Array.from(searchIndex.places).sort(),
      dates: Array.from(searchIndex.dates).sort()
    };
    
    // Write search index
    fs.writeFileSync(
      path.join(dataDir, 'search-index.json'),
      JSON.stringify(finalIndex, null, 2)
    );
    
    console.log(`📝 Generated search index with ${finalIndex.people.length} people`);
    
  } catch (error) {
    console.error('Error generating search indexes:', error);
  }
}

async function processMediaAssets(familyDataDir, publicDir) {
  const mediaSourceDir = path.join(familyDataDir, 'raw', 'images');
  const mediaDestDir = path.join(publicDir, 'media');
  
  if (!fs.existsSync(mediaSourceDir)) {
    console.log('⚠️  No media source directory found.');
    return;
  }
  
  // Ensure media destination exists
  if (!fs.existsSync(mediaDestDir)) {
    fs.mkdirSync(mediaDestDir, { recursive: true });
  }
  
  // Copy media files (could add optimization here)
  await copyDirectory(mediaSourceDir, mediaDestDir);
  
  console.log('📁 Media assets copied to public directory');
}

// Run the build if this script is executed directly
if (require.main === module) {
  buildData().catch(console.error);
}

module.exports = { buildData };