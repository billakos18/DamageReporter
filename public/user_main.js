window.addEventListener('DOMContentLoaded', () => {

    // Theme toggle (dark/light mode)
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

    // Language toggle (greek/english)
    const el = document.documentElement;
    const texts = {
        el: {
            home: "Αρχική",
            reports: "Αναφορές",
            contact: "Χρήσιμα",
            logout: "Έξοδος",
            signout_message: "Αποσύνδεση;",
            signout_confirm: "Ναι",
            signout_cancel: "Όχι",
            left_panel_header: "Καλώς ήρθες " + user.user_first_name,
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
            signout_message: "Logout?",
            signout_confirm: "Yes",
            signout_cancel: "No",
            left_panel_header: "Welcome " + user.user_first_name,
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
            document.querySelector('#Signout-msg').textContent = t.signout_message;
            document.querySelector('#Confirm-signout-btn').textContent = t.signout_confirm;
            document.querySelector('#Cancel-signout-btn').textContent = t.signout_cancel;

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

    // Trigger click on the saved language flag, match the system language
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
    if (startFlag) startFlag.click();

    // Status dropdown menu for admin
    if(user.user_phone == "6900000000"){
        document.querySelectorAll('.menu-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
    
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
                const menu = toggle.nextElementSibling;
                if(menu&& menu.classList.contains('dropdown-menu')) {
                    menu.style.display = 'block';
                }
            });
        });
    
        window.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    } else{ // No status dropdown for regular user
        document.querySelectorAll(".menu-toggle").forEach(toggle => {
            toggle.style.display = 'none';
        })
    }
});


