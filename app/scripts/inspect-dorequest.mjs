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
  const idx = main.data.indexOf('function _doRequest(');
  console.log('--- _doRequest index ---', idx);
  console.log(main.data.slice(idx, idx + 2500));
}

run();
