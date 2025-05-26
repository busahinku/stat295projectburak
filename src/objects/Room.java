package objects;

public class Room {
    private String roomName;
    private String roomType;
    private int capacity;
    private boolean isAvailable;
    private Patient currentPatient;
    private double hourlyRate;
    private String equipment;

    public Room(String roomName, String roomType, int capacity, double hourlyRate, String equipment) {
        if (roomName == null || roomType == null || capacity <= 0 || hourlyRate <= 0 || equipment == null) {
            throw new IllegalArgumentException("Room name, room type, capacity, hourly rate, and equipment cannot be null or capacity cannot be less than 0 or hourly rate cannot be less than 0.");
        } // room cannot be created without these.

        this.roomName = roomName;
        this.roomType = roomType;
        this.capacity = capacity;
        this.isAvailable = true;
        this.hourlyRate = hourlyRate;
        this.equipment = equipment;
    }

    // Getters
    public String getRoomName() {
        return roomName;
    }

    public String getRoomType() {
        return roomType;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    // Setters
    public void setCapacity(int capacity) {
        if (capacity < 1) {
            throw new IllegalArgumentException("Capacity must be at least 1.");
        }
        this.capacity = capacity;
    }


    // Methods
    public void assignPatient(Patient patient) {
        if (this.currentPatient == null) {
            this.currentPatient = patient;
            this.isAvailable = false;
            System.out.println("Patient " + patient.getFullName() + " assigned to room " + roomName);
        } else {
            System.out.println("Room " + roomName + " is already occupied");
        }
    }

    public String GeneralInfo() {
        String status;
        if (currentPatient != null) {
            status = "Occupied";
        } else {
            status = "Available";
        }

        return "Room Name: " + roomName +
                ", Type: " + roomType +
                ", Rate: $" + hourlyRate + "/hr" +
                ", Equipment: " + equipment +
                ", Status: " + status + "";
    }
}