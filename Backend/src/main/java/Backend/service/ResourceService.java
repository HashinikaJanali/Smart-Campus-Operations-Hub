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

    // GET ALL
    public List<ResourceModel> getAllResources() {
        return resourceRepository.findAll();
    }

    // GET BY ID
    public ResourceModel getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(id));
    }

    // GET BY TYPE
    public List<ResourceModel> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    // GET BY STATUS
    public List<ResourceModel> getResourcesByStatus(String status) {
        return resourceRepository.findByStatus(status);
    }

    // GET BY LOCATION
    public List<ResourceModel> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }

    // ADD NEW RESOURCE
    public ResourceModel addResource(ResourceModel resourceModel) {
        return resourceRepository.save(resourceModel);
    }

    // UPDATE RESOURCE
    public ResourceModel updateResource(Long id, ResourceModel updatedResource) {
        ResourceModel resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(id));

        resource.setName(updatedResource.getName());
        resource.setType(updatedResource.getType());
        resource.setLocation(updatedResource.getLocation());
        resource.setCapacity(updatedResource.getCapacity());
        resource.setStatus(updatedResource.getStatus());
        resource.setAvailableFrom(updatedResource.getAvailableFrom());
        resource.setAvailableTo(updatedResource.getAvailableTo());
        resource.setDescription(updatedResource.getDescription());

        return resourceRepository.save(resource);
    }

    // DELETE RESOURCE
    public void deleteResource(Long id) {
        ResourceModel resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(id));
        resourceRepository.delete(resource);
    }
}