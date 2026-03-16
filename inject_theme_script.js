const fs = require('fs');
try {
    let content = fs.readFileSync('website/store.html', 'utf8');
    if (!content.includes('src="theme.js"')) {
        content = content.replace('<head>', '<head>\n    <script src="theme.js"></script>');
        fs.writeFileSync('website/store.html', content, 'utf8');
        console.log("Successfully injected theme.js into store.html");
    } else {
        console.log("theme.js already present in store.html");
    }
} catch (error) {
    console.error("Error updating store.html:", error);
}
