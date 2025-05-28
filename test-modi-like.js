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

async function testModiLike() {
    const modiId = '68309f9ff2ba032b6d61deee'; // Modi's actual ID
    console.log('🎯 Testing like for Narendra Modi');
    console.log('📋 Candidate ID:', modiId);

    try {
        // Get current stats
        console.log('\n1. Getting current stats...');
        const statsOptions = {
            hostname: 'localhost',
            port: 1322,
            path: `/api/feedback/stats/${modiId}`,
            method: 'GET',
        };

        const currentStats = await makeRequest(statsOptions);
        console.log('📊 Current stats:', currentStats);

        // Send a like
        console.log('\n2. Sending a like to Modi...');
        const likeOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/like',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const likeData = JSON.stringify({ candidateId: modiId });
        const likeResult = await makeRequest(likeOptions, likeData);
        console.log('👍 Like result:', likeResult);

        // Get updated stats
        console.log('\n3. Getting updated stats...');
        const updatedStats = await makeRequest(statsOptions);
        console.log('📊 Updated stats:', updatedStats);

        console.log('\n✅ Modi like test completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testModiLike(); 