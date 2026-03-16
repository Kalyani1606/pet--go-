const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove the shopping bag button (cartBtn) if it's in the navbar
    // Pattern to match the cartBtn button in store.html
    const cartButtonRegex = /<button id="cartBtn"[\s\S]*?<\/button>/;
    if (content.match(cartButtonRegex)) {
        content = content.replace(cartButtonRegex, '');
        console.log(`Removed cartBtn from ${file}`);
    }

    // 2. Fix duplicate theme toggles
    // We want only ONE button that calls window.toggleTheme()
    // First, remove any button that calls document.documentElement.classList.toggle('dark')
    const oldToggleRegex = /<button[\s\S]*?onclick="document\.documentElement\.classList\.toggle\('dark'\)"[\s\S]*?<\/button>/g;
    if (content.match(oldToggleRegex)) {
        content = content.replace(oldToggleRegex, '');
        console.log(`Removed old-style toggle from ${file}`);
    }

    // Now, if there are multiple window.toggleTheme() buttons, keep only one.
    const newToggleRegex = /<button[\s\S]*?onclick="window\.toggleTheme\(\)"[\s\S]*?<\/button>/g;
    const matches = content.match(newToggleRegex);
    if (matches && matches.length > 1) {
        // Keep only the first one, remove others
        let first = true;
        content = content.replace(newToggleRegex, (match) => {
            if (first) {
                first = false;
                return match;
            }
            return '';
        });
        console.log(`Removed duplicate new-style toggle from ${file}`);
    }

    // 3. Ensure window.toggleTheme() exists if it was destroyed or missing (fallback)
    // Actually, if we removed all toggles, we should add one back near auth-container
    if (!content.includes('window.toggleTheme()')) {
        const themeToggleHtml = `<button
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-[#1A1C1E] dark:text-gray-100"
                    onclick="window.toggleTheme()">
                    <span
                        class="material-icons-outlined material-symbols-outlined text-2xl dark:hidden">dark_mode</span>
                    <span
                        class="material-icons-outlined material-symbols-outlined text-2xl hidden dark:inline">light_mode</span>
                </button>`;
        if (content.includes('id="auth-container"')) {
            content = content.replace('<div id="auth-container">', themeToggleHtml + '\n                <div id="auth-container">');
            console.log(`Added back single toggle to ${file}`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
