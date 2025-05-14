let selectedCoords = null;
let marker;

let address = new Array(4);

// Create the map
const map = L.map('map', { attributionControl: false }).setView([38.2466, 21.7346], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// "Επιλέξτε στον χάρτη" button click — fade out wizard & show "Use Location"
document.querySelector(".choose-loc-btn").addEventListener("click", () => {
    const wizard = document.querySelector(".wizard");
    wizard.classList.toggle("fade-out");
    document.getElementById("use-location-btn").style.display = "block";
    document.querySelector('#map').style['pointer-events'] = "auto";

    setTimeout(() => {
        wizard.style.display = "none";
    }, 500);
});

// Map click — store coordinates and place marker
map.on('click', function (e) {
    selectedCoords = e.latlng;

    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
});

// Reverse geocoding using Nominatim
async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CityDamageApp/1.0 (info@example.com)' // be polite
            }
        });

        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        return data.address;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return null;
    }
}

// "Χρήση Τοποθεσίας" button — fade in wizard and auto-fill form
document.getElementById("use-location-btn").addEventListener("click", async () => {
    document.querySelector('#map').style['pointer-events'] = "none";
    const wizard = document.querySelector(".wizard");
    wizard.style.display = "block";

    // Slight delay so fade-in works
    setTimeout(() => {
        wizard.classList.toggle("fade-out");
    }, 10);

    // Hide the button again
    document.getElementById("use-location-btn").style.display = "none";

    // Fill form with address
    if (selectedCoords) {
        const address = await reverseGeocode(selectedCoords.lat, selectedCoords.lng);
        if (address) {
            document.getElementById("street").value = address.road || '';
            document.getElementById("street-number").value = address.house_number || '';
            document.getElementById("postal-code").value = address.postcode || '';
        } else {
            alert("Δεν ήταν δυνατός ο εντοπισμός διεύθυνσης.");
        }
    }
});

document.querySelector(".current-loc-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            map.setView([lat, lon], 13);
            if (marker) {
                marker.setLatLng([lat, lon]).bindPopup("Είσαι εδώ").openPopup();
            } else {
                marker = L.marker([lat, lon]).addTo(map).bindPopup("Είσαι εδώ").openPopup();
            }
            selectedCoords = { lat: lat, lgn: lon }
            // Fill form with address
            if (selectedCoords) {
                console.log('Current location found, reverse geocoding...');
                // reverseGeocode(selectedCoords.lat, selectedCoords.lng).then(address => {
                //     if (address) {
                //         document.getElementById("street").value = address.road || '';
                //         document.getElementById("street-number").value = address.house_number || '';
                //         document.getElementById("postal-code").value = address.postcode || '';
                //     } else {
                //         alert("Δεν ήταν δυνατός ο εντοπισμός διεύθυνσης.");
                //     }
                // }).catch(error => {
                //     alert("Δεν ήταν δυνατός ο εντοπισμός διεύθυνσης.");
                //     console.error("Reverse geocoding failed:", error);
                // });
                const address = await reverseGeocode(selectedCoords.lat, selectedCoords.lgn);
                if (address) {
                    document.getElementById("street").value = address.road || '';
                    document.getElementById("street-number").value = address.house_number || '';
                    document.getElementById("postal-code").value = address.postcode || '';
                } else {
                    alert("Δεν ήταν δυνατός ο εντοπισμός διεύθυνσης.")
                }
            }
        },
        error => {
            alert("Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }

    )
});

document.querySelector('.next-btn').addEventListener('click', () => {
    const form = document.querySelector('#wizard-step-1 form');

    if (!form.checkValidity()) {
        form.reportValidity(); // this shows native browser errors + red borders
        return;
    }
    let streetName = document.querySelector('#street').value;
    let streetNumber = document.querySelector('#street-number').value;
    let postalCode = document.querySelector('#postal-code').value;
    let area = document.querySelector('#area');
    let areaName = area.options[area.selectedIndex].text;

    address[0] = streetName;
    address[1] = streetNumber;
    address[2] = postalCode;
    address[3] = areaName;

    console.log(address);

    document.querySelector('#wizard-step-1').style.display = "none";
    document.querySelector('#wizard-step-2').style.display = "block";

});

document.querySelector('#previous-btn-w2').addEventListener('click', () => {
    document.querySelector('#wizard-step-1').style.display = "block";
    document.querySelector('#wizard-step-2').style.display = "none";
})

document.querySelector('#next-btn-w2').addEventListener('click', () => {
    const form = document.querySelector('#wizard-step-1 form');

    if (!form.checkValidity()) {
        form.reportValidity(); // this shows native browser errors + red borders
        return;
    }
    document.querySelector('#wizard-step-2').style.display = "none";
    document.querySelector('#wizard-step-3').style.display = "block";
});

