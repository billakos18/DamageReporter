import { Client } from 'pg'; // PostgreSQL client

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
        console.log('Data retrieved from PostgreSQL database:', res.rows);
        return res.rows;
    } catch (err) {
        console.error('Error retrieving data from PostgreSQL database:', err);
    }
}
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

// client.query('INSERT INTO \"Report\" (report_id, report_type, report_description, report_date, report_street, report_street_number, report_area, report_pcode, report_latitude, report_longitude, report_status, user_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [1, 'Flood', 'Heavy rain caused flooding in the area', '2023-10-01', 'Main St', '123', 'Downtown', 12345, 40.7128, -74.0060, 'in progress', '1234567890'])
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