const https = require('https');
https.get('https://www.google.com/maps/search/D-Watson+Chemist+F-10+Markaz+Islamabad', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => {
    let match = data.match(/1m18[^\"]+/g);
    if (match) console.log(match[0]);
    else console.log('no match');
  });
}).on('error', (e) => console.error(e));
