CREATE TABLE IF NOT EXISTS User{
    user_id INT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(15) NOT NULL
}