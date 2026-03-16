const fs = require('fs');
const path = require('path');

const websiteDir = path.join(__dirname, 'website');
const files = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove the injected script block
    const scriptStartPos = content.indexOf('<script>\n        function handleAuthClick(e) {');
    if (scriptStartPos !== -1) {
        const scriptEndPos = content.indexOf('</script>\n</body>', scriptStartPos);
        if (scriptEndPos !== -1) {
            content = content.substring(0, scriptStartPos) + '</body>' + content.substring(scriptEndPos + '</script>\n</body>'.length);
        } else {
            const alternativeEnd = content.indexOf('</script>', scriptStartPos);
            if (alternativeEnd !== -1) {
                content = content.substring(0, scriptStartPos) + content.substring(alternativeEnd + '</script>'.length);
            }
        }
    }
    
    // Revert the auth container and button back to the standard button
    // It looks like:
    // <div id="auth-container">
    //      <a id="auth-btn" onclick="handleAuthClick(event)" ...>Sign In / Login</a>
    // </div>
    // or similar things.
    // Let's just find "Sign In / Login" in an a-tag (or button) and simply undo the id and onclick injection we did earlier.
    
    const containerMatch = content.match(/<div id="auth-container">([\s\S]*?Sign[\s\n]*(?:In)\s*\/\s*Login[\s\S]*?)<\/div>/i);
    if (containerMatch && containerMatch[1]) {
        let innerBtn = containerMatch[1];
        // Strip id="auth-btn" and onclick="handleAuthClick(event)"
        innerBtn = innerBtn.replace(/\s*id="auth-btn"\s*onclick="handleAuthClick\(event\)"/, '');
        content = content.replace(containerMatch[0], innerBtn);
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Reverted ${file}`);
}
