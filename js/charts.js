/**
 * Charts.js - Responsible for all chart visualizations in the dashboard
 * Using Chart.js to create interactive and responsive charts
 */

// Initialize charts once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all charts
    initTrendChart();
    initCategoryChart();
    initShortageChart();
    initUsageChart();
});

/**
 * Initialize Trend Chart - Line chart showing inventory trends over time
 */
function initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: inventoryTrendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4],
                        drawBorder: false
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 3,
                    hoverRadius: 5
                }
            }
        }
    });
}

/**
 * Initialize Category Chart - Pie chart showing distribution of inventory by category
 */
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: categoryDistributionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value} items)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

/**
 * Initialize Shortage Chart - Line chart for forecasted shortages
 */
function initShortageChart() {
    const ctx = document.getElementById('shortageChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: predictedShortageData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return `Forecast: ${context[0].label}`;
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw.toFixed(1);
                            const status = value < 0 ? '🔴 SHORTAGE' : value < 3 ? '⚠️ LOW' : '✅ OK';
                            return `${label}: ${value} units (${status})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        borderDash: [2, 4],
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 3,
                    hoverRadius: 5
                }
            }
        }
    });
}

/**
 * Initialize Usage Chart - Bar chart for usage patterns
 */
function initUsageChart() {
    const ctx = document.getElementById('usageChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: weeklyUsageData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4],
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Units Used'
                    }
                }
            },
            barPercentage: 0.7,
            categoryPercentage: 0.7
        }
    });
}

/**
 * Update charts with new data - can be called when data changes
 * @param {string} chartId - ID of the chart to update
 * @param {object} newData - New data to apply to the chart
 */
function updateChart(chartId, newData) {
    const chartInstance = Chart.getChart(chartId);
    if (!chartInstance) return;

    chartInstance.data = newData;
    chartInstance.update();
}
