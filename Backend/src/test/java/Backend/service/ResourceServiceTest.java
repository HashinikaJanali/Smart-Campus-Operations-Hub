package Backend.service;

import Backend.exception.ResourceNotFoundException;
import Backend.model.ResourceModel;
import Backend.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    private ResourceModel resource1;
    private ResourceModel resource2;

    @BeforeEach
    void setUp() {
        resource1 = new ResourceModel("1", "Projector", "Equipment", "Room 101", 10, "Available", "09:00", "17:00", "A 1080p projector");
        resource2 = new ResourceModel("2", "Room 102", "Room", "Building A", 30, "Maintenance", "00:00", "23:59", "Conference room");
    }

    @Test
    void getAllResources_ShouldReturnList() {
        when(resourceRepository.findAll()).thenReturn(Arrays.asList(resource1, resource2));

        List<ResourceModel> result = resourceService.getAllResources();

        assertEquals(2, result.size());
        verify(resourceRepository, times(1)).findAll();
    }

    @Test
    void getResourceById_ShouldReturnResource_WhenExists() {
        when(resourceRepository.findById("1")).thenReturn(Optional.of(resource1));

        ResourceModel result = resourceService.getResourceById("1");

        assertNotNull(result);
        assertEquals("Projector", result.getName());
    }

    @Test
    void getResourceById_ShouldThrowException_WhenNotExists() {
        when(resourceRepository.findById("99")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> resourceService.getResourceById("99"));
    }

    @Test
    void getResourcesByType_ShouldReturnList() {
        when(resourceRepository.findByType("Equipment")).thenReturn(Arrays.asList(resource1));

        List<ResourceModel> result = resourceService.getResourcesByType("Equipment");

        assertEquals(1, result.size());
        assertEquals("Equipment", result.get(0).getType());
    }

    @Test
    void getResourcesByStatus_ShouldReturnList() {
        when(resourceRepository.findByStatus("Available")).thenReturn(Arrays.asList(resource1));

        List<ResourceModel> result = resourceService.getResourcesByStatus("Available");

        assertEquals(1, result.size());
        assertEquals("Available", result.get(0).getStatus());
    }

    @Test
    void getResourcesByLocation_ShouldReturnList() {
        when(resourceRepository.findByLocation("Room 101")).thenReturn(Arrays.asList(resource1));

        List<ResourceModel> result = resourceService.getResourcesByLocation("Room 101");

        assertEquals(1, result.size());
        assertEquals("Room 101", result.get(0).getLocation());
    }

    @Test
    void addResource_ShouldReturnSavedResource() {
        when(resourceRepository.save(any(ResourceModel.class))).thenReturn(resource1);

        ResourceModel result = resourceService.addResource(resource1);

        assertNotNull(result);
        assertEquals("Projector", result.getName());
    }

    @Test
    void updateResource_ShouldReturnUpdatedResource_WhenExists() {
        when(resourceRepository.findById("1")).thenReturn(Optional.of(resource1));
        when(resourceRepository.save(any(ResourceModel.class))).thenReturn(resource1);

        ResourceModel updatedInfo = new ResourceModel();
        updatedInfo.setName("Updated Projector");
        updatedInfo.setType("Equipment");

        ResourceModel result = resourceService.updateResource("1", updatedInfo);

        assertNotNull(result);
        assertEquals("Updated Projector", result.getName());
        verify(resourceRepository, times(1)).save(any(ResourceModel.class));
    }

    @Test
    void updateResource_ShouldThrowException_WhenNotExists() {
        when(resourceRepository.findById("99")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> resourceService.updateResource("99", resource1));
    }

    @Test
    void deleteResource_ShouldCallDelete_WhenExists() {
        when(resourceRepository.findById("1")).thenReturn(Optional.of(resource1));
        doNothing().when(resourceRepository).delete(resource1);

        resourceService.deleteResource("1");

        verify(resourceRepository, times(1)).delete(resource1);
    }

    @Test
    void deleteResource_ShouldThrowException_WhenNotExists() {
        when(resourceRepository.findById("99")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> resourceService.deleteResource("99"));
    }
}
