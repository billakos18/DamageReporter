import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });


const model = await import(`../model/damages_model.mjs`);

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

export async function addReport(req, res) {
    try {

        // console.log(req.file?.buffer);
        // type, description, street, number, area, pcode, latitude, longitude, userPhone, photo
        const {
            street,
            'street-number': streetNumber,
            'postal-code': postalCode,
            area,
            latitude,
            longitude, // this was misspelled as "longtitude"
            damage: type, // "damage" is the actual name in the form
            comments,
            mobile // "modile" is the field name in the form
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
            console.log("Failed to add report");
            res.status(500).send('Failed to add report');
        }
   
        // const userId = req.session.user.user_id;
        // const reportDate = new Date();
        // await model.addReport(report_type, report_latitude, report_longitude, report_status, userId, reportDate);
        // res.redirect('/recentReports');
    } catch (error) {
        console.error('Error adding report:', error);
        res.status(500).send('Internal Server Error');
    }
}

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

export async function editReportStatus(req, res) {
    const reportId = req.params.reportId;
    console.log("params:", req.params);
    console.log("body:", req.body);
    const newStatus = req.query.status;
    console.log(newStatus);
    
    try{
        await model.editStatus(reportId, newStatus);
        res.redirect('/user_main');
    } catch(err){
        console.log('Error updating status:', err);
        res.status(500).send('Internal Server Error');
    }
}

export async function editReportPhone(req, res) {
    const newPhone = req.body.phone;
    const oldPhone = req.customData.oldPhone; // old phone number stored in customData
    
    try {
        let result = await model.editReportPhone(oldPhone, newPhone);
        if (result){
            res.redirect('/user_main');
        }
        else {
            console.log("Failed to edit report phone");
            // res.status(500).send('Failed to edit report phone');
            res.json({ error: 'Failed to edit report phone', success: false });
        }
    }
    catch (error) {
        console.error('Error editing report phone:', error);
        res.status(500).send('Internal Server Error');
    }
}


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
            // res.status(400).send('Failed to update user information');
            res.json({ error: 'Failed to update user information', success: false });
        }
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Needs testing
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
                return res.json({ error: 'Το τηλέφωνο ανήκει σε άλλο χρήστη', success: false });
            }
            if (existingEmail && existingEmail.user_id !== req.session.user.user_id) {
                return res.json({ error: 'Το email ανήκει σε άλλο χρήστη', success: false });
            }
        }
        else{
            return res.json({ error: 'Παρακαλούμε επανασυνδεθείτε', success: false });
        }

        // Store the old phone number in customData for later use
        req.customData = { oldPhone: phone };
        next();
    } catch (error) {
        console.error('Error checking phone/email:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function checkAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } 
    else {
        res.redirect('/login');
    }
}