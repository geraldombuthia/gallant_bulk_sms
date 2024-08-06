const express = require('express');
const passport = require('../config/passport');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
router.get('/register', (req, res) => {res.render('register', {user: req.user});});
router.post('/register', AuthController.register);
router.get('/login', (req, res) => {res.render('login');})
router.post('/login', passport.authenticate('local'), AuthController.login);
router.get('/logout', AuthController.logout, (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/'); // Redirect to the home page
    })
});

module.exports = router;

