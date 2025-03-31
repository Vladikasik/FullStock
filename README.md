# FullStock: AI-Driven Supply Chain Management for Restaurants

## Project Overview
FullStock is an intelligent supply chain management dashboard designed specifically for the restaurant industry. It addresses the chronic problem of supply shortages and inefficient restocking processes using AI-driven analytics and predictions.

### Industry Problem
Restaurants frequently face unexpected shortages due to outdated processes and reliance on Excel-based data management. This results in operational disruptions, lost sales, and poor customer experience.

## Key Features

- **Real-time Inventory Monitoring**: Tracks stock levels and highlights items requiring attention
- **AI Prediction Engine**: Forecasts potential shortages before they occur
- **Smart Supplier Suggestions**: Recommends alternative suppliers when shortages arise
- **Integrated Supplier Promotions**: Similar to Google Ads, presenting relevant supplier offers
- **Visual Analytics**: Intuitive charts and graphs for trend analysis
- **SAP ERP Integration Roadmap**: Future connectivity with enterprise systems

## Technology Stack

- HTML, CSS, JavaScript
- Chart.js for data visualization
- Responsive design for all device sizes

## Project Structure

```
src/
├── assets/         # Images and icons
├── css/            # Stylesheet files
├── data/           # Mock data files
├── js/             # JavaScript functionality
│   ├── main.js     # Core application logic
│   ├── charts.js   # Visualization components
│   └── predictions.js # AI prediction simulation
└── index.html      # Main dashboard interface
```

## Data Security & Compliance
The application is designed with German privacy regulations in mind, ensuring data handling meets strict security standards.

## Implementation Note
This demo simulates the dashboard UI and concept with static data. In a production environment, it would connect to live data sources and implement actual AI-driven predictions and analysis.

## Future Roadmap
- Integration with SAP ERP and other major restaurant management systems
- Mobile application with push notifications for critical supplies
- Advanced AI algorithms for more accurate shortage predictions
- Supplier marketplace for direct ordering

## Environment Variables Setup

This project requires the following environment variables:

- `AIRTABLE_API_KEY`: Your Airtable API key
- `AIRTABLE_BASE_ID`: Your Airtable base ID
- `AIRTABLE_TABLE_ID`: Your Airtable table ID

### Local Development

1. Create a `.env` file in the root directory with these variables:
```
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
```

2. During development, run the build script to generate the config file:
```
npm run build
```

### Vercel Deployment

When deploying to Vercel:

1. Add the environment variables in the Vercel project settings
2. The build script will automatically generate the config.js file with these values

**IMPORTANT: Never commit API keys or other secrets to the repository.**
