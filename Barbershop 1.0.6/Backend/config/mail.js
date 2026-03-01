require('dotenv').config();
const nodemail = require("nodemailer");


const transport = nodemail.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
    rejectUnauthorized: false,
  },
})

const sendEmail = async ({ userData, subject, message, link }) => {
    try {
        const info = await transport.sendMail({
            from: `"BarberShop" <${process.env.MAIL_USER}>`,
            to: userData,
            subject: subject,
            text: `${message}\n\nKattints ide: ${link}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>BarberShop Értesítés</h2>
                    <p>${message}</p>
                    <a href="${link}" style="background: #d4af37; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Művelet elvégzése</a>
                </div>
            `,
        });
        console.log("Email elküldve: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Email küldési hiba:", error);
        return null; 
    }
}

module.exports = {
    sendEmail
}