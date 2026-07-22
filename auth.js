let isLoggedIn = localStorage.getItem('loggedIn') === 'true';
let loggedInUser = localStorage.getItem('username');

// Utility: Get all registered users
function getUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers')) || [];
}

// Utility: Save updated users list
function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Utility: Find user by username
function findUser(username) {
    const users = getUsers();
    return users.find(user => user.username === username);
}

// Password hashing using SHA-256 and base64
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    return hashBase64;
}

function openPopup() {
    document.getElementById('popup').classList.remove('hidden');
    showLoginForm();
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert("Please complete all fields.");
        return;
    }

    if (/\d/.test(username)) {
        alert("Identity format error: Names cannot contain numbers.");
        return;
    }

    const user = findUser(username);
    if (!user) {
        alert("Invalid credentials...");
        return;
    }

    const hashedInput = await hashPassword(password);
    if (hashedInput === user.password) {
        isLoggedIn = true;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', user.username);
        alert(`Welcome back, ${user.username}!`);
        closePopup();
        updateLoginButton();

        characters[0].name = user.username;
        showCharacter(0);
    } else {
        alert("Invalid credentials...");
    }
}

function logout() {
    const username = localStorage.getItem('username');
    if (username) {
        localStorage.removeItem(`collectedWords_${username}`);
    }

    localStorage.removeItem('unlockedGallery');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    isLoggedIn = false;
    loggedInUser = null;

    window.dispatchEvent(new CustomEvent('user-logged-out'));
    alert("Logging out. May your cognition remain stable.");
    updateLoginButton();

    setTimeout(() => location.reload(), 100);
}

function updateLoginButton() {
    const btn = document.querySelector('.login-button, .logout-button');
    if (!btn) return;

    if (isLoggedIn) {
        btn.classList.remove('login-button');
        btn.classList.add('logout-button');
        btn.onclick = logout;
    } else {
        btn.classList.remove('logout-button');
        btn.classList.add('login-button');
        btn.onclick = openPopup;
    }
}

async function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const age = parseInt(document.getElementById('register-age').value, 10);

    if (!username || !password || isNaN(age)) {
        alert("Fill in every field. We are... waiting. Thank you.");
        return;
    }

    if (/\d/.test(username)) {
        alert("Identity format error: Names cannot contain numbers.");
        return;
    }

    if (age < 16) {
        alert("Forgive my sudden presence, but you must be at least 16 years old to continue the expedition.");
        return;
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        alert("This identity already exists. Try a different name.");
        return;
    }

    const hashedPassword = await hashPassword(password);
    users.push({ username, password: hashedPassword, age });
    saveUsers(users);

    alert("Identity Registered. Proceed to log in.");
    showLoginForm();
}

function startStory() {
    if (!isLoggedIn) {
        alert('Who are you? State your identity.');
        openPopup();
        return;
    }

    const user = findUser(loggedInUser);
    if (user && user.age < 16) {
        alert('Forgive my sudden presence, but you must be at least 16 years old to continue the expedition.');
        return;
    }

    window.location.href = 'intro.html';
}

// Show/hide password toggles
function togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    if (input && toggle) {
        toggle.addEventListener('change', () => {
            input.type = toggle.checked ? 'text' : 'password';
        });
    }
}

function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggleElement.textContent = isPassword ? 'Conceal' : 'Reveal';
}

window.addEventListener('DOMContentLoaded', () => {
    updateLoginButton();
    togglePasswordVisibility('login-password', 'show-login-password');
    togglePasswordVisibility('register-password', 'show-register-password');

    document.querySelectorAll('.toggle-password').forEach(span => {
        span.style.userSelect = 'none';
        span.style.cursor = 'pointer';
    });
});

async function forgotPassword() {
    const username = prompt("Enter your registered username:");
    if (!username) return;

    const user = findUser(username.trim());
    if (!user) {
        alert("No such user exists.");
        return;
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`Your OTP is: ${otp}`);

    const userOtp = prompt("Enter the OTP sent to you:");
    if (userOtp !== otp) {
        alert("Incorrect OTP. Access denied.");
        return;
    }

    const newPassword = prompt("Enter your new password:");
    if (!newPassword || newPassword.trim().length === 0) {
        alert("Password cannot be empty.");
        return;
    }

    const confirmPassword = prompt("Confirm your new password:");
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const hashedPassword = await hashPassword(newPassword.trim());
    console.log("New hashed password:", hashedPassword); // Debug only

    user.password = hashedPassword;
    const users = getUsers().map(u => u.username === user.username ? user : u);
    saveUsers(users);

    alert("Password successfully updated. Please log in with your new credentials.");
}
