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
  console.log('--- REST ENGINE REQUEST DEFINITION ---');
  console.log(main.data.slice(2250000, 2253000));
}

run();
