package objects;

import java.util.ArrayList;
import java.util.List;

public class Patient extends Person {
    private static int patientCounter = 1;
    private boolean hasInsurance;
    private String insuranceProvider;
    private double balance;
    public List<Appointment> appointments;
    public List<Prescription> prescriptions;
    private MedicalRecord medicalRecord;
    public List<Bill> bills;


    public static String generateNewPatientId() { // Idea Comes From ChatGPT
        return "P" + String.format("%04d", patientCounter++);
    }

    public Patient(String id, String firstName, String lastName, int age, char gender,
                  String phoneNumber, String username, String password,
                  boolean hasInsurance, String insuranceProvider) {

        super(id, firstName, lastName, age, gender, phoneNumber, username, password);

        if (id == null || firstName == null || lastName == null || age <= 0 || gender == '\0' || phoneNumber == null || username == null || password == null) {
            throw new IllegalArgumentException("ID, first name, last name, age, gender, phone number, username, and password cannot be null or age cannot be less than 0.");
        } // patient cannot be created without these.
        this.hasInsurance = hasInsurance;
        this.insuranceProvider = insuranceProvider;
        this.balance = 0.0;
        this.appointments = new ArrayList<>();
        this.prescriptions = new ArrayList<>();
        this.bills = new ArrayList<>();
        this.medicalRecord = null;
    }

    // Getters
    public boolean hasInsurance() {
        return hasInsurance;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }


    public double getBalance() {
        return balance;
    }

    public List<Appointment> getAppointments() {
        return new ArrayList<>(appointments);
    }

    public List<Prescription> getPrescriptions() {
        return new ArrayList<>(prescriptions);
    }

    public MedicalRecord getMedicalRecord() {
        return medicalRecord;
    }

    public List<Bill> getBills() {
        return new ArrayList<>(bills);
    }

    // Setters
    public void setHasInsurance(boolean hasInsurance) {
        this.hasInsurance = hasInsurance;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }


    public void setMedicalRecord(MedicalRecord medicalRecord) {
        this.medicalRecord = medicalRecord;
    }

    // Methods
    public void addAppointment(Appointment appointment) {
        if (!appointments.contains(appointment)) {
            appointments.add(appointment);
        }
    }

    public void addPrescription(Prescription prescription) {
        if (!prescriptions.contains(prescription)) {
            prescriptions.add(prescription);
            if (medicalRecord != null) {
                medicalRecord.addMedication(prescription.getMedication());
            }
        }
    }


    public void setBalance(double balance) {
        this.balance = balance;
    }

    @Override
    public String GeneralInfo() {
        String insurance;
        if (hasInsurance) {
            insurance = insuranceProvider;
        } else {
            insurance = "None";
        }

        return "Patient [Name: " + getFullName() +
                ", Age: " + getAge() +
                ", Insurance: " + insurance +
                ", Balance: $" + balance;
    }
}
