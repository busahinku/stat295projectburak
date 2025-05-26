package objects;

public interface Prescribable {
    String DescribePrescription();
    String GeneralInfo();

    Doctor getDoctor();
    Patient getPatient();
} 