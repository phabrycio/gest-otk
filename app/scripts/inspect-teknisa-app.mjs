import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  const loginApp = await fetchUrl('https://retail.teknisa.com/login/assets/js/app.min.js?v=5.1.25');
  console.log('--- app.min.js length ---', loginApp.data.length);
  // Procurar por autenticação ou serviço de login
  const matchAuth = loginApp.data.match(/serviceUrl[^;]+;/g);
  console.log('serviceUrl matches:', matchAuth);
  
  // Buscar rotas e chamadas POST/services
  const regex = /["'](\/[^"']+|backend\/[^"']+)["']/g;
  let m;
  const paths = new Set();
  while ((m = regex.exec(loginApp.data)) !== null) {
    if (m[1].includes('login') || m[1].includes('auth') || m[1].includes('backend') || m[1].includes('user') || m[1].includes('service')) {
      paths.add(m[1]);
    }
  }
  console.log('Interesting paths in app.min.js:');
  Array.from(paths).slice(0, 30).forEach(p => console.log('  ', p));
}

run();
