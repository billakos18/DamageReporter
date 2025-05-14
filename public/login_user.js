document.querySelector(".register-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".login-container").style.display = "none";
    document.querySelector(".signup-container").style.display = "block";

})

document.querySelector(".login-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".login-container").style.display = "block";
    document.querySelector(".signup-container").style.display = "none";

})

document.querySelector(".signup-btn").addEventListener("click", () => {

    if (document.querySelector('#password-signup').value !== document.querySelector('#password-signup-check').value) {
        console.log('no')
    }

})

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
            reports: "Πρόσφατες Αναφορές",
            contact: "Επικοινωνία",
            h2: "Είσοδος Χρήστη",
            password: "Κωδικός",
            login: "Είσοδος",
            register: "Δεν έχεις λογαριασμό;",
            signup_h2: "Στοιχεία Εγγραφής",
            signup_email: "Email ή Κινητό",
            signup_password: "Κωδικός",
            signup_repassword: "Επαλήθευση Κωδικού",
            signup_btn: "Εγγραφή",
            signup_register: "Έχεις ήδη λογαριασμό;"
        },
        en: {
            home: "Home",
            reports: "Recent Reports",
            contact: "Contact",
            h2: "User Login",
            password: "Password",
            login: "Login",
            register: "Don't have an account?",
            signup_h2: "Sign Up",
            signup_email: "Email or Mobile",
            signup_password: "Password",
            signup_repassword: "Re-enter Password",
            signup_btn: "Sign Up",
            signup_register: "Already have an account?",
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
            document.querySelector(".login-container h2").textContent = t.h2;
            document.querySelector("#password-login-label").textContent = t.password;
            document.querySelector(".login-btn").textContent = t.login;
            document.querySelector(".register-link").textContent = t.register;
            document.querySelector(".signup-container h2").textContent = t.signup_h2;
            document.querySelector("#email-signup-label").textContent = t.signup_email;
            document.querySelector("#password-signup-label").textContent = t.signup_password;
            document.querySelector("#reenter-password-singup-label").textContent = t.signup_repassword;
            document.querySelector(".signup-btn").textContent = t.signup_btn;
            document.querySelector(".login-link").textContent = t.signup_register;

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

document.querySelector(".register-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".login-container").style.display = "none";
    document.querySelector(".signup-container").style.display = "block";

})

document.querySelector(".login-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".login-container").style.display = "block";
    document.querySelector(".signup-container").style.display = "none";

})

document.querySelector(".signup-btn").addEventListener("click", () => {

    if (document.querySelector('#password-signup').value !== document.querySelector('#password-signup-check').value) {
        console.log('no')
    }

})

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
            reports: "Πρόσφατες Αναφορές",
            contact: "Επικοινωνία",
            h2: "Είσοδος Χρήστη",
            password: "Κωδικός",
            login: "Είσοδος",
            register: "Δεν έχεις λογαριασμό;",
            signup_h2: "Στοιχεία Εγγραφής",
            signup_email: "Email ή Κινητό",
            signup_password: "Κωδικός",
            signup_repassword: "Επαλήθευση Κωδικού",
            signup_btn: "Εγγραφή",
            signup_register: "Έχεις ήδη λογαριασμό;"
        },
        en: {
            home: "Home",
            reports: "Recent Reports",
            contact: "Contact",
            h2: "User Login",
            password: "Password",
            login: "Login",
            register: "Don't have an account?",
            signup_h2: "Sign Up",
            signup_email: "Email or Mobile",
            signup_password: "Password",
            signup_repassword: "Re-enter Password",
            signup_btn: "Sign Up",
            signup_register: "Already have an account?",
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
            document.querySelector(".login-container h2").textContent = t.h2;
            document.querySelector("#password-login-label").textContent = t.password;
            document.querySelector(".login-btn").textContent = t.login;
            document.querySelector(".register-link").textContent = t.register;
            document.querySelector(".signup-container h2").textContent = t.signup_h2;
            document.querySelector("#email-signup-label").textContent = t.signup_email;
            document.querySelector("#password-signup-label").textContent = t.signup_password;
            document.querySelector("#reenter-password-singup-label").textContent = t.signup_repassword;
            document.querySelector(".signup-btn").textContent = t.signup_btn;
            document.querySelector(".login-link").textContent = t.signup_register;

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

