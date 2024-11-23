// src/components/Notifications/NotificationPanel.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

const NotificationPanel = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    // Set up real-time updates if needed
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/notifications/${notificationId}/read`,
        {}, // PUT body if no additional data is required
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications(); // Refresh notifications after marking as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-panel">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
              <p>{notification.message}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationPanel;

