const fs = require('fs');
try {
    let content = fs.readFileSync('website/ride-booking-1.html', 'utf8');

    const oldFetchRegex = /const host = window\.location\.hostname;[\s\S]*?const API_BASE = \(host === '127\.0\.0\.1' \|\| host === 'localhost'\) \? 'http:\/\/' \+ host \+ ':3000' : '';[\s\S]*?const response = await fetch\(`\$\{API_BASE\}\/api\/rides`, \{/;

    const newFetch = `const host = window.location.hostname;
                const port = window.location.port;
                
                let fetchUrl = '/api/rides';
                if (port.startsWith('550')) {
                    fetchUrl = \`http://\${host}:3000/api/rides\`;
                } else if (host === '127.0.0.1' || host === 'localhost') {
                    fetchUrl = '/api/rides';
                }

                const response = await fetch(fetchUrl, {`;

    if (content.match(oldFetchRegex)) {
        content = content.replace(oldFetchRegex, newFetch);
        fs.writeFileSync('website/ride-booking-1.html', content, 'utf8');
        console.log("Successfully fixed ride booking fetch logic!");
    } else {
        console.log("Could not find the target code in ride-booking-1.html.");
    }
} catch (error) {
    console.error("Error fixing ride booking:", error);
}
