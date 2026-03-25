async function api(path, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`http://localhost:5000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function runTests() {
  try {
    console.log('1. Registering Host...');
    let hostRes;
    try {
      hostRes = await api('/auth/register', 'POST', { name: 'Host', email: 'host@quickpass.com', password: 'pass', role: 'host' });
    } catch(e) {
      hostRes = await api('/auth/login', 'POST', { email: 'host@quickpass.com', password: 'pass' });
    }
    const hostToken = hostRes.token;
    console.log('Host connected! Token established.');

    console.log('2. Creating Visitor Pass...');
    const visitorRes = await api('/visitor/create', 'POST', {
      visitorName: 'John Doe',
      phone: '1234567890',
      purpose: 'Meeting',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    }, hostToken);
    
    const qrToken = visitorRes.qrToken;
    const visitorId = visitorRes.visitor._id;
    console.log('Visitor Pass created! QR Token:', qrToken.slice(0, 20) + '...');

    console.log('3. Registering Security & Validating QR...');
    let secRes;
    try {
      secRes = await api('/auth/register', 'POST', { name: 'Guard', email: 'guard@quickpass.com', password: 'pass', role: 'security' });
    } catch(e) {
      secRes = await api('/auth/login', 'POST', { email: 'guard@quickpass.com', password: 'pass' });
    }
    const secToken = secRes.token;
    
    const validateRes = await api('/scan/validate', 'POST', { qrToken }, secToken);
    console.log('Validation Result:', validateRes.isValid ? 'Valid' : 'Invalid');

    if(validateRes.isValid) {
      console.log('4. Marking Entry...');
      await api('/scan/entry', 'POST', { visitorId }, secToken);
      
      console.log('5. Marking Exit...');
      await api('/scan/exit', 'POST', { visitorId }, secToken);
      console.log('Entry & Exit Marked!');
    }

    console.log('6. Registering Admin & Fetching Logs...');
    let adminRes;
    try {
      adminRes = await api('/auth/register', 'POST', { name: 'Admin', email: 'admin@quickpass.com', password: 'pass', role: 'admin' });
    } catch(e) {
      adminRes = await api('/auth/login', 'POST', { email: 'admin@quickpass.com', password: 'pass' });
    }
    const adminToken = adminRes.token;
    const logsRes = await api('/admin/logs', 'GET', null, adminToken);
    
    console.log('Logs Data Analytics:', JSON.stringify(logsRes.analytics));
    console.log('Successfully completed E2E verification!');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();
