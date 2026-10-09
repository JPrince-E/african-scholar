const http = require('http');

const testEndpoint = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting API Smoke Tests...');

  // 1. Health
  const health = await testEndpoint('/api/health');
  console.log('1. Health Check:', health.status === 200 ? '✅ PASSED' : '❌ FAILED');

  // 2. Public Directory
  const dir = await testEndpoint('/api/profiles/directory');
  console.log('2. Directory API:', dir.status === 200 && dir.data.scholars.length > 0 ? `✅ PASSED (${dir.data.total} scholars)` : '❌ FAILED');

  // 3. Awards List
  const awards = await testEndpoint('/api/awards');
  console.log('3. Awards API:', awards.status === 200 && awards.data.awards.length === 3 ? `✅ PASSED (${awards.data.awards.length} tiers)` : '❌ FAILED');

  // 4. Admin Login
  const login = await testEndpoint('/api/auth/login', 'POST', {
    email: 'admin@africanscholar.org',
    password: 'AdminPass123!'
  });
  console.log('4. Admin Login:', login.status === 200 && login.data.token ? '✅ PASSED' : '❌ FAILED');
  const adminToken = login.data?.token;

  // 5. Admin Analytics
  const analytics = await testEndpoint('/api/admin/analytics', 'GET', null, adminToken);
  console.log('5. Admin Analytics:', analytics.status === 200 && analytics.data.analytics.totalProfessors > 0 ? `✅ PASSED (${analytics.data.analytics.totalProfessors} professors mapped)` : '❌ FAILED');

  // 6. Admin Applications List
  const apps = await testEndpoint('/api/admin/applications', 'GET', null, adminToken);
  console.log('6. Applications List:', apps.status === 200 && apps.data.applications.length > 0 ? `✅ PASSED (${apps.data.applications.length} dossiers)` : '❌ FAILED');

  // 7. Active Sponsors
  const sponsors = await testEndpoint('/api/sponsors');
  console.log('7. Sponsors API:', sponsors.status === 200 && sponsors.data.sponsors.length > 0 ? `✅ PASSED (${sponsors.data.sponsors.length} active sponsors)` : '❌ FAILED');

  console.log('🎉 Smoke Test Completed Successfully!');
}

runTests().catch(console.error);
