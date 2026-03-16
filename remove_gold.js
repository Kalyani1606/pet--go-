const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ target, replacement }) => {
        content = content.split(target).join(replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// replacements for about.html
const aboutReplacements = [
    { target: '--accent: #D4B996;', replacement: '--accent: #4F46E5;' },
    { target: 'accent: "#D4B996"', replacement: 'accent: "#4F46E5"' },
    { target: 'rgba(212, 185, 150, 0.05)', replacement: 'rgba(79, 70, 229, 0.05)' },
    { target: 'Redefining Pet Care in the <span\n                            class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-white dark:to-accent">Modern\n                            City.</span>', 
      replacement: 'Redefining Pet Care in the <span\n                            class="text-accent underline decoration-4 underline-offset-8">Modern\n                            City.</span>' }
];

// replacements for contact.html
const contactReplacements = [
    { target: '--accent: #D4B996;', replacement: '--accent: #4F46E5;' },
    { target: 'accent: "#D4B996"', replacement: 'accent: "#4F46E5"' },
    { target: 'bg-accent/10', replacement: 'bg-primary/10' },
    { target: 'bg-accent/5', replacement: 'bg-primary/5' },
    { target: 'bg-accent/20 text-accent', replacement: 'bg-primary/10 text-primary dark:text-accent' },
    { target: 'text-accent underline decoration-1 underline-offset-8', replacement: 'text-primary underline decoration-2 underline-offset-8' }
];

replaceInFile('website/about.html', aboutReplacements);
replaceInFile('website/contact.html', contactReplacements);
