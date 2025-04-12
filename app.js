let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const form = document.getElementById('expense-form');
const filter = document.getElementById('filter-category');

form.addEventListener('submit', addExpense);
filter.addEventListener('change', renderExpenses);

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  const expense = { amount, description, date, category };
  expenses.push(expense);
  saveExpenses();
  form.reset();
  renderExpenses();
  updateChart();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
  updateChart();
}

function renderExpenses() {
  const list = document.getElementById('expense-list');
  const selectedCategory = filter.value;
  list.innerHTML = '';

  const filtered = selectedCategory === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  filtered.forEach((exp, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${exp.date} - ${exp.category} - $${exp.amount.toFixed(2)} - ${exp.description}
      <button onclick="deleteExpense(${idx})">❌</button>
    `;
    list.appendChild(div);
  });
}

let chart;
function updateChart() {
  const categoryTotals = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById('expense-chart'), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Expenses by Category',
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      }]
    }
  });
}

// Initial render
renderExpenses();
updateChart();