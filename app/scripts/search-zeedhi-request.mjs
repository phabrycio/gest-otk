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
  const main = await fetchUrl('https://retail.teknisa.com/login/bower_components/zeedhi-frontend/assets/dist/main.min.js?v=5.1.25');
  // Buscar a string onde ele faz a requisição no backend index.php
  let idx = 0;
  while ((idx = main.data.indexOf('serviceUrl', idx)) !== -1) {
    console.log(`=== serviceUrl at ${idx} ===`);
    console.log(main.data.slice(Math.max(0, idx - 50), Math.min(main.data.length, idx + 250)));
    idx += 50;
    if (idx > 100000) break;
  }
}

run();
