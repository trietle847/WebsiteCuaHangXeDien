const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail", //smtp
  auth: {
    user: process.env.EMAIL_USER || "trietle2103@gmail.com",
    pass: process.env.EMAIL_PASS || "acsnkuomsfeirjhy",
  },
});

async function sendMail(to, subject, text) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER || "trietle2103@gmail.com",
        to,
        subject,
        text
    })
}

module.exports = { sendMail };