package Backend.controller;

import Backend.model.ResourceModel;
import Backend.service.ResourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResourceControllerTest {

    @Mock
    private ResourceService resourceService;

    @InjectMocks
    private ResourceController resourceController;

    private ResourceModel resource1;
    private ResourceModel resource2;

    @BeforeEach
    void setUp() {
        resource1 = new ResourceModel("1", "Projector", "Equipment", "Room 101", 10, "Available", "09:00", "17:00", "A 1080p projector");
        resource2 = new ResourceModel("2", "Room 102", "Room", "Building A", 30, "Maintenance", "00:00", "23:59", "Conference room");
    }

    @Test
    void getAllResources_ShouldReturnOk() {
        when(resourceService.getAllResources()).thenReturn(Arrays.asList(resource1, resource2));

        ResponseEntity<List<ResourceModel>> response = resourceController.getAllResources();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void getById_ShouldReturnOk() {
        when(resourceService.getResourceById("1")).thenReturn(resource1);

        ResponseEntity<ResourceModel> response = resourceController.getById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Projector", response.getBody().getName());
    }

    @Test
    void getByType_ShouldReturnOk() {
        when(resourceService.getResourcesByType("Equipment")).thenReturn(Arrays.asList(resource1));

        ResponseEntity<List<ResourceModel>> response = resourceController.getByType("Equipment");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Equipment", response.getBody().get(0).getType());
    }

    @Test
    void getByStatus_ShouldReturnOk() {
        when(resourceService.getResourcesByStatus("Available")).thenReturn(Arrays.asList(resource1));

        ResponseEntity<List<ResourceModel>> response = resourceController.getByStatus("Available");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Available", response.getBody().get(0).getStatus());
    }

    @Test
    void getByLocation_ShouldReturnOk() {
        when(resourceService.getResourcesByLocation("Room 101")).thenReturn(Arrays.asList(resource1));

        ResponseEntity<List<ResourceModel>> response = resourceController.getByLocation("Room 101");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Room 101", response.getBody().get(0).getLocation());
    }

    @Test
    void addResource_ShouldReturnCreated() {
        when(resourceService.addResource(any(ResourceModel.class))).thenReturn(resource1);

        ResponseEntity<ResourceModel> response = resourceController.addResource(resource1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Projector", response.getBody().getName());
    }

    @Test
    void updateResource_ShouldReturnOk() {
        when(resourceService.updateResource(eq("1"), any(ResourceModel.class))).thenReturn(resource1);

        ResponseEntity<ResourceModel> response = resourceController.updateResource("1", resource1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Projector", response.getBody().getName());
    }

    @Test
    void deleteResource_ShouldReturnOk() {
        doNothing().when(resourceService).deleteResource("1");

        ResponseEntity<String> response = resourceController.deleteResource("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Resource deleted successfully!", response.getBody());
        verify(resourceService, times(1)).deleteResource("1");
    }
}
