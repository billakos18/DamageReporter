let selectedCoords = null;
let marker;
let lastReverseGeocodedAddress = null;


let address = new Array(4);

// Create the map
const map = L.map('map', { attributionControl: false }).setView([38.2466, 21.7346], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Choose on map button click — fade out wizard & show "Use Location"
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

    // Fetch address from Nominatim
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CityDamageApp/1.0 (info@example.com)'
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

// Find coordinates from address using Nominatim
async function forwardGeocode(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    // Fetch coordinates from Nominatim
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CityDamageApp/1.0 (info@example.com)'
            }
        });

        // Check if the response is ok
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();

        // If no results found, return null
        if (data.length === 0) return null;

        // Returns latitude and longitude
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error("Forward geocoding failed:", error);
        return null;
    }
}


// Use location button — fade in wizard and auto-fill form
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

            lastReverseGeocodedAddress = {
                road: address.road || '',
                house_number: address.house_number || '',
                postcode: address.postcode || '',
                area: "Patras"
            };
            document.getElementById("street").value = address.road || '';
            document.getElementById("street-number").value = address.house_number || '';
            document.getElementById("postal-code").value = address.postcode || '';
            document.getElementById("longitude").value = selectedCoords.lng;
            document.getElementById("latitude").value = selectedCoords.lat;
        } else {
            alert("Δεν ήταν δυνατός ο εντοπισμός διεύθυνσης.");
        }
    }
});
// Get current location of user
document.querySelector(".current-loc-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Move map to current location
            map.setView([lat, lon], 13);
            if (marker) {
                marker.setLatLng([lat, lon]).bindPopup("Είσαι εδώ").openPopup();
            } else {
                marker = L.marker([lat, lon]).addTo(map).bindPopup("Είσαι εδώ").openPopup();
            }
            selectedCoords = { lat: lat, lng: lon }
            // Fill form with address
            if (selectedCoords) {
                const address = await reverseGeocode(selectedCoords.lat, selectedCoords.lng);
                if (address) {
                    document.getElementById("street").value = address.road || '';
                    document.getElementById("street-number").value = address.house_number || '';
                    document.getElementById("postal-code").value = address.postcode || '';
                    document.getElementById("longitude").value = selectedCoords.lng;
                    document.getElementById("latitude").value = selectedCoords.lat;
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

document.querySelector('.next-btn').addEventListener('click', async () => {
    const street_Name = document.querySelector('#street');
    const street_Number = document.querySelector('#street-number');
    const postal_Code = document.querySelector('#postal-code');
    const area_ = document.querySelector('#area');

    // Check form validity
    if (!street_Name.checkValidity() || !street_Number.checkValidity() || !postal_Code.checkValidity() || !area_.checkValidity()) {
        street_Name.reportValidity();
        street_Number.reportValidity();
        postal_Code.reportValidity();
        area_.reportValidity();
        return;
    }

    let streetName = document.querySelector('#street').value;
    let streetNumber = document.querySelector('#street-number').value;
    let postalCode = document.querySelector('#postal-code').value;

    // Check if address has changed from last geocoding. If changed, reverse geocode it
    let needsGeocoding = false;

    // Check if lastReverseGeocodedAddress is null or if the address has changed
    if (!lastReverseGeocodedAddress) {
        needsGeocoding = true;
    } else {
        if (
            streetName !== lastReverseGeocodedAddress.road ||postalCode !== lastReverseGeocodedAddress.postcode) {
            needsGeocoding = true;
        }
    }

    // If address needs geocoding, use forward geocode to get coordinates
    if (needsGeocoding) {
        const fullAddress = `${streetName} ${streetNumber}, ${postalCode}, Patras, Greece`;
        const coords = await forwardGeocode(fullAddress);

        if (coords) {
            selectedCoords = { lat: coords.lat, lng: coords.lon };
            document.getElementById("latitude").value = coords.lat;
            document.getElementById("longitude").value = coords.lon;
        } else {
            alert("Η διεύθυνση δεν εντοπίστηκε. Ελέγξτε τα πεδία.");
        }
    }

    // Go to next step
    document.querySelector('#wizard-step-1').style.display = "none";
    document.querySelector('#wizard-step-2').style.display = "block";

});

// Go to previous step
document.querySelector('#previous-btn-w2').addEventListener('click', () => {
    document.querySelector('#wizard-step-1').style.display = "block";
    document.querySelector('#wizard-step-2').style.display = "none";
})

// Toggle theme (dark/light mode)
const toggle = document.querySelector('#theme-toggle');
const header = document.querySelector('header');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggle.checked = true;
}

toggle.addEventListener('change', () => {
    if(toggle.checked){
        body.classList.add('dark-mode');
        localStorage.setItem('theme','dark');
    } else{
        body.classList.remove('dark-mode');
        localStorage.setItem('theme','light');
    }
});

// Toggle language (greek/english)
const el = document.documentElement;
const texts = {
    el: {
        home: "Αρχική",
        reports: "Αναφορές",
        contact: "Επικοινωνία",
        signin: "Είσοδος/Εγγραφή",
        signout: "Έξοδος",
        h2: "Δήλωση Βλάβης",
        street: "Οδός",
        street_number: "Αριθμός",
        postal_code: "Τ.Κ.",
        area: "Περιοχή",
        area_placeholder: "Επιλέξτε περιοχή...",
        area_options: [
            "Αγία Σοφία",
            "Αγυιά",
            "Άγιος Ανδρέας",
            "Αμπελόκηποι",
            "Ανθούπολη",
            "Δασύλλιο",
            "Ζαρουχλέικα",
            "Ζαβλάνι",
            "Προσφυγικά",
            "Σκαγιοπούλειο",
            "Τερψιθέα",
            "Ψηλά Αλώνια",
            "Άλλο"
        ],
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
        step2_phone: "Κινητό",
        step2_previous_btn: "Προηγούμενο",
        step2_report: "Δήλωση"

    },
    en: {
        home: "Home",
        reports: "Reports",
        contact: "Contact",
        signin: "Sign In/Sign Up",
        signout: "Sign Out",
        h2: "Report Damage",
        street: "Street",
        street_number: "Street Number",
        postal_code: "Postal Code",
        area: "Area",
        area_placeholder: "Choose area...",
        area_options: [
            "Agia Sofia",
            "Agia",
            "Agios Andreas",
            "Ampelokipi",
            "Anthoupoli",
            "Dasillio",
            "Zarouchleika",
            "Zavlani",
            "Prosfigika",
            "Skagiopoulio",
            "Terpsithea",
            "Other"
        ],
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
        step2_phone: "Mobile",
        step2_previous_btn: "Previous",
        step2_report: "Report"
    }
};    

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

        // Modify area options
        const areaSelect = document.querySelector("#area");
        const areas = areaSelect.querySelectorAll("option:not([disabled])");

        areas.forEach((area, index) => {
            area.textContent = t.area_options[index];
        });
        for (let i = 0; i < areas.length; i++) {
            areas[i].value = t.area_options[i];
        }
        document.querySelector("#area option[disabled][selected]").textContent = t.area_placeholder;
        document.querySelector(".current-loc-btn").textContent = t.current_loc_btn;
        document.querySelector(".choose-loc-btn").textContent = t.choose_loc_btn;
        document.querySelector("#use-location-btn").textContent = t.use_loc_btn;
        document.querySelector(".next-btn").textContent = t.next_btn;

        document.querySelector("#wizard-step-2 h2").textContent = t.step2_h2;
        document.querySelector("#wizard-step-2 #damage-type-label").textContent = t.step2_type;

        // Modify damage options
        const damageSelect = document.querySelector("#damage");
        const options = damageSelect.querySelectorAll("option:not([disabled])");

        options.forEach((opt, index) => {
            opt.textContent = t.damage_options[index];
        });
        for (let i = 0; i < options.length; i++) {
            options[i].value = t.damage_options[i];
        }

        document.querySelector('#damage option[disabled][selected]').textContent = t.step2_type_label;
        document.querySelector("#wizard-step-2 #comments-label").textContent = t.step2_comments;
        document.querySelector("#wizard-step-2 #comments").placeholder = t.step2_comments_label;
        document.querySelector("#wizard-step-2 #image-label").textContent = t.step2_images;
        document.querySelector("#wizard-step-2 #mobile-label").textContent = t.step2_phone;
        document.querySelector("#previous-btn-w2").textContent = t.step2_previous_btn;
        document.querySelector("#report-btn-w2").textContent = t.step2_report;
    
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
        localStorage.setItem('lang', lang);
    });

    // Trigger click on the saved language flag, match the system language
    const startFlag = document.querySelector(`.lang-flag[data-lang="${savedLang}"]`);
    if (startFlag) startFlag.click();
});