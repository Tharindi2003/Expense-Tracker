// Data storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 0;

// Categories
const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'],
    expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other Expenses']
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDate();
    updateCategoryOptions();
    updateFilterCategories();
    displayTransactions();
    updateStatistics();
    updateBudgetDisplay();
});

// Set default date to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Update category options based on type
function updateCategoryOptions() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (type && categories[type]) {
        categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Update filter categories
function updateFilterCategories() {
    const filterCategory = document.getElementById('filterCategory');
    filterCategory.innerHTML = '<option value="all">All Categories</option>';
    
    Object.values(categories).flat().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

// Handle form submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    displayTransactions();
    updateStatistics();
    updateBudgetDisplay();
    updateCategoryChart();
    showNotification('Transaction added successfully!');
    
    // Reset form
    document.getElementById('transactionForm').reset();
    setDefaultDate();
    updateCategoryOptions();
});

// Display transactions
function displayTransactions(transactionsToShow = transactions) {
    const transactionList = document.getElementById('transactionList');
    
    if (transactionsToShow.length === 0) {
        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No transactions found. Try adjusting your filters or add a new transaction!</p>
            </div>
        `;
        return;
    }
    
    transactionList.innerHTML = transactionsToShow.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-details">
                    ${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        updateStatistics();
        updateBudgetDisplay();
        updateCategoryChart();
        showNotification('Transaction deleted successfully!');
    }
}

// Update statistics
function updateStatistics() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const netBalance = totalIncome - totalExpenses;
    const budgetRemaining = budget - totalExpenses;

    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('netBalance').textContent = `$${netBalance.toFixed(2)}`;
    document.getElementById('budgetRemaining').textContent = `$${budgetRemaining.toFixed(2)}`;

    // Update balance change color
    const balanceChange = document.getElementById('balanceChange');
    balanceChange.className = netBalance >= 0 ? 'stat-change positive' : 'stat-change negative';
    
    // Update budget remaining color
    const budgetChange = document.getElementById('budgetChange');
    budgetChange.className = budgetRemaining >= 0 ? 'stat-change positive' : 'stat-change negative';
}

// Set budget
function setBudget() {
    const budgetAmount = parseFloat(document.getElementById('budgetAmount').value);
    if (budgetAmount && budgetAmount > 0) {
        budget = budgetAmount;
        localStorage.setItem('budget', budget.toString());
        updateBudgetDisplay();
        updateStatistics();
        showNotification('Budget set successfully!');
        document.getElementById('budgetAmount').value = '';
    } else {
        alert('Please enter a valid budget amount.');
    }
}

// Update budget display
function updateBudgetDisplay() {
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const budgetSpent = Math.min(totalExpenses, budget);
    const budgetPercentage = budget > 0 ? (budgetSpent / budget) * 100 : 0;
    
    document.getElementById('budgetSpent').textContent = `$${budgetSpent.toFixed(2)}`;
    document.getElementById('budgetTotal').textContent = `$${budget.toFixed(2)}`;
    document.getElementById('budgetProgressBar').style.width = `${budgetPercentage}%`;
    
    // Change color based on budget usage
    const progressBar = document.getElementById('budgetProgressBar');
    if (budgetPercentage > 90) {
        progressBar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else if (budgetPercentage > 75) {
        progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
    }
}

// Update category chart
function updateCategoryChart() {
    const categoryChart = document.getElementById('categoryChart');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
        categoryChart.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>Add some expenses to see category breakdown</p>
            </div>
        `;
        return;
    }
    
    const categoryTotals = {};
    expenses.forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });
    
    categoryChart.innerHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => `
            <div class="category-item">
                <div class="category-name">${category}</div>
                <div class="category-amount">$${amount.toFixed(2)}</div>
            </div>
        `).join('');
}

// Filter transactions
function filterTransactions() {
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const dateFilter = document.getElementById('filterDate').value;
    
    let filteredTransactions = transactions;
    
    if (typeFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
    }
    
    if (dateFilter) {
        filteredTransactions = filteredTransactions.filter(t => t.date === dateFilter);
    }
    
    displayTransactions(filteredTransactions);
}

// Clear filters
function clearFilters() {
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterDate').value = '';
    displayTransactions();
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize category chart
update