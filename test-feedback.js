const fetch = require('node-fetch');

async function testFeedbackAPI() {
    const candidateId = '682d6e4f75e618c3c876cee2'; // Real candidate ID from your database
    const baseUrl = 'http://localhost:1322/api/feedback';

    console.log('🧪 Testing Feedback API...\n');

    try {
        // Test 1: Get initial stats
        console.log('1. Getting initial stats...');
        const statsResponse = await fetch(`${baseUrl}/stats/${candidateId}`);
        const initialStats = await statsResponse.json();
        console.log('Initial stats:', initialStats);

        // Test 2: Send a like
        console.log('\n2. Sending a like...');
        const likeResponse = await fetch(`${baseUrl}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ candidateId: candidateId }),
        });
        const likeResult = await likeResponse.json();
        console.log('Like result:', likeResult);

        // Test 3: Send a dislike
        console.log('\n3. Sending a dislike...');
        const dislikeResponse = await fetch(`${baseUrl}/dislike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ candidateId: candidateId }),
        });
        const dislikeResult = await dislikeResponse.json();
        console.log('Dislike result:', dislikeResult);

        // Test 4: Get final stats
        console.log('\n4. Getting final stats...');
        const finalStatsResponse = await fetch(`${baseUrl}/stats/${candidateId}`);
        const finalStats = await finalStatsResponse.json();
        console.log('Final stats:', finalStats);

        console.log('\n✅ All tests completed successfully!');

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

testFeedbackAPI(); 