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
    
    // Add fullscreen buttons to all chart containers
    addFullscreenButtons();
});

/**
 * Add fullscreen buttons to all chart containers
 */
function addFullscreenButtons() {
    // Get all card bodies that contain a canvas element (chart)
    const chartContainers = document.querySelectorAll('.card-body:has(canvas)');
    
    // For older browsers that don't support :has selector
    document.querySelectorAll('.card-body').forEach(container => {
        if (container.querySelector('canvas')) {
            // Add chart-container class to position the fullscreen button
            container.classList.add('chart-container');
            
            // Create the fullscreen button
            const button = document.createElement('button');
            button.className = 'fullscreen-btn';
            button.innerHTML = '<i class="bi bi-arrows-fullscreen"></i> Fullscreen';
            button.dataset.chartId = container.querySelector('canvas').id;
            
            // Add click event
            button.addEventListener('click', showChartFullscreen);
            
            // Add button to container
            container.appendChild(button);
        }
    });
    
    // Create fullscreen overlay (hidden by default)
    const overlay = document.createElement('div');
    overlay.id = 'chart-fullscreen-overlay';
    overlay.className = 'fullscreen-overlay';
    overlay.style.display = 'none';
    
    // Add to document
    document.body.appendChild(overlay);
}

/**
 * Show a chart in fullscreen mode
 * @param {Event} event - Click event
 */
function showChartFullscreen(event) {
    const chartId = event.currentTarget.dataset.chartId;
    const originalCanvas = document.getElementById(chartId);
    
    if (!originalCanvas) return;
    
    const overlay = document.getElementById('chart-fullscreen-overlay');
    if (!overlay) return;
    
    // Clear previous content
    overlay.innerHTML = '';
    
    // Create fullscreen container
    const container = document.createElement('div');
    container.className = 'fullscreen-container';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'fullscreen-close';
    closeButton.innerHTML = '<i class="bi bi-x-lg"></i> Close';
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
    
    // Create new canvas for the fullscreen chart
    const canvas = document.createElement('canvas');
    canvas.id = `${chartId}-fullscreen`;
    
    // Add elements to container and overlay
    container.appendChild(closeButton);
    container.appendChild(canvas);
    overlay.appendChild(container);
    
    // Show overlay
    overlay.style.display = 'flex';
    document.body.classList.add('no-scroll');
    
    // Get original chart instance and clone its data and options
    const originalChart = Chart.getChart(chartId);
    if (originalChart) {
        // Clone data and options
        const data = JSON.parse(JSON.stringify(originalChart.data));
        const options = JSON.parse(JSON.stringify(originalChart.options));
        
        // Ensure the chart is responsive in fullscreen
        options.responsive = true;
        options.maintainAspectRatio = true;
        if (options.plugins && options.plugins.legend) {
            options.plugins.legend.labels = options.plugins.legend.labels || {};
            options.plugins.legend.labels.font = options.plugins.legend.labels.font || {};
            options.plugins.legend.labels.font.size = 16; // Bigger font in fullscreen
        }
        
        // Create new chart
        new Chart(canvas, {
            type: originalChart.config.type,
            data: data,
            options: options
        });
    }
}

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
