package objects;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class Appointment {
    private static int appointmentCounter = 1;
    public static String generateNewAppointmentId() {
        return "APP" + String.format("%04d", appointmentCounter++);
    }

    private String appointmentId;
    private Patient patient;
    private Doctor doctor;
    private LocalDateTime dateTime;
    private String status;
    private double cost;
    private boolean paid;
    private int durationMinutes;

    public Appointment(String appointmentId, Patient patient, Doctor doctor, LocalDateTime dateTime) {
        if (appointmentId == null || patient == null || doctor == null || dateTime == null) {
            throw new IllegalArgumentException("Appointment ID, patient, doctor, and date time cannot be null.");
        } // appointment cannot be created without these.

        this.appointmentId = appointmentId;
        this.patient = patient;
        this.doctor = doctor;
        this.dateTime = dateTime;
        this.status = "Scheduled";
        this.durationMinutes = 30; // Appointments are 30 minutes by default
        this.cost = 50.0;
        this.paid = false;
    }

    // Second Constructor
    public Appointment(Patient patient, Doctor doctor, StaticSchedule.Day day, LocalTime time) {
        this.appointmentId = generateNewAppointmentId();
        this.patient = patient;
        this.doctor = doctor;
        this.dateTime = LocalDateTime.of(2025, 5, 28, time.getHour(), time.getMinute());
        this.status = "Scheduled";
        this.durationMinutes = 30;
        this.cost =  50.0;
        this.paid = false;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
        if (doctor.isPrivateDoctor()) {
            this.cost = doctor.getPrivateFee()* durationMinutes; // Adjust cost based on duration
        }
    }

    public String GeneralInfo() {
        return "Appointment ID: " + appointmentId +
                ", Patient: " + patient.getFullName() +
                ", Doctor: " + doctor.getFullName() +
                ", Date: " + dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) +
                ", Duration: " + durationMinutes + " minutes" +
                ", Status: " + status +
                ", Cost: $" + cost +
                ", Paid: " + paid;
    }
}
