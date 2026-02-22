let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let nextId = expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1;

document.getElementById("expDate").value = new Date().toISOString().split("T")[0];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

function addExpense() {
  const title = document.getElementById("expTitle").value.trim();
  const amount = parseFloat(document.getElementById("expAmount").value);
  const category = document.getElementById("expCategory").value;
  const date = document.getElementById("expDate").value;

  if (!title || !amount || !category || !date) {
    showToast("Fill all fields!");
    return;
  }

  expenses.unshift({ id: nextId++, title, amount, category, date });
  saveExpenses();
  render();
  showToast("Expense added!");

  document.getElementById("expTitle").value = "";
  document.getElementById("expAmount").value = "";
  document.getElementById("expCategory").value = "";
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses();
  render();
}

function render() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  let total = 0;
  expenses.forEach(e => {
    total += e.amount;

    list.innerHTML += `
      <div class="expense-item">
        <span>${e.title} - ₹${e.amount}</span>
        <button onclick="deleteExpense(${e.id})">❌</button>
      </div>
    `;
  });

  document.getElementById("totalAmount").textContent = "₹" + total.toFixed(2);
  document.getElementById("totalCount").textContent = expenses.length;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

render();