"use client"
import React, { useState, useEffect } from 'react';
import { Bell, Check, MailOpen } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const MLMNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const { token } = getTokens();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data);
    } catch (error) {
      toast.error('Error fetching notifications');
      console.error('Error details:', error); 
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread_count/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch unread count');

      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/mark_read/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to mark notification as read');

      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Error marking notification as read');
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/mark_all_read/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to mark all as read');

      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Error marking all notifications as read');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <Check size={16} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MailOpen className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, showAll ? undefined : 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.is_read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{notification.time_ago}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {notification.notification_type_display}
                    </span>
                  </div>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Check size={20} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {notifications.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-blue-600 hover:text-blue-800"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MLMNotifications;