// Comprehensive Testing Script for Strongwill Sports Platform
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5000';
const results = {
  performance: {},
  functionality: {},
  api: {},
  issues: []
};

// Performance testing function
function performanceTest(url, name) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const end = Date.now();
        const loadTime = end - start;
        results.performance[name] = {
          status: res.statusCode,
          loadTime: loadTime,
          contentLength: data.length,
          performance: loadTime < 2000 ? 'GOOD' : loadTime < 5000 ? 'FAIR' : 'POOR'
        };
        resolve();
      });
    });
    req.on('error', (err) => {
      results.performance[name] = { error: err.message };
      resolve();
    });
    req.setTimeout(10000, () => {
      results.performance[name] = { error: 'Timeout' };
      req.destroy();
      resolve();
    });
  });
}

// API endpoint testing
function testAPI(endpoint, method = 'GET') {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint}`;
    const req = http.request(url, { method }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        results.api[endpoint] = {
          status: res.statusCode,
          method: method,
          responseSize: data.length,
          working: res.statusCode < 500
        };
        resolve();
      });
    });
    req.on('error', (err) => {
      results.api[endpoint] = { error: err.message, working: false };
      resolve();
    });
    req.setTimeout(5000, () => {
      results.api[endpoint] = { error: 'Timeout', working: false };
      req.destroy();
      resolve();
    });
    req.end();
  });
}

async function runTests() {
  console.log('Starting comprehensive testing...\n');
  
  // Performance Tests
  console.log('1. PERFORMANCE TESTING');
  console.log('======================');
  
  const performanceTests = [
    { url: `${BASE_URL}/`, name: 'Homepage' },
    { url: `${BASE_URL}/products`, name: 'Products Page' },
    { url: `${BASE_URL}/design-tool`, name: 'Design Tool' },
    { url: `${BASE_URL}/group-orders`, name: 'Group Orders' },
    { url: `${BASE_URL}/sponsorship`, name: 'Sponsorship Page' }
  ];
  
  for (const test of performanceTests) {
    await performanceTest(test.url, test.name);
    console.log(`${test.name}: ${results.performance[test.name].loadTime || 'ERROR'}ms - ${results.performance[test.name].performance || 'FAILED'}`);
  }
  
  // API Tests
  console.log('\n2. API FUNCTIONALITY TESTING');
  console.log('=============================');
  
  const apiTests = [
    '/api/auth/me',
    '/api/categories',
    '/api/products',
    '/api/group-orders',
    '/api/sponsorship/seeker-profiles',
    '/api/sponsorship/sponsor-profiles',
    '/api/sponsorship/agreements'
  ];
  
  for (const endpoint of apiTests) {
    await testAPI(endpoint);
    const result = results.api[endpoint];
    console.log(`${endpoint}: ${result.status || 'ERROR'} - ${result.working ? 'WORKING' : 'FAILED'}`);
  }
  
  // Generate Report
  console.log('\n3. DETAILED RESULTS');
  console.log('===================');
  console.log(JSON.stringify(results, null, 2));
}

runTests().catch(console.error);
