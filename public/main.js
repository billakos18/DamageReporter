window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
        window.location.reload();
        }
    });

// ---------- Logout popup functions ----------
let currentPopup = null;

function toggleLogoutPopup(event) {
    event.stopPropagation(); // Prevent this click from bubbling to document

    const popup = event.currentTarget.nextElementSibling;

    // If this popup is already open, toggle it
    if (popup.style.display === "block") {
    popup.style.display = "none";
    currentPopup = null;
    } else {
    // Close any other open popup
    if (currentPopup) {
        currentPopup.style.display = "none";
    }

    popup.style.display = "block";
    currentPopup = popup;
    }
}

function hideLogoutPopup() {
    if (currentPopup) {
    currentPopup.style.display = "none";
    currentPopup = null;
    }
}

function submitLogout() {
    document.getElementById("logoutForm").submit();
}

// Close popup if clicking anywhere else
document.addEventListener("click", function(event) {
    if (currentPopup && !currentPopup.contains(event.target)) {
    hideLogoutPopup();
    }
});
// ----------- End of logout popup functions ----------

// ---------- Settings pop functions ----------
function toggleSettingsPopup() {
    const modal = document.getElementById("settingsOverlay");
    modal.style.display = "flex";
    populateSettingsForm(); // Populate the form with user data
    console.log(user);
}

function closeSettingsModal() {
    document.getElementById("settingsOverlay").style.display = "none";
    document.getElementById("errorLabel").style.display = "none"; // Hide error label
    document.getElementById("settingsForm").reset(); // Reset the form
}

//  Close modal when clicking outside
window.addEventListener("mousedown", function (event) {
    const modal = document.getElementById("settingsOverlay");
    if (event.target === modal) {
    closeSettingsModal();
    }
});

// Populate settings form with user data
function populateSettingsForm() {
    if (!window.user) return;

    document.getElementById('firstName').value = window.user.user_first_name || "";
    document.getElementById('lastName').value = window.user.user_last_name || "";
    document.getElementById('email').value = window.user.user_email || "";
    document.getElementById('phone').value = window.user.user_phone || "";
}

    // ----------- End of settings popup functions ----------

// To check if the phone number is alreaedy registered
// Its commented out 

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
    window.location.reload();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#settingsForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.querySelector('#password').value;
        const rePassword = document.querySelector('#confirmPassword').value;
        const errorLabel = document.querySelector('#errorLabel');

        console.log(password, rePassword);

        if (password !== rePassword) {
            
            errorLabel.textContent = 'Οι κωδικοί δεν ταιριάζουν.';
            errorLabel.style.display = 'block';
            return;
        }

        const data = {
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            email: document.querySelector('#email').value,
            phone: document.querySelector('#phone').value,
            password: password, // Only send if not empty
        };
        console.log(data);
        try {
            // Try to edit user info and get response
            const response = await fetch('/user_main/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // If json respone then error, if html response then success
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                // Json respone handling
                const result = await response.json();
                errorLabel.textContent = result.error || 'Σφάλμα στην υποβολή.';
                errorLabel.style.display = 'block';
            } else { 
                // HTML response handling
                const result = await response.text();
                console.log(result);
                if (response.url.includes('/login')) {
                    alert('Έληξε η συνεδρία σας. Παρακαλώ συνδεθείτε ξανά.');
                    window.location.href = response.url;
                    return
                }
                errorLabel.style.display = 'none';
                closeSettingsModal();
                alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!');
                window.location.reload();
            }   
        } catch (err) {
        errorLabel.textContent = 'Σφάλμα δικτύου.';
        errorLabel.style.display = 'block';
        }
    });
    });