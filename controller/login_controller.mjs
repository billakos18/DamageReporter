import dotenv from 'dotenv';
dotenv.config();

const model = await import(`../model/damages_model.mjs`);

// Function to render the login page
export async function showLogin(req, res) {
    try {
        res.render("login", { 
            title: "City Damage Reporter",
            css: "style_login_user.css",
            script: "login_user.js",
            hideAuthButton: true
        });
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the signup page
export async function showSignup(req, res) {
    try {
        res.render("signup", { 
            title: "City Damage Reporter",
            css: "style_login_user.css",
            script: "signup_user.js",
            hideAuthButton: true
        });
    } catch (error) {
        console.error('Error rendering signup page:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to handle user login
export async function loginUser(req, res) {
    const username = req.body['email-login'];
    const password = req.body['password-login'];
    try {
        const user = await model.findUserByUsernamePassword(username, password);

        if (user) {
            req.session.user = user;
            res.redirect('/user_main');
        } else {
            res.render('login', {
                title: "City Damage Reporter",
                css: "style_login_user.css",
                script: "login_user.js",
                hideAuthButton: true,
                error: true
            });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to handle user signup
export async function signupUser(req, res) {
    const firstname = req.body['first-name'];
    const lastname = req.body['last-name'];
    const email = req.body['email-signup'];
    const mobile = req.body['phone-signup'];
    const password = req.body['password-signup'];
    try {
        // Check if the user already exists
        const existingEmail = await model.getUserByEmail(email);
        const existingMobile = await model.getUserByPhone(mobile);

        if (existingEmail) {
            return res.render('signup', {
                title: "City Damage Reporter",
                css: "style_login_user.css",
                script: "signup_user.js",
                hideAuthButton: true,
                error: "Email already in use"
            });
        }

        if (existingMobile) {
            return res.render('signup', {
                title: "City Damage Reporter",
                css: "style_login_user.css",
                script: "signup_user.js",
                hideAuthButton: true,
                error: "Phone number already in use"
            });
        }

        // Check if the user was registered successfully
        const user = await model.registerUser(email, mobile, password, firstname, lastname);
        if (user) {
            req.session.user = user;
            res.redirect('/user_main');
        } else {
            res.render('signup', {
                title: "City Damage Reporter",
                css: "style_login_user.css",
                script: "signup_user.js",
                hideAuthButton: true,
                error: "Failed to register user. Please try again."
            });
        }
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to handle user logout
export async function logoutUser(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the user main page with their reports
export async function showUserMain(req, res) {
    try {
        const user = req.session.user;
        const reports = await model.getUserReports(user.user_phone);
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        res.render('user_main', {
            reports: reports,
            title: "City Damage Reporter",
            user: req.session.user,
            css: "style_user_main.css",
            script: "user_main.js",
            hideAuthButton: false
        });
    } catch (error) {
        console.error('Error rendering user main page:', error);
        res.status(500).send('Internal Server Error');
    }
}
