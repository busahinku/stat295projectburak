package objects;

public class FinancialTransaction {
    private String type; // "Revenue" or "Expense"
    private double amount;
    private String category;
    private String description;

    public FinancialTransaction(String type, double amount, String category, String description) {
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.description = description;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        if (!type.equalsIgnoreCase("revenue") && !type.equalsIgnoreCase("expense")) {
            throw new IllegalArgumentException("Type must be either 'revenue' or 'expense'");
        }
        this.type = type.toLowerCase();
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


} 