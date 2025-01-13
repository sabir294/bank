// Accounts pagina functionaliteit
document.addEventListener('DOMContentLoaded', () => {
    // Demo data voor rekeningen
    const accounts = [
        {
            id: 1,
            type: 'Betaalrekening',
            number: 'NL91MBNK0123456789',
            balance: 2547.89,
            transactions: [
                { date: '2024-01-15', description: 'Salaris', amount: 2800.00, type: 'credit' },
                { date: '2024-01-14', description: 'Albert Heijn', amount: -67.85, type: 'debit' },
                { date: '2024-01-13', description: 'Spotify', amount: -9.99, type: 'debit' }
            ]
        },
        {
            id: 2,
            type: 'Spaarrekening',
            number: 'NL91MBNK0123456790',
            balance: 15750.32,
            transactions: [
                { date: '2024-01-10', description: 'Inleg spaargeld', amount: 500.00, type: 'credit' },
                { date: '2024-01-01', description: 'Rente', amount: 12.50, type: 'credit' }
            ]
        }
    ];

    // Rekeningen weergeven
    const accountsContainer = document.querySelector('.accounts-overview');
    if (accountsContainer) {
        displayAccounts(accountsContainer, accounts);
    }

    // Transactie historie weergeven
    const transactionsContainer = document.querySelector('.transactions-list');
    if (transactionsContainer) {
        displayAllTransactions(transactionsContainer, accounts);
    }

    // Account filters
    const filterButtons = document.querySelectorAll('.account-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            filterAccounts(type, accounts);
            
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Zoekfunctionaliteit
    const searchInput = document.querySelector('.search-transactions');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTransactions(e.target.value, accounts);
        });
    }

    // Account details modal
    setupAccountDetailsModal();
});

function displayAccounts(container, accounts) {
    container.innerHTML = accounts.map(account => `
        <div class="account-card" data-account-id="${account.id}">
            <div class="account-header">
                <h3>${account.type}</h3>
                <span class="account-number">${formatAccountNumber(account.number)}</span>
            </div>
            <div class="account-balance">
                <span class="balance-label">Saldo</span>
                <span class="balance-amount">${window.bankApp.formatAmount(account.balance)}</span>
            </div>
            <div class="account-actions">
                <button class="btn primary" onclick="showAccountDetails(${account.id})">Details</button>
                <button class="btn secondary" onclick="initiateTransfer(${account.id})">Overboeken</button>
            </div>
        </div>
    `).join('');
}

function displayAllTransactions(container, accounts) {
    const allTransactions = accounts.flatMap(account => 
        account.transactions.map(transaction => ({
            ...transaction,
            accountNumber: account.number,
            accountType: account.type
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    displayTransactions(container, allTransactions);
}

function displayTransactions(container, transactions) {
    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-icon ${transaction.type}">
                <i class="fas fa-${transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}"></i>
            </div>
            <div class="transaction-details">
                <span class="transaction-description">${transaction.description}</span>
                <span class="transaction-account">${formatAccountNumber(transaction.accountNumber)}</span>
                <span class="transaction-date">${window.bankApp.formatDate(new Date(transaction.date))}</span>
            </div>
            <span class="transaction-amount ${transaction.type}">
                ${window.bankApp.formatAmount(transaction.amount)}
            </span>
        </div>
    `).join('');
}

function filterAccounts(type, accounts) {
    const filtered = type === 'all' ? accounts : accounts.filter(account => account.type === type);
    const container = document.querySelector('.accounts-overview');
    if (container) {
        displayAccounts(container, filtered);
    }
}

function searchTransactions(query, accounts) {
    const allTransactions = accounts.flatMap(account => 
        account.transactions.map(transaction => ({
            ...transaction,
            accountNumber: account.number,
            accountType: account.type
        }))
    );

    const filtered = allTransactions.filter(transaction => 
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.accountNumber.includes(query) ||
        window.bankApp.formatAmount(transaction.amount).includes(query)
    );

    const container = document.querySelector('.transactions-list');
    if (container) {
        displayTransactions(container, filtered);
    }
}

function showAccountDetails(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const modal = document.querySelector('.account-details-modal');
    if (modal) {
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${account.type}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="account-info">
                        <p><strong>Rekeningnummer:</strong> ${formatAccountNumber(account.number)}</p>
                        <p><strong>Saldo:</strong> ${window.bankApp.formatAmount(account.balance)}</p>
                    </div>
                    <div class="recent-transactions">
                        <h3>Recente Transacties</h3>
                        <div class="transactions-list">
                            ${account.transactions.map(transaction => `
                                <div class="transaction-item ${transaction.type}">
                                    <div class="transaction-details">
                                        <span class="transaction-description">${transaction.description}</span>
                                        <span class="transaction-date">${window.bankApp.formatDate(new Date(transaction.date))}</span>
                                    </div>
                                    <span class="transaction-amount ${transaction.type}">
                                        ${window.bankApp.formatAmount(transaction.amount)}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('active');

        // Sluit modal functionaliteit
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Sluit bij klik buiten modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function initiateTransfer(accountId) {
    // Navigeer naar de overschrijvingspagina met het gekozen account
    window.location.href = `transfers.html?from=${accountId}`;
}

function formatAccountNumber(number) {
    return number.replace(/(.{4})/g, '$1 ').trim();
}

function setupAccountDetailsModal() {
    // Voeg modal container toe als deze nog niet bestaat
    if (!document.querySelector('.account-details-modal')) {
        const modal = document.createElement('div');
        modal.className = 'account-details-modal';
        document.body.appendChild(modal);
    }
}
