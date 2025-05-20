import { Client } from 'pg'; // PostgreSQL client
import { argon2d } from 'argon2';
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

export async function findUserByUsernamePassword(email, password){
    let query = "SELECT user_email, user_phone FROM \"User\" WHERE user_email = $1 AND user_password = $2 LIMIT 1";
    try{
        const res = await client.query(query, [email,password]);
        return res.rows[0];
    } catch(err){
        throw err;
    }
}

export async function registerUser(email, mobile, password, first_name, last_name) {
    const userId = getUser(email);
    if(userId!=undefined) {
        return {}
    } else {
        let query = "INSERT INTO \"User\" (user_id, user_first_name, user_last_name, user_email, user_password, user_phone) VALUES ($1, $2, $3, $4, $5, $6)";
        try {
            const hashedPass = await argon2d.hash(password, 10);
            const res = await client.query(query, [1, first_name, last_name, email, hashedPass, mobile]);
            return res.rows[0];
        } catch(err){
            throw err;
        }
    }
}

export async function getUser(email) {
    let query = "SELECT user_email FROM \"User\" WHERE user_email = $1";
    try{
        const res = await client.query(query, [email]);
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


// client.query('INSERT INTO \"User\" (user_id, user_first_name, user_last_name, user_email, user_password, user_phone) VALUES ($1, $2, $3, $4, $5, $6)', [1, 'John', 'Doe', 'example@mail.com', 'password123', '1234567890'])
//     .then(res => {
//         console.log('Data inserted into PostgreSQL database:', res);
//     })
//     .catch(err => {
//         console.error('Error inserting data into PostgreSQL database:', err);
//     });
// let data = client.query('SELECT * FROM \"User\" where user_id = $1', [1])
//     .then(res => {
//         console.log('Data retrieved from PostgreSQL database:', res.rows[0]);
//         return res.rows;
//     })
//     .catch(err => {
//         console.error('Error retrieving data from PostgreSQL database:', err);
//     });

// client.query('INSERT INTO \"Report\" (report_id, report_type, report_description, report_date, report_street, report_street_number, report_area, report_pcode, report_latitude, report_longitude, report_status, user_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [145, 'Flood', 'Heavy rain caused flooding in the area', '2023-10-01', 'Main St', '123', 'Downtown', 12345, 40.7128, -74.0060, 'done', '1234567890'])
//     .then(res => {
//         console.log('Data inserted into PostgreSQL database:', res);
//     })
//     .catch(err => {
//         console.error('Error inserting data into PostgreSQL database:', err);
//     });
// let data = client.query('SELECT * FROM \"Report\"')
//     .then(res => {
//         console.log('Data retrieved from PostgreSQL database:', res.rows[0]);
//         return res.rows;
//     })
//     .catch(err => {
//         console.error('Error retrieving data from PostgreSQL database:', err);
//     });