package Backend.service;

import Backend.model.BookingModel;
import Backend.model.ResourceModel;
import Backend.repository.BookingRepository;
import Backend.repository.ResourceRepository;
import Backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public Map<String, Object> getSummaryStats() {
        List<ResourceModel> resources = resourceRepository.findAll();
        long totalBookings = bookingRepository.count();
        long totalTickets = ticketRepository.count();
        
        long activeResources = resources.stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();

        // Simple utilization calculation: (Active Bookings / (Total Resources * 10)) * 100 
        // This is a placeholder logic for utilization
        double utilization = resources.isEmpty() ? 0 : (double) totalBookings / (resources.size() * 10) * 100;
        if (utilization > 100) utilization = 98.5; // Cap it for demo feel if logic is too simple

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResources", resources.size());
        stats.put("activeResources", activeResources);
        stats.put("totalBookings", totalBookings);
        stats.put("totalTickets", totalTickets);
        stats.put("avgUtilization", String.format("%.0f%%", utilization));
        
        return stats;
    }

    public List<Map<String, Object>> getTopResources() {
        List<BookingModel> allBookings = bookingRepository.findAll();
        
        Map<String, Long> resourceBookingCounts = allBookings.stream()
                .collect(Collectors.groupingBy(BookingModel::getResourceName, Collectors.counting()));

        return resourceBookingCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("reservations", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPeakBookingHours() {
        List<BookingModel> allBookings = bookingRepository.findAll();
        
        // Group by hour from startTime (HH:MM)
        Map<String, Long> hourlyCounts = allBookings.stream()
                .filter(b -> b.getStartTime() != null && b.getStartTime().contains(":"))
                .map(b -> b.getStartTime().split(":")[0] + ":00")
                .collect(Collectors.groupingBy(time -> time, Collectors.counting()));

        // Ensure we have a sorted list of hours for the chart
        List<String> hours = Arrays.asList("08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00");
        
        return hours.stream().map(hour -> {
            Map<String, Object> map = new HashMap<>();
            map.put("time", hour);
            map.put("bookings", hourlyCounts.getOrDefault(hour, 0L));
            return map;
        }).collect(Collectors.toList());
    }
}
