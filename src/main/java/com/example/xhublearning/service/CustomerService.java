package com.example.xhublearning.service;

import com.example.xhublearning.Customer;
import com.example.xhublearning.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // Create/Save customer
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Update customer
    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Delete customer
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
