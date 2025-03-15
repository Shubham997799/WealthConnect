package com.example.Expance_management.Entity;



import jakarta.persistence.*;

@Entity
@Table(name = "expense_types")
public class ExpenseType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double lim;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Double getLim() {
		return lim;
	}
	public void setLimit(Double lim) {
		this.lim = lim;
	}

    // Getters and Setters
    
}
