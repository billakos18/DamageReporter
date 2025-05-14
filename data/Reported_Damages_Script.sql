CREATE TABLE IF NOT EXISTS User(
    user_id INT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    user_first_name VARCHAR(100) NOT NULL,
    user_last_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Report(
    report_id INT PRIMARY KEY,
    report_type VARCHAR(255) NOT NULL,
    report_description TEXT NOT NULL,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    report_street VARCHAR(255) NOT NULL,
    report_street_number VARCHAR(10) NOT NULL,
    report_area VARCHAR(100) NOT NULL,
    report_pcode VARCHAR(10) NOT NULL,
    report_latitude DECIMAL(9, 6) NOT NULL,
    report_longitude DECIMAL(9, 6) NOT NULL,
    report_status TEXT NOT NULL CHECK (report_status IN ('approved', 'rejected', 'in progress')),
    user_phone VARCHAR(15) NOT NULL
);

