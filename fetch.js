const http = require('http');

http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            console.log(bodyMatch[1].substring(0, 3000));
        } else {
            console.log("No body found:", data.substring(0, 500));
        }
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
