window.addEventListener('DOMContentLoaded', () => {  
    const toggle = document.querySelector('#theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggle.checked = true;
    }
    toggle.addEventListener('change', () => {
    if (toggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme','dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme','light');
    }
    });

    const texts = {
    el: {
        home: "Αρχική",
        reports: "Αναφορές",
        contact: "Επικοινωνία",
        signin: "Είσοδος/Εγγραφή",
        signout: "Έξοδος",
        signout_message: "Αποσύνδεση;",
        signout_confirm: "Ναι",
        signout_cancel: "Όχι",
        police: {
        title: "Αστυνομία",
        text: [
            `<strong>Ιστοσελίδα:</strong> <a href="https://www.astynomia.gr/" target="_blank">https://www.astynomia.gr/</a>`,
            `<strong>Α' Αστυνομικό Τμήμα</strong> - Τηλέφωνο: <a a href="tel:+302614409750">261 440 9750</a>, Διεύθυνση: Πανεπιστημίου 138, Ανθούπολη, 264 43 Πάτρα Αχαΐας`,
            `<strong>Β' Αστυνομικό Τμήμα</strong> - Τηλέφωνο: <a a href="tel:+302610695282">261 069 5282</a>, Διεύθυνση: Ερμού 95, 26110 Πάτρα Αχαΐας`,
            `<strong>Γ' Αστυνομικό Τμήμα</strong> - Τηλέφωνο: <a a href="tel:+302610344850">261 034 4850</a>, Διεύθυνση: Φιλίππου και Ολυμπιάδος &amp Νικοπόλεως, 26332 Πάτρα Αχαΐας`,
            `<strong>Τμήμα Τροχαίας</strong> - Τηλέφωνο: <a a href="tel:+302614409770">261 440 9770</a>, Διεύθυνση: Πανεπιστημίου 138, Ανθούπολη, 264 43 Πάτρα Αχαΐας`
        ]
        },
        fire: {
        title: "Πυροσβεστική",
        text: [
            `<strong>Ιστοσελίδα:</strong> <a href="https://www.fireservice.gr/el" target="_blank">https://www.fireservice.gr/el</a>`,
            `<strong>Α' Πυροσβετικός Σταθμός</strong> - Τηλέφωνο: <a a href="tel:+302610333211">261 033 3211</a>, Διεύθυνση: Ναυαρίνου 120, Χαλκώματα, 262 22 Πάτρα Αχαΐας`,
            `<strong>Β' Πυροσβετικός Σταθμός</strong> - Τηλέφωνο: <a a href="tel:+302610340506">261 034 0506</a>, Διεύθυνση: Κτίριο Λιμένα Πατρών ΠΑΤΡΑ 26110, Μαρούδα, Πάτρα Αχαΐας`,
            `<strong>Διοίκηση Πυροσβεστικών Υπηρεσιών</strong> - Τηλέφωνο: <a a href="tel:+302610434664">261 043 4664</a>, Διεύθυνση: Ν.Ε.Ο Πατρών - Αθηνών 147 ΠΑΤΡΑ 26110, Μαρούδα, Πάτρα Αχαΐας`
        ]
            
        },
        deyap: {
        title: "ΔΕΥΑΠ",
        text: [
            `<strong>Ιστοσελίδα:</strong> <a href="https://deyaponline.gr/" target="_blank">https://deyaponline.gr/</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Τηλέφωνο: <a a href="tel:+302610366100">2610 366 100</a>, Διεύθυνση: Γλαύκου 93, 263 32 Πάτρα Αχαΐας`
        ]
        },
        deh: {
        title: "ΔΕΗ",
        text: [
            `<strong>Ιστοσελίδα:</strong> <a href="https://www.dei.gr/el/" target="_blank">https://www.dei.gr/el/</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Τηλέφωνο: <a a href="tel:+302610642763">261 064 2763</a>, Διεύθυνση: Εγλυκάδα, 263 35 Πάτρα Αχαΐας`
        ]
        },
        dhmos: {
        title: "Δήμος Πατρέων",
        text: [
            `<strong>Ιστοσελίδα:</strong> <a href="https://e-patras.gr/el" target="_blank">https://e-patras.gr/el</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Τηλέφωνο: <a a href="tel:+302613610200">261 361 0200</a>, Διεύθυνση: Μαιζώνος 108, 26221 Πάτρα Αχαΐας`
        ]
        }
    },
    en: {
        home: "Home",
        reports: "Reports",
        contact: "Contact",
        signin: "Sign In / Register",
        signout: "Logout",
        signout_message: "Logout?",
        signout_confirm: "Yes",
        signout_cancel: "No",
        police: {
        title: "Police Dept.",
        text: [
            `<strong>Website:</strong> <a href="https://www.astynomia.gr/" target="_blank">https://www.astynomia.gr/</a>`,
            `<strong>1st Precinct</strong> - Tel: <a a href="tel:+302614409750">261 440 9750</a>, Address: Πανεπιστημίου 138, Ανθούπολη, 264 43 Πάτρα Αχαΐας`,
            `<strong>2nd Precinct</strong> - Tel: <a a href="tel:+302610695282">261 069 5282</a>, Address: Ερμού 95, 26110 Πάτρα Αχαΐας`,
            `<strong>3rd Precinct</strong> - Tel: <a a href="tel:+302610344850">261 034 4850</a>, Address: Φιλίππου και Ολυμπιάδος &amp Νικοπόλεως, 26332 Πάτρα Αχαΐας`,
            `<strong>Τμήμα Τροχαίας</strong> - Tel: <a a href="tel:+302614409770">261 440 9770</a>, Address: Πανεπιστημίου 138, Ανθούπολη, 264 43 Πάτρα Αχαΐας`
        ]
        },
        fire: {
        title: "Fire Dept.",
        text: [
            `<strong>Website:</strong> <a href="https://www.fireservice.gr/el" target="_blank">https://www.fireservice.gr/el</a>`,
            `<strong>1st Fire Station</strong> - Tel: <a a href="tel:+302610333211">261 033 3211</a>, Address: Ναυαρίνου 120, Χαλκώματα, 262 22 Πάτρα Αχαΐας`,
            `<strong>2nd Fire Station</strong> - Tel: <a a href="tel:+302610340506">261 034 0506</a>, Address: Κτίριο Λιμένα Πατρών ΠΑΤΡΑ 26110, Μαρούδα, Πάτρα Αχαΐας`,
            `<strong>Διοίκηση Πυροσβεστικών Υπηρεσιών</strong> - Tel: <a a href="tel:+302610434664">261 043 4664</a>, Address: Ν.Ε.Ο Πατρών - Αθηνών 147 ΠΑΤΡΑ 26110, Μαρούδα, Πάτρα Αχαΐας`
        ]
            
        },
        deyap: {
        title: "Water Authority",
        text: [
            `<strong>Website:</strong> <a href="https://deyaponline.gr/" target="_blank">https://deyaponline.gr/</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Tel: <a a href="tel:+302610366100">2610 366 100</a>, Address: Γλαύκου 93, 263 32 Πάτρα Αχαΐας`
        ]
        },
        deh: {
        title: "Electricity Authority",
        text: [
            `<strong>Website:</strong> <a href="https://www.dei.gr/el/" target="_blank">https://www.dei.gr/el/</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Tel: <a a href="tel:+302610642763">261 064 2763</a>, Address: Εγλυκάδα, 263 35 Πάτρα Αχαΐας`
        ]
        },
        dhmos: {
        title: "Municipality of Patras",
        text: [
            `<strong>Website:</strong> <a href="https://e-patras.gr/el" target="_blank">https://e-patras.gr/el</a>`,
            `<strong>Υπηρεσία Πατρών</strong> - Tel: <a a href="tel:+302613610200">261 361 0200</a>, Address: Μαιζώνος 108, 26221 Πάτρα Αχαΐας`
        ]
        }
    }
    };
    
    const savedLang = localStorage.getItem('lang') || 'el';
    document.querySelectorAll('.lang-flag').forEach(flag => {
    flag.addEventListener('click', () => {
        const lang = flag.dataset.lang;
        const t = texts[lang];
        document.querySelector('.header_opt:nth-child(1)').textContent = t.home;
        document.querySelector('.header_opt:nth-child(2)').textContent = t.reports;
        document.querySelector('.header_opt:nth-child(3)').textContent = t.contact;

        // if user is logged in
        const signout_btn = document.querySelector('.sign-out-btn');
        if (signout_btn) {
        signout_btn.textContent = t.signout;
        document.querySelector('#Signout-msg').textContent = t.signout_message;
        document.querySelector('#Confirm-signout-btn').textContent = t.signout_confirm;
        document.querySelector('#Cancel-signout-btn').textContent = t.signout_cancel;
        }
        // if user is not logged in
        else {
        document.querySelector('.sign-in-btn').textContent = t.signin;
        }

        [
        {id: 'police', data: t.police},
        {id: 'fire-dept', data: t.fire},
        {id: 'deyap', data: t.deyap},
        {id: 'deh', data: t.deh},
        {id: 'dhmos', data: t.dhmos},
        ].forEach(section => {
        const container = document.querySelector(`#${section.id}`);
        container.querySelector('h1').textContent = section.data.title;
        const ps = container.querySelectorAll('p');
        ps.forEach((p, idx) => {
            p.innerHTML = section.data.text[idx] || '';
        });
        })

        document.documentElement.lang = lang;
        // toggle flag visibility
        if (lang === 'en') {
        document.querySelector('#gr').style.display  = 'block';
        document.querySelector('#eng').style.display = 'none';
        } else {
        document.querySelector('#gr').style.display  = 'none';
        document.querySelector('#eng').style.display = 'block';
        }

        localStorage.setItem('lang', lang);
    });
    });
    
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
    if (startFlag) startFlag.click();
});