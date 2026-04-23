package Backend.controller;

import Backend.model.ResourceModel;
import Backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceModel>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceModel> getById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceModel>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(resourceService.getResourcesByType(type));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ResourceModel>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(resourceService.getResourcesByStatus(status));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<ResourceModel>> getByLocation(@PathVariable String location) {
        return ResponseEntity.ok(resourceService.getResourcesByLocation(location));
    }

    @PostMapping
    public ResponseEntity<ResourceModel> addResource(@RequestBody ResourceModel resource) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.addResource(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceModel> updateResource(
            @PathVariable String id,
            @RequestBody ResourceModel updated) {
        return ResponseEntity.ok(resourceService.updateResource(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted successfully!");
    }
}
