const fs = require('fs');
try {
    let content = fs.readFileSync('website/store.html', 'utf8');

    // Replace the problematic checkout fetch
    const oldFetch = `                const host = window.location.hostname;
                const API_BASE = (host === '127.0.0.1' || host === 'localhost') ? 'http://' + host + ':3000' : '';
                const response = await fetch(\`\${API_BASE}/api/orders\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart, total })
                });`;

    const newFetch = `                const host = window.location.hostname;
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

    content = content.replace(oldFetch, newFetch);
    fs.writeFileSync('website/store.html', content, 'utf8');
    console.log("Successfully fixed checkout fetch logic");
} catch (error) {
    console.error("Failed to fix store.html checkout logic:", error);
}
