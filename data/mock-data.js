/**
 * Mock Data for FullStock Dashboard
 * 
 * This file simulates data that would normally come from an Excel sheet
 * or other backend data source in a real implementation.
 */

// Inventory Data
const inventoryData = [
    {
        id: 1,
        name: "Beef Tenderloin",
        category: "Meat",
        currentStock: 3.5,
        minRequired: 10,
        unit: "kg",
        status: "critical",
        nextDelivery: "2025-04-02",
        aiAction: "Alternative supplier needed"
    },
    {
        id: 2,
        name: "Fresh Tomatoes",
        category: "Produce",
        currentStock: 8.2,
        minRequired: 15,
        unit: "kg",
        status: "warning",
        nextDelivery: "2025-04-01",
        aiAction: "Order additional 10kg"
    },
    {
        id: 3,
        name: "Chicken Breast",
        category: "Meat",
        currentStock: 12.5,
        minRequired: 8,
        unit: "kg",
        status: "ok",
        nextDelivery: "2025-04-04",
        aiAction: "Stock optimal"
    },
    {
        id: 4,
        name: "Olive Oil",
        category: "Pantry",
        currentStock: 2,
        minRequired: 5,
        unit: "bottles",
        status: "warning",
        nextDelivery: "2025-04-03",
        aiAction: "Order expedited"
    },
    {
        id: 5,
        name: "Heavy Cream",
        category: "Dairy",
        currentStock: 1.5,
        minRequired: 6,
        unit: "liters",
        status: "critical",
        nextDelivery: "2025-04-05",
        aiAction: "Alternative supplier suggested"
    },
    {
        id: 6,
        name: "Potatoes",
        category: "Produce",
        currentStock: 18,
        minRequired: 10,
        unit: "kg",
        status: "ok",
        nextDelivery: "2025-04-08",
        aiAction: "Stock optimal"
    },
    {
        id: 7,
        name: "Salmon Fillet",
        category: "Seafood",
        currentStock: 3.2,
        minRequired: 5,
        unit: "kg",
        status: "warning",
        nextDelivery: "2025-04-02",
        aiAction: "Check quality on arrival"
    },
    {
        id: 8,
        name: "Basil",
        category: "Herbs",
        currentStock: 0.2,
        minRequired: 0.5,
        unit: "kg",
        status: "critical",
        nextDelivery: "2025-04-01",
        aiAction: "Local supplier identified"
    },
    {
        id: 9,
        name: "White Wine",
        category: "Beverages",
        currentStock: 12,
        minRequired: 10,
        unit: "bottles",
        status: "ok",
        nextDelivery: "2025-04-15",
        aiAction: "Stock optimal"
    },
    {
        id: 10,
        name: "Flour",
        category: "Baking",
        currentStock: 15,
        minRequired: 20,
        unit: "kg",
        status: "warning",
        nextDelivery: "2025-04-03",
        aiAction: "Increase next order"
    }
];

