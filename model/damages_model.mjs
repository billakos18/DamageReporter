import { Client } from 'pg'; // PostgreSQL client
import argon2 from 'argon2';

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: 'postgresql://damage_reporter_database_user:6hEVXqguu9vCkGto8PVahfxTlb0VOux6@dpg-d0q9tmjipnbc73e6dl10-a.frankfurt-postgres.render.com/damage_reporter_database',
  ssl: {
    rejectUnauthorized: false
  }
});


// Connect to the PostgreSQL database
try{
    await client.connect();
    console.log('Connected to PostgreSQL database');
}
catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
}

// Function to retrieve recent reports from the database
export async function getRecentReports(){
    try {
        const res = await client.query('SELECT report_type, to_char(report_date, \'YYYY-MM-DD\') as report_date, report_latitude, report_longitude, report_status FROM "Report"');
        return res.rows;
    } catch (err) {
        console.error('Error retrieving data from PostgreSQL database:', err);
    }
}

// Function to find a user by username and password
export async function findUserByUsernamePassword(username, password){
    let query_email = "SELECT user_id, user_first_name, user_last_name, user_email, user_phone, user_password FROM \"User\" WHERE user_email = $1 LIMIT 1";
    let query_phone = "SELECT user_id, user_first_name, user_last_name, user_email, user_phone, user_password FROM \"User\" WHERE user_phone = $1 LIMIT 1";
    try{
        let res = await client.query(query_email, [username]);
        if(res.rows.length === 0){
            res = await client.query(query_phone, [username]);
        }
        if(res.rows.length === 0){
            return 
        }
        const hashedPass = res.rows[0].user_password;
        const isValid = await argon2.verify(hashedPass, password);
        if(!isValid){
            return 
        }
        return {
            user_id: res.rows[0].user_id,
            user_first_name: res.rows[0].user_first_name,
            user_last_name: res.rows[0].user_last_name,
            user_email: res.rows[0].user_email,
            user_phone: res.rows[0].user_phone
        }
    } catch(err){
        throw err;
    }
}

// Function to register a new user in the database
export async function registerUser(email, mobile, password, firstName, lastName) {
    let idQuery = "SELECT count(user_id) FROM \"User\""
    let query = "INSERT INTO \"User\" (user_id, user_email, user_password, user_phone, user_first_name, user_last_name) VALUES ($1, $2, $3, $4, $5, $6)";
    try {
        const hashedPass = await argon2.hash(password, 10);
        const resCount = await client.query(idQuery);
        const newId = parseInt(resCount.rows[0].count) + 1;
        const res = await client.query(query, [newId, email, hashedPass, mobile, firstName, lastName]);
        if (res){
            const user = {
                user_id: newId,
                user_email: email,
                user_phone: mobile,
                user_first_name: firstName,
                user_last_name: lastName
            }
            return user;
        } else{
            return {}
        }
    } catch(err){
        throw err;
    }
    
}
// Function to check if a phone number or email already exists in the database
export async function getUser(phone, email) {

    let query = "SELECT user_id FROM \"User\" WHERE user_phone = $1 OR user_email = $2";
    try{

        let res = await client.query(query, [phone, email]);
        return res.rows[0];
    } catch(err){
        throw err;
    }
    
}

// Function to get user by phone number
export async function getUserByPhone(phone) {
    let query = "SELECT user_id FROM \"User\" WHERE user_phone = $1";
    try{
        let res = await client.query(query, [phone]);
        return res.rows[0];
    } catch(err){
        throw err;
    }
    
}

// Function to get user by email
export async function getUserByEmail(email) {

    let query = "SELECT user_id FROM \"User\" WHERE user_email = $1";
    try{
        let res = await client.query(query, [email]);
        return res.rows[0];
    } catch(err){
        throw err;
    }
    
}

// Function to add a new report to the database
export async function addReport(type, description, street, number, area, pcode, latitude, longitude, userPhone, photo) {
    let idQuery = "SELECT count(report_id) FROM \"Report\""
    let query = "INSERT INTO \"Report\" (report_type, report_description, report_date, report_street, report_street_number, report_area, report_pcode, report_latitude, report_longitude, report_status, user_phone, report_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    try {
        const resCount = await client.query(idQuery);
        const newId = parseInt(resCount.rows[0].count) + 1;
        const date = new Date();
        const res = await client.query(query, [type, description, date, street, number, area, pcode, parseFloat(latitude), parseFloat(longitude), "received", userPhone, photo]);
        return res;
    } catch(err) {
        throw err;
    }
}

// Function to get all reports submitted by a specific user
export async function getUserReports(userPhone) {
    if (userPhone === "6900000000"){
        // If the user is an admin, return all reports
        let query = "SELECT report_id, report_type, to_char(report_date, 'YYYY-MM-DD') as report_date, report_latitude, report_longitude, report_status, report_street, report_street_number, report_area FROM \"Report\"";
        try {
            const res = await client.query(query);
            return res.rows;
        } catch(err) {
            throw err;
    ``  }
    } else{
        let query = "SELECT report_id, report_type, to_char(report_date, 'YYYY-MM-DD') as report_date, report_latitude, report_longitude, report_status, report_street, report_street_number, report_area FROM \"Report\" WHERE user_phone = $1";
        try {
            const res = await client.query(query, [userPhone]);
            return res.rows;
        } catch(err) {
            throw err;
    ``  }
    }
    
}

// Function to delete a report by its ID
export async function deleteReport(reportId) {
    let query = "DELETE FROM \"Report\" WHERE report_id = $1";
    try {
        const res = await client.query(query, [reportId]);
        return res;
    } catch(err) {
        throw err;
    }
}

// Function to edit the status of a report by its ID
export async function editStatus(reportId, status) {
    let query = "UPDATE \"Report\" SET report_status = $1 WHERE report_id = $2";
    try{
        const res = await client.query(query, [status, reportId]);
        return res;
    } catch(err){
        throw err;
    }
}

// Function to update user information
export async function updateUserInfo(userId, firstName, lastName, email, phone, password) {
    if (password === "" || password == null) {
        // If password is not provided, update only the other fields
        let query = "UPDATE \"User\" SET user_first_name = $1, user_last_name = $2, user_email = $3, user_phone = $4 WHERE user_id = $5";
        try {
            const res = await client.query(query, [firstName, lastName, email, phone, userId]);
            return res;
        } catch(err) {
            throw err;
    }
    }
    else{
        // If password is provided, hash it and update all fields
        let hashedPass = await argon2.hash(password, 10);
        let query = "UPDATE \"User\" SET user_first_name = $1, user_last_name = $2, user_email = $3, user_phone = $4, user_password = $5 WHERE user_id = $6";
        try {
            const res = await client.query(query, [firstName, lastName, email, phone, hashedPass, userId]);
            return res;
        } catch(err) {
            throw err;
        }
    }
    
}

// Function to edit the phone number in reports
export async function editReportPhone(oldPhone, newPhone) {
    let query = "UPDATE \"Report\" SET user_phone = $1 WHERE user_phone = $2";
    try {
        const res = await client.query(query, [newPhone, oldPhone]);
        return res;
    }
    catch(err) {
        throw err;
    }
}
