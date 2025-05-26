import objects.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class Main {
    private static Scanner scanner = new Scanner(System.in); /* for Retrieving Data From User we're using scanner */
    private static List<Person> users = new ArrayList<>(); // person List
    private static Person currentUser = null; // there is no assigned person in start with type Person (from Person Class)
    private static List<Department> departments = new ArrayList<>();
    private static List<Inventory> inventoryList = new ArrayList<>();
    private static List<Room> rooms = new ArrayList<>();

    public static void main(String[] args) {
            // creating sample data (initial data) for our program-demo.
            // create departments
            Department cardiology = new Department("Cardiology", null, "Block A");
            Department neurology = new Department("Neurology", null, "Block B");
            departments.add(cardiology); // we should add initial departments to the departments list (list created in this class)
            departments.add(neurology);
        
            // create founder
            Founder founder = new Founder("F001", "Burak Sahin", "Kucuk", 40, 'M', "5319870221",
                    "founder", "founder", 150000.0);
    
            // create doctors
            Doctor cardiologist = new Doctor("D101", "Aysegul", "Özkaya Eren", 30, 'F', "5245287101",
                    "doctor", "doctor", "Cardiology", "Cardiologist", "301", false, 120000.0);
            cardiologist.setStaticSchedule(new StaticSchedule()); // Assigning doctor to a schedule. 9-5
        
            Doctor neurologist = new Doctor("D102", "Prof. Dr. Aysen", "Akkaya", 40, 'M', "512389722",
                    "aysen", "aysen", "Neurology", "Neurologist", "302", false, 110000.0);
            neurologist.setStaticSchedule(new StaticSchedule());
        
            // create patient
            Patient patient = new Patient("P1111", "Berat", "Ozkan", 35, 'M', "5319878790",
                    "patient", "patient", true, "BurakSahinInsurance");
        
            // create pharmacist
            Pharmacist pharmacist = new Pharmacist("PH1111", "Kevin De", "Bruyne", 35, 'M', "52418176236",
                    "pharmacist", "pharmacist", "Main Pharmacy", 80000.0, "Monday-Friday 9AM-5PM");
        
            // create assistant
            Assistant assistant = new Assistant(
                    "A111", "Pelin", "Erkaya", 35, 'F', "52418176236",
                    "assistant", "assistant",
                    neurologist, (short)5, "Adissed",
                    neurology, 100000.0
            );
        
            // assign doctors to departments
            cardiology.setHead(cardiologist); // With using Department.java function
            neurology.setHead(neurologist);
        
            // adding all initialized users to the user class.
            users.add(founder);
            users.add(cardiologist);
            users.add(neurologist);
            users.add(patient);
            users.add(pharmacist);
            users.add(assistant);
        
            // sample inventory items with using Inventory.java constructor.
            inventoryList.add(new Inventory("I001", "Iburamin", "Medication", 100, 10, 1.5, "SahinCo", "Main Pharmacy"));
            inventoryList.add(new Inventory("I002", "Bandage", "Medical Supplies", 50, 5, 0.5, "BurakCo", "Storage"));
            inventoryList.add(new Inventory("I003", "Parol Plus", "Medication", 80, 10, 2.0, "SahinCo", "Main Pharmacy"));
        
            // add some sample rooms with using Room.java constructor
            rooms.add(new Room("201", "Radiology - 1", 2, 50.0, "Radiolog, Radiology Stuff"));
            rooms.add(new Room("202", "Radiology Pro Plus", 2, 50.0, "Radiolog, Radiology Stuff, Much more radio"));
            rooms.add(new Room("101", "Blood", 1, 200.0, "Nurse, Monitor, Blood"));
            rooms.add(new Room("301", "Operating Room - 1", 1, 200.0, "Ventilator, Monitor, Other Equipments"));
            rooms.add(new Room("302", "Operating Room - 2", 1, 500.0, "Though this room is empty, it is still a valid room"));
            rooms.add(new Room("303", "Emergency Room - 1", 4, 300.0, "Stretcher, Equipments"));


        // start the application with while loop until exist working it'll return same thing.
        while (true) {
            if (currentUser == null) {
                showWelcomeMenu(); // we're dealing with functions to generate simple page
            } else {
                showRoleSpecificMenu();
            }
        }
    } // our whole code is done actually :D

    private static void showWelcomeMenu() {
        while (true) {
            System.out.println("\n################################################");
            System.out.println("#### Welcome to Hospital Management System #####");
            System.out.println("################################################");
            System.out.println("####   1. Login                             ####");
            System.out.println("####   2. Register (Patient)                ####");
            System.out.println("####   3. Exit                              ####");
            System.out.println("################################################");
            System.out.print("Select an option type-> (1/2/3): ");

            /* We will use switch because switch and if else are different actually.
            When we are building non-prob things we should use switch. */
            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    login();
                    if (currentUser != null) {
                        return;
                    }
                    break;
                case "2":
                    registerPatient();
                    break;
                case "3":
                    System.out.println("\nThank you for using Hospital Management System. Goodbye!");
                    System.exit(0);
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    private static void registerPatient() {
        System.out.println("\n### Patient Registration ###");

        // generate a new patient ID
        String patientId = Patient.generateNewPatientId();

        System.out.print("First Name: ");
        String firstName = scanner.nextLine();

        System.out.print("Last Name: ");
        String lastName = scanner.nextLine();

        System.out.print("Age: ");
        int age = Integer.parseInt(scanner.nextLine());

        System.out.print("Gender (M/F): ");
        char gender = scanner.nextLine().toUpperCase().charAt(0);

        System.out.print("Phone Number: ");
        String phoneNumber = scanner.nextLine();

        System.out.print("Username: ");
        String username = scanner.nextLine();

        System.out.print("Password: ");
        String password = scanner.nextLine();

        System.out.print("Do you have insurance? (y/n): ");
        boolean hasInsurance = scanner.nextLine().startsWith("y");

        String insuranceProvider = "";
        if (hasInsurance) {
            System.out.print("Insurance Provider: ");
            insuranceProvider = scanner.nextLine();
        }


        // create new patient from above retrieved data call the Patient.java constructor.
        Patient newPatient = new Patient(
                patientId,
                firstName,
                lastName,
                age,
                gender,
                phoneNumber,
                username,
                password,
                hasInsurance,
                insuranceProvider
                );

        // for system runtime data we should add this to the our users list. we're not using database.
        users.add(newPatient);

        System.out.println("\nRegistration successful! Welcome to the your new health journey!");
    }



    // login Function
    private static void login() {
        System.out.println("\n### Hospital Management System ###");
        System.out.println("Please login:");
        System.out.print("Username: ");
        String username = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();

        for (Person user : users) {
            if (user.authenticate(username, password)) {
                currentUser = user;
                System.out.println("\nWelcome, " + user.getFullName() + "!");
                return;
            }
        }
        System.out.println("\nInvalid username or password. Please try again.");
    }

    
    // role chooser function from people's inherited classes.
    private static void showRoleSpecificMenu() {
        if (currentUser instanceof Founder) {
            showFounderMenu();

        } else if (currentUser instanceof Doctor) {
            Doctor doctor = (Doctor) currentUser;
            if (doctor.isPrivateDoctor()) {
                showPrivateDoctorMenu();
            } else {
                showDoctorMenu();
            }

        } 
        else if (currentUser instanceof Patient) {
            showPatientMenu();
        } 
        else if (currentUser instanceof Pharmacist) {
            
            showPharmacistMenu();
        } 
        else if (currentUser instanceof Assistant) {
            showAssistantMenu();
        }
    }

    // founder menu
    private static void showFounderMenu() {
        while (true) {
            System.out.println("\n#################################");
            System.out.println("####### Founder Dashboard #######");
            System.out.println("##  1. View Profile            ##");
            System.out.println("##  2. Create Department       ##");
            System.out.println("##  3. Create Doctor           ##");
            System.out.println("##  4. Create Assistant        ##");
            System.out.println("##  5. Hire Doctor             ##");
            System.out.println("##  6. Fire Doctor             ##");
            System.out.println("##  7. View All Workers        ##");
            System.out.println("##  8. View All Departments    ##");
            System.out.println("##  9. Generate Monthly Report ##");
            System.out.println("##  10. Create Room            ##");
            System.out.println("##  11. View All Rooms         ##");
            System.out.println("##  12. Logout                 ##");
            System.out.println("#################################");
            System.out.print("Select an option: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    showProfile();
                    break;
                case "2":
                    createDepartment();
                    break;
                case "3":
                    createDoctor();
                    break;
                case "4":
                    createAssistant();
                    break;
                case "5":
                    hireDoctor();
                    break;
                case "6":
                    fireDoctor();
                    break;
                case "7":
                    viewAllWorkers();
                    break;
                case "8":
                    viewAllDepartments();
                    break;
                case "9":
                    generateMonthlyReport();
                    break;
                case "10":
                    createRoom();
                    break;
                case "11":
                    viewAllRooms();
                    break;
                case "12":
                    currentUser = null;
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }


    // doctor menu
    private static void showDoctorMenu() {
        while (true) {
            System.out.println("\n########################################");
            System.out.println("########## Doctor Dashboard ############");
            System.out.println("##  1. View Profile                   ##");
            System.out.println("##  2. View Appointments              ##");
            System.out.println("##  3. View Patients                  ##");
            System.out.println("##  4. Write Prescription             ##");
            System.out.println("##  5. Update Medical Records         ##");
            System.out.println("##  6. View Schedule                  ##");
            System.out.println("##  7. Complete/Cancel Appointment    ##");
            System.out.println("##  8. Update Patient Medical Record  ##");
            System.out.println("##  9. Assign Patient to Room         ##");
            System.out.println("##  10. View Available Rooms          ##");
            System.out.println("##  11. Logout                        ##");
            System.out.println("########################################");
            System.out.print("Select an option: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    showProfile();
                    break;
                case "2":
                    viewAppointments();
                    break;
                case "3":
                    viewPatients();
                    break;
                case "4":
                    writePrescription();
                    break;
                case "5":
                    updateMedicalRecords();
                    break;
                case "6":
                    viewSchedule();
                    break;
                case "7":
                    manageDoctorAppointments();
                    break;
                case "8":
                    updatePatientMedicalRecord();
                    break;
                case "9":
                    assignPatientToRoom();
                    break;
                case "10":
                    viewAvailableRooms();
                    break;
                case "11":
                    currentUser = null; // return the main while loop.
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    // patient menu

    private static void showPatientMenu() {
        while (true) {
            System.out.println("\n########################################");
            System.out.println("########### Patient Dashboard ##########");
            System.out.println("##  1. View Profile                   ##");
            System.out.println("##  2. View Appointments              ##");
            System.out.println("##  3. Create Appointment             ##");
            System.out.println("##  4. View Medical Records           ##");
            System.out.println("##  5. View Prescriptions             ##");
            System.out.println("##  6. Write Review                   ##");
            System.out.println("##  7. See Reviews                    ##");
            System.out.println("##  8. Billing                        ##");
            System.out.println("##  9. Logout                         ##");
            System.out.println("########################################");
            System.out.print("Select an option: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    showProfile();
                    break;
                case "2":
                    viewAppointments();
                    break;
                case "3":
                    createAppointment();
                    break;
                case "4":
                    viewMedicalRecords();
                    break;
                case "5":
                    viewPrescriptions();
                    break;
                case "6":
                    writeReview();
                    break;
                case "7":
                    seeReviews();
                    break;
                case "8":
                    showBilling();
                    break;
                case "9":
                    currentUser = null;
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }


    // pharmacist menu
    private static void showPharmacistMenu() {
        while (true) {
            System.out.println("\n###########################################");
            System.out.println("########### Pharmacist Dashboard ##########");
            System.out.println("##  1. View Profile                      ##");
            System.out.println("##  2. View Inventory                    ##");
            System.out.println("##  3. Add Inventory Stock               ##");
            System.out.println("##  4. Remove Inventory Stock            ##");
            System.out.println("##  5. Check Medication Stock            ##");
            System.out.println("##  6. View Prescriptions                ##");
            System.out.println("##  7. Logout                            ##");
            System.out.println("###########################################");
            System.out.print("Select an option: ");

            String choice = scanner.nextLine();
            Pharmacist pharmacist = (Pharmacist) currentUser;

            switch (choice) {
                case "1":
                    System.out.println(pharmacist.GeneralInfo());
                    break;
                case "2":
                    viewInventory();
                    break;
                case "3":
                    addInventoryStock();
                    break;
                case "4":
                    removeInventoryStock();
                    break;
                case "5":
                    checkMedicationStock();
                    break;
                case "6":
                    viewPrescriptionsPharmacist(pharmacist);
                    break;
                case "7":
                    currentUser = null;
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    // inventory viewing
    private static void viewInventory() {
        System.out.println("\n### Inventory List ###");
        if (inventoryList == null || inventoryList.isEmpty()) {
            System.out.println("There are no items in the inventory.");
            return;
        }
        for (Inventory item : inventoryList) {
            System.out.println(item.GeneralInfo());
        }
    }

    private static void addInventoryStock() {
        System.out.println("\n### Add Inventory Stock ###");
        viewInventory();
        System.out.print("Enter Item ID to add stock: ");
        String itemId = scanner.nextLine();

        //---
        Inventory selected = null;
        for (Inventory item : inventoryList) {
            if (item.getItemId().equals(itemId)) {
                selected = item;
                break;
            }
        }
        if (selected == null) {
            System.out.println("Item not found.");
            return;
        }
        System.out.print("Enter amount to add: ");
        int amount = Integer.parseInt(scanner.nextLine());
        selected.addStock(amount);
        System.out.println("Stock added. New quantity: " + selected.getQuantity());
        //---
    }

    private static void removeInventoryStock() {
        System.out.println("\n### Remove Inventory Stock ###");
        viewInventory();
        System.out.print("Enter Item ID to remove stock: ");
        String itemId = scanner.nextLine();

        //---
        Inventory selected = null;
        for (Inventory item : inventoryList) {
            if (item.getItemId().equals(itemId)) {
                selected = item;
                break;
            }
        }
        if (selected == null) {
            System.out.println("Item not found.");
            return;
        }
        System.out.print("Enter amount to remove: ");
        int amount = Integer.parseInt(scanner.nextLine());
        selected.removeStock(amount);
        System.out.println("Stock removed. New quantity: " + selected.getQuantity());
        //---
    }

    private static void checkMedicationStock() {
        System.out.println("\n### Check Medication Stock ###");
        System.out.print("Enter medication name: ");
        String medName = scanner.nextLine();

        boolean found = false;
        for (Inventory item : inventoryList) {
            if (item.getItemName().equals(medName)) {
                System.out.println(item.getItemName() + " in stock: " + item.getQuantity());
                found = true;
            }
        }
        if (!found) {
            System.out.println("Medication not found in inventory.");
        }
    }

    // pprescription
    private static void viewPrescriptionsPharmacist(Pharmacist pharmacist) {
        System.out.println("\n### Prescriptions ###");
        if (pharmacist.getPrescriptions().isEmpty()) {
            System.out.println("No prescriptions found.");
        } else {
            for (Prescription prescription : pharmacist.getPrescriptions()) {
                System.out.println(prescription.GeneralInfo());
            }
        }
    }
    //---------------------------------

    private static void showAssistantMenu() {
        Assistant assistant = (Assistant) currentUser;
        while (true) {
            System.out.println("\n###########################################");
            System.out.println("########## Assistant Dashboard ############");
            System.out.println("##  1. View Profile                      ##");
            System.out.println("##  2. Call Doctor                       ##");
            System.out.println("##  3. Logout                            ##");
            System.out.println("###########################################");
            System.out.print("Select an option: ");
            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    System.out.println(assistant.GeneralInfo());
                    break;
                case "2":
                    callDoctorByAssistant(assistant);
                    break;
                case "3":
                    currentUser = null;
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    private static void callDoctorByAssistant(Assistant assistant) {
        System.out.println("\nAvailable Doctors:");
        for (Person user : users) {
            if (user instanceof Doctor) {
                Doctor doc = (Doctor) user;
                System.out.println(doc.getId() + ": " + doc.getFullName());
            }
        }
        System.out.print("Enter Doctor ID to call: ");
        String docId = scanner.nextLine();
        Doctor selected = null;
        for (Person user : users) {
            if (user instanceof Doctor && ((Doctor) user).getId().equals(docId)) {
                selected = (Doctor) user;
                break;
            }
        }
        if (selected != null) {
            assistant.callDoctor(selected);
        } else {
            System.out.println("Doctor not found.");
        }
    }
    //---------------------------------

    
    private static void showProfile() {
        System.out.println("\n### Profile ###");
        System.out.println("Name: " + currentUser.getFullName());
        System.out.println("Age: " + currentUser.getAge());
        System.out.println("Gender: " + currentUser.getGender());
        System.out.println("Phone: " + currentUser.getPhoneNumber());

        if (currentUser instanceof Doctor) {
            Doctor doctor = (Doctor) currentUser;
            System.out.println("Department: " + doctor.getDepartment());
            System.out.println("Specialty: " + doctor.getSpecialty());
            System.out.println("Office: " + doctor.getOfficeNumber());

        } else if (currentUser instanceof Patient) {
            Patient patient = (Patient) currentUser;
            System.out.println("Insurance: " + (patient.hasInsurance() ? "Yes" : "No"));
            if (patient.hasInsurance()) {
                System.out.println("Provider: " + patient.getInsuranceProvider());
            }
        }
    }

    private static void createAppointment() {
        if (currentUser instanceof Patient) {
            System.out.println("\n### Create Appointment ###");

            // available doctors
            System.out.println("\nAvailable Doctors:");
            for (Person user : users) {
                if (user instanceof Doctor) {
                    Doctor doc = (Doctor) user;
                    String type;
                    if (doc.isPrivateDoctor()) {
                        type = "Private Practice";
                    } else {
                        type = "Hospital";
                    }

                    System.out.println(doc.getId() + ": " + doc.getFullName() + 
                            " (" + doc.getSpecialty() + ") - " + type);
                }
            }

            System.out.print("\nSelect Doctor ID: ");
            String doctorId = scanner.nextLine();

            Doctor selectedDoctor = null;
            for (Person user : users) {
                if (user instanceof Doctor && ((Doctor) user).getId().equals(doctorId)) {
                    selectedDoctor = (Doctor) user;
                    break;
                }
            }

            if (selectedDoctor == null) {
                System.out.println("Invalid doctor selection.");
                return;
            }

            // weekdays
            System.out.println("\nAvailable Days:");
            System.out.println("1. Monday");
            System.out.println("2. Tuesday");
            System.out.println("3. Wednesday");
            System.out.println("4. Thursday");
            System.out.println("5. Friday");

            System.out.print("\nSelect Day (1-5): ");
            int dayChoice = Integer.parseInt(scanner.nextLine());
            if (dayChoice < 1 || dayChoice > 5) {
                System.out.println("Invalid day selection.");
                return;
            }
            StaticSchedule.Day selectedDay = StaticSchedule.Day.values()[dayChoice - 1]; // Because list starts from 0, we need to subtract 1

            // show available time slots
            System.out.println("\nAvailable Time Slots:");
            List<LocalTime> availableSlots = selectedDoctor.getStaticSchedule()
                    .getAvailableTimeSlots(selectedDay, selectedDoctor.getAppointments());

            if (availableSlots.isEmpty()) {
                System.out.println("No available time slots for this day.");
                return;
            }

            for (int i = 0; i < availableSlots.size(); i++) {
                System.out.println((i + 1) + ". " + availableSlots.get(i));
            }

            System.out.print("\nSelect Time Slot (1-" + availableSlots.size() + "): ");
            int timeChoice = Integer.parseInt(scanner.nextLine());
            if (timeChoice < 1 || timeChoice > availableSlots.size()) {
                System.out.println("Invalid time slot selection.");
                return;
            }

            LocalTime selectedTime = availableSlots.get(timeChoice - 1); // Again first index must be 0.

            // create appointment with constructor
            Appointment appointment = selectedDoctor.scheduleAppointment(
                    (Patient) currentUser,
                    selectedDay,
                    selectedTime
            );

            if (appointment != null) {
                System.out.println("\nAppointment created successfully!");
                System.out.println("Appointment ID: " + appointment.getAppointmentId());
                System.out.println("Doctor: " + appointment.getDoctor().getFullName());
                System.out.println("Date: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                System.out.println("Cost: $" + appointment.getCost());
                if (selectedDoctor.isPrivateDoctor()) {
                    System.out.println("Location: " + selectedDoctor.getOfficeNumber()); // For private doctors, this is their office address
                }
            } else {
                System.out.println("Failed to create appointment.");
            }
        }
    }

    private static void viewAppointments() {
        System.out.println("\n### Appointments ###");
        if (currentUser instanceof Patient) {
            Patient patient = (Patient) currentUser;
            List<Appointment> appointments = patient.getAppointments();
            if (appointments.isEmpty()) {
                System.out.println("No appointments found.");
            } else {
                for (Appointment appointment : appointments) {
                    System.out.println("\nAppointment ID: " + appointment.getAppointmentId());
                    System.out.println("Doctor: " + appointment.getDoctor().getFullName());
                    System.out.println("Date: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    System.out.println("Status: " + appointment.getStatus());
                    System.out.println("Cost: $" + appointment.getCost());
                }
            }
        } else if (currentUser instanceof Doctor) {
            Doctor doctor = (Doctor) currentUser;
            List<Appointment> appointments = doctor.getAppointments();
            if (appointments.isEmpty()) {
                System.out.println("No appointments found.");
            } else {
                for (Appointment appointment : appointments) {
                    System.out.println("\nAppointment ID: " + appointment.getAppointmentId());
                    System.out.println("Patient: " + appointment.getPatient().getFullName());
                    System.out.println("Date: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    System.out.println("Status: " + appointment.getStatus());
                    String paidStatus;
                    if (appointment.isPaid()) {
                        paidStatus = "Yes";
                    } else {
                        paidStatus = "No";
                    }
                    System.out.println("Paid: " + paidStatus);
                }
            }
        }
    }

    private static void viewPatients() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Patients ###");
            Doctor doctor = (Doctor) currentUser;
            List<Patient> patients = doctor.getPatients();
            if (patients.isEmpty()) {
                System.out.println("No patients found.");
            } else {
                for (Patient patient : patients) {
                    System.out.println("\nPatient ID: " + patient.getId());
                    System.out.println("Name: " + patient.getFullName());
                    System.out.println("Age: " + patient.getAge());
                    System.out.println("Gender: " + patient.getGender());
                    System.out.println("Phone: " + patient.getPhoneNumber());
                }
            }
        }
    }

    private static void writePrescription() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Write Prescription ###");
            System.out.print("Patient ID: ");
            String patientId = scanner.nextLine();

            Patient selectedPatient = null;
            for (Person user : users) {
                if (user instanceof Patient && ((Patient) user).getId().equals(patientId)) {
                    selectedPatient = (Patient) user;
                    break;
                }
            }

            if (selectedPatient != null) {
                System.out.print("Medication: ");
                String medication = scanner.nextLine();
                System.out.print("Dosage Type: ");
                String dosageType = scanner.nextLine();
                System.out.print("Usage Instructions: ");
                String usage = scanner.nextLine();
                System.out.print("Notes: ");
                String notes = scanner.nextLine();

                Prescription prescription = new Prescription(
                        medication,
                        dosageType,
                        usage,
                        selectedPatient,
                        (Doctor) currentUser,
                        notes
                );

                selectedPatient.addPrescription(prescription);
                System.out.println("Prescription written successfully!");
            } else {
                System.out.println("Invalid patient selection.");
            }
        }
    }

    private static void updateMedicalRecords() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Update Medical Records ###");
            System.out.print("Patient ID: ");
            String patientId = scanner.nextLine();

            Patient selectedPatient = null;
            for (Person user : users) {
                if (user instanceof Patient && ((Patient) user).getId().equals(patientId)) {
                    selectedPatient = (Patient) user;
                    break;
                }
            }

            if (selectedPatient != null) {
                System.out.print("Blood Type: ");
                String bloodType = scanner.nextLine();
                System.out.print("Height (cm): ");
                double height = Double.parseDouble(scanner.nextLine());
                System.out.print("Weight (kg): ");
                double weight = Double.parseDouble(scanner.nextLine());
                System.out.print("Diagnosis: ");
                String diagnosis = scanner.nextLine();
                System.out.print("Procedures: ");
                String procedures = scanner.nextLine();
                System.out.print("Allergies: ");
                String allergies = scanner.nextLine();
                System.out.print("Immunizations: ");
                String immunizations = scanner.nextLine();
                System.out.print("Lab Results: ");
                String labResults = scanner.nextLine();
                System.out.print("Additional Notes:: ");
                String notes = scanner.nextLine();

                MedicalRecord record = new MedicalRecord(
                        MedicalRecord.generateNewRecordId(),
                        selectedPatient,
                        bloodType,
                        height,
                        weight,
                        diagnosis,
                        procedures,
                        allergies,
                        immunizations,
                        labResults,
                        notes
                );

                selectedPatient.setMedicalRecord(record);
                System.out.println("Medical record updated successfully!");
            } else {
                System.out.println("Invalid patient selection.");
            }
        }
    }

    private static void viewSchedule() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Schedule ###");
            Doctor doctor = (Doctor) currentUser;
            StaticSchedule schedule = doctor.getStaticSchedule();
            for (StaticSchedule.Day day : StaticSchedule.Day.values()) {
                System.out.println("\n" + day + ":");
                List<LocalTime> times = schedule.getAvailableTimeSlots(day, doctor.getAppointments());
                if (times.isEmpty()) {
                    System.out.println("No available slots");
                } else {
                    StringBuilder availableTimes = new StringBuilder();
                    for (int i = 0; i < times.size(); i++) {
                        if (i > 0) {
                            availableTimes.append(", ");
                        }
                        availableTimes.append(times.get(i));
                    }
                    System.out.println("Available times: " + availableTimes.toString());
                }
            }
        }
    }

    private static void viewMedicalRecords() {
        if (currentUser instanceof Patient) {
            System.out.println("\n### Medical Records ###");
            Patient patient = (Patient) currentUser;
            MedicalRecord record = patient.getMedicalRecord();
            if (record != null) {
                System.out.println("Blood Type: " + record.getBloodType());
                System.out.println("Height: " + record.getHeight() + " cm");
                System.out.println("Weight: " + record.getWeight() + " kg");
                System.out.println("\nDiagnoses: " + record.getDiagnoses());
                System.out.println("Procedures: " + record.getProcedures());
                System.out.println("Medications: " + record.getMedications());
                System.out.println("Allergies: " + record.getAllergies());
                System.out.println("Immunizations: " + record.getImmunizations());
                System.out.println("Lab Results: " + record.getLabResults());
                System.out.println("\nNotes: " + record.getNotes());
            } else {
                System.out.println("No medical records found.");
            }
        }
    }

    private static void viewPrescriptions() {
        if (currentUser instanceof Patient) {
            System.out.println("\n### Prescriptions ###");
            Patient patient = (Patient) currentUser;
            List<Prescription> prescriptions = patient.getPrescriptions();
            if (prescriptions.isEmpty()) {
                System.out.println("No prescriptions found.");
            } else {
                for (Prescription prescription : prescriptions) {
                    System.out.println("\nMedication: " + prescription.getMedication());
                    System.out.println("Dosage Type: " + prescription.getDosageType());
                    System.out.println("Usage: " + prescription.getUsage());
                    System.out.println("Doctor: " + prescription.getDoctor().getFullName());
                    System.out.println("Date: " + prescription.getIssueDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    System.out.println("Notes: " + prescription.getNotes());
                }
            }
        } 
        
        else if (currentUser instanceof Pharmacist) {
            System.out.println("\n### Prescriptions ###");
            Pharmacist pharmacist = (Pharmacist) currentUser;
            List<Prescription> prescriptions = pharmacist.getPrescriptions();
            if (prescriptions.isEmpty()) {
                System.out.println("No prescriptions found.");
            } else {
                for (Prescription prescription : prescriptions) {
                    System.out.println("\nMedication: " + prescription.getMedication());
                    System.out.println("Patient: " + prescription.getPatient().getFullName());
                    System.out.println("Doctor: " + prescription.getDoctor().getFullName());
                    System.out.println("Date: " + prescription.getIssueDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                }
            }
        }
    }

    private static void writeReview() {
        if (currentUser instanceof Patient) {
            System.out.println("\n### Write Review ###");
            System.out.println("\nAvailable Doctors:");
            for (Person user : users) {
                if (user instanceof Doctor) {
                    Doctor doc = (Doctor) user;
                    double avg = doc.calculateAverageRating();

                    String ratingDisplay;
                    if (avg > 0) {
                        ratingDisplay = String.format("%.2f", avg); // like C programmings printf function, 3.123 = 3.12
                    } else {
                        ratingDisplay = "No reviews yet";
                    }
                    System.out.println(doc.getId() + ": " + doc.getFullName() + " (" + doc.getSpecialty() +
                            ") - Average Rating: " + ratingDisplay);
                }
            }

            System.out.print("\nSelect Doctor ID: ");
            String doctorId = scanner.nextLine();

            Doctor selectedDoctor = null;
            for (Person user : users) {
                if (user instanceof Doctor && ((Doctor) user).getId().equals(doctorId)) {
                    selectedDoctor = (Doctor) user;
                    break;
                }
            }

            if (selectedDoctor != null) {
                System.out.print("Rating (1-5): ");
                int rating = Integer.parseInt(scanner.nextLine());
                System.out.print("Comment: ");
                String comment = scanner.nextLine();

                Review review = new Review((Patient) currentUser, selectedDoctor, comment, rating);
                selectedDoctor.addReview(review);
                System.out.println("Review added successfully!");
            } else {
                System.out.println("Invalid doctor selection.");
            }
        }
    }

    private static void seeReviews() {
        System.out.println("\n### Doctor Reviews ###");
        for (Person user : users) {
            if (user instanceof Doctor) {
                Doctor doc = (Doctor) user;
                System.out.println("\nDoctor: " + doc.getFullName() + " (" + doc.getSpecialty() + ")");
                List<Review> reviews = doc.getReviews();
                if (reviews.isEmpty()) {
                    System.out.println("No reviews yet.");
                } else {
                    for (Review review : reviews) {
                        System.out.println("- Rating: " + review.getRating() + "/5");
                        System.out.println("  Comment: " + review.getComment());
                    }
                }
            }
        }
    }

    private static void showBilling() {
        if (currentUser instanceof Patient) { // for this specific patient
            System.out.println("\n### Billing ###");
            Patient patient = (Patient) currentUser;
            List<Appointment> appointments = patient.getAppointments();
            double total = 0.0;
            List<Appointment> unpaid = new ArrayList<>();
            if (appointments.isEmpty()) {
                System.out.println("No appointments found.");
            } else {
                for (Appointment appointment : appointments) {
                    if (!appointment.isPaid()) { // if appointment is not paid
                        unpaid.add(appointment);
                        System.out.println("\nAppointment ID: " + appointment.getAppointmentId());
                        System.out.println("Doctor: " + appointment.getDoctor().getFullName());
                        System.out.println("Date: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                        System.out.println("Cost: $" + appointment.getCost());
                        total += appointment.getCost();
                    }
                }
                if (unpaid.isEmpty()) {
                    System.out.println("\nAll appointments are paid. No outstanding balance.");
                } else {
                    System.out.println("\nTotal Due: $" + total);
                    System.out.println("1. Pay All");
                    System.out.println("2. Pay by Appointment ID");
                    System.out.println("3. Back");
                    System.out.print("Select an option: ");
                    String choice = scanner.nextLine();
                    
                    switch (choice) {
                        case "1":
                            for (Appointment appointment : unpaid) {
                                markAppointmentPaid(appointment);
                            }
                            System.out.println("All unpaid appointments have been paid.");
                            break;
                        case "2":
                            System.out.print("Enter Appointment ID to pay: ");
                            String id = scanner.nextLine();
                            boolean found = false;
                            for (Appointment appointment : unpaid) {
                                if (appointment.getAppointmentId().equals(id)) {
                                    markAppointmentPaid(appointment);
                                    System.out.println("Appointment " + id + " has been paid.");
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                System.out.println("Invalid Appointment ID.");
                            }
                            break;
                        case "3":
                            return;
                        default:
                            System.out.println("Invalid option.");
                            break;
                    }
                }
            }
        }
    }

    private static void markAppointmentPaid(Appointment appointment) {
        appointment.setPaid(true);
    }

    private static void createDepartment() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### Create Department ###");
            System.out.print("Department Name: ");
            String name = scanner.nextLine();
            System.out.print("Location: ");
            String location = scanner.nextLine();

            System.out.println("\nAvailable Doctors:");
            for (Person user : users) {
                if (user instanceof Doctor) {
                    System.out.println(((Doctor) user).getId() + ": " + ((Doctor) user).getFullName() +
                            " (" + ((Doctor) user).getSpecialty() + ")");
                }
            }
            System.out.print("\nSelect Doctor ID: ");
            String doctorId = scanner.nextLine();

            Doctor selectedDoctor = null;
            for (Person user : users) {
                if (user instanceof Doctor && ((Doctor) user).getId().equals(doctorId)) {
                    selectedDoctor = (Doctor) user;
                    break;
                }
            }

            if (selectedDoctor != null) {
                Department newDepartment = new Department(name, selectedDoctor, location);
                departments.add(newDepartment);
                ((Founder) currentUser).createDepartment(name, selectedDoctor, location);
                System.out.println("Department created successfully!");
            } else {
                System.out.println("Invalid doctor selection.");
            }
        }
    }

    private static void hireDoctor() {
        if (currentUser instanceof Founder) {
            System.out.println("\nWholeDoctors Doctors:");
            for (Person user : users) {
                if (user instanceof Doctor) {
                    System.out.println(((Doctor) user).getId() + ": " + ((Doctor) user).getFullName() +
                            " (" + ((Doctor) user).getSpecialty() + ")");
                }
            }

            System.out.println("\n### Hire Doctor ###");
            System.out.print("Doctor ID: ");
            String doctorId = scanner.nextLine();
            System.out.print("Department Name: ");
            String deptName = scanner.nextLine();

            Doctor selectedDoctor = null;
            for (Person user : users) {
                if (user instanceof Doctor && ((Doctor) user).getId().equals(doctorId)) {
                    selectedDoctor = (Doctor) user;
                    break;
                }
            }

            Department selectedDept = null;
            for (Department dept : departments) {
                if (dept.getName().equals(deptName)) {
                    selectedDept = dept;
                    break;
                }
            }

            if (selectedDoctor != null && selectedDept != null) {
                ((Founder) currentUser).hireDoctor(selectedDoctor, selectedDept);
                System.out.println("Doctor hired successfully!");
            } else {
                System.out.println("Invalid doctor or department selection.");
            }
        }
    }

    private static void fireDoctor() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### Fire Doctor ###");
            System.out.print("Doctor ID: ");
            String doctorId = scanner.nextLine();

            Doctor selectedDoctor = null;
            for (Person user : users) {
                if (user instanceof Doctor && ((Doctor) user).getId().equals(doctorId)) {
                    selectedDoctor = (Doctor) user;
                    break;
                }
            }

            if (selectedDoctor != null) {
                ((Founder) currentUser).fireDoctor(selectedDoctor);
                System.out.println("Doctor fired successfully!");
            } else {
                System.out.println("Invalid doctor selection.");
            }
        }
    }

    private static void viewAllWorkers() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### All Workers ###");
            System.out.println("\nDoctors:");
            for (Person user : users) {
                if (user instanceof Doctor) {
                    Doctor doctor = (Doctor) user;
                    System.out.println(doctor.getId() + ": " + doctor.getFullName() +
                            " (" + doctor.getSpecialty() + ")");
                }
            }
        }
    }

    private static void viewAllDepartments() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### All Departments ###");
            for (Department dept : departments) {
                System.out.println("\nDepartment: " + dept.getName());
                System.out.println("Location: " + dept.getLocation());
                System.out.println("Head: " + (dept.getHead() != null ? dept.getHead().getFullName() : "None"));
                System.out.println("Doctors:");
                for (Doctor doctor : dept.getDoctors()) {
                    System.out.println("  - " + doctor.getFullName() + " (" + doctor.getSpecialty() + ")");
                }
            }
        }
    }

    private static void generateMonthlyReport() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### Monthly Report ###");
            System.out.println("Departments: " + departments.size());
            int doctorCount = 0;
            int patientCount = 0;
            int pharmacistCount = 0;
            int appointmentCount = 0;
            double totalRevenue = 0.0;
            double totalExpenses = 0.0;
            for (Person user : users) {
                if (user instanceof Doctor) doctorCount++;
                if (user instanceof Patient) patientCount++;
                if (user instanceof Pharmacist) pharmacistCount++;
            }
            for (Person user : users) {
                if (user instanceof Doctor) {
                    Doctor doc = (Doctor) user;
                    for (Appointment appointment : doc.getAppointments()) {
                        appointmentCount++;
                        totalRevenue += appointment.getCost();
                    }
                    totalExpenses += ((Doctor) user).getSalary();
                }
                if (user instanceof Pharmacist) {
                    totalExpenses += ((Pharmacist) user).getSalary();
                }
            }
            System.out.println("Doctors: " + doctorCount);
            System.out.println("Patients: " + patientCount);
            System.out.println("Pharmacists: " + pharmacistCount);
            System.out.println("Appointments: " + appointmentCount);
            System.out.println("Total Revenue: $" + totalRevenue);
            System.out.println("Total Expenses: $" + totalExpenses);
            System.out.println("Net Income: $" + (totalRevenue - totalExpenses));
        }
    }

    private static void manageDoctorAppointments() {
        if (currentUser instanceof Doctor) {
            Doctor doctor = (Doctor) currentUser;
            List<Appointment> appointments = doctor.getAppointments();
            if (appointments.isEmpty()) {
                System.out.println("No appointments to manage.");
                return;
            }
            System.out.println("\n### Manage Appointments ###");
            for (Appointment appointment : appointments) {
                System.out.println("\nAppointment ID: " + appointment.getAppointmentId());
                System.out.println("Patient: " + appointment.getPatient().getFullName());
                System.out.println("Date: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                System.out.println("Status: " + appointment.getStatus());
            }
            System.out.print("\nEnter Appointment ID to manage (or 'back' to return): ");
            String id = scanner.nextLine();
            if (id.equals("back")) return;

            Appointment selected = null;
            for (Appointment appointment : appointments) {
                if (appointment.getAppointmentId().equals(id)) {
                    selected = appointment;
                    break;
                }
            }
            if (selected == null) {
                System.out.println("Invalid Appointment ID.");
                return;
            }
            System.out.println("1. Mark as Completed");
            System.out.println("2. Cancel Appointment");
            System.out.println("3. Back");
            System.out.print("Select an option: ");
            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    setAppointmentStatus(selected, "Completed");
                    System.out.println("Appointment marked as completed.");
                    break;
                case "2":
                    setAppointmentStatus(selected, "Canceled");
                    System.out.println("Appointment canceled.");
                    break;
                case "3":
                    return;
                default:
                    System.out.println("Invalid option.");
                    break;
            }
        }
    }

    private static void setAppointmentStatus(Appointment appointment, String status) {
        appointment.setStatus(status);
    }

    private static void createDoctor() {
        System.out.println("\n### Create Doctor ###");
        String doctorId = Doctor.generateNewDoctorId();
        System.out.print("First Name: ");
        String firstName = scanner.nextLine();
        System.out.print("Last Name: ");
        String lastName = scanner.nextLine();
        System.out.print("Age: ");
        int age = Integer.parseInt(scanner.nextLine());
        System.out.print("Gender (M/F): ");
        char gender = scanner.nextLine().toUpperCase().charAt(0);
        System.out.print("Phone Number: ");
        String phoneNumber = scanner.nextLine();
        System.out.print("Username: ");
        String username = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();
        System.out.print("Is Private Doctor? (yes/no): ");
        boolean isPrivate = scanner.nextLine().startsWith("y");

        if (isPrivate) {
            System.out.print("Specialty: ");
            String specialty = scanner.nextLine();
            System.out.print("Office Address: ");
            String officeAddress = scanner.nextLine();
            System.out.print("Consultation Fee ($): ");
            double privateFee = Double.parseDouble(scanner.nextLine());

            Doctor newDoctor = new Doctor(
                    doctorId,
                    firstName,
                    lastName,
                    age,
                    gender,
                    phoneNumber,
                    username,
                    password,
                    "Private Practice",
                    specialty,
                    officeAddress,
                    true,
                    0.0 
            );
            newDoctor.setPrivateFee(privateFee);
            newDoctor.setStaticSchedule(new StaticSchedule());
            users.add(newDoctor);
            System.out.println("Private doctor created successfully!");
        } 
        
        else {
            System.out.print("Department: ");
            String department = scanner.nextLine();
            System.out.print("Specialty: ");
            String specialty = scanner.nextLine();
            System.out.print("Office Number: ");
            String officeNumber = scanner.nextLine();
            System.out.print("Salary: ");
            double salary = Double.parseDouble(scanner.nextLine());

            Doctor newDoctor = new Doctor(
                    doctorId,
                    firstName,
                    lastName,
                    age,
                    gender,
                    phoneNumber,
                    username,
                    password,
                    department,
                    specialty,
                    officeNumber,
                    false,
                    salary
            );
            newDoctor.setStaticSchedule(new StaticSchedule());
            users.add(newDoctor);
            System.out.println("Hospital doctor created successfully!");
        }
    }

    private static void createAssistant() {
        System.out.println("\n### Create Assistant ###");
        String assistantId = Assistant.generateNewAssistantId();
        System.out.print("First Name: ");
        String firstName = scanner.nextLine();
        System.out.print("Last Name: ");
        String lastName = scanner.nextLine();
        System.out.print("Age: ");
        int age = Integer.parseInt(scanner.nextLine());
        System.out.print("Gender (M/F): ");
        char gender = scanner.nextLine().toUpperCase().charAt(0);
        System.out.print("Phone Number: ");
        String phoneNumber = scanner.nextLine();
        System.out.print("Username: ");
        String username = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();


        System.out.println("Available Doctors:");
        for (Person user : users) {
            if (user instanceof Doctor) {
                Doctor doc = (Doctor) user;
                System.out.println(doc.getId() + ": " + doc.getFullName());
            }
        }
        System.out.print("Supervisor Doctor ID: ");
        String supervisorId = scanner.nextLine();
        Doctor supervisor = null;
        for (Person user : users) {
            if (user instanceof Doctor && ((Doctor) user).getId().equals(supervisorId)) {
                supervisor = (Doctor) user;
                break;
            }
        }
        if (supervisor == null) {
            System.out.println("Invalid supervisor. Assistant not created.");
            return;
        }

        System.out.print("Experience (years): ");
        short experience = Short.parseShort(scanner.nextLine());
        System.out.print("Duty: ");
        String duty = scanner.nextLine();


        System.out.println("Available Departments:");
        for (Department dept : departments) {
            System.out.println(dept.getName());
        }
        System.out.print("Department Name: ");
        String deptName = scanner.nextLine();
        Department department = null;
        for (Department dept : departments) {
            if (dept.getName().equals(deptName)) {
                department = dept;
                break;
            }
        }
        if (department == null) {
            System.out.println("Invalid department. Assistant could not be created. We're too sorry.");
            return;
        }

        System.out.print("Salary: ");
        double salary = Double.parseDouble(scanner.nextLine());
        System.out.print("Work Schedule: ");

        Assistant newAssistant = new Assistant(
                assistantId, firstName, lastName, age, gender, phoneNumber, username, password,
                supervisor, experience, duty, department, salary
        );
        users.add(newAssistant);
        System.out.println("Assistant created successfully!");
    }

    private static void updatePatientMedicalRecord() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Update Patient Medical Record ###");
            
            System.out.println("\nYour Patients:");
            Doctor doctor = (Doctor) currentUser;
            List<Patient> patients = doctor.getPatients();
            if (patients.isEmpty()) {
                System.out.println("No patients found.");
                return;
            }
            
            for (Patient patient : patients) {
                System.out.println(patient.getId() + ": " + patient.getFullName());
            }
            
            System.out.print("\nSelect Patient ID: ");
            String patientId = scanner.nextLine();
            
            Patient selectedPatient = null;
            for (Patient patient : patients) {
                if (patient.getId().equals(patientId)) {
                    selectedPatient = patient;
                    break;
                }
            }
            
            if (selectedPatient == null) {
                System.out.println("Invalid patient selection.");
                return;
            }
            
            MedicalRecord record = selectedPatient.getMedicalRecord();
            if (record == null) {
                System.out.println("No medical record found for this patient.");
                return;
            }
            
            while (true) {
                System.out.println("\nWhat would you like to update?");
                System.out.println("1. Height");
                System.out.println("2. Weight");
                System.out.println("3. Blood Type");
                System.out.println("4. Diagnoses");
                System.out.println("5. Procedures");
                System.out.println("6. Allergies");
                System.out.println("7. Immunizations");
                System.out.println("8. Lab Results");
                System.out.println("9. Add Medication");
                System.out.println("10. Remove Medication");
                System.out.println("11. Notes");
                System.out.println("12. Back");
                System.out.print("\nSelect an option: ");
                
                String choice = scanner.nextLine();
                try {
                    switch (choice) {
                        case "1":
                            System.out.print("Enter new height (cm): ");
                            double height = Double.parseDouble(scanner.nextLine());
                            record.setHeight(height);
                            System.out.println("Height updated successfully.");
                            break;
                            
                        case "2":
                            System.out.print("Enter new weight (kg): ");
                            double weight = Double.parseDouble(scanner.nextLine());
                            record.setWeight(weight);
                            System.out.println("Weight updated successfully.");
                            break;
                            
                        case "3":
                            System.out.print("Enter new blood type: ");
                            String bloodType = scanner.nextLine();
                            record.setBloodType(bloodType);
                            System.out.println("Blood type updated successfully.");
                            break;
                            
                        case "4":
                            System.out.print("Enter new diagnoses: ");
                            String diagnoses = scanner.nextLine();
                            record.setDiagnoses(diagnoses);
                            System.out.println("Diagnoses updated successfully.");
                            break;
                            
                        case "5":
                            System.out.print("Enter new procedures: ");
                            String procedures = scanner.nextLine();
                            record.setProcedures(procedures);
                            System.out.println("Procedures updated successfully.");
                            break;
                            
                        case "6":
                            System.out.print("Enter new allergies: ");
                            String allergies = scanner.nextLine();
                            record.setAllergies(allergies);
                            System.out.println("Allergies updated successfully.");
                            break;
                            
                        case "7":
                            System.out.print("Enter new immunizations: ");
                            String immunizations = scanner.nextLine();
                            record.setImmunizations(immunizations);
                            System.out.println("Immunizations updated successfully.");
                            break;
                            
                        case "8":
                            System.out.print("Enter new lab results: ");
                            String labResults = scanner.nextLine();
                            record.setLabResults(labResults);
                            System.out.println("Lab results updated successfully.");
                            break;
                            
                        case "9":
                            System.out.print("Enter medication to add: ");
                            String medication = scanner.nextLine();
                            record.addMedication(medication);
                            System.out.println("Medication added successfully.");
                            break;
                            
                        case "10":
                            System.out.print("Enter medication to remove: ");
                            String medToRemove = scanner.nextLine();
                            record.removeMedication(medToRemove);
                            System.out.println("Medication removed successfully.");
                            break;
                            
                        case "11":
                            System.out.print("Enter new notes: ");
                            String notes = scanner.nextLine();
                            record.setNotes(notes);
                            System.out.println("Notes updated successfully.");
                            break;
                            
                        case "12":
                            return;
                            
                        default:
                            System.out.println("Invalid option. Please try again.");
                            break;
                    }
                } catch (IllegalArgumentException e) {
                    System.out.println("Error: Something went wrong. We're too sorry.");
                }
            }
        }
    }

    private static void createRoom() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### Create Room ###");
            
            System.out.print("Room Name: ");
            String roomName = scanner.nextLine();
            
            System.out.print("Room Type: ");
            String roomType = scanner.nextLine();
            
            System.out.print("Capacity: ");
            int capacity = Integer.parseInt(scanner.nextLine());
            
            System.out.print("Hourly Rate ($): ");
            double hourlyRate = Double.parseDouble(scanner.nextLine());
            
            System.out.print("Equipment (comma-separated): ");
            String equipment = scanner.nextLine();
            
            Room newRoom = new Room(roomName, roomType, capacity, hourlyRate, equipment);
            rooms.add(newRoom);
            System.out.println("Room created successfully!");
        }
    }

    private static void viewAllRooms() {
        if (currentUser instanceof Founder) {
            System.out.println("\n### All Rooms ###");
            if (rooms.isEmpty()) {
                System.out.println("No rooms found.");
                return;
            }
            
            for (Room room : rooms) {
                System.out.println(room.GeneralInfo());
            }
        }
    }

    private static void viewAvailableRooms() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Available Rooms ###");
            boolean hasAvailableRooms = false;
            
            for (Room room : rooms) {
                if (room.isAvailable()) {
                    System.out.println(room.GeneralInfo());
                    hasAvailableRooms = true;
                }
            }
            
            if (!hasAvailableRooms) {
                System.out.println("No available rooms found.");
            }
        }
    }

    private static void assignPatientToRoom() {
        if (currentUser instanceof Doctor) {
            System.out.println("\n### Assign Patient to Room ###");
            
            Doctor doctor = (Doctor) currentUser;
            List<Patient> patients = doctor.getPatients();
            if (patients.isEmpty()) {
                System.out.println("No patients found.");
                return;
            }
            
            System.out.println("\nYour Patients:");
            for (Patient patient : patients) {
                System.out.println(patient.getId() + ": " + patient.getFullName());
            }
            
            System.out.print("\nSelect Patient ID: ");
            String patientId = scanner.nextLine();
            
            Patient selectedPatient = null;
            for (Patient patient : patients) {
                if (patient.getId().equals(patientId)) {
                    selectedPatient = patient;
                    break;
                }
            }
            
            if (selectedPatient == null) {
                System.out.println("Invalid patient selection.");
                return;
            }
            
            System.out.println("\nAvailable Rooms:");
            boolean hasAvailableRooms = false;
            for (Room room : rooms) {
                if (room.isAvailable()) {
                    System.out.println(room.GeneralInfo());
                    hasAvailableRooms = true;
                }
            }
            
            if (!hasAvailableRooms) {
                System.out.println("No available rooms found.");
                return;
            }
            
            System.out.print("\nEnter Room Name: ");
            String roomName = scanner.nextLine();
            
            Room selectedRoom = null;
            for (Room room : rooms) {
                if (room.getRoomName().equals(roomName) && room.isAvailable()) {
                    selectedRoom = room;
                    break;
                }
            }
            
            if (selectedRoom == null) {
                System.out.println("Invalid room selection or room is not available.");
                return;
            }
            
            selectedRoom.assignPatient(selectedPatient);
            System.out.println("Patient assigned to room successfully!");
        }
    }

    //------ private doctor will be added do not forget to add it.

    private static void showPrivateDoctorMenu() {
        while (true) {
            System.out.println("\n### Private Doctor Dashboard ###");
            System.out.println("1. View Profile");
            System.out.println("2. View Appointment2");
            System.out.println("3. View Patients");
            System.out.println("4. Write Prescription");
            System.out.println("5. Update Medical Records");
            System.out.println("6. View Schedule");
            System.out.println("7. Complete/Cancel Appointment");
            System.out.println("8. Update Patient Medical Record");
            System.out.println("9. Set Consultation Fee");
            System.out.println("10. View Earnings");
            System.out.println("11. Logout");
            System.out.print("\nSelect an option: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    showProfile();
                    break;
                case "2":
                    viewAppointments();
                    break;
                case "3":
                    viewPatients();
                    break;
                case "4":
                    writePrescription();
                    break;
                case "5":
                    updateMedicalRecords();
                    break;
                case "6":
                    viewSchedule();
                    break;
                case "7":
                    manageDoctorAppointments();
                    break;
                case "8":
                    updatePatientMedicalRecord();
                    break;
                case "9":
                    setConsultationFee();
                    break;
                case "10":
                    viewEarnings();
                    break;
                case "11":
                    currentUser = null;
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    private static void setConsultationFee() {
        if (currentUser instanceof Doctor && ((Doctor) currentUser).isPrivateDoctor()) {
            System.out.println("\n### Set Consultation Fee ###");
            System.out.print("Enter new consultation fee ($): ");
            double privatefee = Double.parseDouble(scanner.nextLine());
            ((Doctor) currentUser).setPrivateFee(privatefee);
            System.out.println("Consultation fee updated successfully.");
        }
    }

    private static void viewEarnings() {
        if (currentUser instanceof Doctor && ((Doctor) currentUser).isPrivateDoctor()) {
            Doctor doctor = (Doctor) currentUser;
            System.out.println("\n### Earnings Report ###");
            double totalEarnings = 0.0;
            int totalAppointments = 0;
            
            for (Appointment appointment : doctor.getAppointments()) {
                if (appointment.getStatus().equals("Completed")) {
                    totalEarnings += appointment.getCost();
                    totalAppointments++;
                }
            }
            
            System.out.println("Total Completed Appointments: " + totalAppointments);
            System.out.println("Total Earnings: $" + totalEarnings);
            System.out.println("Average per Appointment: $" + (totalAppointments > 0 ? totalEarnings / totalAppointments : 0));
        }
    }
}