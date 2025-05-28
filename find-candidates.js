const http = require('http');

function getCandidates() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 1322,
            path: '/api/auth/candidates',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

async function findCandidates() {
    try {
        console.log('🔍 Finding all candidates...\n');
        const candidates = await getCandidates();
        
        console.log(`Found ${candidates.length} candidates:\n`);
        
        candidates.forEach((candidate, index) => {
            console.log(`${index + 1}. ${candidate.firstName} ${candidate.lastName}`);
            console.log(`   ID: ${candidate._id}`);
            console.log(`   Username: ${candidate.username}`);
            console.log(`   Party: ${candidate.partyName}`);
            console.log(`   Likes: ${candidate.likes || 0}`);
            console.log(`   Dislikes: ${candidate.dislikes || 0}`);
            console.log('');
        });
        
        // Look for Modi specifically
        const modi = candidates.find(c => 
            c.firstName.toLowerCase().includes('modi') || 
            c.lastName.toLowerCase().includes('modi') ||
            c.firstName.toLowerCase().includes('narendra')
        );
        
        if (modi) {
            console.log('🎯 Found Modi:');
            console.log(`   Name: ${modi.firstName} ${modi.lastName}`);
            console.log(`   ID: ${modi._id}`);
            console.log(`   Current Likes: ${modi.likes || 0}`);
            console.log(`   Current Dislikes: ${modi.dislikes || 0}`);
        } else {
            console.log('❌ Modi not found in candidates');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

findCandidates(); 