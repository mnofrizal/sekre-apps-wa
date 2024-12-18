const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-auth'
    }),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// QR Code event handler
client.on('qr', (qr) => {
    console.log('Scan the QR code below to login:');
    qrcode.generate(qr, { small: true });
});

// Ready event handler
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Authentication event handlers
client.on('authenticated', (session) => {
    console.log('WhatsApp client is authenticated!');
});

client.on('auth_failure', (msg) => {
    console.error('WhatsApp authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp client was disconnected:', reason);
});

module.exports = client;