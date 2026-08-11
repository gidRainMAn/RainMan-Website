const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // console.log("RAINBRAIN COMPARE 1");
    res.render("rainbrain/index", {
        layout: false
    });
});

router.get("/compare", (req, res) => {
    // console.log("RAINBRAIN COMPARE 2");
    res.render("rainbrain/compare",{
        layout: false
    });
});

router.get("/how-it-works", (req, res) => {
    // console.log("RAINBRAIN COMPARE 3");
    res.render("rainbrain/how-it-works",{
        layout: false
    });
});

router.get("/try", (req, res) => {
    // console.log("RAINBRAIN COMPARE 4");
    res.render("rainbrain/try",{
        layout: false
    });
});

router.get("/who-its-for", (req, res) => {
    // console.log("RAINBRAIN COMPARE 5");
    res.render("rainbrain/who-its-for",{
        layout: false
    });
});

module.exports = router;