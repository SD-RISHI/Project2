let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let nextId = expenses.length
    ? Math.max(...expenses.map(exp => exp.id)) + 1
    : 1;

// Set today's date
document.getElementById("expDate").value =
    new Date().toISOString().split("T")[0];

// Restore Dark Mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("darkToggle").textContent = "☀️ Light";
}

// ----------------------
// Save Expenses
// ----------------------
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ----------------------
// Toast
// ----------------------
function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show-toast");

    setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2000);
}

// ----------------------
// Add Expense
// ----------------------
function addExpense() {

    const title = document.getElementById("expTitle").value.trim();
    const amount = parseFloat(document.getElementById("expAmount").value);
    const category = document.getElementById("expCategory").value;
    const date = document.getElementById("expDate").value;

    if (!title || isNaN(amount) || amount <= 0 || !category || !date) {
        showToast("Please fill all fields correctly.");
        return;
    }

    expenses.unshift({
        id: nextId++,
        title,
        amount,
        category,
        date
    });

    saveExpenses();
    render();

    showToast("Expense Added Successfully");

    document.getElementById("expTitle").value = "";
    document.getElementById("expAmount").value = "";
    document.getElementById("expCategory").value = "";
}

// ----------------------
// Delete
// ----------------------
function deleteExpense(id) {

    if (!confirm("Delete this expense?")) return;

    expenses = expenses.filter(exp => exp.id !== id);

    saveExpenses();

    render();

    showToast("Expense Deleted");
}

// ----------------------
// Edit
// ----------------------
function editExpense(id) {

    const expense = expenses.find(exp => exp.id === id);

    if (!expense) return;

    document.getElementById("expTitle").value = expense.title;
    document.getElementById("expAmount").value = expense.amount;
    document.getElementById("expCategory").value = expense.category;
    document.getElementById("expDate").value = expense.date;

    deleteExpense(id);
}

// ----------------------
// Render
// ----------------------
function render() {

    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    let total = 0;
    let monthTotal = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    expenses.forEach(expense => {

        total += expense.amount;

        const d = new Date(expense.date);

        if (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
        ) {
            monthTotal += expense.amount;
        }

        list.innerHTML += `
        <div class="expense-item">

            <div class="expense-left">
                <h3>${expense.title}</h3>

                <p>
                    ${expense.category} • ${expense.date}
                </p>
            </div>

            <div class="expense-right">

                <div class="price">
                    ₹${expense.amount.toFixed(2)}
                </div>

                <button
                    class="delete-btn"
                    onclick="editExpense(${expense.id})">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">
                    🗑 Delete
                </button>

            </div>

        </div>
        `;
    });

    if (expenses.length === 0) {

        list.innerHTML = `
        <div class="expense-item">
            <p style="width:100%;text-align:center;">
                No expenses added yet.
            </p>
        </div>`;
    }

    document.getElementById("totalAmount").textContent =
        "₹" + total.toFixed(2);

    document.getElementById("monthAmount").textContent =
        "₹" + monthTotal.toFixed(2);

    document.getElementById("totalCount").textContent =
        expenses.length;
}

// ----------------------
// Dark Mode
// ----------------------
function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const btn = document.getElementById("darkToggle");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        btn.textContent = "☀️ Light";

    } else {

        localStorage.setItem("theme", "light");
        btn.textContent = "🌙 Dark";
    }
}

render();
