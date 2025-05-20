import dotenv from 'dotenv';
dotenv.config();

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

