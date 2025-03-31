/**
 * Form.js - Handles the popup form that appears when clicking anywhere on the website
 */

// Get Airtable API keys from environment variables
// These are loaded from config.js which is populated during build time
document.addEventListener('DOMContentLoaded', () => {
    // Create the form overlay and insert it into the document
    createFormOverlay();
    
    // Add click event listener to the entire document (excluding the form itself)
    setupClickListener();
    
    // Add form submission handler
    setupFormSubmission();
});

/**
 * Create the form overlay and append it to the body
 */
function createFormOverlay() {
    const formHtml = `
        <div id="form-overlay" class="form-overlay hidden">
            <div class="form-popup" id="contact-form-popup">
                <div class="form-header">
                    <h3>Contact Us</h3>
                    <button type="button" class="close-btn" id="form-close-btn">×</button>
                </div>
                <form id="contact-form">
                    <div class="form-group">
                        <label for="name">Name <span class="required">*</span></label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="company">Company <span class="required">*</span></label>
                        <input type="text" id="company" name="company" required>
                    </div>
                    <div class="form-group">
                        <label for="position">Position <span class="required">*</span></label>
                        <input type="text" id="position" name="position" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Submit</button>
                    </div>
                </form>
                <div id="form-success" class="form-success hidden">
                    <i class="bi bi-check-circle-fill"></i>
                    <h4>Thank you!</h4>
                    <p>Your information has been submitted. We'll be in touch soon.</p>
                    <button type="button" class="close-success-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

/**
 * Set up click listener on document to show form
 */
function setupClickListener() {
    // Get form elements
    const formOverlay = document.getElementById('form-overlay');
    const formPopup = document.getElementById('contact-form-popup');
    const closeBtn = document.getElementById('form-close-btn');
    const successCloseBtn = document.querySelector('.close-success-btn');
    
    // Add click event to the document (except on the form itself)
    document.addEventListener('click', (event) => {
        // Ignore clicks on the form itself
        if (formPopup && formPopup.contains(event.target)) {
            return;
        }
        
        // If form already shown, don't show it again
        if (formOverlay && !formOverlay.classList.contains('hidden')) {
            return;
        }
        
        // Show the form
        if (formOverlay) {
            formOverlay.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        }
    });
    
    // Close button handler
    if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click handler from firing
            formOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Success screen close button handler
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click handler from firing
            
            // Hide success message and form overlay
            document.getElementById('form-success').classList.add('hidden');
            formOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            
            // Reset the form for next use
            document.getElementById('contact-form').reset();
            document.getElementById('contact-form').classList.remove('hidden');
        });
    }
    
    // Prevent form overlay from closing when clicking on the form itself
    if (formPopup) {
        formPopup.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click handler from firing
        });
    }
}

/**
 * Set up form submission handler
 */
function setupFormSubmission() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                position: document.getElementById('position').value,
                email: document.getElementById('email').value
            };
            
            try {
                // Submit to Airtable
                await submitToAirtable(formData);
                
                // Show success message
                form.classList.add('hidden');
                document.getElementById('form-success').classList.remove('hidden');
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting the form. Please try again.');
            }
        });
    }
}

/**
 * Submit form data to Airtable
 * @param {Object} data - Form data
 * @returns {Promise} - Airtable API response
 */
async function submitToAirtable(data) {
    try {
        // Get environment variables from window.env (set in config.js)
        // Use optional chaining to prevent destructuring errors
        const AIRTABLE_API_KEY = window.env?.AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = window.env?.AIRTABLE_BASE_ID;
        const AIRTABLE_TABLE_ID = window.env?.AIRTABLE_TABLE_ID;
        
        // Check if configuration exists
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
            throw new Error('Airtable configuration is missing. Please check your environment variables.');
        }
        
        // Log the request URL and data for debugging
        console.log(`Submitting to: https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
        
        // Try with single record format first, which is simpler
        const requestBody = {
            fields: {
                'Name': data.name,
                'Company': data.company,
                'Position': data.position,
                'Email': data.email
            },
            typecast: true // Enable automatic type conversion
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        // Create the request to Airtable
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        // Log response status for debugging
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable error response:', errorText);
            throw new Error(`Airtable API error: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error('Error in submitToAirtable:', error);
        throw error;
    }
} 