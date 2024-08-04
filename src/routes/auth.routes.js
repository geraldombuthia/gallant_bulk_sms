const express = require('express');
const passport = require('../config/passport');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
router.get('/register', (req, res) => {
    res.json({message: "Hey register please"});
});
router.post('/register', AuthController.register);
router.get('/login', (req, res) => {
    res.json({message: "Hey login please"});
})
router.post('/login', passport.authenticate('local'), AuthController.login);
router.get('/logout', AuthController.logout, (req, res) => {
    res.json({message: "Hey logged out"});
});

module.exports = router;

