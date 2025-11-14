// fix-extensions.mjs - COMPLETE VERSION
import fs from 'fs/promises';
import path from 'path';

async function fixFileExtensions(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // FIX 1: Regular imports without extensions
    content = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
      if (p2.includes('.js') || p2.includes('.ts') || p2.includes('.mjs')) {
        return match;
      }
      return `${p1}${p2}.js${p3}`;
    });
    
    // FIX 2: Export statements
    content = content.replace(/(export\s*\*\s*from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
      if (p2.includes('.js') || p2.includes('.ts') || p2.includes('.mjs')) {
        return match;
      }
      return `${p1}${p2}.js${p3}`;
    });
    
    // FIX 3: Special case - providers directory imports
    content = content.replace(/from\s+['"]\.\/providers['"]/g, 'from "./providers/index.js"');
    content = content.replace(/from\s+['"]\.\.\/providers['"]/g, 'from "../providers/index.js"');
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✅ Fixed extensions in: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Fixing import extensions...');
  
  const filesToFix = [
    'dist/index.js',
    'dist/engine.js',
    'dist/crypto.js',
    'dist/http.js',
    'dist/types.js',
    'dist/providers/index.js',
    'dist/providers/base.js',
    'dist/providers/mtn.js',
    'dist/providers/orange.js'
  ];

  for (const file of filesToFix) {
    await fixFileExtensions(file);
  }
  
  console.log('🎉 Import fixing completed!');
}

main().catch(console.error);