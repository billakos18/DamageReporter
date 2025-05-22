let selectedCoords = null;
let marker;

const map = L.map('map', { attributionControl: false }).setView([38.2466, 21.7346], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

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
            signin: "Είσοδος/Εγγραφή",
            signout: "Έξοδος",
        },
        en: {
            home: "Home",
            reports: "Reports",
            contact: "Contact",
            signin: "Sign In/Sign Up",
            signout: "Sign Out",
        }
    }

    const savedLang = localStorage.getItem('lang') || 'el';
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
            }
            // if user is not logged in
            else{
                document.querySelector(".sign-in-btn").textContent = t.signin;
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


// Show recent reports on the map as markers
if (window.reports) {
    window.reports.forEach(report => {
        const marker = L.marker([report.report_latitude, report.report_longitude]).addTo(map);
        marker.bindPopup(`
            <strong>${report.report_type}</strong><br>
            ${report.report_date}<br>
            ${report.report_status}<br>
        `);
    });

}