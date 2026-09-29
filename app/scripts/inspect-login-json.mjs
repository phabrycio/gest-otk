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
  const meta = await fetchUrl('https://retail.teknisa.com/login/assets/json/datasources/login.json');
  console.log('--- login.json status ---', meta.status);
  console.log(meta.data.slice(0, 1500));
}

run();
