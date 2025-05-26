
// Main layout script

// Prevent the back button from navigating back
// Force page to reload, not fetch from cache
window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
        window.location.reload();
        }
    });

// ---------- Logout popup functions ----------
let currentPopup = null; // Variable to keep track of the currently open popup

// Function to toggle the logout popup, attached to the logout button
function toggleLogoutPopup(event) {
    event.stopPropagation(); // Prevent this click from bubbling to document

    const popup = event.currentTarget.nextElementSibling; // Get the next sibling element which is the popup

    // If this popup is already open, toggle it
    if (popup.style.display === "block") {
    popup.style.display = "none";
    currentPopup = null;
    } else { // If this popup is not open, show it

    // Close any other open popup
    if (currentPopup) {
        currentPopup.style.display = "none";
    }
    // Show the popup
    popup.style.display = "block";
    currentPopup = popup;
    }
}

// Function to hide the logout popup, called when clicking no on the popup
function hideLogoutPopup() {
    if (currentPopup) {
    currentPopup.style.display = "none";
    currentPopup = null;
    }
}

// Function to submit the logout form, called when clicking yes on the popup
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

// Function to toggle the settings popup, attached to the settings button
function toggleSettingsPopup() {
    const modal = document.getElementById("settingsOverlay");
    modal.style.display = "flex";
    populateSettingsForm(); // Populate the form with user data
}

// Function to close the settings modal, called when clicking the cancel button
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#settingsForm');

    // When form is submitted, validate passwords and send data
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.querySelector('#password').value;
        const rePassword = document.querySelector('#confirmPassword').value;
        const errorLabel = document.querySelector('#errorLabel');

        // Check if passwords match
        if (password !== rePassword) {
            
            errorLabel.textContent = 'Οι κωδικοί δεν ταιριάζουν.';
            errorLabel.style.display = 'block';
            return;
        }

        // Data object thats has user data and gets sent to the server
        const data = {
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            email: document.querySelector('#email').value,
            phone: document.querySelector('#phone').value,
            password: password, // Only send if not empty
        };

        // Send requst to server
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
                if (response.url.includes('/login')) {
                    alert('Έληξε η συνεδρία σας. Παρακαλώ συνδεθείτε ξανά.');
                    window.location.href = response.url; // Redirect to login page if session expired
                    return
                }

                // If success, hide error label and close modal
                errorLabel.style.display = 'none';
                closeSettingsModal();
                alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!'); // Show success message
                window.location.reload(); // Reload the page to reflect changes
            }   
        } catch (err) { // If there is a network error, show error message
        errorLabel.textContent = 'Σφάλμα δικτύου.';
        errorLabel.style.display = 'block';
        }
    });
});