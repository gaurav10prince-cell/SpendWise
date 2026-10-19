# 💰 SpendWise — Personal Expense Tracker

SpendWise is a full-stack personal finance management application that helps users track their income and expenses, manage transactions, and visualize their spending habits through an interactive dashboard.

## 🚀 Features

* **Dashboard:** View total balance, income, and expenses.
* **Transaction Management:** Add, edit, and delete transactions.
* **Search & Filter:** Find transactions using search and category/type filters.
* **Visual Analytics:** Compare income and expenses and analyze category-wise spending.
* **Database Persistence:** Store transaction records in MySQL.
* **Responsive UI:** Clean dashboard design for desktop and mobile screens.

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5 & CSS3
* Axios
* Vite

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* REST API

### Database

* MySQL

## 📁 Project Structure

```text
SpendWise/
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/gaurav/expense_tracker/
│           │       ├── controller/
│           │       ├── entity/
│           │       └── repository/
│           └── resources/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

* Java JDK
* Node.js and npm
* MySQL Server
* VS Code or another IDE

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "New Project"
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure MySQL

Start MySQL Server and create the database.

```sql
CREATE DATABASE expense_tracker;
```

Configure the database connection in the backend's `application.properties` file using your MySQL username and password.

Keep your database credentials private.

### 3. Start the Backend

Open a terminal in the backend directory:

```bash
cd backend
```

Run the Spring Boot application using the Maven wrapper if available:

```bash
.\mvnw.cmd spring-boot:run
```

Alternatively, open the backend project in your IDE and run the main Spring Boot application class.

The backend API runs at:

```text
http://localhost:8080
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/expenses`      | Retrieve all transactions |
| POST   | `/api/expenses`      | Add a transaction         |
| PUT    | `/api/expenses/{id}` | Update a transaction      |
| DELETE | `/api/expenses/{id}` | Delete a transaction      |

## 🎯 Project Objective

The objective of SpendWise is to provide a simple and user-friendly platform for managing personal finances. It demonstrates full-stack application development using React, Java Spring Boot, REST APIs, and MySQL.

## 👨‍💻 Developer

**Gaurav Pandey**
B.Tech — Computer Science and Engineering
United Institute of Technology, Prayagraj

## 📄 License

This project was developed for educational and portfolio purposes.
