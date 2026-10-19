package com.gaurav.expense_tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gaurav.expense_tracker.entity.Expense;
import com.gaurav.expense_tracker.repository.ExpenseRepository;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://spendwise-two-sepia.vercel.app/"
})
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense updatedExpense) {

        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setTitle(updatedExpense.getTitle());
                    expense.setAmount(updatedExpense.getAmount());
                    expense.setCategory(updatedExpense.getCategory());
                    expense.setType(updatedExpense.getType());
                    expense.setDate(updatedExpense.getDate());

                    Expense savedExpense = expenseRepository.save(expense);

                    return ResponseEntity.ok(savedExpense);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

