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

// Ensure js directory exists
const jsDir = path.join(__dirname, 'js');
if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
}

// Write config file
fs.writeFileSync(path.join(jsDir, 'config.js'), configContent);

console.log('Config file generated successfully with environment variables'); 