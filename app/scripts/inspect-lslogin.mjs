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
  console.log('--- LSLoginService.login body ---');
  console.log(loginApp.data.slice(4500, 6000));
}

run();
