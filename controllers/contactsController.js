const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendContactEmail = async (req, res) => {
    try {
        const { name, email, company, message } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required."
            });
        }

        await transporter.sendMail({
            from: `"RainMan Website" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New enquiry from RainMan website - ${name}`,
            text: `
New enquiry from the RainMan website

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message || "No message provided"}
            `.trim()
        });

        console.log(`Contact form enquiry received from ${email}`);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error("========== CONTACT FORM ERROR ==========");
        console.error(error);
        console.error("========================================");

        return res.status(500).json({
            success: false,
            message: "Unable to send message."
        });
    }
};

module.exports = {
    sendContactEmail
};