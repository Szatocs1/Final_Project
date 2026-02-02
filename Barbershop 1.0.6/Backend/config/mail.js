const nodemail = require("nodemailer");

const transport = nodemail.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
})

const sendEmail = async ({ userData, subject, message }) =>{
    return await transport.sendMail({
        from: 'no-reply@example.com',
        to: userData,
        subject,
        text:`
            <p>${message}</p>
            <a href="${link}">ide</a>
        `,
        html:`
            <p>${message}</p>
            <a href="${link}">ide</a>
        `,
    });
}

module.exports = {
    sendEmail
}