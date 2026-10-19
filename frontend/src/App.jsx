import { useEffect, useState } from "react";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/expenses`;

const INITIAL_FORM = {
  title: "",
  amount: "",
  category: "Food",
  type: "EXPENSE",
  date: new Date().toLocaleDateString("en-CA"),
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState(INITIAL_FORM.title);
  const [amount, setAmount] = useState(INITIAL_FORM.amount);
  const [category, setCategory] = useState(INITIAL_FORM.category);
  const [type, setType] = useState(INITIAL_FORM.type);
  const [date, setDate] = useState(INITIAL_FORM.date);

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const loadExpenses = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
      setError("");
    } catch (err) {
      setError(
        "Backend se connection nahi ho raha. Spring Boot check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const resetForm = () => {
    setTitle(INITIAL_FORM.title);
    setAmount(INITIAL_FORM.amount);
    setCategory(INITIAL_FORM.category);
    setType(INITIAL_FORM.type);
    setDate(INITIAL_FORM.date);
    setEditingId(null);
  };

  const totalIncome = expenses
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalIncome - totalExpense;
  const maxAmount = Math.max(totalIncome, totalExpense, 1);

  const categoryExpenses = expenses
    .filter((item) => item.type === "EXPENSE")
    .reduce((result, item) => {
      result[item.category] =
        (result[item.category] || 0) + Number(item.amount);
      return result;
    }, {});

  const categoryData = Object.entries(categoryExpenses).sort(
    (a, b) => b[1] - a[1]
  );

  const filteredExpenses = [...expenses]
    .reverse()
    .filter((item) => {
      const matchesSearch = (item.title || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesType =
        filterType === "ALL" || item.type === filterType;

      const matchesCategory =
        filterCategory === "ALL" ||
        item.category === filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");
    setSaving(true);

    const transaction = {
      title: title.trim(),
      amount: Number(amount),
      category,
      type,
      date,
    };

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Could not update transaction"
            : "Could not save transaction"
        );
      }

      resetForm();

      await loadExpenses();

      setSuccess(
        isEditing
          ? "Transaction updated successfully!"
          : "Transaction added successfully!"
      );
    } catch (err) {
      setError(
        editingId !== null
          ? "Transaction update nahi hua. Backend endpoint aur database check karo."
          : "Transaction save nahi hua. Backend aur database check karo."
      );
    } finally {
      setSaving(false);
    }
  };

  const editExpense = (item) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setAmount(String(item.amount ?? ""));
    setCategory(item.category || "Other");
    setType(item.type || "EXPENSE");

    // Date input ko YYYY-MM-DD format chahiye.
    setDate(
      item.date
        ? String(item.date).slice(0, 10)
        : INITIAL_FORM.date
    );

    setError("");
    setSuccess("");

    // Edit form tak scroll karo.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    resetForm();
    setError("");
    setSuccess("");
  };

  const deleteExpense = async (id) => {
    const confirmed = window.confirm(
      "Kya tum is transaction ko delete karna chahte ho?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete transaction");
      }

      // Agar edit ho raha transaction delete hua, form reset karo.
      if (editingId === id) {
        resetForm();
      }

      await loadExpenses();
      setSuccess("Transaction deleted successfully!");
    } catch (err) {
      setError("Transaction delete nahi hua.");
    }
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const resetFilters = () => {
    setSearch("");
    setFilterType("ALL");
    setFilterCategory("ALL");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">₹</span>
          <span>SpendWise</span>
        </div>

        <p className="menu-label">MENU</p>
        <div className="menu-item active">▦ &nbsp; Dashboard</div>
        <div className="menu-item">↔ &nbsp; Transactions</div>
        <div className="menu-item">▤ &nbsp; Reports</div>

        <div className="sidebar-bottom">
          <div className="avatar">GP</div>
          <div>
            <strong>Gaurav Pandey</strong>
            <small>Personal Account</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Welcome back! Here's your financial overview.
            </p>
          </div>

          <div className="today">
            <span>📅</span>{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </header>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div
            className="success-message"
            role="status"
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              background: "#dcfce7",
              color: "#166534",
            }}
          >
            {success}
          </div>
        )}

        <section className="summary-grid">
          <div className="summary-card balance-card">
            <div className="card-top">
              <span>Total Balance</span>
              <span className="card-icon">₹</span>
            </div>
            <h2>{formatMoney(balance)}</h2>
            <p>Your current net balance</p>
          </div>

          <div className="summary-card">
            <div className="card-top">
              <span>Total Income</span>
              <span className="card-icon income-icon">↗</span>
            </div>
            <h2>{formatMoney(totalIncome)}</h2>
            <p className="positive">Money received</p>
          </div>

          <div className="summary-card">
            <div className="card-top">
              <span>Total Expenses</span>
              <span className="card-icon expense-icon">↘</span>
            </div>
            <h2>{formatMoney(totalExpense)}</h2>
            <p className="negative">Money spent</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h3>
                  {editingId !== null
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h3>
                <p>
                  {editingId !== null
                    ? "Update your transaction details"
                    : "Record your income or expenses"}
                </p>
              </div>

              <span className="heading-icon">
                {editingId !== null ? "✏️" : "＋"}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="transaction-title">
                Transaction Title
              </label>
              <input
                id="transaction-title"
                type="text"
                placeholder="e.g. Grocery shopping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="transaction-amount">
                Amount (₹)
              </label>
              <input
                id="transaction-amount"
                type="number"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <label htmlFor="transaction-type">
                Transaction Type
              </label>
              <select
                id="transaction-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>

              <label htmlFor="transaction-category">Category</label>
              <select
                id="transaction-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Salary</option>
                <option>Freelance</option>
                <option>Health</option>
                <option>Education</option>
                <option>Other</option>
              </select>

              <label htmlFor="transaction-date">Date</label>
              <input
                id="transaction-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <button
                className="submit-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "💾 Save Changes"
                    : "+ Add Transaction"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  ✕ Cancel
                </button>
              )}
            </form>
          </div>

          <div className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Transactions</h3>
                <p>Your latest financial activity</p>
              </div>

              <span className="transaction-count">
                {filteredExpenses.length} shown / {expenses.length} total
              </span>
            </div>

            <div className="filter-controls">
              <input
                type="text"
                placeholder="🔍 Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search transactions by title"
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter by transaction type"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="ALL">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>

              <button
                type="button"
                className="reset-filter-button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>

            {loading ? (
              <p className="empty-state">
                Loading transactions...
              </p>
            ) : expenses.length === 0 ? (
              <p className="empty-state">
                No transactions yet. Add one to get started!
              </p>
            ) : filteredExpenses.length === 0 ? (
              <p className="empty-state">
                No matching transactions found. Try different filters.
              </p>
            ) : (
              <div className="transaction-list">
                {filteredExpenses.map((item) => (
                  <div className="transaction-row" key={item.id}>
                    <div className="transaction-symbol">
                      {item.type === "INCOME" ? "↙" : "↗"}
                    </div>

                    <div className="transaction-details">
                      <strong>{item.title}</strong>
                      <small>
                        {item.category} · {item.date}
                      </small>
                    </div>

                    <div className="transaction-right">
                      <strong
                        className={
                          item.type === "INCOME"
                            ? "positive"
                            : "negative"
                        }
                      >
                        {item.type === "INCOME" ? "+" : "-"}
                        {formatMoney(Number(item.amount))}
                      </strong>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "8px",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => editExpense(item)}
                          title="Edit transaction"
                          disabled={saving}
                          style={{
                            padding: "6px 10px",
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => deleteExpense(item.id)}
                          title="Delete transaction"
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="charts-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h3>Income vs Expenses</h3>
                <p>Compare your overall financial activity</p>
              </div>
              <span className="heading-icon">📊</span>
            </div>

            <div className="comparison-chart">
              <div className="chart-item">
                <div className="chart-label">
                  <span>Total Income</span>
                  <strong>{formatMoney(totalIncome)}</strong>
                </div>

                <div className="chart-track">
                  <div
                    className="chart-bar income-bar"
                    style={{
                      width: `${(totalIncome / maxAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="chart-item">
                <div className="chart-label">
                  <span>Total Expenses</span>
                  <strong>{formatMoney(totalExpense)}</strong>
                </div>

                <div className="chart-track">
                  <div
                    className="chart-bar expense-bar"
                    style={{
                      width: `${(totalExpense / maxAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="chart-summary">
              <span>Net Balance</span>
              <strong
                className={balance >= 0 ? "positive" : "negative"}
              >
                {formatMoney(balance)}
              </strong>
            </div>
          </div>

          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h3>Spending by Category</h3>
                <p>See where your money goes</p>
              </div>
              <span className="heading-icon">💳</span>
            </div>

            {categoryData.length === 0 ? (
              <p className="empty-state">
                Add expenses to see your spending chart.
              </p>
            ) : (
              <div className="category-chart">
                {categoryData.map(([name, value]) => (
                  <div
                    className="category-chart-item"
                    key={name}
                  >
                    <div className="chart-label">
                      <span>{name}</span>
                      <strong>{formatMoney(value)}</strong>
                    </div>

                    <div className="chart-track">
                      <div
                        className="chart-bar category-bar"
                        style={{
                          width: `${
                            (value /
                              Math.max(
                                ...categoryData.map(
                                  (item) => item[1]
                                ),
                                1
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer>
          SpendWise · Manage your money with confidence.
        </footer>
      </main>
    </div>
  );
}

export default App;

