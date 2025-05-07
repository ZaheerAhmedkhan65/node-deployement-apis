const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlware/upload');
const authenticate = require('../middlware/authenticate');


router.get('/suggested_user',authenticate, userController.suggestedUser);
router.get('/:id/profile',authenticate, userController.profile);
router.post('/:id/avatar/update',authenticate,upload.single('image'), userController.updateProfile);
router.get('/:id/followers',authenticate, userController.followers);
router.get('/:id/following',authenticate, userController.following);
router.post('/:id/follow',authenticate, userController.followUser);
router.post('/:id/unfollow',authenticate, userController.unfollowUser);
router.get('/:id/notifications',authenticate, userController.notifications);
module.exports = router;