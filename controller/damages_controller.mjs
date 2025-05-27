import dotenv from 'dotenv';
dotenv.config();

const model = await import(`../model/damages_model.mjs`);

// Function to render the home page
export async function showHome(req, res) {
    try {
        if (req.session.user) {
            const reports = await model.getUserReports(req.session.user.user_phone);
            res.render('user_main', { 
                reports: reports,
                title: "City Damage Reporter",
                css: "style_user_main.css",
                script: "user_main.js",
                user: req.session.user,
                hideAuthButton: false
            });
            return;
        }
        res.render("home", { 
            title: "City Damage Reporter",
            css: "style_index.css",
            script: "index_script.js",
            user: req.session.user || null,
            hideAuthButton: false
        });
    } catch (error) {
        console.error('Error rendering home page:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the communications page
export async function showCommunications(req, res) {
    try {
        res.render("communication", { 
        title: "Communication",
        css: "style_communication.css",
        script: "communication.js",
        user: req.session.user || null,
        hideAuthButton: false
    });
    } catch (error) {
        console.error('Error fetching communications:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the report damage page
export async function reportDamage(req, res) {
    try {
        res.render("report", { 
            title: "Report Damage",
            css: "style_report.css", 
            script: "report.js",
            hideAuthButton: false,
            user: req.session.user || null,
            map: true
        });
    } catch (error) {
        console.error('Error rendering report page:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the recent reports page
export async function showRecentReports(req, res) {
    try {
        const recentReports = await model.getRecentReports();
        res.render("recent_reports", { 
            title: "Recent Reports",
            css: "style_recent_reports.css",
            script: "recent_reports.js",
            reports: JSON.stringify(recentReports),
            user: req.session.user || null,
            hideAuthButton: false,
            map: true
        });
    } catch (error) {
        console.error('Error fetching recent reports:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to handle adding a new report
export async function addReport(req, res) {
    try {
        const {
            street,
            'street-number': streetNumber,
            'postal-code': postalCode,
            area,
            latitude,
            longitude, 
            damage: type, 
            comments,
            mobile 
            } = req.body;

        const result = await model.addReport(
            type,
            comments,
            street,
            streetNumber,
            area,
            postalCode,
            latitude,
            longitude,
            mobile,
            req.file?.buffer
        );
        if (result) {
            res.redirect('/recentReports');
        } else {
            res.status(500).send('Failed to add report');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Function to delete a report
export async function deleteReport(req, res) {
    const reportId = req.params.reportId;
    try {
        await model.deleteReport(reportId);
        res.redirect('/user_main');
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to edit the status of a report
export async function editReportStatus(req, res) {
    const reportId = req.params.id;
    const newStatus = req.query.status;
    
    try{
        await model.editStatus(reportId, newStatus);
        res.redirect('/user_main');
    } catch(err){
        res.status(500).send('Internal Server Error');
    }
}

// Function to edit the phone number in a report
export async function editReportPhone(req, res) {
    const newPhone = req.body.phone;
    const oldPhone = req.customData.oldPhone; // old phone number stored in customData
    
    try {
        let result = await model.editReportPhone(oldPhone, newPhone);
        if (result){
            res.redirect('/user_main');
        }
        else {
            res.json({ error: 'Failed to edit report phone', success: false });
        }
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Function to edit user information
export async function editUserInfo(req, res, next) {
    try {
        const user = req.session.user;
        const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

        // Update user information in the database
        const updatedUserConfirm = await model.updateUserInfo(user.user_id, firstName, lastName, email, phone, password);
        
        if (updatedUserConfirm) {
            let updatedUser = {
                user_id: user.user_id,
                user_email: email,
                user_phone: phone,
                user_first_name: firstName,
                user_last_name: lastName
            };
            req.customData = {oldPhone: user.user_phone}; // Store old phone for further use
            req.session.user = updatedUser; // Update session with new user info
            next(); // Proceed to the next middleware or route handler
        } else {
            res.json({ error: 'Failed to update user information', success: false });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Function to check if the phone number or email is already used
export async function checkUsedPhone_Email(req, res, next) {
    const phone = req.body.phone;
    const email = req.body.email;

    try {
        // Check if the phone number or email is already used
        const existingPhone = await model.getUserByPhone(phone);
        const existingEmail = await model.getUserByEmail(email);

        // If either phone or email already exists, return an error
        if (req.session?.user) {
            if (existingPhone && existingPhone.user_id !== req.session.user.user_id) {
                return res.json({ error: 'Phone number belongs to another user', success: false });
            }
            if (existingEmail && existingEmail.user_id !== req.session.user.user_id) {
                return res.json({ error: 'Email belongs to another user', success: false });
            }
        }
        else{
            return res.json({ error: 'Session expired. Please reconnect.', success: false });
        }

        // Store the old phone number in customData for later use
        req.customData = { oldPhone: phone };
        next();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Check if the user is authenticated (session exists)
export async function checkAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } 
    else {
        res.redirect('/login');
    }
}

export async function checkAdmin(req, res, next) {
    if (req.session.user.user_email === 'admin@admin.com'){
        next();
    } else {
        res.status(200);
    }
}