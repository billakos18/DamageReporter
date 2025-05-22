import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import damagesRoutes from './routes/damages_routes.mjs';
import argon from 'argon2';

const app = express();
// const router = express.Router();

// Static files (style_index.css, images, scripts)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(session({
    // secret: argon.hash('a_really_big_secret_key_that_not_even_I_know_and_is_hard_to_guess'),
    secret: "b59b5c26b1587938d65cc8a8fa8ce01b",
    cookie: { maxAge: 1000 * 60 * 10 }, // 10 minutes  
    resave: false,
    saveUninitialized: false
}));

// Set up Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    helpers: { // Custom helpers
        json: (context) => {
             return JSON.stringify(context)
            },
        formatDate: (dateString, formatStr = 'PPpp') => {
            return format(new Date(dateString), formatStr);
            },
         eq: (a, b) => a == b,
         not: (a) => !a
    }
}));
app.set('view engine', 'hbs');
// app.use((req,res,next) => {
//     res.set('Cache-Control', 'no-store');
//     next();
// })
// Use routes
app.use('/', damagesRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));

// // Main route
// router.get("/", (req, res) => {
//     res.render("home", { 
//         title: "City Damage Reporter",
//         css: "style_index.css",
//         script: "index_script.js",
//         hideAuthButton: false,
//         user: req.session.user || null
//     })
// });

// app.use("/", router);

// // Login route
// router.get("/login", (req, res) => {
//     res.render("login", { 
//         title: "City Damage Reporter",
//         css: "style_login_user.css",
//         script: "login_user.js",
//         hideAuthButton: true
//     })
// });

// router.post("/login", (req, res) => {
//     const { 'email-login': username, 'password-login': password } = req.body;

//     if (username === "test@bil" && password === "bil") {
//         req.session.user = { username };
//         console.log(`User ${username} logged in`)
//         return res.redirect("/");
//     } else {
//         return res.redirect("/login?error=1")
//     }
// });

// app.use("/login", router);

// // Report route
// router.get("/report", (req, res) => {
//     res.render("report", { 
//         title: "Report Damage",
//         css: "style_report.css", 
//         script: "report.js",
//         hideAuthButton: false,
//         user: req.session.user || null,
//         map: true
//     });
// });
// app.use("/report", router);

// // Communication route
// router.get("/communication", (req, res) => {
//     res.render("communication", { 
//         title: "Communication",
//         css: "style_communication.css",
//         script: "communication.js",
//         user: req.session.user || null,
//         hideAuthButton: false
//     })
// });
// app.use("/communication", router);
// // 404 fallback
// app.use((req, res) => {
//     res.status(404).send("Page Not Found");
// });

// Import routes


