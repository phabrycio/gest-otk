const https = require('https');

https.get('https://retail.teknisa.com/login/', (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    const scripts = [];
    const regex = /src=["']([^"']+)["']/g;
    let m;
    while ((m = regex.exec(body)) !== null) {
      scripts.push(m[1]);
    }
    console.log('SCRIPTS FOUND:');
    scripts.forEach((s) => console.log(' -', s));
  });
}).on('error', (e) => console.error(e));
