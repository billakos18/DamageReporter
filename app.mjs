import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';

const app = express();
const router = express.Router();

// Static files (style_index.css, images, scripts)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false
}));

// Set up Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts'
}));
app.set('view engine', 'hbs');

// Main route
router.get("/", (req, res) => {
    res.render("home", { 
        title: "City Damage Reporter",
        css: "style_index.css",
        script: "index_script.js",
        hideAuthButton: false,
        user: req.session.user || null
    })
});

app.use("/", router);

// Login route
router.get("/login", (req, res) => {
    res.render("login", { 
        title: "City Damage Reporter",
        css: "style_login_user.css",
        script: "login_user.js",
        hideAuthButton: true
    })
});

router.post("/login", (req, res) => {
    const { 'email-login': username, 'password-login': password } = req.body;

    if (username === "test@bil" && password === "bil") {
        req.session.user = { username };
        console.log(`User ${username} logged in`)
        return res.redirect("/");
    } else {
        return res.redirect("/login?error=1")
    }
});

app.use("/login", router);

// Report route
router.get("/report", (req, res) => {
    res.render("report", { 
        title: "Report Damage",
        css: "style_report.css", 
        script: "report.js",
        hideAuthButton: false,
        user: req.session.user || null,
        map: true
    });
});
app.use("/report", router);

// Communication route
router.get("/communication", (req, res) => {
    res.render("communication", { 
        title: "Communication",
        css: "style_communication.css",
        script: "communication.js",
        user: req.session.user || null,
        hideAuthButton: false
    })
});
app.use("/communication", router);
// 404 fallback
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));
