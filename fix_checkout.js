const fs = require('fs');
try {
    let content = fs.readFileSync('website/store.html', 'utf8');

    // Replace the success toast with an alert
    content = content.replace(
        /showToast\('✅ Order placed successfully! ID: ' \+ data\.orderId\);/,
        "alert('✅ Order placed successfully! Your Order ID is: ' + data.orderId);"
    );

    // Remove the setTimeout toggleCart and replace with instant
    content = content.replace(
        /setTimeout\(\(\) => toggleCart\(false\), 2000\);/,
        "toggleCart(false);"
    );

    // Replace the failure toast with an alert
    content = content.replace(
        /showToast\('❌ Failed to place order'\);/,
        "alert('❌ Failed to place order. Please try again.');"
    );

    // Replace the connection error toast with an alert
    content = content.replace(
        /showToast\('❌ Server connection error'\);/,
        "alert('❌ Server connection error. Please make sure the backend is running.');"
    );

    fs.writeFileSync('website/store.html', content, 'utf8');
    console.log("Successfully fixed checkout alerts in store.html");
} catch (error) {
    console.error("Failed to fix store.html checkout alerts:", error);
}