// Supplier Data with Google Ads-inspired promotion integration
const supplierData = [
    {
        id: 1,
        name: "FreshFarm Direct",
        category: "Produce",
        items: ["Fresh Tomatoes", "Basil", "Potatoes"],
        stockAvailability: "High",
        deliveryTime: "Next day",
        priceIndex: "€€",
        matchScore: 92,
        logoUrl: "https://via.placeholder.com/80x80.png?text=FF",
        isSponsored: false,
        description: "Local farm with daily fresh deliveries and excellent quality produce."
    },
    {
        id: 2,
        name: "Premium Meats",
        category: "Meat",
        items: ["Beef Tenderloin", "Chicken Breast"],
        stockAvailability: "Medium",
        deliveryTime: "2-3 days",
        priceIndex: "€€€",
        matchScore: 87,
        logoUrl: "https://via.placeholder.com/80x80.png?text=PM",
        isSponsored: true,
        description: "High-quality, ethically sourced meats from trusted farms. 10% off for new customers."
    },
    {
        id: 3,
        name: "Dairy Delights",
        category: "Dairy",
        items: ["Heavy Cream", "Milk", "Butter"],
        stockAvailability: "High",
        deliveryTime: "Next day",
        priceIndex: "€€",
        matchScore: 94,
        logoUrl: "https://via.placeholder.com/80x80.png?text=DD",
        isSponsored: false,
        description: "Fresh dairy products directly from local farms with excellent quality control."
    },
    {
        id: 4,
        name: "Ocean Harvest",
        category: "Seafood",
        items: ["Salmon Fillet", "Tuna", "Shrimp"],
        stockAvailability: "Low",
        deliveryTime: "1-2 days",
        priceIndex: "€€€",
        matchScore: 85,
        logoUrl: "https://via.placeholder.com/80x80.png?text=OH",
        isSponsored: true,
        description: "Sustainable seafood delivered fresh. Special promotion: Free delivery on orders over €100."
    },
    {
        id: 5,
        name: "Pantry Essentials",
        category: "Pantry",
        items: ["Olive Oil", "Flour", "Rice"],
        stockAvailability: "High",
        deliveryTime: "2-3 days",
        priceIndex: "€",
        matchScore: 91,
        logoUrl: "https://via.placeholder.com/80x80.png?text=PE",
        isSponsored: false,
        description: "Best prices on high-quality pantry staples with efficient delivery."
    },
    {
        id: 6,
        name: "Premium Beverages",
        category: "Beverages",
        items: ["White Wine", "Red Wine", "Craft Beer"],
        stockAvailability: "Medium",
        deliveryTime: "3-4 days",
        priceIndex: "€€",
        matchScore: 88,
        logoUrl: "https://via.placeholder.com/80x80.png?text=PB",
        isSponsored: true,
        description: "Premium selection of beverages with wholesale pricing. Limited time offer: 15% off wine cases."
    }
];

// Historical Usage Data (for charts)
const historicalUsageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: {
        meat: [145, 132, 151, 142, 138, 158, 177, 183, 165, 142, 148, 166],
        produce: [230, 210, 220, 245, 260, 295, 310, 315, 285, 260, 225, 235],
        dairy: [120, 115, 125, 130, 135, 140, 145, 150, 145, 135, 125, 130],
        seafood: [80, 75, 85, 90, 95, 100, 105, 110, 105, 95, 85, 90],
        pantry: [190, 185, 195, 200, 205, 210, 215, 220, 215, 205, 195, 200],
        beverages: [110, 100, 120, 130, 150, 170, 190, 200, 170, 150, 130, 160]
    }
};

// Predicted Shortages (for AI prediction charts)
const predictedShortageData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
        {
            label: 'Beef Tenderloin',
            data: [3.5, 2.1, 0.8, -1.5, -3.2, -5.0],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
        },
        {
            label: 'Fresh Tomatoes',
            data: [8.2, 5.9, 3.6, 1.3, -1.0, -3.3],
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            tension: 0.4
        },
        {
            label: 'Heavy Cream',
            data: [1.5, 0.2, -1.1, -2.4, -3.7, -5.0],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
        },
        {
            label: 'Basil',
            data: [0.2, -0.1, -0.4, -0.7, -1.0, -1.3],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
        }
    ]
};

// Category Distribution Data (for pie chart)
const categoryDistributionData = {
    labels: ['Meat', 'Produce', 'Dairy', 'Seafood', 'Pantry', 'Beverages', 'Herbs', 'Baking'],
    datasets: [
        {
            data: [25, 20, 15, 10, 12, 8, 5, 5],
            backgroundColor: [
                '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf', '#7cbb00'
            ]
        }
    ]
};

// Weekly Usage Patterns (for bar chart)
const weeklyUsageData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Average Usage',
            data: [85, 72, 78, 75, 92, 110, 105],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        },
        {
            label: 'Predicted Usage',
            data: [82, 75, 80, 78, 95, 115, 110],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }
    ]
};

// Inventory Trend Data (for line chart)
const inventoryTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
        {
            label: 'Critical Items',
            data: [3, 5, 4, 8],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Warning Items',
            data: [8, 10, 12, 15],
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Healthy Items',
            data: [120, 115, 118, 127],
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: true,
            tension: 0.4
        }
    ]
};
