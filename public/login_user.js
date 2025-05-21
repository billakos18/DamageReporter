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
            h2: "Είσοδος Χρήστη",
            username: "Email ή Κινητό",
            password: "Κωδικός",
            login: "Είσοδος",
            register: "Δεν έχεις λογαριασμό;",
        },
        en: {
            home: "Home",
            reports: "Reports",
            contact: "Contact",
            h2: "User Login",
            username: "Email or Phone Number",
            password: "Password",
            login: "Login",
            register: "Don't have an account?",

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
            document.querySelector("#username-label").textContent = t.username;
            document.querySelector("#password-login-label").textContent = t.password;
            document.querySelector(".login-btn").textContent = t.login;
            document.querySelector(".register-link").textContent = t.register;


            el.lang = lang;
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



