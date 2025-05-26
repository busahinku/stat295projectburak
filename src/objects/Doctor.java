package objects;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class Doctor extends Person {
    private static int doctorCounter = 1;
    public static String generateNewDoctorId() {
        return "D" + String.format("%03d", doctorCounter++);
    }
    private String department; // This is string because hiring a doctor depends to the founder. This should be considered speciality
    private String specialty;
    private String officeNumber;
    private short experience;
    private boolean isPrivate;
    private double salary; // Monthly salary for hospital doctors
    private String privatePracticeLocation; // For private doctors only
    public List<Appointment> appointments;
    public List<Patient> patients;
    private double privateFee;
    private StaticSchedule staticSchedule;
    public List<Review> reviews;

    public Doctor(String id, String firstName, String lastName, int age, char gender, String phoneNumber,
                 String username, String password, String department, String specialty, String officeNumber,
                  boolean isPrivate, double salary) {
        super(id, firstName, lastName, age, gender, phoneNumber, username, password);
        this.department = department;
        this.specialty = specialty;
        this.officeNumber = officeNumber;
        this.isPrivate = isPrivate;
        this.salary = salary;
        this.appointments = new ArrayList<>();
        this.patients = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.staticSchedule = new StaticSchedule();
        this.privateFee = 250.0;
    }

    // Getters
    public String getDepartment() {
        return department;
    }

    public String getSpecialty() {
        return specialty;
    }

    public String getOfficeNumber() {
        return officeNumber;
    }

    public double getPrivateFee() {
        return privateFee;
    }

    public short getExperience() {
        return experience;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public double getSalary() {
        return salary;
    }

    public String getPrivatePracticeLocation() {
        return privatePracticeLocation;
    }

    public List<Appointment> getAppointments() {
        return new ArrayList<>(appointments);
    }

    public List<Patient> getPatients() {
        return new ArrayList<>(patients);
    }

    public StaticSchedule getStaticSchedule() {
        return staticSchedule;
    }

    public List<Review> getReviews() {
        return new ArrayList<>(reviews);
    }

    public boolean isPrivateDoctor() {
        return isPrivate;
    }
    

    // Setters
    public void setDepartment(String department) {
        this.department = department;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public void setPrivatePracticeLocation(String location) {
            this.privatePracticeLocation = location;
    }

    public void setStaticSchedule(StaticSchedule schedule) {
        this.staticSchedule = schedule;
    }

    public void setPrivateFee(double privateFee) {
        this.privateFee = privateFee;
    }

    // Methods
    public void addReview(Review review) {
        reviews.add(review);
    }

    public double calculateAverageRating() {
        if (reviews.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Review review : reviews) {
            sum += review.getRating();
        }
        return sum / reviews.size();
    }

    @Override
    public String GeneralInfo() {
        String Info = "Doctor Name: " + getFullName() +
                ", Specialty: " + specialty +
                ", Experience: " + experience + " years.";

        String result;
        if (isPrivate) {
            result = Info + ", Private Practice at: " + privatePracticeLocation +
                    ", Fee: $" + privateFee;
        } else {
            result = Info + ", Department: " + department +
                    ", Office: " + officeNumber;
        }
        return result;
    }

    public Appointment scheduleAppointment(Patient patient, StaticSchedule.Day day, LocalTime time) {
        Appointment appointment = new Appointment(patient, this, day, time);
        appointments.add(appointment);
        patient.addAppointment(appointment);
        if (!patients.contains(patient)) {
            patients.add(patient);
        }
        return appointment;
    }
}
