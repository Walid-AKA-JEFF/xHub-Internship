package com.example.xhublearning.controller;

import com.example.xhublearning.Customer;
import com.example.xhublearning.service.CustomerService;
import com.example.xhublearning.service.CustomerEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerEventService customerEventService;

    @Autowired
    private CustomerService customerService;

    public CustomerController(CustomerEventService customerEventService) {
        this.customerEventService = customerEventService;
    }

    // GET all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // GET customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);

        // Publish customer created event
        customerEventService.publishCustomerCreated(savedCustomer);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    // PUT update existing customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        customer.setId(id);
        Customer updatedCustomer = customerService.updateCustomer(customer);

        // Publish customer updated event
        customerEventService.publishCustomerUpdated(updatedCustomer);

        return ResponseEntity.ok(updatedCustomer);
    }

    // DELETE customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        // Publish customer deleted event before deletion
        customerEventService.publishCustomerDeleted(id);

        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}