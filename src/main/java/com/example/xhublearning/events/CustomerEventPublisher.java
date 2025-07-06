package com.example.xhublearning.events;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventPublisher {
    private final ApplicationEventPublisher publisher;

    public CustomerEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void publishCustomerEvent(CustomerEvent event) {
        System.out.println("Publishing customer event: " + event.getEventType() + " for customer ID: " + event.getCustomerId());
        publisher.publishEvent(event);
    }
}
