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
  // Procurar onde ele faz $http.post ou Zeedhi service call
  const terms = ['authenticate', 'login', 'serviceUrl', 'password', 'usuario', 'senha'];
  terms.forEach(t => {
    let idx = 0;
    while ((idx = loginApp.data.indexOf(t, idx)) !== -1) {
      console.log(`=== MATCH "${t}" at ${idx} ===`);
      console.log(loginApp.data.slice(Math.max(0, idx - 80), Math.min(loginApp.data.length, idx + 150)));
      idx += t.length + 50;
      if (idx > 20000) break; // limite
    }
  });
}

run();
