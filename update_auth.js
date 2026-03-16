const fs = require('fs');
const path = require('path');

const websiteDir = path.join(__dirname, 'website');
const files = fs.readdirSync(websiteDir).filter(f => f.endsWith('.html') && f !== 'index.html');

const scriptToInject = `
    <script>
        function handleAuthClick(e) {
            e.preventDefault();
            const userString = localStorage.getItem('user');
            if (userString) {
                localStorage.removeItem('user');
                alert('Logged out successfully');
                window.location.reload();
            } else {
                window.location.href = 'index.html';
            }
        }
        function updateUIForUser() {
            const userString = localStorage.getItem('user');
            const authContainer = document.getElementById('auth-container');
            
            if (!authContainer) return;

            if (userString) {
                const user = JSON.parse(userString);
                const firstName = user.name.split(' ')[0];
                const initial = firstName.charAt(0).toUpperCase();

                authContainer.innerHTML = \`
                    <div class="relative group">
                        <button class="flex items-center gap-2.5 p-1 pr-3.5 rounded-full bg-white dark:bg-[#1A1C1E] border-[1.5px] border-[#1A1C1E] dark:border-white shadow-sm hover:opacity-90 transition-all active:scale-95 ml-2">
                            <div class="w-8 h-8 rounded-full bg-[#1A1C1E] dark:bg-white text-white dark:text-[#1A1C1E] flex items-center justify-center font-bold text-[15px]">
                                \${initial}
                            </div>
                            <span class="text-[15px] font-bold text-[#1F2937] dark:text-white hidden sm:block tracking-wide pt-0.5 ml-0.5">\${firstName}</span>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div class="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-slate-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-[100]">
                            <div class="p-1.5">
                                <button onclick="handleLogout()" class="w-full text-center px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            } else {
                authContainer.innerHTML = \`
                    <button id="auth-btn" onclick="handleAuthClick(event)" class="ml-2 px-6 py-2.5 rounded-full bg-[#1A1C1E] text-white dark:bg-white dark:text-[#1A1C1E] text-sm font-bold hover:opacity-90 transition-colors shadow-none border border-black/10 dark:border-white/10 tracking-wide" style="font-family: 'Plus Jakarta Sans', sans-serif;">Sign In / Login</button>
                \`;
            }
        }
        document.addEventListener('DOMContentLoaded', updateUIForUser);
    </script>
</body>`;

for (const file of files) {
    const filePath = path.join(websiteDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace the specific "Sign In / Login" <a> tag to add id and onclick
    // Use gi to handle case, and [\s\n]* to handle any spacing/newlines inside the tag text
    // 1. First, strip any existing auth-container wrapper so we don't nest them
    const wrapperRegex = /<div id="auth-container">\s*(<a[^>]*>[\s\n]*Sign[\s\n]*In \/ Login[\s\n]*<\/a>)\s*<\/div>/gi;
    content = content.replace(wrapperRegex, '$1');

    // 2. Now match the <a> tag
    const aTagRegex = /<a[^>]*href(?:="[^"]*"|='[^']*'|=[^\s>]+)?[^>]*>[\s\n]*Sign[\s\n]*In \/ Login[\s\n]*<\/a>/gi;
    
    let modified = false;
    content = content.replace(aTagRegex, (match) => {
        modified = true;
        // Clean out old injected IDs and onclicks to prevent duplicates
        let cleanMatch = match.replace(/id="auth-btn"\s*/gi, '').replace(/onclick="[^"]*"\s*/gi, '').replace(/\s+/g, ' ');
        const aTagWithId = cleanMatch.replace('<a ', '<a id="auth-btn" onclick="handleAuthClick(event)" ');
        return `<div id="auth-container">\n                    ${aTagWithId}\n                </div>`;
    });
    
    // Instead of just injecting before </body>, we replace the existing script if it exists
    const oldScriptRegex = /<script>\s*function handleAuthClick[\s\S]*?<\/script>\s*<\/body>/;
    
    if (content.match(oldScriptRegex)) {
        content = content.replace(oldScriptRegex, scriptToInject);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file} (replaced existing script)`);
    } else if (modified) {
        content = content.replace('</body>', scriptToInject);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file} (injected new script)`);
    } else {
        console.log(`Skipped ${file} (no match or already updated)`);
    }
}
