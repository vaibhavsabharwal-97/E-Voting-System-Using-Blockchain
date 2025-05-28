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

async function testFeedbackValidation() {
    console.log('🧪 Testing Feedback System with User/Election Validation\n');

    // Test data
    const candidateId = '68309f9ff2ba032b6d61deee'; // Modi's ID
    const userId = '507f1f77bcf86cd799439011'; // Example user ID
    const electionId = '507f1f77bcf86cd799439012'; // Example election ID

    try {
        // Test 1: Try to give feedback without required fields
        console.log('1. Testing feedback without user ID...');
        const noUserOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/like',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        const noUserData = JSON.stringify({ candidateId });
        const noUserResult = await makeRequest(noUserOptions, noUserData);
        console.log('Result:', noUserResult);

        // Test 2: Try to give feedback with all required fields
        console.log('\n2. Testing feedback with all required fields...');
        const validOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/like',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        const validData = JSON.stringify({ candidateId, userId, electionId });
        const validResult = await makeRequest(validOptions, validData);
        console.log('Result:', validResult);

        // Test 3: Try to give feedback again (should fail)
        console.log('\n3. Testing duplicate feedback (should fail)...');
        const duplicateResult = await makeRequest(validOptions, validData);
        console.log('Result:', duplicateResult);

        // Test 4: Try to give different feedback type (should also fail)
        console.log('\n4. Testing different feedback type for same user/candidate/election...');
        const dislikeOptions = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/feedback/dislike',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        const dislikeResult = await makeRequest(dislikeOptions, validData);
        console.log('Result:', dislikeResult);

        // Test 5: Check user's feedback for the election
        console.log('\n5. Checking user feedback for election...');
        const userFeedbackOptions = {
            hostname: 'localhost',
            port: 1322,
            path: `/api/feedback/user/${userId}/election/${electionId}`,
            method: 'GET'
        };
        const userFeedbackResult = await makeRequest(userFeedbackOptions);
        console.log('Result:', userFeedbackResult);

        console.log('\n✅ All validation tests completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFeedbackValidation(); 