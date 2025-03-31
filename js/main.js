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
    
    // Make Critical and Warning Items clickable
    makeStatusCardsClickable();
    
    // Make inventory table sortable
    makeInventoryTableSortable();
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
    
    // First highlight the corresponding supplier section in the sidebar
    highlightSidebarItem('suppliers-section');
    
    // Get matching suppliers by category
    const matchingSuppliers = supplierData.filter(supplier => 
        supplier.category === item.category || 
        supplier.items.includes(item.name)
    );
    
    // Remove highlights from all supplier cards first
    document.querySelectorAll('.supplier-card').forEach(card => {
        card.classList.remove('border-primary', 'shadow', 'highlight-card');
    });
    
    // Add highlighting to matching supplier cards
    if (matchingSuppliers.length > 0) {
        matchingSuppliers.forEach(supplier => {
            const card = document.querySelector(`.supplier-card[data-id="${supplier.id}"]`);
            if (card) {
                card.classList.add('border-primary', 'shadow', 'highlight-card');
            }
        });
        
        // Scroll to supplier section with a small delay to ensure DOM updates
        setTimeout(() => {
            // First scroll to the supplier section
            document.querySelector('#suppliers-section').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Add a small delay before scrolling to the first match
            setTimeout(() => {
                // Find the first highlighted card and scroll it into view
                const firstCard = document.querySelector('.supplier-card.highlight-card');
                if (firstCard) {
                    firstCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 600);
        }, 100);
    } else {
        // If no matching suppliers, just scroll to the supplier section
        document.querySelector('#suppliers-section').scrollIntoView({
            behavior: 'smooth'
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

/**
 * Make the Critical Items and Warning Items cards clickable
 * to redirect to the inventory status section
 */
function makeStatusCardsClickable() {
    // Fallback method to find the cards
    document.querySelectorAll('.card-title').forEach(title => {
        if (title.textContent.includes('Critical Items')) {
            const card = title.closest('.card');
            makeCardClickable(card, 'critical');
        }
        if (title.textContent.includes('Warning Items')) {
            const card = title.closest('.card');
            makeCardClickable(card, 'warning');
        }
    });
}

/**
 * Make a card clickable and redirect to inventory section with filtering
 * @param {HTMLElement} card - The card element to make clickable
 * @param {string} status - The status to filter by ('critical' or 'warning')
 */
function makeCardClickable(card, status) {
    if (!card) return;
    
    // Add clickable styling
    card.classList.add('clickable-card');
    card.style.cursor = 'pointer';
    
    // Add click event
    card.addEventListener('click', () => {
        // Scroll to inventory section
        document.querySelector('#inventory-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Filter the table to show only items with this status
        filterInventoryTable(status);
        
        // Highlight the inventory section in the sidebar
        highlightSidebarItem('inventory-section');
    });
}

/**
 * Highlight the corresponding sidebar item
 * @param {string} sectionId - The ID of the section to highlight
 */
function highlightSidebarItem(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the matching link
    const navLink = document.querySelector(`.sidebar .nav-link[href="#${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

/**
 * Filter the inventory table by status
 * @param {string} status - The status to filter by
 */
function filterInventoryTable(status) {
    const rows = document.querySelectorAll('#inventory-table-body tr');
    
    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(5) .status-badge');
        if (statusCell) {
            const rowStatus = statusCell.textContent.trim().toLowerCase();
            
            if (status === 'critical' && rowStatus === 'critical') {
                row.style.display = '';
                row.classList.add('highlight-row');
            } else if (status === 'warning' && rowStatus === 'warning') {
                row.style.display = '';
                row.classList.add('highlight-row');
            } else {
                row.style.display = status ? 'none' : '';
                row.classList.remove('highlight-row');
            }
        }
    });
    
    // Add a clear filter button if it doesn't exist
    if (!document.getElementById('clear-filter-btn') && status) {
        const table = document.querySelector('.table');
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-filter-btn';
        clearBtn.className = 'btn btn-sm btn-outline-secondary mb-3';
        clearBtn.textContent = 'Clear Filter';
        clearBtn.addEventListener('click', () => {
            // Show all rows
            rows.forEach(row => {
                row.style.display = '';
                row.classList.remove('highlight-row');
            });
            clearBtn.remove();
        });
        
        table.parentNode.insertBefore(clearBtn, table);
    }
}

/**
 * Make the inventory table sortable by status only
 */
function makeInventoryTableSortable() {
    const table = document.querySelector('#inventory-section table');
    
    if (!table) return;
    
    // Add sort indicators and functionality only to Status column
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        const columnText = header.textContent.trim();
        
        // Make only Status column sortable
        if (columnText === 'Status') {
            // Add sort icon
            header.innerHTML = `${columnText} <i class="bi bi-arrow-down-up sort-icon"></i>`;
            header.classList.add('sortable');
            header.style.cursor = 'pointer';
            
            // Add click event
            header.addEventListener('click', () => sortTable(index, 'status'));
        }
    });
}

/**
 * Sort the inventory table
 * @param {number} columnIndex - The index of the column to sort by
 * @param {string} type - The type of data ('status' only)
 */
function sortTable(columnIndex, type) {
    const table = document.querySelector('#inventory-section table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('th')[columnIndex];
    
    // Toggle sort direction
    const currentDirection = header.getAttribute('data-sort-direction') || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    
    // Update all header attributes and icons
    document.querySelectorAll('th').forEach(th => {
        th.removeAttribute('data-sort-direction');
        const sortIcon = th.querySelector('.sort-icon');
        if (sortIcon) {
            sortIcon.classList.remove('bi-arrow-up', 'bi-arrow-down');
            sortIcon.classList.add('bi-arrow-down-up');
        }
    });
    
    // Update current header
    header.setAttribute('data-sort-direction', newDirection);
    const icon = header.querySelector('.sort-icon');
    if (icon) {
        icon.classList.remove('bi-arrow-down-up');
        icon.classList.add(newDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down');
    }
    
    // Sort the rows
    rows.sort((a, b) => {
        // We only sort by status now
        const valueA = getStatusPriority(a.querySelector(`td:nth-child(${columnIndex + 1}) .status-badge`).textContent.trim());
        const valueB = getStatusPriority(b.querySelector(`td:nth-child(${columnIndex + 1}) .status-badge`).textContent.trim());
        
        // Compare values
        if (valueA < valueB) return newDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return newDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Reorder rows in the table
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Get numerical priority for status values (for sorting)
 * @param {string} status - Status text
 * @returns {number} - Priority value (lower = more critical)
 */
function getStatusPriority(status) {
    switch (status.toLowerCase()) {
        case 'critical': return 1;
        case 'warning': return 2;
        case 'ok': return 3;
        default: return 4;
    }
}
