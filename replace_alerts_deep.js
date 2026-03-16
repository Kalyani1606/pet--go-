const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. First, handle specific patterns that we missed or want to prioritize
    
    // Pattern: alert(data.error || '...')
    content = content.replace(/alert\(data\.error\s*\|\|\s*(['"])(.*?)\1\)/g, "showNotification(data.error || '$2', 'error')");
    
    // Pattern: alert('✅ ...')
    content = content.replace(/alert\((['"])✅\s*(.*?)\1\)/g, "showNotification('$2', 'success')");
    
    // Pattern: alert('❌ ...')
    content = content.replace(/alert\((['"])❌\s*(.*?)\1\)/g, "showNotification('$2', 'error')");

    // 2. Generic static strings that were missed
    const staticAlertRegex = /alert\((['"])(.*?)\1\)/g;
    content = content.replace(staticAlertRegex, (match, quote, message) => {
        let type = 'info';
        const msgLower = message.toLowerCase();
        if (msgLower.includes('success') || msgLower.includes('thank') || msgLower.includes('welcome')) type = 'success';
        if (msgLower.includes('error') || msgLower.includes('fail') || msgLower.includes('connect')) type = 'error';
        return `showNotification(${quote}${message}${quote}, '${type}')`;
    });

    // 3. Any remaining alerts with variables
    content = content.replace(/alert\((?![ '"])(.*?)\)/g, "showNotification($1, 'info')");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Deep processed ${file}`);
});
