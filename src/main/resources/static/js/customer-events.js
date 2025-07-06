// Initialize SSE connection
function initCustomerEvents() {
    const eventSource = new EventSource('/api/customer-events/subscribe');

    // Handle customer created events
    eventSource.addEventListener('customer-create', function(event) {
        const customerData = JSON.parse(event.data);
        addCustomerToTable(customerData);
    });

    // Handle customer updated events
    eventSource.addEventListener('customer-update', function(event) {
        const customerData = JSON.parse(event.data);
        updateCustomerInTable(customerData);
    });

    // Handle customer deleted events
    eventSource.addEventListener('customer-delete', function(event) {
        const customerData = JSON.parse(event.data);
        removeCustomerFromTable(customerData.customerId);
    });

    // Handle connection error
    eventSource.onerror = function() {
        console.error('SSE connection error');
        // Attempt to reconnect after a delay
        setTimeout(() => {
            initCustomerEvents();
        }, 5000);
    };
}

// Add a new customer row to the table
function addCustomerToTable(customerData) {
    const customersTable = document.querySelector('#customers-table tbody');
    if (!customersTable) return;

    const newRow = createCustomerRow(customerData);
    customersTable.appendChild(newRow);
}

// Update an existing customer row in the table
function updateCustomerInTable(customerData) {
    const customerId = customerData.customerId;
    const existingRow = document.querySelector(`tr[data-customer-id="${customerId}"]`);

    if (existingRow) {
        const newRow = createCustomerRow(customerData);
        existingRow.replaceWith(newRow);
    }
}

// Remove a customer row from the table
function removeCustomerFromTable(customerId) {
    const existingRow = document.querySelector(`tr[data-customer-id="${customerId}"]`);

    if (existingRow) {
        existingRow.remove();
    }
}

// Helper function to create a customer table row
function createCustomerRow(customerData) {
    const customer = JSON.parse(customerData.customerData);
    const row = document.createElement('tr');
    row.setAttribute('data-customer-id', customerData.customerId);

    // Populate row with customer data
    // Note: Adjust these fields based on your actual customer properties
    row.innerHTML = `
        <td>${customer.id || ''}</td>
        <td>${customer.name || ''}</td>
        <td>${customer.email || ''}</td>
        <td>
            <button class="edit-btn" onclick="editCustomer(${customer.id})">Edit</button>
            <button class="delete-btn" onclick="deleteCustomer(${customer.id})">Delete</button>
        </td>
    `;

    return row;
}

// Initialize the event source when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initCustomerEvents();
});
