CREATE DATABASE IF NOT EXISTS gallantbulksms;

USE gallantbulksms;
--@block
-- DROP DATABASE gallantbulksms;

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
    apikey VARCHAR(255) NOT NULL,
    password VARCHAR(128) NOT NULL, 
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,   
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--@block
SELECT * FROM users

--@BLOCK
-- DROP TABLE IF EXISTS users;

--@BLOCK
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    amount INT NOT NULL,
    transaction_code VARCHAR(50),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'mpesa',
    transaction_status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    currency ENUM('USD', 'KE') DEFAULT 'KE',
    merchantRequestID VARCHAR(50),
    checkoutRequestID VARCHAR(50),
    responseCode VARCHAR(10),
    responseDescription VARCHAR(50),
    transactionDate VARCHAR(50),
    phone VARCHAR(15),
    purchaseType VARCHAR(20) DEFAULT 'sms',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@BLOCK
SELECT * FROM Payments

--@BLOCK
SELECT * FROM Payments WHERE merchantRequestID = "60e4-4f14-997e-f04c8c4f586d172807285"

--@BLOCK
-- DROP TABLE IF EXISTS Payments;

--@BLOCK
DESCRIBE Payments;

--@BLOCK
CREATE TABLE IF NOT EXISTS Credits (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    paymentId INTEGER NOT NULL,
    creditsValue DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    creditUnit DECIMAL(10, 2) NOT NULL DEFAULT 0,
    productType VARCHAR(20) NOT NULL DEFAULT 'sms',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (paymentId) REFERENCES Payments(id)
);

--@BLOCK
SELECT * FROM Credits;

--@BLOCK
-- DROP TABLE IF EXISTS Credits;

--@BLOCK
CREATE TABLE IF NOT EXISTS SMSCredits (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    price_per_unit DECIMAL(10, 5) NOT NULL DEFAULT 0,
    creditBalance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user (userId),
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@BLOCK
SELECT * FROM SMSCredits;

--@BLOCK
-- DROP TABLE IF EXISTS SMSCredits;

--@BLOCK
CREATE TABLE IF NOT EXISTS EmailCredits (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    price_per_unit DECIMAL(10, 5) NOT NULL DEFAULT 0,
    creditBalance DECIMAL(10, 5) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user (userId),
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@block
UPDATE EmailCredits 
SET price_per_unit = 0.05 
WHERE userId = 1;
--@BLOCK
-- INSERT INTO EmailCredits VALUE (1, 1, 20.00000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
--@BLOCK
SELECT * FROM EmailCredits;

--@BLOCK
-- DROP TABLE IF EXISTS EmailCredits;


--@BLOCK
CREATE TABLE IF NOT EXISTS SMSMsg (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    senderId VARCHAR(20) NOT NULL, 
    phoneNumber VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    deliveryStatus VARCHAR(20) DEFAULT 'pending',
    retryAttempts INT DEFAULT 0,
    providerId VARCHAR(255) NULL,
    providerResponse TEXT NULL,
    cost DECIMAL(10, 2) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@BLOCK 
SELECT * FROM SMSMsg;

--@BLOCK
-- DROP TABLE IF EXISTS SMSMsg;


--@BLOCK
CREATE TABLE IF NOT EXISTS Emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    textBody TEXT NULL,
    htmlBody TEXT NULL,
    isHTML BOOLEAN DEFAULT TRUE,
    recipient JSON NOT NULL DEFAULT (JSON_OBJECT('to', JSON_ARRAY(), 'cc', JSON_ARRAY(), 'bcc', JSON_ARRAY())),
    sender VARCHAR(255) NOT NULL,
    deliveryStatus VARCHAR(20) NOT NULL,
    providerId VARCHAR(255) NULL,
    providerResponse TEXT NULL,
    sentAt DATETIME NULL,
    trackingID VARCHAR(255) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

--@BLOCK
SELECT * FROM Emails;

--@BLOCK
-- DROP TABLE IF EXISTS  Emails;

-- Introduce a price model to keep track of the prices per 
-- unit of email or sms