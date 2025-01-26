const express = require('express');
const router = express.Router();
const dashboardlayoutMiddleware = require("../middleware/dashboardlayout.middleware");
const DashboardController = require('../controllers/dashboard.controller');

// Dashboard main route
router.get('/', dashboardlayoutMiddleware, (req, res) => {
    DashboardController.renderOverview(req, res);
});

router.get("/api", dashboardlayoutMiddleware, (req, res) => {
    res.render('partials/pages/api', {
        user: req.user
    });
});


router.get('/senderids', dashboardlayoutMiddleware, (req, res) => {
    res.render('partials/pages/shortcodes', {
        user: req.user
    });
});

router.get("/billing", dashboardlayoutMiddleware, (req, res) => {
    res.render('partials/pages/billing', {
        user: req.user
    });
});

router.get('/support', dashboardlayoutMiddleware, (req, res) => {
    res.render('partials/pages/support', {
        user: req.user
    })
})

router.get("/profile", dashboardlayoutMiddleware, (req, res) => {
    res.render('partials/pages/user-profile', {
        user: req.user
    })
})

module.exports = router;