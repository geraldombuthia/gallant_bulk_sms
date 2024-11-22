CREATE IF NOT EXIST DATABASE gallantbulksms;

--@block
SELECT * FROM device_access

--@block
CREATE TABLE device_access (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    access_level INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--@block
SELECT * FROM device_access

--@block
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    password VARCHAR(128) NOT NULL,    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--@block
SELECT * FROM users

--@BLOCK
DROP TABLE IF EXISTS users;

--@BLOCK
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    amount INT NOT NULL,
    transaction_code VARCHAR(50),
    payment_method ENUM('mpesa', 'airtelmoney', 'paypal', 'google_pay') NOT NULL DEFAULT 'mpesa',
    transaction_status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    currency ENUM('USD', 'KE') DEFAULT 'KE',
    merchantRequestID VARCHAR(50),
    checkoutRequestID VARCHAR(50),
    responseCode VARCHAR(10),
    responseDescription VARCHAR(50),
    transactionDate VARCHAR(50),
    phone VARCHAR(15),
    purchaseType ENUM('register', 'purchase') DEFAULT 'purchase',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@BLOCK
SELECT * FROM Payments

--@BLOCK
SELECT * FROM Payments WHERE merchantRequestID = "60e4-4f14-997e-f04c8c4f586d172807285"

--@BLOCK
DROP TABLE IF EXISTS Payments;

--@BLOCK
DESCRIBE Payments;