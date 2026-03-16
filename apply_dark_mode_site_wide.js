const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html'));

const themeToggleHtml = `<button
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-[#1A1C1E] dark:text-gray-100"
                    onclick="window.toggleTheme()">
                    <span
                        class="material-icons-outlined material-symbols-outlined text-2xl dark:hidden">dark_mode</span>
                    <span
                        class="material-icons-outlined material-symbols-outlined text-2xl hidden dark:inline">light_mode</span>
                </button>`;

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Inject theme.js into <head>
    if (!content.includes('src="theme.js"')) {
        content = content.replace('<head>', '<head>\n    <script src="theme.js"></script>');
    }

    // 2. Add toggle button near auth-container if not already present
    if (content.includes('id="auth-container"') && !content.includes('window.toggleTheme()')) {
        content = content.replace('<div id="auth-container">', themeToggleHtml + '\n                <div id="auth-container">');
    } else if (content.includes('id="auth-btn"') && !content.includes('window.toggleTheme()')) {
        // Fallback for pages where auth-container might be different or button is direct
        // But usually it's in a flex container
        // I'll just look for auth-container as it's the standard I've been using
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
