package objects;

import java.time.LocalDateTime;

public class Review {
    private Patient reviewer;
    private Doctor reviewedDoctor;
    private String comment;
    private int rating;
    private LocalDateTime reviewDate;

    public Review(Patient reviewer, Doctor reviewedDoctor, String comment, int rating) {

        if (reviewer == null || reviewedDoctor == null || rating <= 0) {
            throw new IllegalArgumentException("Reviewer, reviewedDoctor, and rating cannot be null or rating cannot be less than 0.");
        } // review cannot be created without these.

        this.reviewer = reviewer;
        this.reviewedDoctor = reviewedDoctor;
        this.comment = comment;
        setRating(rating);
        this.reviewDate = LocalDateTime.now();
    }

    // Getters
    public Patient getReviewer() {
        return reviewer;
    }

    public Doctor getReviewedDoctor() {
        return reviewedDoctor;
    }

    public String getComment() {
        return comment;
    }

    public int getRating() {
        return rating;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    // Setters
    public void setComment(String newComment) {
        this.comment = newComment;
    }

    public void setRating(int rating) {
        if (rating >= 1 && rating <= 5) {
            this.rating = rating;
        } else {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
    }

    public void updateRating(int newRating) {
        setRating(newRating);
    }

    public String GeneralInfo() {
        return "Review Patient: " + reviewer.getFullName() +
                ", Doctor: " + reviewedDoctor.getFullName() +
                ", Rating: " + rating + "/5" +
                ", Date: " + reviewDate.toString() +
                ", Comment: " + comment;
    }
}
