// Transfers pagina functionaliteit
document.addEventListener('DOMContentLoaded', () => {
    // Haal account ID uit URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fromAccountId = urlParams.get('from');

    // Demo data voor rekeningen
    const accounts = [
        {
            id: 1,
            type: 'Betaalrekening',
            number: 'NL91MBNK0123456789',
            balance: 2547.89
        },
        {
            id: 2,
            type: 'Spaarrekening',
            number: 'NL91MBNK0123456790',
            balance: 15750.32
        }
    ];

    // Recent overgemaakte bedragen voor suggesties
    const recentAmounts = [10, 25, 50, 100];

    // Initialiseer formulier
    initializeTransferForm(accounts, fromAccountId);
    
    // Voeg recente bedragen toe
    addRecentAmounts(recentAmounts);
    
    // Initialiseer formulier validatie
    setupFormValidation();
});

function initializeTransferForm(accounts, selectedAccountId) {
    const fromSelect = document.querySelector('#from-account');
    const toSelect = document.querySelector('#to-account');
    
    if (fromSelect && toSelect) {
        // Vul de account dropdowns
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = `${account.type} (${formatAccountNumber(account.number)})`;
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        });

        // Selecteer het account uit de URL parameter
        if (selectedAccountId) {
            fromSelect.value = selectedAccountId;
        }

        // Update beschikbaar saldo bij selectie van account
        fromSelect.addEventListener('change', () => {
            updateAvailableBalance(accounts, fromSelect.value);
        });

        // Trigger initial balance update
        updateAvailableBalance(accounts, fromSelect.value);
    }
}

function updateAvailableBalance(accounts, accountId) {
    const balanceElement = document.querySelector('.available-balance .amount');
    if (balanceElement) {
        const account = accounts.find(acc => acc.id === parseInt(accountId));
        if (account) {
            balanceElement.textContent = window.bankApp.formatAmount(account.balance);
        }
    }
}

function addRecentAmounts(amounts) {
    const container = document.querySelector('.quick-amounts');
    if (container) {
        container.innerHTML = amounts.map(amount => `
            <button type="button" class="amount-btn" data-amount="${amount}">
                ${window.bankApp.formatAmount(amount)}
            </button>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('#amount').value = btn.dataset.amount;
                validateAmount();
            });
        });
    }
}

function setupFormValidation() {
    const form = document.querySelector('#transfer-form');
    const amountInput = document.querySelector('#amount');
    const descriptionInput = document.querySelector('#description');
    const fromSelect = document.querySelector('#from-account');
    const toSelect = document.querySelector('#to-account');
    const dateInput = document.querySelector('#transfer-date');

    if (form) {
        // Valideer bedrag bij input
        amountInput?.addEventListener('input', validateAmount);
        
        // Valideer beschrijving bij input
        descriptionInput?.addEventListener('input', validateDescription);
        
        // Valideer rekeningen bij verandering
        fromSelect?.addEventListener('change', validateAccounts);
        toSelect?.addEventListener('change', validateAccounts);
        
        // Valideer datum bij verandering
        dateInput?.addEventListener('change', validateDate);

        // Form submit handler
        form.addEventListener('submit', handleTransferSubmit);
    }
}

function validateAmount() {
    const amountInput = document.querySelector('#amount');
    const errorElement = document.querySelector('#amount-error');
    
    if (amountInput && errorElement) {
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount <= 0) {
            showError(errorElement, 'Voer een geldig bedrag in');
            return false;
        }
        
        const fromSelect = document.querySelector('#from-account');
        const selectedAccount = accounts.find(acc => acc.id === parseInt(fromSelect.value));
        
        if (selectedAccount && amount > selectedAccount.balance) {
            showError(errorElement, 'Onvoldoende saldo');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    return false;
}

function validateDescription() {
    const descriptionInput = document.querySelector('#description');
    const errorElement = document.querySelector('#description-error');
    
    if (descriptionInput && errorElement) {
        const description = descriptionInput.value.trim();
        
        if (description.length < 3) {
            showError(errorElement, 'Beschrijving moet minimaal 3 tekens bevatten');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    return false;
}

function validateAccounts() {
    const fromSelect = document.querySelector('#from-account');
    const toSelect = document.querySelector('#to-account');
    const errorElement = document.querySelector('#account-error');
    
    if (fromSelect && toSelect && errorElement) {
        if (fromSelect.value === toSelect.value) {
            showError(errorElement, 'Kies verschillende rekeningen');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    return false;
}

function validateDate() {
    const dateInput = document.querySelector('#transfer-date');
    const errorElement = document.querySelector('#date-error');
    
    if (dateInput && errorElement) {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError(errorElement, 'Datum kan niet in het verleden liggen');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    return false;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

async function handleTransferSubmit(e) {
    e.preventDefault();
    
    // Valideer alle velden
    const isAmountValid = validateAmount();
    const isDescriptionValid = validateDescription();
    const areAccountsValid = validateAccounts();
    const isDateValid = validateDate();
    
    if (isAmountValid && isDescriptionValid && areAccountsValid && isDateValid) {
        // Toon bevestigingsmodal
        const confirmed = await showConfirmationModal();
        
        if (confirmed) {
            // Simuleer verwerking
            showProcessingOverlay();
            
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage();
                resetForm();
            }, 2000);
        }
    }
}

function showConfirmationModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal confirmation-modal';
        
        const fromAccount = document.querySelector('#from-account option:checked').textContent;
        const toAccount = document.querySelector('#to-account option:checked').textContent;
        const amount = document.querySelector('#amount').value;
        const description = document.querySelector('#description').value;
        const date = document.querySelector('#transfer-date').value;
        
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Bevestig je overboeking</h3>
                <div class="transfer-details">
                    <p><strong>Van:</strong> ${fromAccount}</p>
                    <p><strong>Naar:</strong> ${toAccount}</p>
                    <p><strong>Bedrag:</strong> ${window.bankApp.formatAmount(parseFloat(amount))}</p>
                    <p><strong>Omschrijving:</strong> ${description}</p>
                    <p><strong>Datum:</strong> ${window.bankApp.formatDate(new Date(date))}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn secondary" id="cancel-transfer">Annuleren</button>
                    <button class="btn primary" id="confirm-transfer">Bevestigen</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const cancelBtn = modal.querySelector('#cancel-transfer');
        const confirmBtn = modal.querySelector('#confirm-transfer');
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });
        
        confirmBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        });
    });
}

function showProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'processing-overlay';
    overlay.innerHTML = `
        <div class="spinner"></div>
        <p>Je overboeking wordt verwerkt...</p>
    `;
    document.body.appendChild(overlay);
}

function hideProcessingOverlay() {
    const overlay = document.querySelector('.processing-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function showSuccessMessage() {
    window.bankApp.showNotification('Je overboeking is succesvol verwerkt!', 'success');
}

function resetForm() {
    const form = document.querySelector('#transfer-form');
    if (form) {
        form.reset();
        updateAvailableBalance(accounts, form.querySelector('#from-account').value);
    }
}

function formatAccountNumber(number) {
    return number.replace(/(.{4})/g, '$1 ').trim();
}
