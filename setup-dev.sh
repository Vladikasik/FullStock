#!/bin/bash

# Setup script for local development

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL
# Add your Airtable credentials below
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_ID=
EOL
  echo ".env file created. Please edit it to add your Airtable credentials."
  exit 1
else
  echo ".env file already exists"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the dev build to generate config.js
echo "Running dev build..."
npm run dev-build

echo "Setup complete. You can now open index.html in your browser." 