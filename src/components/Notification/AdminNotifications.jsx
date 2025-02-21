'use client'
import React, { useState, useEffect } from 'react';
import { Bell, Search, Plus, Trash2, Send } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: 'GENERAL',
    recipient: null
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { token } = getTokens();

  useEffect(() => {
    fetchNotifications();
    fetchMembers();
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
      setNotifications(data);
    } catch (error) {
      toast.error('Error fetching notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch members');

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the notification data
    //   const notificationData = {
    //     ...formData,
    //     recipient: formData.notification_type === 'INDIVIDUAL' ? formData.recipient : null
    //   };
    const notificationData = {
        ...formData,
        recipient: formData.notification_type === 'INDIVIDUAL' ? parseInt(formData.recipient) : null
    };

      console.log('Sending notification:', notificationData); // For debugging

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create notification');
      }

      const data = await response.json();
      console.log('Response:', data); // For debugging

      toast.success('Notification sent successfully');
      setShowNewModal(false);
      setFormData({
        title: '',
        message: '',
        notification_type: 'GENERAL',
        recipient: null
      });
      fetchNotifications();
    } catch (error) {
      toast.error(error.message || 'Error sending notification');
      console.error('Notification error:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete notification');

      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      toast.error('Error deleting notification');
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Notification</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 border rounded-lg"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications
          .filter(n => 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((notification) => (
            <div key={notification.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {notification.notification_type_display}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="text-sm text-gray-500 flex items-center space-x-4">
                    <span>{notification.time_ago}</span>
                    {notification.recipient_name && (
                      <span>To: {notification.recipient_name}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* New Notification Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Send New Notification</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.notification_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    notification_type: e.target.value,
                    recipient: e.target.value === 'GENERAL' ? null : formData.recipient
                  })}
                >
                  <option value="GENERAL">General (All Members)</option>
                  <option value="INDIVIDUAL">Individual Member</option>
                  {/* <option value="SYSTEM">System Notification</option> */}
                </select>
              </div>

              {formData.notification_type === 'INDIVIDUAL' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.recipient || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      recipient: e.target.value
                    })}
                    required
                  >
                    <option value="">Select a member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.user.first_name} {member.user.last_name} ({member.member_id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full p-2 border rounded h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send size={20} />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;