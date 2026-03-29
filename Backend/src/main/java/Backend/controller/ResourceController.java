package Backend.controller;

import Backend.model.ResourceModel;
import Backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // GET ALL
    @GetMapping
    public ResponseEntity<List<ResourceModel>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ResourceModel> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // GET BY TYPE
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceModel>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(resourceService.getResourcesByType(type));
    }

    // GET BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ResourceModel>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(resourceService.getResourcesByStatus(status));
    }

    // GET BY LOCATION
    @GetMapping("/location/{location}")
    public ResponseEntity<List<ResourceModel>> getByLocation(@PathVariable String location) {
        return ResponseEntity.ok(resourceService.getResourcesByLocation(location));
    }

    // POST
    @PostMapping
    public ResponseEntity<ResourceModel> addResource(@RequestBody ResourceModel resourceModel) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.addResource(resourceModel));
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<ResourceModel> updateResource(
            @PathVariable Long id,
            @RequestBody ResourceModel updatedResource) {
        return ResponseEntity.ok(resourceService.updateResource(id, updatedResource));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted successfully!");
    }
}