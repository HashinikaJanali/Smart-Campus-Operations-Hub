package Backend.controller;

import Backend.model.TicketModel;
import Backend.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketControllerTest {

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private TicketController ticketController;

    private TicketModel sampleTicket;

    @BeforeEach
    void setUp() {
        sampleTicket = new TicketModel();
        sampleTicket.setId("ticket1");
        sampleTicket.setResource("Projector");
        sampleTicket.setLocation("Room 101");
        sampleTicket.setCategory("Equipment");
        sampleTicket.setDescription("Projector is broken");
        sampleTicket.setPriority("HIGH");
        sampleTicket.setStatus("OPEN");
        sampleTicket.setSubmittedBy("john");
        sampleTicket.setUserId("user1");
    }

    @Test
    void getAllTickets_returnsOkWithTicketList() {
        when(ticketService.getAllTickets()).thenReturn(List.of(sampleTicket));

        ResponseEntity<List<TicketModel>> response = ticketController.getAllTickets();

        List<TicketModel> body = Objects.requireNonNull(response.getBody());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(body).hasSize(1);
        assertThat(body.get(0).getId()).isEqualTo("ticket1");
    }

    @Test
    void getMyTickets_returnsTicketsForGivenUserId() {
        when(ticketService.getMyTickets("user1")).thenReturn(List.of(sampleTicket));

        ResponseEntity<List<TicketModel>> response = ticketController.getMyTickets("user1");

        List<TicketModel> body = Objects.requireNonNull(response.getBody());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(body).hasSize(1);
        assertThat(body.get(0).getUserId()).isEqualTo("user1");
    }

    @Test
    void getTicketById_returnsOkWhenFound() {
        when(ticketService.getTicketById("ticket1")).thenReturn(sampleTicket);

        ResponseEntity<?> response = ticketController.getTicketById("ticket1");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(sampleTicket);
    }

    @Test
    void getTicketById_returns404WhenNotFound() {
        when(ticketService.getTicketById("unknown"))
                .thenThrow(new RuntimeException("Ticket not found with id: unknown"));

        ResponseEntity<?> response = ticketController.getTicketById("unknown");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isEqualTo("Ticket not found with id: unknown");
    }

    @Test
    void createTicket_returnsOkWithCreatedTicket() throws Exception {
        List<MultipartFile> images = List.of();
        when(ticketService.createTicket(
                "Projector", "Room 101", "Equipment", "Broken", "HIGH",
                "john", "user1", "0771234567", "john@test.com", images))
                .thenReturn(sampleTicket);

        ResponseEntity<?> response = ticketController.createTicket(
                "Projector", "Room 101", "Equipment", "Broken", "HIGH",
                "john", "user1", "0771234567", "john@test.com", images);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(sampleTicket);
    }

    @Test
    void createTicket_returnsBadRequestOnServiceException() throws Exception {
        when(ticketService.createTicket(any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any()))
                .thenThrow(new RuntimeException("Storage unavailable"));

        ResponseEntity<?> response = ticketController.createTicket(
                "Projector", "Room 101", "Equipment", "Broken", "HIGH",
                "john", "user1", null, null, List.of());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(Objects.requireNonNull(response.getBody()).toString()).contains("Failed to create ticket");
    }

    @Test
    void updateTicketStatus_returnsOkWithUpdatedTicket() {
        Map<String, String> payload = Map.of("status", "IN_PROGRESS");
        sampleTicket.setStatus("IN_PROGRESS");
        when(ticketService.updateTicketStatus("ticket1", payload)).thenReturn(sampleTicket);

        ResponseEntity<?> response = ticketController.updateTicketStatus("ticket1", payload);

        TicketModel body = (TicketModel) Objects.requireNonNull(response.getBody());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(body.getStatus()).isEqualTo("IN_PROGRESS");
    }

    @Test
    void updateTicketStatus_returnsBadRequestWhenTicketNotFound() {
        Map<String, String> payload = Map.of("status", "RESOLVED");
        when(ticketService.updateTicketStatus("unknown", payload))
                .thenThrow(new RuntimeException("Ticket not found with id: unknown"));

        ResponseEntity<?> response = ticketController.updateTicketStatus("unknown", payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Ticket not found with id: unknown");
    }

    @Test
    void assignTicket_returnsOkWithAssignedTicket() {
        Map<String, String> payload = Map.of("assignedTo", "Alice");
        sampleTicket.setAssignedTo("Alice");
        sampleTicket.setStatus("IN_PROGRESS");
        when(ticketService.assignTicket("ticket1", "Alice")).thenReturn(sampleTicket);

        ResponseEntity<?> response = ticketController.assignTicket("ticket1", payload);

        TicketModel body = (TicketModel) Objects.requireNonNull(response.getBody());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(body.getAssignedTo()).isEqualTo("Alice");
        assertThat(body.getStatus()).isEqualTo("IN_PROGRESS");
    }

    @Test
    void deleteTicket_returnsOkOnSuccess() {
        doNothing().when(ticketService).deleteTicket("ticket1");

        ResponseEntity<?> response = ticketController.deleteTicket("ticket1");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Ticket deleted successfully.");
        verify(ticketService).deleteTicket("ticket1");
    }
}
