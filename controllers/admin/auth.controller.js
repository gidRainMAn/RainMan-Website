const bcrypt = require("bcrypt");

exports.loginPage = (req, res) => {
    res.render("admin/login");
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
        return res.render("admin/login", {
            error: "Invalid credentials"
        });
    }

    const valid = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    if (!valid) {
        return res.render("admin/login", {
            error: "Invalid credentials"
        });
    }

    req.session.admin = true;

    res.redirect("/admin/dashboard");
};

exports.logout = (req, res) => {

    req.session.destroy(() => {
        res.redirect("/admin/login");
    });

};