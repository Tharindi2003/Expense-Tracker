// Auto-fill demo credentials when clicking the demo info
document.querySelector('.demo-info').addEventListener('click', function() {
    document.getElementById('email').value = 'demo@tracker.com';
    document.getElementById('password').value = 'demo123';
    showSuccessMessage('Demo credentials filled!');
});

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling;
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Handle form submission
document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const signinBtn = document.getElementById('signinBtn');
    
    // Clear previous errors
    clearErrors();
    
    // Basic validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    signinBtn.classList.add('loading');
    signinBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Demo login check
        if (email === 'demo@tracker.com' && password === 'demo123') {
            showSuccessMessage('Welcome back! Redirecting to your dashboard...');
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            setTimeout(() => {
                // In a real app, this would redirect to the dashboard
                window.location.href = '#dashboard'; // Replace with actual dashboard URL
            }, 1500);
        } else {
            // Remove loading state
            signinBtn.classList.remove('loading');
            signinBtn.disabled = false;
            
            // Show error
            showError('passwordError', 'Invalid email or password');
            document.querySelector('.container').classList.add('shake');
            
            setTimeout(() => {
                document.querySelector('.container').classList.remove('shake');
            }, 600);
        }
    }, 1500);
});

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Social login handlers
function socialLogin(provider) {
    showSuccessMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
}

// Navigation handlers
function goToHome() {
    showSuccessMessage('Redirecting to home page...');
    // window.location.href = '/'; // Uncomment for actual navigation
}

function goToSignUp() {
    showSuccessMessage('Redirecting to sign up page...');
    // window.location.href = '/signup'; // Uncomment for actual navigation
}

function forgotPassword() {
    showSuccessMessage('Password reset link sent to your email!');
}

// Auto-focus first input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').focus();
});

// Handle Enter key press
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('signInForm').dispatchEvent(new Event('submit'));
    }
});

