const http = require('http');
const BASE_URL = 'http://localhost:5000';

async function testPlatform() {
  console.log('=== STRONGWILL SPORTS PLATFORM TEST REPORT ===\n');
  
  const results = {
    performance: {},
    functionality: {},
    api: {},
    issues: []
  };

  // Performance test function
  function performanceTest(url, name) {
    return new Promise((resolve) => {
      const start = Date.now();
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loadTime = Date.now() - start;
          results.performance[name] = {
            status: res.statusCode,
            loadTime: loadTime,
            contentLength: data.length,
            rating: loadTime < 1000 ? 'EXCELLENT' : loadTime < 2000 ? 'GOOD' : loadTime < 5000 ? 'FAIR' : 'POOR'
          };
          resolve();
        });
      });
      req.on('error', (err) => {
        results.performance[name] = { error: err.message };
        results.issues.push(`Performance: ${name} failed - ${err.message}`);
        resolve();
      });
      req.setTimeout(10000, () => {
        results.performance[name] = { error: 'Timeout > 10s' };
        results.issues.push(`Performance: ${name} timeout`);
        req.destroy();
        resolve();
      });
    });
  }

  // API test function
  function testAPI(endpoint) {
    return new Promise((resolve) => {
      const req = http.get(`${BASE_URL}${endpoint}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const isWorking = res.statusCode < 500;
          results.api[endpoint] = {
            status: res.statusCode,
            working: isWorking,
            responseSize: data.length
          };
          if (!isWorking) {
            results.issues.push(`API: ${endpoint} returned ${res.statusCode}`);
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        results.api[endpoint] = { error: err.message, working: false };
        results.issues.push(`API: ${endpoint} failed - ${err.message}`);
        resolve();
      });
      req.setTimeout(5000, () => {
        results.api[endpoint] = { error: 'Timeout', working: false };
        results.issues.push(`API: ${endpoint} timeout`);
        req.destroy();
        resolve();
      });
    });
  }

  console.log('1. PERFORMANCE TESTING');
  console.log('=======================');
  
  const pages = [
    { url: `${BASE_URL}/`, name: 'Homepage' },
    { url: `${BASE_URL}/products`, name: 'Products' },
    { url: `${BASE_URL}/design-tool`, name: 'Design Tool' },
    { url: `${BASE_URL}/group-orders`, name: 'Group Orders' },
    { url: `${BASE_URL}/sponsorship`, name: 'Sponsorship' },
    { url: `${BASE_URL}/login`, name: 'Login' },
    { url: `${BASE_URL}/register`, name: 'Registration' }
  ];
  
  for (const page of pages) {
    await performanceTest(page.url, page.name);
    const result = results.performance[page.name];
    if (result.error) {
      console.log(`❌ ${page.name}: ERROR - ${result.error}`);
    } else {
      console.log(`✅ ${page.name}: ${result.loadTime}ms (${result.rating}) - Status: ${result.status}`);
    }
  }

  console.log('\n2. API ENDPOINT TESTING');
  console.log('========================');
  
  const endpoints = [
    '/api/auth/me',
    '/api/categories', 
    '/api/products',
    '/api/group-orders',
    '/api/sponsorship/seeker-profiles',
    '/api/sponsorship/sponsor-profiles',
    '/api/sponsorship/agreements',
    '/api/orders',
    '/api/cart'
  ];
  
  for (const endpoint of endpoints) {
    await testAPI(endpoint);
    const result = results.api[endpoint];
    if (result.error) {
      console.log(`❌ ${endpoint}: ERROR - ${result.error}`);
    } else {
      const status = result.working ? '✅ WORKING' : '❌ FAILED';
      console.log(`${status} ${endpoint}: Status ${result.status} (${result.responseSize} bytes)`);
    }
  }

  console.log('\n3. FUNCTIONAL ANALYSIS');
  console.log('=======================');
  
  // Analyze functionality based on API responses
  const workingAPIs = Object.values(results.api).filter(r => r.working).length;
  const totalAPIs = Object.keys(results.api).length;
  const workingPages = Object.values(results.performance).filter(r => !r.error && r.status === 200).length;
  const totalPages = Object.keys(results.performance).length;
  
  console.log(`Pages Loading: ${workingPages}/${totalPages} (${Math.round(workingPages/totalPages*100)}%)`);
  console.log(`API Endpoints: ${workingAPIs}/${totalAPIs} (${Math.round(workingAPIs/totalAPIs*100)}%)`);
  
  // Performance summary
  const avgLoadTime = Object.values(results.performance)
    .filter(r => !r.error)
    .reduce((sum, r) => sum + r.loadTime, 0) / workingPages;
  
  console.log(`Average Load Time: ${Math.round(avgLoadTime)}ms`);

  console.log('\n4. ISSUES FOUND');
  console.log('===============');
  if (results.issues.length === 0) {
    console.log('✅ No critical issues detected');
  } else {
    results.issues.forEach(issue => console.log(`❌ ${issue}`));
  }

  console.log('\n5. RECOMMENDATIONS');
  console.log('===================');
  
  if (avgLoadTime > 2000) {
    console.log('⚠️  Consider optimizing page load times (currently > 2s average)');
  }
  if (workingAPIs < totalAPIs) {
    console.log('⚠️  Some API endpoints are not responding correctly');
  }
  if (workingPages < totalPages) {
    console.log('⚠️  Some pages are not loading correctly');
  }
  
  console.log('\n6. OVERALL PLATFORM HEALTH');
  console.log('===========================');
  const overallScore = Math.round(((workingPages/totalPages) + (workingAPIs/totalAPIs)) / 2 * 100);
  
  if (overallScore >= 90) {
    console.log(`🟢 EXCELLENT (${overallScore}%) - Platform is performing well`);
  } else if (overallScore >= 75) {
    console.log(`🟡 GOOD (${overallScore}%) - Minor issues detected`);
  } else if (overallScore >= 50) {
    console.log(`🟠 FAIR (${overallScore}%) - Several issues need attention`);
  } else {
    console.log(`🔴 POOR (${overallScore}%) - Critical issues require immediate attention`);
  }

  return results;
}

testPlatform().catch(console.error);
