import https from 'https';

function fetchUrl(url, cookie) {
  return new Promise((resolve, reject) => {
    const headers = cookie ? { Cookie: cookie } : {};
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  const init = await fetchUrl('https://retail.teknisa.com/login/');
  const cookies = init.headers['set-cookie'] || [];
  const phpSess = cookies.map(c => c.split(';')[0]).join('; ');
  console.log('Session Cookie:', phpSess);

  const tokenRes = await fetchUrl('https://retail.teknisa.com/backend/index.php?action=getAntiCSRFToken', phpSess);
  console.log('--- AntiCSRF status ---', tokenRes.status);
  console.log('--- AntiCSRF body ---', tokenRes.data);
}

run();