document.querySelector('#previous-btn-w3').addEventListener('click', () => {
    document.querySelector('#wizard-step-2').style.display = "block";
    document.querySelector('#wizard-step-3').style.display = "none";
});
const el = document.documentElement;
const texts = {
    el: {
        home: "Αρχική",
        reports: "Πρόσφατες Αναφορές",
        contact: "Επικοινωνία",
        signin: "Είσοδος/Εγγραφή",
        signout: "Έξοδος",
        h2: "Δήλωση Βλάβης",
        street: "Οδός",
        street_number: "Αριθμός",
        postal_code: "Τ.Κ.",
        area: "Περιοχή",
        current_loc_btn: "Τρέχουσα Τοποθεσία",
        choose_loc_btn: "Επιλέξτε στον χάρτη",
        use_loc_btn: "Χρήση Τοποθεσίας",
        next_btn: "Επόμενο",

        step2_h2: "Πληροφορίες Δήλωσης",
        step2_type: "Τύπος Βλάβης",
        damage_options: [
            "Χαλασμένος σωλήνας νερού",
            "Διαρροές αερίου",
            "Χαλασμένα φανάρια",
            "Εκτεθειμένα καλώδια ή ηλεκτρολογικοί κίνδυνοι",
            "Λακκούβες",
            "Πεσμένα δέντρα ή κλαδιά",
            "Σπασμένα πεζοδρόμια",
            "Κατεστραμμένα παγκάκια",
            "Παράνομη απόρριψη απορριμμάτων",
            "Ανοιχτά ή χωρίς κάλυμμα φρεάτια",
            "Σπασμένες παιδικές χαρές",
            "Χαλασμένος δημοτικός φωτισμός",
            "Κατεστραμμένες στάσεις λεωφορείων",
            "Ρωγμές σε τοίχους δημόσιων κτιρίων",
            "Άλλο"
        ],
        step2_type_label: "Επιλέξτε τύπο βλάβης",
        step2_comments: "Σχόλια",
        step2_comments_label: "Αναφέρετε σχόλια σχετικά με την βλάβη",
        step2_images: "Φωτογραφία (προαιρετική)",
        step2_previous_btn: "Προηγούμενο",
        step2_next_btn: "Επόμενο",

        step3_h2: "Πληροφορίες Επικοινωνίας",
        step3_firstname: "Όνομα",
        step3_lastname: "Επώνυμο",
        step3_phone: "Κινητό",
        step3_previous_btn: "Προηγούμενο",
        step3_report: "Δήλωση"

    },
    en: {
        home: "Home",
        reports: "Recent Reports",
        contact: "Contact",
        signin: "Sign In/Sign Up",
        signout: "Sign Out",
        h2: "Report Damage",
        street: "Street",
        street_number: "Street Number",
        postal_code: "Postal Code",
        area: "Area",
        current_loc_btn: "Current Location",
        choose_loc_btn: "Choose on Map",
        use_loc_btn: "Use Location",
        next_btn: "Next",

        step2_h2: "Report Information",
        step2_type: "Damage Type",
        damage_options: [
            "Broken water pipe",
            "Gas leaks",
            "Broken traffic lights",
            "Exposed wires or electrical hazards",
            "Potholes",
            "Fallen trees or branches",
            "Broken sidewalks",
            "Damaged benches",
            "Illegal dumping of garbage",
            "Open or uncovered manholes",
            "Broken playground equipment",
            "Broken municipal lighting",
            "Damaged bus stops",
            "Cracks in public building walls",
            "Other"
        ],
        step2_type_label: "Select damage type",
        step2_comments: "Comments",
        step2_comments_label: "Please provide comments about the damage",
        step2_images: "Image (optional)",
        step2_previous_btn: "Previous",
        step2_next_btn: "Next",

        step3_h2: "Contact Information",
        step3_firstname: "Name",
        step3_lastname: "Last Name",
        step3_phone: "Mobile",
        step3_previous_btn: "Previous",
        step3_report: "Report"
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
        try{
          document.querySelector(".sign-in-btn").textContent = t.signin;
        } catch (error) {
          document.querySelector(".sign-out-btn").textContent = t.signout;
        };
        document.querySelector(".wizard-container h2").textContent = t.h2;
        document.querySelector("#street-label").textContent = t.street;
        document.querySelector("#street-number-label").textContent = t.street_number;
        document.querySelector("#postal-code-label").textContent = t.postal_code;
        document.querySelector("#area-label").textContent = t.area;
        document.querySelector(".current-loc-btn").textContent = t.current_loc_btn;
        document.querySelector(".choose-loc-btn").textContent = t.choose_loc_btn;
        document.querySelector("#use-location-btn").textContent = t.use_loc_btn;
        document.querySelector(".next-btn").textContent = t.next_btn;

        document.querySelector("#wizard-step-2 h2").textContent = t.step2_h2;
        document.querySelector("#wizard-step-2 #damage-type-label").textContent = t.step2_type;
        const damageSelect = document.querySelector("#damage");
        const options = damageSelect.querySelectorAll("option:not([disabled])");

        options.forEach((opt, index) => {
            opt.textContent = t.damage_options[index];
        });
        document.querySelector('#damage option[disabled][selected]').textContent = t.step2_type_label;
        document.querySelector("#wizard-step-2 #comments-label").textContent = t.step2_comments;
        document.querySelector("#wizard-step-2 #comments").placeholder = t.step2_comments_label;
        document.querySelector("#wizard-step-2 #image-label").textContent = t.step2_images;
        document.querySelector("#previous-btn-w2").textContent = t.step2_previous_btn;
        document.querySelector("#next-btn-w2").textContent = t.step2_next_btn;

        document.querySelector("#wizard-step-3 h2").textContent = t.step3_h2;
        document.querySelector("#wizard-step-3 #first-name-label").textContent = t.step3_firstname;
        document.querySelector("#wizard-step-3 #last-name-label").textContent = t.step3_lastname;
        document.querySelector("#wizard-step-3 #mobile-label").textContent = t.step3_phone;
        document.querySelector("#previous-btn-w3").textContent = t.step3_previous_btn;
        document.querySelector("#report-btn-w3").textContent = t.step3_report;

        el.lang = lang;
        // document.querySelector("#")
        if (el.lang === "en") {
            document.querySelector("#gr").style.display = "block";
            document.querySelector("#eng").style.display = "none";
        } else {
            document.querySelector("#gr").style.display = "none";
            document.querySelector("#eng").style.display = "block";
        }

        localStorage.setItem('lang', lang);
    });
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
     if (startFlag) startFlag.click();
});