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
            logout: "Έξοδος",
            left_panel_header: "Καλώς ήρθες",
            left_panel_par: "Είσαι έτοιμος να καταγράψεις ένα νέο πρόβλημα;",
            report_btn: "Αναφορά Προβλήματος",
            right_panel_header: "Οι Αναφορές Μου",
            right_panel_par: "Δεν έχετε υποβάλει αναφορές ακόμα."
            
        },
        en: {
            home: "Home",
            reports: "Reports",
            contact: "Contact",
            logout: "Logout",
            left_panel_header: "Welcome",
            left_panel_par: "Are you ready to report a new issue for your city?",
            report_btn: "Report an Issue",
            right_panel_header: "My Reports",
            right_panel_par: "You have not submitted any reports yet.",
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
            document.querySelector(".sign-out-btn").textContent = t.logout;
            document.querySelector(".left-panel h2").textContent = t.left_panel_header;
            document.querySelector(".left-panel p").textContent = t.left_panel_par;
            document.querySelector(".left-panel .report-btn").textContent = t.report_btn;
            document.querySelector(".right-panel h2").textContent = t.right_panel_header;
            const msgEl = document.querySelector("#no-reports-msg");
            if (msgEl) msgEl.textContent = t.right_panel_par;
            

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

document.querySelector(".signup-btn").addEventListener("click", () => {

    if (document.querySelector('#password-signup').value !== document.querySelector('#password-signup-check').value) {
        console.log('no')
    }

})
