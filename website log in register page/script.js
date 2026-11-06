
function togglePassword(id, button) {
    let password = document.getElementById(id);

    if (password.type === "password") {
        password.type = "text";
        button.textContent = "Hide";
    } else {
        password.type = "password";
        button.textContent = "Show";
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "message " + type;
}

let registerPassword = document.getElementById("registerPassword");

if (registerPassword) {

    registerPassword.addEventListener("input", function() {

        let password = registerPassword.value;
        let strengthFill = document.getElementById("strengthFill");
        let strengthText = document.getElementById("strengthText");

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (password.length === 0) {
            strengthFill.style.width = "0";
            strengthFill.style.background = "";
            strengthText.textContent = "Password strength";
        } else if (score <= 1) {
            strengthFill.style.width = "25%";
            strengthFill.style.background = "#B34C4C";
            strengthText.textContent = "Weak password";
        } else if (score <= 2) {
            strengthFill.style.width = "50%";
            strengthFill.style.background = "#C5A46D";
            strengthText.textContent = "Medium password";
        } else if (score === 3) {
            strengthFill.style.width = "75%";
            strengthFill.style.background = "#A9A16D";
            strengthText.textContent = "Good password";
        } else {
            strengthFill.style.width = "100%";
            strengthFill.style.background = "#587B5B";
            strengthText.textContent = "Strong password";
        }

    });
}

let registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("fullName").value.trim();
        let email = document.getElementById("registerEmail").value.trim();
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("registerPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        let terms = document.getElementById("terms").checked;
        let message = document.getElementById("registerMessage");

        message.className = "message";

        if (!name || !email || !username || !password || !confirmPassword) {
            showMessage(message, "Please complete all fields.", "error");
            return;
        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage(message, "Please enter a valid email address.", "error");
            return;
        }

        if (password.length < 8) {
            showMessage(message, "Password must contain at least 8 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.", "error");
            return;
        }

        if (!terms) {
            showMessage(message, "Please agree to the Terms and Conditions.", "error");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem("beautyAccounts")) || [];

        let existingAccount = accounts.find(function(account) {
            return account.email.toLowerCase() === email.toLowerCase() ||
                   account.username.toLowerCase() === username.toLowerCase();
        });

        if (existingAccount) {
            showMessage(message, "Email or username is already registered.", "error");
            return;
        }

        let newAccount = {
            name: name,
            email: email,
            username: username,
            password: password
        };

        accounts.push(newAccount);

        localStorage.setItem("beautyAccounts", JSON.stringify(accounts));

        showMessage(message, "Your account has been created successfully! Redirecting to sign in...", "success");

        registerForm.reset();

        document.getElementById("strengthFill").style.width = "0";
        document.getElementById("strengthText").textContent = "Password strength";

        setTimeout(function() {
            window.location.href = "login.html";
        }, 2000);

    });
}

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value;
        let rememberMe = document.getElementById("rememberMe").checked;
        let message = document.getElementById("loginMessage");

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            showMessage(message, "Please enter your email and password.", "error");
            return;
        }

        if (!emailPattern.test(email)) {
            showMessage(message, "Please enter a valid email address.", "error");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem("beautyAccounts")) || [];

        let account = accounts.find(function(user) {
            return user.email.toLowerCase() === email.toLowerCase() &&
                   user.password === password;
        });

        if (account) {

            showMessage(message, "Login successful! Welcome to Maison Belle.", "success");

            document.getElementById("welcomeName").textContent = "Welcome, " + account.name + "!";
            document.getElementById("welcomeBox").style.display = "block";

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

        } else {
            showMessage(message, "Incorrect email or password. Please try again.", "error");
            document.getElementById("welcomeBox").style.display = "none";
        }

    });

    let savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
        document.getElementById("loginEmail").value = savedEmail;
        document.getElementById("rememberMe").checked = true;
    }
}

let forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function(event) {
        event.preventDefault();

        alert("Please contact Maison Belle support for password assistance.");
    });

}

let termsLink = document.getElementById("termsLink");
let termsModal = document.getElementById("termsModal");
let closeModal = document.getElementById("closeModal");
let acceptModal = document.getElementById("acceptModal");

if (termsLink) {

    termsLink.addEventListener("click", function(event) {
        event.preventDefault();
        termsModal.style.display = "flex";
    });

    closeModal.addEventListener("click", function() {
        termsModal.style.display = "none";
    });

    acceptModal.addEventListener("click", function() {
        termsModal.style.display = "none";
        document.getElementById("terms").checked = true;
    });

    termsModal.addEventListener("click", function(event) {
        if (event.target === termsModal) {
            termsModal.style.display = "none";
        }
    });

}
