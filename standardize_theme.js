const fs = require('fs');
const path = require('path');

const websiteDir = 'website';
const htmlFiles = ['about.html', 'contact.html', 'services.html', 'store.html', 'index.html'];

const standardConfig = `
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#1A1C1E",
                        "background-light": "#F8F7F4",
                        "background-dark": "#0F1113",
                        accent: "#D4B996",
                    },
                    fontFamily: {
                        display: ["'Plus Jakarta Sans'", "sans-serif"],
                        sans: ["'Plus Jakarta Sans'", "sans-serif"],
                    },
                },
            },
        };
    </script>`;

const standardFonts = `
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />`;

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Standardize Tailwind Config colors and fonts
    const configRegex = /<script>\s*tailwind\.config[\s\S]*?<\/script>/;
    content = content.replace(configRegex, standardConfig);

    // 2. Standardize Font and Icon Imports
    // We'll replace the block of links in the head
    const headLinksRegex = /<link href="https:\/\/fonts\.googleapis\.com"[\s\S]*?Material[\s\S]*?Outlined" rel="stylesheet" \/>/;
    const headLinksFallbackRegex = /<link[\s\S]*?Plus\+Jakarta\+Sans[\s\S]*?>\s*<link[\s\S]*?Material[\s\S]*?>/;
    
    if (content.match(headLinksRegex)) {
        content = content.replace(headLinksRegex, standardFonts);
    } else if (content.match(headLinksFallbackRegex)) {
       // content = content.replace(headLinksFallbackRegex, standardFonts);
    }

    // 3. Standardize Icon Classes: material-icons-outlined -> material-symbols-outlined
    content = content.replace(/material-icons-outlined/g, 'material-symbols-outlined');

    // 4. Clean up any weird combinations like "material-symbols-outlined material-symbols-outlined"
    content = content.replace(/material-symbols-outlined\s+material-symbols-outlined/g, 'material-symbols-outlined');

    // 5. Ensure the Navbar Theme Toggle is unified and clean
    const toggleRegex = /<button[\s\S]*?onclick="window\.toggleTheme\(\)"[\s\S]*?>[\s\S]*?<\/button>/;
    const cleanToggle = `<button
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-[#1A1C1E] dark:text-gray-100"
                    onclick="window.toggleTheme()">
                    <span class="material-symbols-outlined text-2xl dark:hidden">dark_mode</span>
                    <span class="material-symbols-outlined text-2xl hidden dark:inline">light_mode</span>
                </button>`;
    
    content = content.replace(toggleRegex, cleanToggle);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Standardized ${file}`);
});
