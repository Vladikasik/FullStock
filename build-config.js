/**
 * Build script to generate config.js with environment variables during Vercel build
 * This script would be executed as part of Vercel's build process
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

// Validate environment variables
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error('Error: Required environment variables are missing.');
    console.error('Make sure to set AIRTABLE_API_KEY, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_ID');
    process.exit(1);
}

// Create config content
const configContent = `/**
 * Config file with environment variables
 * This file is generated at build time - DO NOT EDIT MANUALLY
 */

window.env = {
    AIRTABLE_API_KEY: "${AIRTABLE_API_KEY}",
    AIRTABLE_BASE_ID: "${AIRTABLE_BASE_ID}",
    AIRTABLE_TABLE_ID: "${AIRTABLE_TABLE_ID}"
};`;

// Create public directory
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Create public/js directory
const publicJsDir = path.join(publicDir, 'js');
if (!fs.existsSync(publicJsDir)) {
    fs.mkdirSync(publicJsDir, { recursive: true });
}

// Write config file to public/js directory
fs.writeFileSync(path.join(publicJsDir, 'config.js'), configContent);

// Copy all static assets to the public directory
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy static directories to public
const dirs = ['js', 'css', 'assets', 'data'];
dirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
        copyDir(path.join(__dirname, dir), path.join(publicDir, dir));
    }
});

// Copy index.html to public directory
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(publicDir, 'index.html'));

console.log('Build completed successfully. Files generated in public directory.'); 