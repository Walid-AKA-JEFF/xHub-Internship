package com.example.xhublearning.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerEvent {
    private String eventType; // CREATE, UPDATE, DELETE
    private Long customerId;
    private String customerData; // JSON representation of customer
}
