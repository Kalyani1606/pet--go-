const fs = require('fs');

try {
    let content = fs.readFileSync('website/store.html', 'utf8');

    // Find the updateCartUI function and fix the emptyMsg logic
    // Replace the specific block of code
    const target = /if \(cart\.length === 0\) \{[\s\S]*?list\.innerHTML = '';[\s\S]*?list\.appendChild\(emptyMsg\);[\s\S]*?totalEl\.textContent = '₹0';[\s\S]*?badge\.classList\.add\('hidden'\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?emptyMsg\.remove\(\);/;
    
    const replacement = `if (cart.length === 0) {
                list.innerHTML = '';
                if (emptyMsg) emptyMsg.classList.remove('hidden');
                totalEl.textContent = '₹0';
                badge.classList.add('hidden');
                return;
            }

            if (emptyMsg) emptyMsg.classList.add('hidden');`;

    if (content.match(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync('website/store.html', content, 'utf8');
        console.log("Successfully fixed updateCartUI logic in store.html");
    } else {
        console.log("Could not find the target code block in store.html");
        // Fallback: try a simpler match if the above failed
        const target2 = /list\.appendChild\(emptyMsg\);/;
        if (content.match(target2)) {
             content = content.replace(/list\.appendChild\(emptyMsg\);/, "if (emptyMsg) emptyMsg.classList.remove('hidden');");
             content = content.replace(/emptyMsg\.remove\(\);/, "if (emptyMsg) emptyMsg.classList.add('hidden');");
             fs.writeFileSync('website/store.html', content, 'utf8');
             console.log("Applied fallback fix for updateCartUI");
        } else {
            console.log("Failed to find even the fallback target.");
        }
    }
} catch (error) {
    console.error("Error patching store.html:", error);
}
