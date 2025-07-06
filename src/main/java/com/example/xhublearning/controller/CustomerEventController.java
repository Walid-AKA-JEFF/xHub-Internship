package com.example.xhublearning.controller;

import com.example.xhublearning.events.CustomerEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@CrossOrigin
@RequestMapping("/api/customer-events")
public class CustomerEventController {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/subscribe")
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        // Add onCompletion callback to remove the emitter when the client disconnects
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        emitters.add(emitter);
        return emitter;
    }

    @EventListener
    public void handleCustomerEvent(CustomerEvent event) {
        System.out.println("Handling customer event: " + event.getEventType() + ", emitters count: " + emitters.size());
        List<SseEmitter> deadEmitters = new ArrayList<>();

        emitters.forEach(emitter -> {
            try {
                System.out.println("Sending event to client: " + event.getEventType());
                emitter.send(SseEmitter.event()
                        .name("customer-" + event.getEventType().toLowerCase())
                        .data(event));
            } catch (IOException e) {
                System.err.println("Failed to send event to client: " + e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            System.out.println("Removing " + deadEmitters.size() + " dead emitters");
            emitters.removeAll(deadEmitters);
        }
    }
}
