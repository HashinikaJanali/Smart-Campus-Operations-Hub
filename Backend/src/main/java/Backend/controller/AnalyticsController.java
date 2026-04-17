package Backend.controller;

import Backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")

public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSummaryStats() {
        return ResponseEntity.ok(analyticsService.getSummaryStats());
    }

    @GetMapping("/top-resources")
    public ResponseEntity<List<Map<String, Object>>> getTopResources() {
        return ResponseEntity.ok(analyticsService.getTopResources());
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<List<Map<String, Object>>> getPeakBookingHours() {
        return ResponseEntity.ok(analyticsService.getPeakBookingHours());
    }
}
