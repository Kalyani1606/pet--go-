const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Inject notifications.js if not present
    if (!content.includes('notifications.js')) {
        content = content.replace('</head>', '    <script src="notifications.js"></script>\n</head>');
    }

    // 2. Replace alert calls
    // We try to detect the type based on keyword
    const alertRegex = /alert\((['"])(.*?)\1\)/g;
    
    content = content.replace(alertRegex, (match, quote, message) => {
        let type = 'info';
        const msgLower = message.toLowerCase();
        
        if (msgLower.includes('success') || msgLower.includes('thank') || msgLower.includes('welcome') || msgLower.includes('✅')) {
            type = 'success';
        } else if (msgLower.includes('error') || msgLower.includes('fail') || msgLower.includes('❌') || msgLower.includes('connect')) {
            type = 'error';
        } else if (msgLower.includes('please') || msgLower.includes('wait')) {
            type = 'info';
        }

        // Clean up emojis if they are already in the message (optional, but keep for now)
        return `showNotification(${quote}${message}${quote}, '${type}')`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
});
