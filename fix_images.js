const fs = require('fs');
const path = require('path');

try {
    const productsJsContent = fs.readFileSync('website/products.js', 'utf8');
    const imageDir = path.join('website', 'product_images');
    const existingImages = fs.readdirSync(imageDir);

    let updatedContent = productsJsContent;

    // Use regex to find all img: "..." occurrences
    const imgRegex = /img:\s*"([^"]+)"/g;
    let match;

    while ((match = imgRegex.exec(productsJsContent)) !== null) {
        let originalPath = match[1];
        let filename = path.basename(originalPath);
        
        // If the file doesn't exist in the folder (ignoring 'product_images/' prefix)
        if (!existingImages.includes(filename)) {
            // we will search for the closest match or assign a placeholder
            let newFile = null;
            
            // Try to find an image that somewhat matches the filename prefixes
            const prefix = filename.split('_')[0];
            const partialMatches = existingImages.filter(img => img.startsWith(prefix));
            
            if (partialMatches.length > 0) {
                newFile = partialMatches[0];
            } else {
                // If it's something entirely weird, pick a generic one based on pet type or whatever
                // It's probably easier to just fallback to a placeholder if nothing matches
                // OR we can assign one of the existing ones
                newFile = existingImages[0]; 
            }
            
            // Replace in file
            updatedContent = updatedContent.replace(
                new RegExp(`img:\\s*"${originalPath}"`), 
                `img: "product_images/${newFile}"`
            );
            console.log(`Replaced missing image ${originalPath} with product_images/${newFile}`);
        }
    }

    fs.writeFileSync('website/products.js', updatedContent, 'utf8');
    console.log("Successfully fixed products.js image links.");
} catch (error) {
    console.error("Error fixing images:", error);
}
