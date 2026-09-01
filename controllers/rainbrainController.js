const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },

    pool: true,
    maxConnections: 1,
    maxMessages: 100,

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

const requestTrial = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            company,
            measure
        } = req.body;

        if (!firstName || !lastName || !email || !company) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        await transporter.sendMail({

            from: `"RainBrain Website" <${process.env.SMTP_USER}>`,

            to: process.env.CONTACT_EMAIL,

            replyTo: email,

            subject: `RainBrain Trial Request - ${firstName} ${lastName}`,

            text: `
New RainBrain trial request

Name:
${firstName} ${lastName}

Email:
${email}

Company:
${company}

What they want to measure:
${measure || "Not provided"}

--------------------------------
Submitted from RainBrain website
            `.trim()

        });

        console.log(
            `RainBrain trial request received from ${email}`
        );

        return res.status(200).json({
            success: true,
            message: "Trial request sent successfully."
        });

    } catch (error) {

        console.error(
            "========== RAINBRAIN TRIAL ERROR =========="
        );

        console.error(error);

        console.error(
            "==========================================="
        );

        return res.status(500).json({
            success: false,
            message: "Unable to send trial request."
        });

    }
};

module.exports = {
    requestTrial
};