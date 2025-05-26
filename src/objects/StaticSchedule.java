package objects;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalTime;

public class StaticSchedule {
    // Simple array of time slots from 9 - 17
    private static final LocalTime[] TIME_SLOTS = {
        LocalTime.of(9, 0), 
        LocalTime.of(9, 30), 
        LocalTime.of(10, 0), 
        LocalTime.of(10, 30),
        LocalTime.of(11, 0), 
        LocalTime.of(11, 30),
        LocalTime.of(12, 0), 
        LocalTime.of(12, 30),
        LocalTime.of(13, 0), 
        LocalTime.of(13, 30),
        LocalTime.of(14, 0), 
        LocalTime.of(14, 30),
        LocalTime.of(15, 0), 
        LocalTime.of(15, 30),
        LocalTime.of(16, 0) 
    };

    // enum for days of the week
    public enum Day {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY
    }

    // Get available time slots for a given day
    public List<LocalTime> getAvailableTimeSlots(Day day, List<Appointment> appointments) {
        List<LocalTime> availableSlots = new ArrayList<>();
        for (LocalTime slot : TIME_SLOTS) {
            availableSlots.add(slot);
        }
        
        // Remove slots that are already booked
        for (Appointment appointment : appointments) {
            int appointmentDay = appointment.getDateTime().toLocalDate().getDayOfWeek().getValue() - 1;
            
            if (appointmentDay == day.ordinal()) {
                LocalTime appointmentTime = appointment.getDateTime().toLocalTime();
                availableSlots.remove(appointmentTime);
            }
        }
        
        return availableSlots;
    }
}
