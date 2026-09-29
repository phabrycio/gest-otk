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
  const mainMin = await fetchUrl('https://retail.teknisa.com/login/bower_components/zeedhi-frontend/assets/dist/main.min.js?v=5.1.25');
  console.log('--- main.min.js length ---', mainMin.data.length);
  // Procurar por requestDataSourceEngine ou getDataSource
  const idx = mainMin.data.indexOf('getDataSource=function');
  if (idx !== -1) {
    console.log('--- getDataSource definition ---');
    console.log(mainMin.data.slice(idx, idx + 1000));
  } else {
    const idx2 = mainMin.data.indexOf('getDataSource');
    console.log('first getDataSource at:', idx2);
    console.log(mainMin.data.slice(idx2, idx2 + 500));
  }
}

run();
