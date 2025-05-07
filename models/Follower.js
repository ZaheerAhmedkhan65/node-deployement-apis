const db = require('../config/connection');

class Follower {
    static async createFollower(followerId, userId) {
        const [result] = await db.query(
            'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
            [followerId, userId]
        );
        const [follow] = await db.query('SELECT * FROM followers WHERE id = ?', [result.insertId]);
        return follow[0];
    }

    static async deleteFollower(followerId, followingId) {
        const [follow] = await db.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        await db.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        return follow[0]; // Return deleted follow data if needed
    }

    static async getAllFollowers() {
        const [follows] = await db.query('SELECT * FROM followers');
        return follows;
    }

    static async getFollowersByUserId(userId) {
        const [followers] = await db.query(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.avatar,
                f.created_at as followed_at
            FROM followers f
            JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = ?
            ORDER BY f.created_at DESC
        `, [userId]);
        
        return followers;
    }

    static async getFollowersByUserIdAndFollowerId(userId, followerId) {
        const [follows] = await db.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, userId]);
        return follows;
    }

    static async getFollowingsByUserId(userId) {
        const [follows] = await db.query('SELECT * FROM followers WHERE following_id = ?', [userId]);
        return follows;
    }
    
}

module.exports = Follower;
