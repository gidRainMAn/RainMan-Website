exports.index = (req, res) => {

    res.render("admin/dashboard", {
        layout: "layouts/admin",
        title: "Dashboard"
    });

};