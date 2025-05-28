const http = require('http');

// Test basic server connectivity
const options = {
    hostname: 'localhost',
    port: 1322,
    path: '/api/auth/candidates',
    method: 'GET'
};

console.log('Testing basic server connectivity...');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('Response received, length:', body.length);
        if (body.length > 0) {
            try {
                const data = JSON.parse(body);
                console.log('First candidate:', data[0]);
            } catch (e) {
                console.log('Raw response:', body.substring(0, 200));
            }
        }
    });
});

req.on('error', (err) => {
    console.error('Request error:', err.message);
});

req.end(); 