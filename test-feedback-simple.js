const http = require('http');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function testFeedbackAPI() {
    const candidateId = '682d6e4f75e618c3c876cee2';
    console.log('🧪 Testing Feedback API with candidate ID:', candidateId);

    try {
        // Test dislike endpoint
        console.log('\n1. Testing dislike endpoint...');
        const dislikeOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/dislike',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const dislikeData = JSON.stringify({ candidateId: candidateId });
        const dislikeResult = await makeRequest(dislikeOptions, dislikeData);
        console.log('Dislike result:', dislikeResult);

        // Test like endpoint
        console.log('\n2. Testing like endpoint...');
        const likeOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/like',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const likeData = JSON.stringify({ candidateId: candidateId });
        const likeResult = await makeRequest(likeOptions, likeData);
        console.log('Like result:', likeResult);

        // Test stats endpoint
        console.log('\n3. Testing stats endpoint...');
        const statsOptions = {
            hostname: 'localhost',
            port: 1322,
            path: `/api/feedback/stats/${candidateId}`,
            method: 'GET',
        };

        const statsResult = await makeRequest(statsOptions);
        console.log('Stats result:', statsResult);

        console.log('\n✅ All tests completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFeedbackAPI(); 