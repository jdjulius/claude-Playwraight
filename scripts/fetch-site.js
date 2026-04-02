const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  const result = await fetchUrl('https://dev.paisabombas.app');
  console.log('STATUS:', result.status);
  console.log('CONTENT-TYPE:', result.headers['content-type']);
  console.log('HTML (first 5000):');
  console.log(result.body.substring(0, 5000));
}

main().catch(console.error);
