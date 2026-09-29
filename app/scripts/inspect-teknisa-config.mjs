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
  const config = await fetchUrl('https://retail.teknisa.com/config/Config.min.js?v=5.1.25');
  console.log('--- Config.min.js ---');
  console.log(config.data.slice(0, 1500));

  const env = await fetchUrl('https://retail.teknisa.com/assets/js/environment.min.js?v=5.1.25');
  console.log('--- environment.min.js ---');
  console.log(env.data.slice(0, 1500));
}

run();
