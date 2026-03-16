const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Super aggressive replacement of alert( anything )
    // We'll use a regex that finds alert followed by anything until the matching closing brace
    // This is simple but usually works for basic alerts.
    
    content = content.replace(/alert\(([\s\S]*?)\)/g, (match, inner) => {
        let type = 'info';
        const innerLower = inner.toLowerCase();
        
        if (innerLower.includes('success') || innerLower.includes('thank') || innerLower.includes('welcome') || innerLower.includes('✅')) {
            type = 'success';
        } else if (innerLower.includes('error') || innerLower.includes('fail') || innerLower.includes('❌') || innerLower.includes('connect')) {
            type = 'error';
        }

        // Clean up the inner message if it has ✅ or ❌ emojis at the start of a string
        let cleanedInner = inner.replace(/['"]✅\s*/g, "'").replace(/['"]❌\s*/g, "'");
        
        return `showNotification(${cleanedInner}, '${type}')`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Aggressively processed ${file}`);
});
