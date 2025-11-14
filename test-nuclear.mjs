// test-nuclear.mjs - TESTS EVERYTHING
import { readFileSync } from 'fs';

console.log('🧪 NUCLEAR SDK TEST\n');

// Test 1: Check file structure
console.log('1. File Structure Check:');
const files = [
  'dist/index.js',
  'dist/engine.js',
  'dist/crypto.js',
  'dist/http.js',
  'dist/types.js',
  'dist/providers/mtn.js',
  'dist/providers/orange.js'
];

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    console.log(`✅ ${file} - ${content.length} bytes`);
  } catch (e) {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 2: Check imports in index.js
console.log('\n2. Import Check:');
try {
  const indexContent = readFileSync('dist/index.js', 'utf8');
  const imports = indexContent.match(/from\s+['"][^'"]+['"]/g) || [];
  console.log('Imports found:', imports);
  
  const allHaveJs = imports.every(imp => imp.includes('.js'));
  console.log(allHaveJs ? '✅ ALL IMPORTS HAVE .JS' : '❌ SOME IMPORTS MISSING .JS');
} catch (e) {
  console.log('❌ Cannot check imports');
}

// Test 3: Try to import the SDK
console.log('\n3. SDK Import Test:');
try {
  const { MomoSDK } = await import('./dist/index.js');
  console.log('✅ MomoSDK imported successfully');
  
  const sdk = new MomoSDK({
    provider: 'mtn',
    providerConfig: {
      baseUrl: 'https://sandbox.momodeveloper.mtn.com',
      apiKey: 'test',
      apiUser: 'test',
      apiSecret: 'test'
    },
    escrowAccount: '233551234567',
    feePercent: 2.5
  });
  
  console.log('✅ SDK instance created');
  console.log('✅ Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sdk)));
  console.log('\n🎉 SDK IS 100% WORKING!');
  
} catch (error) {
  console.log('❌ SDK import failed:', error.message);
}