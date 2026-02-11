const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, 'products.js');
let fileContent = fs.readFileSync(productsPath, 'utf8');

// Parse products from the file
const products = require('./products');

// Generate unique IDs based on category
const categoryCounts = {};
const updatedProducts = products.map(product => {
    const categoryPrefix = product.category.replace(/['\s]/g, '').substring(0, 3).toUpperCase();
    categoryCounts[categoryPrefix] = (categoryCounts[categoryPrefix] || 0) + 1;
    const uniqueId = `${categoryPrefix}${String(categoryCounts[categoryPrefix]).padStart(3, '0')}`;
    
    return {
        unique_id: uniqueId,
        ...product
    };
});

// Write updated products back to file
const output = `const products = ${JSON.stringify(updatedProducts, null, 4)};\n\nmodule.exports = products;\n`;
fs.writeFileSync(productsPath, output);

console.log('✓ Added unique_id to all products');
console.log(`✓ Total products: ${updatedProducts.length}`);
