const fs = require('fs');
try {
    let content = fs.readFileSync('website/store.html', 'utf8');

    // Replace the problematic checkout fetch
    const oldFetchRegex = /const host = window\.location\.hostname;[\s\S]*?const response = await fetch\(`\$\{API_BASE\}\/api\/orders`, \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ items: cart, total \}\)\s*\}\);/;

    const newFetch = `const host = window.location.hostname;
                const port = window.location.port;
                
                let fetchUrl = '/api/orders';
                // If running on Live Server port 5500, 5501, 5502, route API to port 3000
                if (port.startsWith('550')) {
                    fetchUrl = \`http://\${host}:3000/api/orders\`;
                } else if (host === '127.0.0.1' || host === 'localhost') {
                     // If already on 3000, use relative path to avoid CORS issues
                    fetchUrl = '/api/orders';
                }

                const response = await fetch(fetchUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart, total })
                });`;

    if (content.match(oldFetchRegex)) {
        content = content.replace(oldFetchRegex, newFetch);
        fs.writeFileSync('website/store.html', content, 'utf8');
        console.log("Successfully fixed checkout fetch logic!");
    } else {
        console.log("Could not find the target code to replace.");
    }
} catch (error) {
    console.error("Failed to fix store.html checkout logic:", error);
}
