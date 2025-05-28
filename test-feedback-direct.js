const http = require('http');

function testEndpoint(path, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 1322,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        console.log(`\n🔍 Testing ${method} ${path}`);
        if (data) {
            console.log('📤 Sending data:', data);
        }

        const req = http.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode}`);
            
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    console.log('📥 Response:', result);
                    resolve(result);
                } catch (e) {
                    console.log('📥 Raw response:', body);
                    resolve(body);
                }
            });
        });

        req.on('error', (err) => {
            console.error('❌ Request error:', err.message);
            reject(err);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function runTests() {
    const candidateId = '682d6e4f75e618c3c876cee2'; // Real candidate ID
    
    console.log('🧪 Testing Feedback API Endpoints');
    console.log('🎯 Candidate ID:', candidateId);

    try {
        // Test 1: Get stats
        await testEndpoint(`/api/feedback/stats/${candidateId}`, 'GET');

        // Test 2: Send dislike
        const dislikeData = JSON.stringify({ candidateId: candidateId });
        await testEndpoint('/api/feedback/dislike', 'POST', dislikeData);

        // Test 3: Send like
        const likeData = JSON.stringify({ candidateId: candidateId });
        await testEndpoint('/api/feedback/like', 'POST', likeData);

        // Test 4: Get final stats
        await testEndpoint(`/api/feedback/stats/${candidateId}`, 'GET');

        console.log('\n✅ All tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

runTests(); 