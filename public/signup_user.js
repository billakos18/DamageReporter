window.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('#theme-toggle');
    const header = document.querySelector('header');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
    const el = document.documentElement;
    const texts = {
        el: {
            home: "Αρχική",
            reports: "Αναφορές",
            contact: "Επικοινωνία",
            signup_h2: "Στοιχεία Εγγραφής",
            first_name: "Όνομα",
            last_name: "Επώνυμο",
            signup_email: "Email",
            signup_phone: "Κινητό Τηλέφωνο",
            signup_password: "Κωδικός",
            signup_repassword: "Επαλήθευση Κωδικού",
            signup_btn: "Εγγραφή",
            signup_register: "Έχεις ήδη λογαριασμό;",
            error: "Ο χρήστης υπάρχει ήδη"
        },
        en: {
            home: "Home",
            reports: "Reports",
            contact: "Contact",
            signup_h2: "Sign Up",
            first_name: "First Name",
            last_name: "Last Name",
            signup_email: "Email",
            signup_phone: "Phone Number",
            signup_password: "Password",
            signup_repassword: "Re-enter Password",
            signup_btn: "Sign Up",
            signup_register: "Already have an account?",
            error: "User already exists"
        }
    };

    const savedLang = localStorage.getItem('lang') || 'el';
    document.querySelectorAll(".lang-flag").forEach(flag => {
        flag.addEventListener("click", () => {
            const lang = flag.dataset.lang;
            const t = texts[lang];
            document.querySelector(".header_opt:nth-child(1)").textContent = t.home;
            document.querySelector(".header_opt:nth-child(2)").textContent = t.reports;
            document.querySelector(".header_opt:nth-child(3)").textContent = t.contact;
            document.querySelector(".signup-container h2").textContent = t.signup_h2;
            document.querySelector("#first-name-label").textContent = t.first_name;
            document.querySelector("#last-name-label").textContent = t.last_name;
            document.querySelector("#email-signup-label").textContent = t.signup_email;
            document.querySelector("#phone-signup-label").textContent = t.signup_phone;
            document.querySelector("#password-signup-label").textContent = t.signup_password;
            document.querySelector("#reenter-password-singup-label").textContent = t.signup_repassword;
            document.querySelector(".signup-btn").textContent = t.signup_btn;
            document.querySelector(".login-link").textContent = t.signup_register;

            const errLabel = document.querySelector(".error-message");
            if(errLabel) {
                errLabel.textContent = t.error;
            }

            el.lang = lang;
            // document.querySelector("#")
            if (el.lang === "en") {
                document.querySelector("#gr").style.display = "block";
                document.querySelector("#eng").style.display = "none";
            } else {
                document.querySelector("#gr").style.display = "none";
                document.querySelector("#eng").style.display = "block";
            }
            localStorage.setItem('lang', lang)
        });
    });
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
    if (startFlag) startFlag.click();
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    const password = document.querySelector('#password-signup').value;
    const rePassword = document.querySelector('#password-signup-check').value;

    if (password !== rePassword) {
        event.preventDefault();
        alert('Passwords do not match.');
    }
});