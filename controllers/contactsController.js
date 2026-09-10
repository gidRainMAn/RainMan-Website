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
        const {
            name,
            email,
            company,
            message,
            website,
            "cf-turnstile-response": turnstileToken
        } = req.body;

        // -----------------------------------
        // 1. Honeypot check
        // -----------------------------------
        if (website) {
            console.warn(
                `Contact form honeypot triggered from ${req.ip}`
            );

            return res.status(400).json({
                success: false,
                message: "Invalid submission."
            });
        }

        // -----------------------------------
        // 2. Required fields
        // -----------------------------------
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required."
            });
        }

        // -----------------------------------
        // 3. Turnstile token check
        // -----------------------------------
        if (!turnstileToken) {
            return res.status(400).json({
                success: false,
                message: "Please complete the verification."
            });
        }

        // -----------------------------------
        // 4. Verify Turnstile with Cloudflare
        // -----------------------------------
        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                    remoteip: req.ip
                })
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn(
                "Turnstile validation failed:",
                turnstileResult["error-codes"]
            );

            return res.status(403).json({
                success: false,
                message: "Verification failed. Please try again."
            });
        }

        // -----------------------------------
        // 5. Send email
        // -----------------------------------
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

        console.log(
            `Contact form enquiry received from ${email}`
        );

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