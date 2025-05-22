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

        console.log(req.body);
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
            console.log("Report added successfully:", result);
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