/**
 * Main.js - Core application logic for the FullStock dashboard
 */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate inventory table
    populateInventoryTable();
    
    // Populate supplier suggestions
    populateSupplierSuggestions();
    
    // Add event listeners
    setupEventListeners();
});

/**
 * Populate the inventory table with data
 */
function populateInventoryTable() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Add rows for each inventory item
    inventoryData.forEach(item => {
        const row = document.createElement('tr');
        
        // Set row class based on status
        if (item.status === 'critical') {
            row.classList.add('table-danger');
        } else if (item.status === 'warning') {
            row.classList.add('table-warning');
        }
        
        // Create cell content
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>
                <span class="fw-bold">${item.currentStock}</span> ${item.unit}
            </td>
            <td>${item.minRequired} ${item.unit}</td>
            <td>
                <span class="status-badge ${statusBadgeClass(item.status)}">
                    ${statusText(item.status)}
                </span>
            </td>
            <td>${formatDate(item.nextDelivery)}</td>
            <td>
                <div class="d-flex justify-content-between align-items-center">
                    <span>${item.aiAction}</span>
                    ${item.status !== 'ok' ? '<button class="btn btn-sm btn-outline-primary view-suggestions" data-id="' + item.id + '">View Options</button>' : ''}
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to suggestion buttons
    document.querySelectorAll('.view-suggestions').forEach(button => {
        button.addEventListener('click', handleViewSuggestions);
    });
}

/**
 * Returns the appropriate CSS class for status badges
 * @param {string} status - Item status
 * @returns {string} CSS class
 */
function statusBadgeClass(status) {
    switch (status) {
        case 'critical': return 'status-critical';
        case 'warning': return 'status-warning';
        case 'ok': return 'status-ok';
        default: return '';
    }
}

/**
 * Returns human-readable status text
 * @param {string} status - Item status
 * @returns {string} Status text
 */
function statusText(status) {
    switch (status) {
        case 'critical': return 'Critical';
        case 'warning': return 'Warning';
        case 'ok': return 'OK';
        default: return status;
    }
}

/**
 * Format date to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today or tomorrow
    if (date.toDateString() === now.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }
    
    // Otherwise return formatted date
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Handle click on "View Options" button
 * @param {Event} event - Click event
 */
function handleViewSuggestions(event) {
    const itemId = parseInt(event.target.dataset.id);
    const item = inventoryData.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Scroll to supplier section
    document.querySelector('#suppliers-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Highlight matching suppliers
    const suppliers = findAlternativeSuppliers(item);
    if (suppliers.length > 0) {
        // Add pulsing effect to matching supplier cards
        document.querySelectorAll('.supplier-card').forEach(card => {
            card.classList.remove('border-primary', 'shadow');
        });
        
        suppliers.forEach(supplier => {
            const card = document.querySelector(`.supplier-card[data-id="${supplier.id}"]`);
            if (card) {
                card.classList.add('border-primary', 'shadow');
                
                // Scroll the first match into view
                if (supplier === suppliers[0]) {
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                }
            }
        });
    }
}

/**
 * Populate supplier suggestions section
 */
function populateSupplierSuggestions() {
    const container = document.getElementById('supplier-cards');
    if (!container) return;
    
    // Sort suppliers to ensure sponsored ones are distributed evenly
    const sortedSuppliers = distributeSponsored(supplierData);
    
    // Create supplier cards
    sortedSuppliers.forEach(supplier => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm supplier-card" data-id="${supplier.id}">
                ${supplier.isSponsored ? '<span class="sponsored-badge">Sponsored</span>' : ''}
                <div class="card-body text-center">
                    <img src="${supplier.logoUrl}" alt="${supplier.name} logo" class="supplier-logo">
                    <h5 class="card-title">${supplier.name}</h5>
                    <p class="supplier-match">
                        <i class="bi bi-check-circle-fill me-1"></i> ${supplier.matchScore}% match
                    </p>
                    <p class="card-text">${supplier.description}</p>
                    <div class="d-flex justify-content-between mb-3">
                        <span><strong>Category:</strong> ${supplier.category}</span>
                        <span><strong>Price:</strong> ${supplier.priceIndex}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                        <span><strong>Stock:</strong> ${supplier.stockAvailability}</span>
                        <span><strong>Delivery:</strong> ${supplier.deliveryTime}</span>
                    </div>
                    <button class="btn btn-primary">Contact Supplier</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Distribute sponsored suppliers evenly throughout the list
 * Inspired by Google Ads approach to show sponsored content
 * 
 * @param {Array} suppliers - List of supplier objects
 * @returns {Array} Rearranged suppliers with sponsored ones distributed
 */
function distributeSponsored(suppliers) {
    if (!suppliers || suppliers.length === 0) return [];
    
    // Separate sponsored and non-sponsored suppliers
    const sponsored = suppliers.filter(s => s.isSponsored);
    const nonSponsored = suppliers.filter(s => !s.isSponsored);
    
    // If no sponsored suppliers, return the original list
    if (sponsored.length === 0) return suppliers;
    
    // Sort non-sponsored by match score
    nonSponsored.sort((a, b) => b.matchScore - a.matchScore);
    
    // Calculate spacing between sponsored items
    const spacing = Math.floor(nonSponsored.length / (sponsored.length + 1));
    
    // Distribute sponsored suppliers
    const result = [...nonSponsored];
    sponsored.forEach((item, index) => {
        const position = Math.min((index + 1) * spacing, result.length);
        result.splice(position, 0, item);
    });
    
    return result;
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Add toggle functionality for the sidebar on mobile
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    }
    
    // Make nav links scroll to sections
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target && target.startsWith('#') && document.querySelector(target)) {
                e.preventDefault();
                document.querySelector(target).scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}
