let selectedCoords = null;
let marker;

// Create the map
const map = L.map('map', { attributionControl: false }).setView([38.2466, 21.7346], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

window.addEventListener('DOMContentLoaded', () => {

    // Toggle theme (dark/light mode)
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

    // Toggle language (greek/english)
    const el = document.documentElement;
    const texts = {
        el: {
            home: "Αρχική",
            reports: "Αναφορές",
            contact: "Χρήσιμα",
            signin: "Είσοδος/Εγγραφή",
            signout: "Έξοδος",
            signout_message: "Αποσύνδεση;",
            signout_confirm: "Ναι",
            signout_cancel: "Όχι"
        },
        en: {
            home: "Home",
            reports: "Reports",
            contact: "Contact",
            signin: "Sign In / Register",
            signout: "Logout",
            signout_message: "Logout?",
            signout_confirm: "Yes",
            signout_cancel: "No"
        }
    }

    // Set initial language based on localStorage or default to Greek
    const savedLang = localStorage.getItem('lang') || 'el';

    // Modify text based on language
    document.querySelectorAll(".lang-flag").forEach(flag => {
        flag.addEventListener("click", () => {
            const lang = flag.dataset.lang;
            const t = texts[lang];
            document.querySelector(".header_opt:nth-child(1)").textContent = t.home;
            document.querySelector(".header_opt:nth-child(2)").textContent = t.reports;
            document.querySelector(".header_opt:nth-child(3)").textContent = t.contact;
            // if user is logged in
            const signout_btn = document.querySelector(".sign-out-btn");
            if (signout_btn) {
                signout_btn.textContent = t.signout;
                document.querySelector('#Signout-msg').textContent = t.signout_message;
                document.querySelector('#Confirm-signout-btn').textContent = t.signout_confirm;
                document.querySelector('#Cancel-signout-btn').textContent = t.signout_cancel;
            }
            // if user is not logged in
            else{
                document.querySelector(".sign-in-btn").textContent = t.signin;
            }

            // Toggle flag visibility
            el.lang = lang;
            if (el.lang === "en") {
                document.querySelector("#gr").style.display = "block";
                document.querySelector("#eng").style.display = "none";
            } else {
                document.querySelector("#gr").style.display = "none";
                document.querySelector("#eng").style.display = "block";
            }

            // Save language in local storage
            localStorage.setItem('lang', lang)
        });
    });
        
    // Trigger click on the saved language flag, match the system language
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
    if (startFlag) startFlag.click();
});


// Show recent reports on the map as markers
if (window.reports) {
    window.reports.forEach(report => {
        const marker = L.marker([report.report_latitude, report.report_longitude]).addTo(map);
        marker.bindPopup(`
            <strong>${report.report_type}</strong><br>
            ${report.report_date}<br>
            status: ${report.report_status}<br>
        `);
    });

}