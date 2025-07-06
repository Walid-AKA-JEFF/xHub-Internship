// Handle customer form submission
document.addEventListener('DOMContentLoaded', function() {
    const customerForm = document.getElementById('customer-form');

    if (customerForm) {
        customerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form data
            const formData = new FormData(customerForm);
            const customerData = {};

            formData.forEach((value, key) => {
                customerData[key] = value;
            });

            try {
                // Check if we're updating or creating
                if (customerData.id) {
                    // Update existing customer
                    await updateCustomer(customerData.id, customerData);
                    showNotification('Customer updated successfully');
                } else {
                    // Create new customer
                    await createCustomer(customerData);
                    showNotification('Customer created successfully');
                    customerForm.reset(); // Reset form after creating
                }
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        });
    }

    // Set up delete button handlers
    document.addEventListener('click', async function(event) {
        if (event.target && event.target.classList.contains('delete-btn')) {
            const customerId = event.target.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this customer?')) {
                try {
                    await deleteCustomer(customerId);
                    showNotification('Customer deleted successfully');
                } catch (error) {
                    showNotification('Error: ' + error.message, 'error');
                }
            }
        }
    });
});

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}
