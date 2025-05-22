import { Client } from 'pg'; // PostgreSQL client
import argon2 from 'argon2';
const client = new Client({
  host: 'localhost',
  port: 5432,                // default Postgres port
  user: 'postgres',          // your DB user
  password: 'nikolas2003', // your DB password
  database: 'damage_report_database', // your database name
});

try{
    await client.connect();
    console.log('Connected to PostgreSQL database');
}
catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
}

export async function getRecentReports(){
    try {
        const res = await client.query('SELECT report_type, to_char(report_date, \'YYYY-MM-DD HH24:MI:SS\') as report_date, report_latitude, report_longitude, report_status FROM "Report"');
        return res.rows;
    } catch (err) {
        console.error('Error retrieving data from PostgreSQL database:', err);
    }
}

export async function findUserByUsernamePassword(username, password){
    let query_email = "SELECT user_first_name, user_last_name, user_email, user_phone, user_password FROM \"User\" WHERE user_email = $1 LIMIT 1";
    let query_phone = "SELECT user_first_name, user_last_name, user_email, user_phone, user_password FROM \"User\" WHERE user_phone = $1 LIMIT 1";
    try{
        let res = await client.query(query_email, [username]);
        if(res.rows.length === 0){
            res = await client.query(query_phone, [username]);
        }
        if(res.rows.length === 0){
            console.log("User not found");  
            return 
        }
        const hashedPass = res.rows[0].user_password;
        const isValid = await argon2.verify(hashedPass, password);
        if(!isValid){
            console.log("Invalid password");
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

export async function registerUser(email, mobile, password, firstName, lastName) {
    // const userId = getUser(mobile, email);
    // console.log("Ti ston peonta:", userId);
    // if(!userId) {
    //     console.log("User already exists:", userId);
    //     return {}
    // } else {
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
            alert("Internal database error")
            return {}
        }
    } catch(err){
        throw err;
    }
    
}

export async function getUser(phone, email) {
    let query_phone = "SELECT user_id FROM \"User\" WHERE user_phone = $1";
    let query_email = "SELECT user_id FROM \"User\" WHERE user_email = $1";
    try{
        let res = await client.query(query_phone, [phone]);
        if(res.rows.length === 0){
            res = await client.query(query_email, [email]);
        }
        return res.rows[0];
    } catch(err){
        throw err;
    }
    
}

export async function addReport(type, description, street, number, area, pcode, userPhone) {
    let query = "INSERT INTO \"Report\" (report_id, report_type, report_description, report_date, report_street, report_street_number, report_area, report_pcode, report_latitude, report_longitude, report_status, user_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    try {
        const date = new Date();
        const res = await client.query(query, [1, type, description, date, street, number, area, pcode, "testlat", "testlon", "received", userPhone]);
        return res.rows[0];
    } catch(err) {
        throw err;
    }
}

export async function getUserReports(userPhone) {
    let query = "SELECT report_type, to_char(report_date, 'YYYY-MM-DD HH24:MI:SS') as report_date, report_latitude, report_longitude, report_status, report_street, report_street_number, report_area FROM \"Report\" WHERE user_phone = $1";
    try {
        const res = await client.query(query, [userPhone]);
        return res.rows;
    } catch(err) {
        throw err;
    }
}
// export async function addReport(wiz1, lat, long, type, description){
//     try{
//         const res = await client.query(`INSERT INTO \"Report\" (report_id, report_type, report_description, report_date, report_street, report_street_number, report_area, report_pcode, report_latitude, report_longitude, report_status, user_phone)
//             VALUES ($1, $2, $3, $4, $5, $6)`,
//             [1, 'Flood', 'Heavy rain caused flooding in the area', '2023-10-01', wiz1[0], wiz1[1], wiz1[3], wiz1[2], 40.7128, -74.0060, 'in progress', '1234567890'])
        
//     }
//     catch (err) {
//         console.error('Error inserting data into PostgreSQL database:', err);
//     }
// }