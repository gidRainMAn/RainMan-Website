// controllers/pageController.js

exports.home = (req, res) => {
    res.render("pages/home", {
        title: "RainMan | Profit from Marketing Effectiveness",
        description:
            "RainMan helps organizations maximize marketing ROI through Marketing Mix Modeling, AI, and Decision Intelligence.",
        currentPage: "home",
        canonical: "/",
        robots: "index,follow",
    });
};

// exports.home = (req, res) => {
//     console.log("HOME CONTROLLER HIT");

//     res.render("pages/home", {
//         title: "RainMan Home",
//         description: "Test",
//         currentPage: "home",
//         canonical: "/",
//         robots: "index,follow",
//     });
// };

exports.team = (req, res) => {
    res.render("pages/team", {
        title: "Our Team | RainMan",
        description:
            "Meet the experts behind RainMan's marketing analytics and decision intelligence solutions.",
        currentPage: "team",
        canonical: "/team",
        robots: "index,follow",
    });
};

exports.methodology = (req, res) => {
    res.render("pages/methodology", {
        title: "Our Methodology | RainMan",
        description:
            "Learn about RainMan's data-driven methodology for marketing measurement and optimization.",
        currentPage: "methodology",
        canonical: "/methodology",
        robots: "index,follow",
    });
};

exports.services = (req, res) => {
    res.render("pages/services", {
        title: "Services | RainMan",
        description:
            "Explore RainMan's consulting, marketing analytics, and AI-powered decision intelligence services.",
        currentPage: "services",
        canonical: "/services",
        robots: "index,follow",
    });
};

exports.products = (req, res) => {
    res.render("pages/products", {
        title: "Products | RainMan",
        description:
            "Discover RainMan's suite of products including RainBrain, RainGauge, and Octopus.",
        currentPage: "products",
        canonical: "/products",
        robots: "index,follow",
    });
};

exports.resources = (req, res) => {
    res.render("pages/resources", {
        title: "Resources | RainMan",
        description:
            "Browse blogs, case studies, whitepapers, and thought leadership from RainMan.",
        currentPage: "resources",
        canonical: "/resources",
        robots: "index,follow",
    });
};

exports.contact = (req, res) => {
    res.render("pages/contact", {
        title: "Contact Us | RainMan",
        description:
            "Get in touch with RainMan to discuss your marketing analytics and decision intelligence needs.",
        currentPage: "contact",
        canonical: "/contact",
        robots: "index,follow",
    });
};