# Personal Finance & Budget Tracking Application

A comprehensive full-stack web application designed to help users manage their personal finances, track daily transactions, monitor custom budgets, and gain visual insights into their spending habits.

## 🚀 Tech Stack

**Frontend:**
- React (via Vite)
- Tailwind CSS v4
- Zustand (State management with local storage persistence)
- React Router DOM v6
- Recharts (Data visualization)
- Lucide React (Icons)
- Axios

**Backend:**
- Node.js & Express.js
- Prisma ORM (with `@prisma/adapter-pg`)
- PostgreSQL
- JSON Web Tokens (JWT) & bcryptjs for secure HTTP-only cookie authentication
- Zod (Robust API input validation)

---

## 🌟 Features

- **Secure Authentication**: Full JWT-based login/registration system with password hashing and secure HTTP-only cookies.
- **Interactive Dashboard**: Provides a high-level overview of your finances, including Total Balance, Monthly Income, and Monthly Expenses.
- **Visual Insights**: Built-in dynamic charts (Income vs Expense Bar Chart, Expense Distribution Pie Chart).
- **Transaction Management**: Add, edit, and delete transactions. Filter historical transactions by date range, category, or type.
- **Budget Monitoring**: Create budgets for specific expense categories (Monthly, Weekly, Yearly) and track your spending against them using visual progress bars with over-budget alerts.
- **Custom Categories**: Manage your own Income and Expense categories. (Default categories are automatically seeded upon account creation).

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL running locally or remotely

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Open the `backend/.env` file and replace the placeholder `DATABASE_URL` with your actual PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/finance_db?schema=public"
   PORT=5000
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```

4. Push the Prisma Schema to your database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 📖 Usage

1. Open your browser and go to `http://localhost:5173`.
2. Click **Sign up now** to register a new account.
3. Upon registration, default categories (*Salary, Freelance, Food, Rent, Transport*) will be automatically generated for you.
4. Go to **Categories** to add any additional custom categories.
5. Head to **Transactions** to start logging your income and expenses.
6. Create **Budgets** to monitor your spending limits.
7. Return to the **Dashboard** to view your financial summary and charts!

---

## 📂 Project Structure

```text
📦 Tracking Application
 ┣ 📂 backend
 ┃ ┣ 📂 prisma          # Prisma schema
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers   # Route handlers
 ┃ ┃ ┣ 📂 middlewares   # Auth, Error, and Zod Validation middlewares
 ┃ ┃ ┣ 📂 routes        # Express routing
 ┃ ┃ ┣ 📂 utils         # DB adapter and JWT generator
 ┃ ┃ ┣ 📂 validators    # Zod schemas
 ┃ ┃ ┣ 📜 app.js        # Express App configuration
 ┃ ┃ ┗ 📜 server.js     # Entry point
 ┃ ┗ 📜 package.json
 ┃
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components    # Layout, ProtectedRoute, SummaryCard
   ┃ ┣ 📂 pages         # Dashboard, Login, Register, Transactions, Budgets, Categories
   ┃ ┣ 📂 services      # Axios config and API handlers
   ┃ ┣ 📂 store         # Zustand Auth Store
   ┃ ┣ 📜 App.jsx       # React Router setup
   ┃ ┣ 📜 index.css     # Tailwind v4 imports
   ┃ ┗ 📜 main.jsx      # React entry point
   ┣ 📜 vite.config.js  # Vite config with backend proxy
   ┗ 📜 package.json
```
