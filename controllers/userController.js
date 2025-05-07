const Post = require('../models/Post');
const User = require('../models/User');
const Follower = require('../models/Follower');
const Notification = require('../models/Notification');

const userController = {
    // Create a new post
    async profile(req, res) {
        try {
            const userData = await User.findById(req.params.id);
            console.log(userData);
            res.status(201).json({ 
                user:req.user,
                userData,
                userId: req.user.userId
             });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateProfile(req,res) {
        try {
            const avatar = req.file.path;
            const avatar_public_id = req.file.filename;
            const updatedUser = await User.updateAvatar(req.params.id, avatar, avatar_public_id);
            res.json({ updatedUser, message: "User updated successfully" });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async suggestedUser(req, res) {
        try {
            const currentUserId = req.user.userId; // Assuming you have user in request from auth middleware
            const suggestedUsers = await User.getSuggestedUsers(currentUserId);
            
            // Add isFollowing flag for frontend
            const usersWithFollowingStatus = suggestedUsers.map(user => ({
                ...user,
                isFollowing: false
            }));
            
            res.json(usersWithFollowingStatus);
        } catch (error) {
            console.error('Error getting suggested users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async followUser(req, res) {
        try {
            const followerId = req.user.userId;
            const followingId = req.params.id;
            
            const isFollowing = await Follower.getFollowersByUserIdAndFollowerId(followerId, followingId);
            if (isFollowing.length > 0) {
                return res.status(400).json({ error: 'You are already following this user' });
            }

            const follow = await Follower.createFollower(followerId, followingId);
            const notification = await Notification.createNotification(followingId, followerId, 'follow');
            res.json({ follow, message: "User followed successfully" });
        } catch (error) {
            console.error('Error following user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async unfollowUser(req, res) {
        try {
            const followerId = req.user.userId;
            const followingId = req.params.id;
            const unfollow = await Follower.deleteFollower(followerId, followingId);
            res.json({ unfollow, message: "User unfollowed successfully" });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async following(req, res) {
        try {
            const following = await Follower.getFollowingsByUserId(req.params.id);
            res.json(following);
        } catch (error) {
            console.error('Error getting follows:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async followers(req, res) {
        try {
            const followers = await Follower.getFollowersByUserId(req.params.id);
            res.json(followers);
        } catch (error) {
            console.error('Error getting followers:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async notifications(req, res) {
        try {
            const notifications = await Notification.getNotificationsByUserId(req.params.id);
            res.json(notifications);
        } catch (error) {
            console.error('Error getting notifications:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}

module.exports = userController;