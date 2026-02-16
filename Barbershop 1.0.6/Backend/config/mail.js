const nodemail = require("nodemailer");

const transport = nodemail.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
    rejectUnauthorized: false,
  },
})

const sendEmail = async ({ userData, subject, message }) =>{
    return await transport.sendMail({
        from: `Your App Name <${process.env.MAIL_USER}>`,
        to: userData,
        subject,
        text: `${message}\n\n${link}`,
        html:`
            <p>${message}</p>
            <a href="${link}">ide</a>
        `,
    });
}

module.exports = {
    sendEmail
}