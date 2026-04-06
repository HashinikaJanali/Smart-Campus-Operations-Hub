package Backend.service;

import Backend.exception.ResourceNotFoundException;
import Backend.model.ResourceModel;
import Backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<ResourceModel> getAllResources() {
        return resourceRepository.findAll();
    }

    public ResourceModel getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Resource not found: " + id));
    }

    public List<ResourceModel> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<ResourceModel> getResourcesByStatus(String status) {
        return resourceRepository.findByStatus(status);
    }

    public List<ResourceModel> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }

    public ResourceModel addResource(ResourceModel resource) {
        return resourceRepository.save(resource);
    }

    public ResourceModel updateResource(String id, ResourceModel updated) {
        ResourceModel existing = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Resource not found: " + id));

        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setLocation(updated.getLocation());
        existing.setCapacity(updated.getCapacity());
        existing.setStatus(updated.getStatus());
        existing.setAvailableFrom(updated.getAvailableFrom());
        existing.setAvailableTo(updated.getAvailableTo());
        existing.setDescription(updated.getDescription());

        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        ResourceModel existing = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Resource not found: " + id));
        resourceRepository.delete(existing);
    }
}