const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlware/upload');
const jwt = require('jsonwebtoken');

router.get('/reset-password/:token', authController.resetPassword);

router.post('/signup',upload.single('image'),authController.signup);
router.post('/signin', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.updatePassword);
router.get('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;