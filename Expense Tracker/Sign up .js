 // Auto-fill demo data
 function fillDemoData() {
    document.getElementById('firstName').value = 'John';
    document.getElementById('lastName').value = 'Smith';
    document.getElementById('signupEmail').value = 'john.smith@demo.com';
    document.getElementById('signupPassword').value = 'DemoPass123!';
    document.getElementById('confirmPassword').value = 'DemoPass123!';
    document.getElementById('terms').checked = true;
    
    // Trigger password strength check
    checkPasswordStrength();
    showSuccessMessage('Demo data filled! Ready to create account.');
}

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

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthDiv = document.getElementById('passwordStrength');
    const bars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    if (password.length === 0) {
        strengthDiv.style.display = 'none';
        return;
    }
    
    strengthDiv.style.display = 'block';
    
    let strength = 0;
    let strengthLabel = '';
    
    // Reset bars
    bars.forEach(bar => {
        bar.className = 'strength-bar';
    });
    
    // Check different criteria
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update bars and text
    if (strength <= 1) {
        strengthLabel = 'Very Weak';
        bars[0].classList.add('weak');
    } else if (strength === 2) {
        strengthLabel = 'Weak';
        bars[0].classList.add('weak');
        bars[1].classList.add('weak');
    } else if (strength === 3) {
        strengthLabel = 'Fair';
        bars[0].classList.add('fair');
        bars[1].classList.add('fair');
        bars[2].classList.add('fair');
    } else if (strength === 4) {
        strengthLabel = 'Good';
        bars[0].classList.add('good');
        bars[1].classList.add('good');
        bars[2].classList.add('good');
        bars[3].classList.add('good');
    } else {
        strengthLabel = 'Strong';
        bars.forEach(bar => bar.classList.add('strong'));
    }
    
    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

// Add password strength checking
document.getElementById('signupPassword').addEventListener('input', checkPasswordStrength);

// Handle form submission
document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    const signupBtn = document.getElementById('signupBtn');
    
    // Clear previous errors
    clearErrors();
    
    let isValid = true;
    
    // Validate first name
    if (firstName.length < 2) {
        showError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate last name
    if (lastName.length < 2) {
        showError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (password.length < 8) {
        showError('signupPasswordError', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    // Check terms acceptance
    if (!terms) {
        showError('confirmPasswordError', 'Please accept the terms and privacy policy');
        isValid = false;
    }
    
    if (!isValid) {
        document.querySelector('.container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.container').classList.remove('shake');
        }, 600);
        return;
    }
    
    // Show loading state
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    // Simulate account creation
    setTimeout(() => {
        // Store user data
        const userData = {
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        showSuccessMessage('Account created successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
            // In a real app, this would redirect to the dashboard
            window.location.href = '#dashboard'; // Replace with actual dashboard URL
        }, 2000);
    }, 2000);
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
    }, 4000);
}

// Navigation handlers
function goToLogin() {
    showSuccessMessage('Redirecting to login page...');
    // window.location.href = '/login'; // Uncomment for actual navigation
}

function showTerms() {
    showSuccessMessage('Terms of Service - Coming soon!');
}

function showPrivacy() {
    showSuccessMessage('Privacy Policy - Coming soon!');
}

// Auto-focus first input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('firstName').focus();
});

// Real-time validation
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = this.value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (confirmPassword && password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
    } else {
        errorElement.style.display = 'none';
    }
});

// Email validation on blur
document.getElementById('signupEmail').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
    } else {
        document.getElementById('signupEmailError').style.display = 'none';
    }
});

