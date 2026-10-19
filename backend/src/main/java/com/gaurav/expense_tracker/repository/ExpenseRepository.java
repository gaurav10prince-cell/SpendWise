package com.gaurav.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gaurav.expense_tracker.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}