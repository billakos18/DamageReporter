
// Main script for the start page
window.addEventListener("DOMContentLoaded", () => {

    // Theme toggle functionality
    const toggle = document.querySelector("#theme-toggle");
    const header = document.querySelector("header");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });

    // Language toggle functionality
    const el = document.documentElement;

    // Define the texts for each language
    const texts = {
      el: {
        home: "Αρχική",
        reports: "Αναφορές",
        contact: "Χρήσιμα",
        signin: "Είσοδος/Εγγραφή",
        signout: "Έξοδος",
        headline: "Είδες κάτι; Ανέφερε το.",
        subtitle: "Κάνε την πόλη σου πιο ασφαλή, με ένα κλικ!",
        report: "Αναφορά Προβλήματος",
        how: "Πώς Λειτουργεί;",
        step1: "📷 Εντόπισε το Πρόβλημα",
        step1desc: "Βγάλε μια φωτογραφία ή περιέγραψε το ζήτημα.",
        step2: "📝 Υποβολή Αναφοράς",
        step2desc: "Συμπλήρωσε τα στοιχεία και στείλε την αναφορά σου.",
        step3: "📍 Παρακολούθησε την Εξέλιξη",
        step3desc: "Λάβε ενημερώσεις για την πορεία της επίλυσης.",
      },
      en: {
        home: "Home",
        reports: "Reports",
        contact: "Contact",
        signin: "Sign In / Register",
        signout: "Sign Out",
        headline: "See something? Report it.",
        subtitle: "Make your city safer with just one click!",
        report: "Report an Issue",
        how: "How It Works",
        step1: "📷 Spot the Problem",
        step1desc: "Take a photo or describe the issue.",
        step2: "📝 Submit Report",
        step2desc: "Fill in the details and send your report.",
        step3: "📍 Track Progress",
        step3desc: "Get updates as it's being resolved.",
      },
    };

    // Set initial language based on localStorage or default to Greek
    const savedLang = localStorage.getItem("lang") || "el";

    // Modify text based on language
    document.querySelectorAll(".lang-flag").forEach((flag) => {
      flag.addEventListener("click", () => {
        const lang = flag.dataset.lang;
        const t = texts[lang];
        document.querySelector(".header_opt:nth-child(1)").textContent =
          t.home;
        document.querySelector(".header_opt:nth-child(2)").textContent =
          t.reports;
        document.querySelector(".header_opt:nth-child(3)").textContent =
          t.contact;
        try{
          document.querySelector(".sign-in-btn").textContent = t.signin;
        } catch (error) {
          document.querySelector(".sign-out-btn").textContent = t.signout;
        };
        document.querySelector(".hero h1").textContent = t.headline;
        document.querySelector(".hero p").textContent = t.subtitle;
        document.querySelector(".report-btn").textContent = t.report;
        document.querySelector(".how-it-works h2").textContent = t.how;
        const steps = document.querySelectorAll(".step");
        steps[0].querySelector("h3").textContent = t.step1;
        steps[0].querySelector("p").textContent = t.step1desc;
        steps[1].querySelector("h3").textContent = t.step2;
        steps[1].querySelector("p").textContent = t.step2desc;
        steps[2].querySelector("h3").textContent = t.step3;
        steps[2].querySelector("p").textContent = t.step3desc;
        el.lang = lang;
        // document.querySelector("#")
        if (el.lang === "en") {
          document.querySelector("#gr").style.display = "block";
          document.querySelector("#eng").style.display = "none";
        } else {
          document.querySelector("#gr").style.display = "none";
          document.querySelector("#eng").style.display = "block";
        }

        localStorage.setItem("lang", lang); // Save the selected language to localStorage
      });
    });

    // Trigger click on the saved language flag, match the system language
    const startFlag = document.querySelector(
      `.lang-flag[data-lang="${savedLang}"]`
    );
    if (startFlag) startFlag.click();
  });