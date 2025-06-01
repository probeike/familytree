const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Data processing script for family tree genealogy data
class GenealogyDataProcessor {
  constructor() {
    this.dataDir = path.join(__dirname, '../../family-tree-data');
    this.outputDir = path.join(this.dataDir, 'processed'); // Output to family-tree-data repo
    this.people = [];
    this.relationships = [];
    this.families = {};
    this.media = [];
  }

  // Main processing function
  async processAll() {
    console.log('🔄 Starting genealogy data processing...');
    
    // Ensure output directories exist
    this.ensureDirectories();
    
    // Process HTML files
    await this.processHtmlFiles();
    
    // Process media files
    await this.processMediaFiles();
    
    // Generate derived data
    this.generateFamilies();
    this.generateRelationships();
    
    // Write output files
    this.writeDataFiles();
    
    console.log('✅ Data processing complete!');
    this.printStatistics();
  }

  ensureDirectories() {
    const dirs = [
      this.outputDir,
      path.join(this.outputDir, 'people'),
      path.join(this.outputDir, 'relationships'),
      path.join(this.outputDir, 'media'),
      path.join(this.outputDir, 'families')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  async processHtmlFiles() {
    const htmlDir = path.join(this.dataDir, 'raw/html');
    if (!fs.existsSync(htmlDir)) {
      console.log('⚠️  HTML directory not found:', htmlDir);
      return;
    }

    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    console.log(`📄 Processing ${htmlFiles.length} HTML files...`);

    for (const file of htmlFiles) {
      await this.processHtmlFile(path.join(htmlDir, file));
    }
  }

  async processHtmlFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(content);
      const filename = path.basename(filePath, '.html');
      
      console.log(`📄 Processing: ${filename}`);

      // Extract person data based on common genealogy HTML patterns
      const person = this.extractPersonFromHtml($, filename);
      if (person) {
        this.people.push(person);
      }

      // Extract family connections
      const connections = this.extractConnectionsFromHtml($);
      this.relationships.push(...connections);

    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  extractPersonFromHtml($, filename) {
    // Extract person information from HTML
    // This needs to be customized based on your HTML structure
    
    const person = {
      id: this.generatePersonId(filename),
      firstName: '',
      lastName: '',
      birthDate: '',
      birthPlace: '',
      deathDate: '',
      deathPlace: '',
      occupation: '',
      biography: '',
      photos: [],
      documents: [],
      spouseIds: [],
      childrenIds: [],
      parentIds: [],
      siblingIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Try to extract name from title or headers
    const title = $('title').text() || $('h1').first().text() || filename;
    const nameParts = this.parseNameFromTitle(title);
    person.firstName = nameParts.firstName;
    person.lastName = nameParts.lastName;

    // Try to extract dates
    const dates = this.extractDatesFromText($.text());
    if (dates.birth) person.birthDate = dates.birth;
    if (dates.death) person.deathDate = dates.death;

    // Extract biography from paragraphs
    const paragraphs = $('p').map((i, el) => $(el).text()).get();
    person.biography = paragraphs.join('\\n\\n');

    // Extract images
    const images = $('img').map((i, el) => $(el).attr('src')).get();
    person.photos = images.filter(img => img);

    return person;
  }

  extractConnectionsFromHtml($) {
    const connections = [];
    
    // Look for family relationship keywords
    const text = $.text().toLowerCase();
    const relationshipPatterns = [
      /married\\s+to\\s+([^\\n\\.]+)/gi,
      /son\\s+of\\s+([^\\n\\.]+)/gi,
      /daughter\\s+of\\s+([^\\n\\.]+)/gi,
      /father[:\\s]+([^\\n\\.]+)/gi,
      /mother[:\\s]+([^\\n\\.]+)/gi
    ];

    // Extract relationships based on patterns
    relationshipPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        connections.push({
          id: this.generateId(),
          type: this.getRelationshipType(match[0]),
          relatedName: match[1].trim(),
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    return connections;
  }

  async processMediaFiles() {
    const mediaDir = path.join(this.dataDir, 'raw/images');
    if (!fs.existsSync(mediaDir)) {
      console.log('⚠️  Media directory not found:', mediaDir);
      return;
    }

    const mediaFiles = fs.readdirSync(mediaDir, { recursive: true })
      .filter(file => /\\.(jpg|jpeg|png|gif|pdf)$/i.test(file));
    
    console.log(`🖼️  Processing ${mediaFiles.length} media files...`);

    for (const file of mediaFiles) {
      const mediaItem = this.createMediaItem(file);
      this.media.push(mediaItem);
    }
  }

  createMediaItem(filename) {
    const ext = path.extname(filename).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    const isPdf = ext === '.pdf';

    return {
      id: this.generateId(),
      filename: filename,
      originalFilename: filename,
      type: isPdf ? 'document' : 'photo',
      mimeType: isPdf ? 'application/pdf' : `image/${ext.slice(1)}`,
      fileSize: 0, // Would need fs.statSync to get actual size
      title: this.generateTitleFromFilename(filename),
      description: '',
      date: '',
      location: '',
      peopleIds: [],
      tags: this.extractTagsFromFilename(filename),
      source: 'family_archive',
      copyright: '',
      thumbnailPath: isImage ? filename : '',
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  generateFamilies() {
    console.log('👨‍👩‍👧‍👦 Generating family groups...');
    
    // Group people by surname
    const surnameGroups = {};
    this.people.forEach(person => {
      const surname = person.lastName || 'Unknown';
      if (!surnameGroups[surname]) {
        surnameGroups[surname] = [];
      }
      surnameGroups[surname].push(person.id);
    });

    // Create family records
    Object.entries(surnameGroups).forEach(([surname, memberIds]) => {
      this.families[surname] = {
        id: this.generateId(),
        surname: surname,
        alternateSpellings: [],
        origin: '',
        originCountry: '',
        migrationHistory: '',
        description: '',
        memberIds: memberIds,
        statistics: {
          totalMembers: memberIds.length,
          generations: 0,
          oldestMember: '',
          youngestMember: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  }

  generateRelationships() {
    console.log('🔗 Generating relationships...');
    // This would need more sophisticated logic to infer relationships
    // from the extracted data and cross-reference between people
  }

  writeDataFiles() {
    console.log('💾 Writing data files...');

    // Write people index
    const peopleIndex = this.people.map(p => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
      deathDate: p.deathDate
    }));
    
    fs.writeFileSync(
      path.join(this.outputDir, 'people', 'index.json'),
      JSON.stringify(peopleIndex, null, 2)
    );

    // Write individual person files
    this.people.forEach(person => {
      fs.writeFileSync(
        path.join(this.outputDir, 'people', `${person.id}.json`),
        JSON.stringify(person, null, 2)
      );
    });

    // Write relationships
    fs.writeFileSync(
      path.join(this.outputDir, 'relationships', 'relationships.json'),
      JSON.stringify(this.relationships, null, 2)
    );

    // Write families
    fs.writeFileSync(
      path.join(this.outputDir, 'families.json'),
      JSON.stringify(Object.values(this.families), null, 2)
    );

    // Write media index
    fs.writeFileSync(
      path.join(this.outputDir, 'media', 'index.json'),
      JSON.stringify(this.media, null, 2)
    );
  }

  // Helper functions
  generatePersonId(filename) {
    return filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  parseNameFromTitle(title) {
    // Basic name parsing - would need improvement
    const cleanTitle = title.replace(/[^a-zA-Z\\s]/g, '').trim();
    const parts = cleanTitle.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts[parts.length - 1] || ''
    };
  }

  extractDatesFromText(text) {
    const dates = {};
    
    // Look for birth/death date patterns
    const birthMatch = text.match(/(?:born|birth)[^\\d]*(\\d{4})/i);
    const deathMatch = text.match(/(?:died|death)[^\\d]*(\\d{4})/i);
    
    if (birthMatch) dates.birth = birthMatch[1];
    if (deathMatch) dates.death = deathMatch[1];
    
    return dates;
  }

  getRelationshipType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('married')) return 'spouse';
    if (lower.includes('son') || lower.includes('daughter')) return 'child';
    if (lower.includes('father') || lower.includes('mother')) return 'parent';
    return 'unknown';
  }

  generateTitleFromFilename(filename) {
    return path.basename(filename, path.extname(filename))
      .replace(/[_-]/g, ' ')
      .replace(/\\b\\w/g, l => l.toUpperCase());
  }

  extractTagsFromFilename(filename) {
    const tags = [];
    const name = filename.toLowerCase();
    
    if (name.includes('wedding')) tags.push('wedding');
    if (name.includes('family')) tags.push('family');
    if (name.includes('grave')) tags.push('cemetery');
    if (name.includes('house')) tags.push('residence');
    
    return tags;
  }

  printStatistics() {
    console.log('\\n📊 Processing Statistics:');
    console.log(`   👥 People: ${this.people.length}`);
    console.log(`   👨‍👩‍👧‍👦 Families: ${Object.keys(this.families).length}`);
    console.log(`   🔗 Relationships: ${this.relationships.length}`);
    console.log(`   🖼️  Media Items: ${this.media.length}`);
  }
}

// Run the processor
if (require.main === module) {
  const processor = new GenealogyDataProcessor();
  processor.processAll().catch(console.error);
}

module.exports = GenealogyDataProcessor;