const ENV_KEY = import.meta.env.VITE_KEY;

export function xorEncrypt(text, key = ENV_KEY) {

    let encrypted = "";
    for (let i = 0; i < text.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = text.charCodeAt(i) ^ keyChar;
        encrypted += String.fromCharCode(encryptedChar);
    }
    return encrypted;
}