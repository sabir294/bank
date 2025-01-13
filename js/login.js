document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const remember = formData.get('remember');

            // Validate form data
            if (!username || !password) {
                showNotification('Vul alle verplichte velden in', 'error');
                return;
            }

            // Simulate login request
            showNotification('Bezig met inloggen...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                // For demo purposes, always succeed
                showLoginSuccess();
            }, 1500);
        });
    }

    // Show success message and redirect
    function showLoginSuccess() {
        showNotification('Succesvol ingelogd!', 'success');
        
        // Redirect to dashboard after notification
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(note => note.remove());
        
        // Add new notification
        document.body.appendChild(notification);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add floating label effect
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', () => {
            control.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', () => {
            if (!control.value) {
                control.parentElement.classList.remove('focused');
            }
        });
        
        // Check initial state
        if (control.value) {
            control.parentElement.classList.add('focused');
        }
    });
});
