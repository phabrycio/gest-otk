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
  const p = await fetchUrl('https://retail.teknisa.com/login/assets/json/project.json');
  console.log('--- project.json status ---', p.status);
  console.log(p.data.slice(0, 2000));
}

run();
