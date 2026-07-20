// Core Modules
const path = require("path");

// Third-Party Modules
const express = require("express");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");

// Route Imports
const indexRoutes = require("./routes");

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// ==========================
// App Configuration
// ==========================

const PORT = process.env.PORT || 3000;

// ==========================
// View Engine
// ==========================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

// Default layout
app.set("layout", "layouts/main");

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Parse JSON
app.use(express.json());

app.use((req, res, next) => {
    res.locals.title = "RainMan";
    res.locals.description = "";
    res.locals.currentPage = "";
    res.locals.canonical = req.originalUrl;
    res.locals.robots = "index,follow";

    next();
});

// ==========================
// Routes
// ==========================

app.use("/", indexRoutes);

// ==========================
// 404 Page - Page Not Found
// ==========================

app.use((req, res) => {
    res.status(404).render("error/404", {
        title: "404 | Page Not Found",
        description: "The requested page could not be found.",
        canonical: req.originalUrl,
        robots: "noindex,nofollow",
        currentPage: ""
    });
});

// ==========================
// 500 Page - Internal Server Error
// ==========================
// 500 - Internal Server Error
app.use((err, req, res, next) => {

    console.error("========== SERVER ERROR ==========");
    console.error(err.stack);
    console.error("==================================");

    const isDev = process.env.NODE_ENV !== "production";

    res.status(500).render("error/500", {
        title: "500 | Internal Server Error",
        description: "An unexpected error occurred.",
        canonical: req.originalUrl,
        robots: "noindex,nofollow",
        currentPage: "",
        error: isDev ? err : null,
    });

});

// ==========================
// Start Server
// ==========================

app.listen(PORT, () => {
    console.log(`🚀 Rainman Website running on http://localhost:${PORT}`);
});