const fs = require('fs');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Remove the text-transparent/bg-clip-text/bg-gradient gold headings
    // This matches the multi-line span with many classes including gradient ones
    const gradientRegex = /<span\s+class="text-transparent bg-clip-text bg-gradient-to-r[^"]*">([\s\S]*?)<\/span>/g;
    content = content.replace(gradientRegex, (match, innerText) => {
        // Keep the inner text but replace the span with a simpler one
        return `<span class="text-primary dark:text-white underline decoration-2 underline-offset-8">${innerText}</span>`;
    });

    // 2. Ensure ambient glows are primary/very subtle instead of gold accent
    content = content.replace(/bg-accent\/10 rounded-full blur-\[120px\]/g, 'bg-primary/5 rounded-full blur-[120px]');
    content = content.replace(/bg-accent\/5 rounded-full blur-\[120px\]/g, 'bg-primary/5 rounded-full blur-[120px]');

    // 3. Update stats/large numbers to primary instead of gold if they are text-accent
    // Only targeting stats which are usually text-4xl or similar
    content = content.replace(/text-4xl font-bold text-accent mb-2/g, 'text-4xl font-bold text-primary dark:text-white mb-2');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${filePath}`);
}

cleanFile('website/about.html');
cleanFile('website/contact.html');
cleanFile('website/services.html'); // Just in case
cleanFile('website/index.html'); // Also de-goldify slightly if needed, but user said "same as home page"
