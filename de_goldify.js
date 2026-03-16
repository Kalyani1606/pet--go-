const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ target, replacement }) => {
        content = content.split(target).join(replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// revert indigo to gold, but keep logic clean
const cleanupReplacements = [
    // Revert variables
    { target: '--accent: #4F46E5;', replacement: '--accent: #D4B996;' },
    { target: 'accent: "#4F46E5"', replacement: 'accent: "#D4B996"' },
    { target: 'rgba(79, 70, 229, 0.05)', replacement: 'rgba(212, 185, 150, 0.05)' },
    
    // Remove the explicit "to-accent" gradient in about.html title
    { target: 'class="text-accent underline decoration-4 underline-offset-8"', 
      replacement: 'class="text-primary dark:text-white underline decoration-2 underline-offset-8"' },
      
    // Remove ambient glows in contact.html (changing bg-accent to bg-transparent or primary/none)
    { target: 'bg-accent/10 rounded-full blur-[120px]', replacement: 'bg-primary/5 rounded-full blur-[120px]' },
    { target: 'bg-accent/5 rounded-full blur-[120px]', replacement: 'bg-primary/5 rounded-full blur-[120px]' },

    // Simplify the large accent text in contact.html
    { target: 'text-accent underline decoration-2 underline-offset-8', replacement: 'text-primary dark:text-white underline decoration-2 underline-offset-8' },
    
    // Change large stats to primary instead of accent if they feel too "gold"
    { target: 'text-4xl font-bold text-accent mb-2', replacement: 'text-4xl font-bold text-primary dark:text-white mb-2' }
];

replaceInFile('website/about.html', cleanupReplacements);
replaceInFile('website/contact.html', cleanupReplacements);
