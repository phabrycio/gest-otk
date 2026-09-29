import https from 'https';

function postJson(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const req = https.request(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Content-Length': Buffer.byteLength(body),
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://retail.teknisa.com',
          'Referer': 'https://retail.teknisa.com/login/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...headers,
        },
      },
      (res) => {
        let respBody = '';
        res.on('data', (c) => (respBody += c));
        res.on('end', () =>
          resolve({ status: res.statusCode, headers: res.headers, body: respBody })
        );
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const user = 'gestor.mns@engenhocorp.com';
  const rawPass = '702007';
  const passCript = 'LOGIN_CRIPT_TEK_' + Buffer.from(rawPass).toString('base64');

  // Payload padrão do Zeedhi / Teknisa
  const payload = {
    action: 'getDataSource',
    dataSource: 'login#/login',
    filter: [
      { name: 'EMAIL', operator: '=', value: user },
      { name: 'PASSWORD', operator: '=', value: passCript },
      { name: 'PRODUCT_ID', operator: '=', value: 1776 },
      { name: 'REQUESTER_URL', operator: '=', value: 'https://retail.teknisa.com/login/#/login#authentication' },
      { name: 'ATTEMPTS', operator: '=', value: 1 },
      { name: 'SHOW_FULL_OPERATOR', operator: '=', value: true },
      { name: 'HASH', operator: '=', value: 'hash_test_node_' + Date.now() },
      { name: 'SESSION_CHANGE', operator: '=', value: false },
      { name: 'KEEP_CONNECTED', operator: '=', value: 'N' },
      { name: 'RC_URL', operator: '=', value: null },
      { name: 'URL', operator: '=', value: 'https://retail.teknisa.com/login/#/login#authentication' },
      { name: 'NRORGOPER', operator: '=', value: null },
      { name: 'USE_ACCESS_TIME_CONTROL', operator: '=', value: true },
      { name: 'STYLE', operator: '=', value: 'inflightor' },
      { name: 'ACCESS_KEY', operator: '=', value: null },
      { name: 'TYPE_LOGIN', operator: '=', value: 'P' },
      { name: 'TYPE_AUTHENTICATOR', operator: '=', value: null },
      { name: 'LANGUAGE', operator: '=', value: 'pt_br' },
    ],
  };

  console.log('Sending login POST to https://retail.teknisa.com/backend/index.php ...');
  const res = await postJson('https://retail.teknisa.com/backend/index.php', payload);
  console.log('STATUS:', res.status);
  console.log('HEADERS:', res.headers);
  console.log('BODY:', res.body.slice(0, 3000));
}

run();
