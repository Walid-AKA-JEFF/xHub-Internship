package com.example.xhublearning.repository;

import com.example.xhublearning.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Custom query methods can be added here if needed
}