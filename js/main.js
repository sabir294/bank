// Main JavaScript voor algemene navigatie en functionaliteit
document.addEventListener('DOMContentLoaded', () => {
    // Navigatie menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Animatie element toevoegen
    const animatedDiv = document.createElement('div');
    animatedDiv.id = 'movingDiv';
    animatedDiv.style.cssText = `
        width: 50px;
        height: 50px;
        background-color: #007bff;
        position: absolute;
        left: 0;
        top: 100px;
        border-radius: 5px;
        transition: left 0.1s linear;
    `;
    document.body.appendChild(animatedDiv);

    let position = 0;
    const maxWidth = window.innerWidth - 50; // Subtract div width

    // Animatie functie
    function moveDiv() {
        position += 5; // Beweeg 5px per keer
        if (position > maxWidth) {
            position = 0; // Reset naar begin
        }
        animatedDiv.style.left = position + 'px';
    }

    // Start de animatie (elke 100ms)
    setInterval(moveDiv, 100);

    // Actieve pagina markeren
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Dropdown menu's
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Sluit andere dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-content')?.classList.remove('active');
                    }
                });
                
                content.classList.toggle('active');
            });
        }
    });

    // Sluit dropdowns bij klik buiten
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-content')?.classList.remove('active');
        });
    });

    // Language selector functionality
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function(e) {
            const selectedLanguage = e.target.value;
            // Here you would implement language switching logic
            // For now, we'll just save the preference
            localStorage.setItem('preferredLanguage', selectedLanguage);
        });

        // Set initial language based on saved preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            languageSelector.value = savedLanguage;
        }
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add active class to current nav item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.main-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Notificatie systeem
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="message">${message}</span>
            <button class="close-btn">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animatie toevoegen
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Automatisch sluiten na 5 seconden
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Sluit knop functionaliteit
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
};

const closeNotification = (notification) => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
};

// Formulier validatie
const validateForm = (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'Dit veld is verplicht');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                markInvalid(input, 'Voer een geldig e-mailadres in');
                isValid = false;
            }
        } else if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                markInvalid(input, 'Voer een geldig telefoonnummer in');
                isValid = false;
            }
        }
    });
    
    return isValid;
};

const markInvalid = (input, message) => {
    input.classList.add('invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const existing = input.parentElement.querySelector('.error-message');
    if (existing) existing.remove();
    
    input.parentElement.appendChild(errorDiv);
    
    input.addEventListener('input', () => {
        input.classList.remove('invalid');
        errorDiv.remove();
    }, { once: true });
};

// Link beveiliging
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
        e.preventDefault();
        
        const confirm = window.confirm('Je verlaat nu de ModernBank website. Wil je doorgaan?');
        if (confirm) {
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    }
});

// Datum formattering
const formatDate = (date) => {
    return new Intl.DateTimeFormat('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// Bedrag formattering
const formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

// Utility functions that might be needed across pages
const utils = {
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Exporteer functies voor gebruik in andere bestanden
window.bankApp = {
    showNotification,
    validateForm,
    formatDate,
    formatAmount,
    utils
};

// Helper functies
function formatCurrency(amount) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Formulier validatie
const transferForm = document.getElementById('transfer-form');
if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simuleer een overschrijving
        showNotification('Overschrijving wordt verwerkt...', 'info');
        
        setTimeout(() => {
            showNotification('Overschrijving succesvol uitgevoerd!', 'success');
            transferForm.reset();
        }, 2000);
    });
}

// Toon demo account data
function loadDemoAccounts() {
    const accounts = [
        { type: 'Betaalrekening', number: 'NL91 BANK 0123 4567 89', balance: 2500.75 },
        { type: 'Spaarrekening', number: 'NL91 BANK 0123 4567 90', balance: 15000.00 }
    ];

    const accountsList = document.querySelector('.accounts-dashboard');
    if (accountsList) {
        accountsList.innerHTML = accounts.map(account => `
            <div class="account-card">
                <h3>${account.type}</h3>
                <div class="account-number">${account.number}</div>
                <div class="balance">${formatCurrency(account.balance)}</div>
                <div class="account-actions">
                    <button class="btn-action">Details</button>
                    <button class="btn-action">Overschrijven</button>
                </div>
            </div>
        `).join('');
    }
}

// Laad demo data
loadDemoAccounts();
