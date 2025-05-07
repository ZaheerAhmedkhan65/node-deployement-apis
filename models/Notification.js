const db = require('../config/connection');

class Notification {
    static async createNotification(userId, actor_id, type='follow') {
        const [result] = await db.query(
            'INSERT INTO notifications (user_id, actor_id, type) VALUES (?, ?, ?)',
            [userId, actor_id, type]
        );
        const [notification] = await db.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
        return notification[0];
    }

    static async getNotificationsByUserId(userId) {
        const [notifications] = await db.query(`
            SELECT 
                n.*,
                u.name as actor_name,
                u.avatar as actor_avatar,
                p.title as post_title,
                p.id as post_id,
                CASE 
                    WHEN n.type = 'new_post' THEN CONCAT(u.name, ' created a new post')
                    WHEN n.type = 'like' THEN CONCAT(u.name, ' liked your post')
                    WHEN n.type = 'dislike' THEN CONCAT(u.name, ' disliked your post')
                    WHEN n.type = 'repost' THEN CONCAT(u.name, ' reposted your post')
                    WHEN n.type = 'follow' THEN CONCAT(u.name, ' started following you')
                    ELSE 'New notification'
                END as message,
                TIMESTAMPDIFF(HOUR, n.created_at, NOW()) as hours_ago
            FROM notifications n
            LEFT JOIN users u ON n.actor_id = u.id
            LEFT JOIN posts p ON n.post_id = p.id
            WHERE n.user_id = ?
            ORDER BY n.is_read ASC, n.created_at DESC
            LIMIT 50
        `, [userId]);
    
        // Format the time display
        return notifications.map(notification => ({
            ...notification,
            time_display: notification.hours_ago < 24 
                ? `${notification.hours_ago}h ago` 
                : new Date(notification.created_at).toLocaleDateString(),
            is_new: !notification.is_read && notification.hours_ago < 24
        }));
    }
}

module.exports = Notification;
