package com.example.xhublearning.service;

import com.example.xhublearning.events.CustomerEvent;
import com.example.xhublearning.events.CustomerEventPublisher;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class CustomerEventService {
    private final CustomerEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    public CustomerEventService(CustomerEventPublisher eventPublisher, ObjectMapper objectMapper) {
        this.eventPublisher = eventPublisher;
        this.objectMapper = objectMapper;
    }

    public void publishCustomerCreated(Object customer) {
        publishCustomerEvent("CREATE", customer);
    }

    public void publishCustomerUpdated(Object customer) {
        publishCustomerEvent("UPDATE", customer);
    }

    public void publishCustomerDeleted(Long customerId) {
        CustomerEvent event = new CustomerEvent("DELETE", customerId, null);
        eventPublisher.publishCustomerEvent(event);
    }

    private void publishCustomerEvent(String eventType, Object customer) {
        try {
            System.out.println("Preparing to publish " + eventType + " event");
            String customerJson = objectMapper.writeValueAsString(customer);
            // Assuming the customer object has an 'id' field
            Long customerId = (Long) getCustomerId(customer);
            System.out.println("Customer ID: " + customerId + ", JSON: " + customerJson);
            CustomerEvent event = new CustomerEvent(eventType, customerId, customerJson);
            eventPublisher.publishCustomerEvent(event);
            System.out.println("Event published successfully");
        } catch (JsonProcessingException e) {
            System.err.println("Error serializing customer: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error serializing customer", e);
        } catch (Exception e) {
            System.err.println("Unexpected error publishing event: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error publishing customer event", e);
        }
    }

    private Long getCustomerId(Object customer) {
        try {
            // This uses reflection to get the ID field from the customer object
            // Adjust as needed based on your actual Customer class structure
            return (Long) customer.getClass().getMethod("getId").invoke(customer);
        } catch (Exception e) {
            throw new RuntimeException("Error getting customer ID", e);
        }
    }
}
