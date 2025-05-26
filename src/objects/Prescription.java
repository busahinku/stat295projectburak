package objects;

import java.time.LocalDateTime;

public class Prescription implements Prescribable {
    private String medication;
    private String dosageType;
    private String usage;
    private Patient patient;
    private Doctor doctor;
    private LocalDateTime issueDate;
    private String notes;

    public Prescription(String medication, String dosageType, String usage,
                       Patient patient, Doctor doctor, String notes) {
        
        if (medication == null || patient == null || doctor == null) {
            throw new IllegalArgumentException("Medication, patient, and doctor cannot be null.");
        } // prescription cannot be created without these.
        this.medication = medication;
        this.dosageType = dosageType;
        this.usage = usage;
        this.patient = patient;
        this.doctor = doctor;
        this.issueDate = LocalDateTime.now();
        this.notes = notes;
    }

    // Getters
    public String getMedication() {
        return medication;
    }

    public String getDosageType() {
        return dosageType;
    }

    public String getUsage() {
        return usage;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public String getNotes() {
        return notes;
    }

    @Override
    public String DescribePrescription() {
        return "Medication: " + medication +
               "\nDosage Type: " + dosageType +
               "\nUsage: " + usage +
               "\nNotes: " + notes;
    }

    @Override
    public String GeneralInfo() {
        return "Prescription Medication: " + medication +
                ", Type: " + dosageType +
                ", Usage: " + usage +
                ", Patient: " + patient.getFullName() +
                ", Doctor: " + doctor.getFullName() +
                ", Date: " + issueDate;
    }
}
