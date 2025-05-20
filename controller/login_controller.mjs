import dotenv from 'dotenv';
dotenv.config();

const model = await import(`../model/damages_model.mjs`);

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

export async function loginUser(req, res) {
    const email = req.body['email-login'];
    const password = req.body['password-login'];
    try {
        const user = await model.findUserByUsernamePassword(email, password);

        if (user) {
            req.session.user = user;
            const reports = await model.getUserReports(user.user_phone);

            res.render('user_main', {reports: reports,
                title: "City Damage Reporter",
                user: user,
                css: "style_user_main.css",
                script: "user_main.js",
                hideAuthButton: false
            });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function signupUser(req, res) {
    const { email, mobile, password } = req.body;
    try {
        const user = await model.registerUser(email, mobile, password);
        if (user) {
            const reports = await model.getUserReports(user.user_phone);
            res.render('user_main', {reports: reports,
                title: "City Damage Reporter",
                user: user,
                css: "style_user_main.css",
                script: "user_main.js",
                hideAuthButton: false
            });
        } else {
            res.status(400).send('User already exists');
        }
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function logoutUser(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).send('Internal Server Error');
    }
}


