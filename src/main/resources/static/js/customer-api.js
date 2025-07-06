// Create a new customer
async function createCustomer(customerData) {
    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error('Failed to create customer');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

// Update an existing customer
async function updateCustomer(customerId, customerData) {
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error('Failed to update customer');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
}

// Delete a customer
async function deleteCustomer(customerId) {
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete customer');
        }

        return true;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
}

// Get all customers
async function getAllCustomers() {
    try {
        const response = await fetch('/api/customers');

        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}
