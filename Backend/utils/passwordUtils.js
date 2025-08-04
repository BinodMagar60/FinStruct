
const dotenv = require('dotenv')
dotenv.config()

//salt
function generateCustomSalt(length = 16, seed = Date.now().toString()) {
    let salt = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?";

    for (let i = 0; i < length; i++) {
        const charCode = seed.charCodeAt(i % seed.length);
        const mixed = (charCode * (i + 3) + i * 7) % chars.length;
        salt += chars.charAt(mixed);
    }

    return salt;
}

//hashing
function customHash(password, salt, iterations = 1000) {
    let hash = salt + password + salt;

    for (let i = 0; i < iterations; i++) {
        let newHash = "";
        for (let j = 0; j < hash.length; j++) {
            const charCode = hash.charCodeAt(j);
            const shifted = (charCode ^ (j + 3)) + (i % 7);
            newHash += String.fromCharCode((shifted % 126) + 32); 
        }
        hash = newHash;
    }

    return hash;
}

//Encryption
function xorEncrypt(text, key = process.env.KEY) {
    let encrypted = "";
    for (let i = 0; i < text.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = text.charCodeAt(i) ^ keyChar;
        encrypted += String.fromCharCode(encryptedChar);
    }
    return encrypted;
}

//Decryption
function xorDecrypt(encryptedText, key = process.env.KEY) {
    return xorEncrypt(encryptedText, key); 
}


module.exports = {
    generateCustomSalt,
    customHash,
    xorEncrypt,
    xorDecrypt
}
