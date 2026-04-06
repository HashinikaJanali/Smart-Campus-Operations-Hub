package Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class ResourceModel {

    @Id
    private String id;

    private String name;
    private String type;
    private String location;
    private int capacity;
    private String status;
    private String availableFrom;
    private String availableTo;
    private String description;

    // CONSTRUCTORS
    public ResourceModel() {}

    public ResourceModel(String id, String name, String type,
                         String location, int capacity, String status,
                         String availableFrom, String availableTo,
                         String description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.capacity = capacity;
        this.status = status;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.description = description;
    }

    // GETTERS
    public String getId()           { return id; }
    public String getName()         { return name; }
    public String getType()         { return type; }
    public String getLocation()     { return location; }
    public int    getCapacity()     { return capacity; }
    public String getStatus()       { return status; }
    public String getAvailableFrom(){ return availableFrom; }
    public String getAvailableTo()  { return availableTo; }
    public String getDescription()  { return description; }

    // SETTERS
    public void setId(String id)                    { this.id = id; }
    public void setName(String name)                { this.name = name; }
    public void setType(String type)                { this.type = type; }
    public void setLocation(String location)        { this.location = location; }
    public void setCapacity(int capacity)           { this.capacity = capacity; }
    public void setStatus(String status)            { this.status = status; }
    public void setAvailableFrom(String availableFrom){ this.availableFrom = availableFrom; }
    public void setAvailableTo(String availableTo)  { this.availableTo = availableTo; }
    public void setDescription(String description)  { this.description = description; }
}