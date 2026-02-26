import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveReminders, markReminderShown } from "../redux/actions/orderActions";
import "../styles/ReminderNotification.css";

const ReminderNotification = () => {
  const dispatch = useDispatch();
  const [dismissedReminders, setDismissedReminders] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderRemindersActive = useSelector((state) => state.orderRemindersActive);
  const { reminders } = orderRemindersActive;

  useEffect(() => {
    if (userInfo) {
      // Initial check immediately
      dispatch(getActiveReminders());
      
      // Poll every 30 seconds for new reminders
      const interval = setInterval(() => {
        dispatch(getActiveReminders());
      }, 30 * 1000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [dispatch, userInfo]);

  // Clear dismissed reminders when new data arrives to prevent stale state
  useEffect(() => {
    if (reminders && reminders.length > 0) {
      // Remove dismissed IDs that are no longer in the current reminders list
      setDismissedReminders(prev => 
        prev.filter(id => reminders.some(r => r._id === id))
      );
    }
  }, [reminders]);

  const handleDismiss = (orderId) => {
    // Add to local dismissed list for immediate UI update
    setDismissedReminders([...dismissedReminders, orderId]);
    // Mark as shown in database
    dispatch(markReminderShown(orderId));
  };

  const visibleReminders = reminders?.filter(
    (reminder) => !dismissedReminders.includes(reminder._id)
  );

  if (!visibleReminders || visibleReminders.length === 0) {
    return null;
  }

  return (
    <div className="reminder-notifications-container">
      {visibleReminders.map((order) => (
        <div key={order._id} className="reminder-notification">
          <div className="reminder-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="reminder-content">
            <h3 className="reminder-title">Medication Reminder</h3>
            <p className="reminder-message">
              {order.reminder.reminderMessage}
            </p>
            {order.reminder.reminderDate && (
              <div className="reminder-datetime">
                <i className="fas fa-calendar-alt"></i>
                <span>
                  {new Date(order.reminder.reminderDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {order.reminder.reminderTime && (
                  <>
                    <i className="fas fa-clock"></i>
                    <span>{order.reminder.reminderTime}</span>
                  </>
                )}
              </div>
            )}
            <div className="reminder-order-details">
              <p className="reminder-order-id">
                Order #{order._id.substring(0, 8)}
              </p>
              {order.orderItems && order.orderItems.length > 0 && (
                <div className="reminder-items">
                  {order.orderItems.map((item, idx) => (
                    <span key={idx} className="reminder-item-name">
                      {item.name} (Qty: {item.qty})
                      {idx < order.orderItems.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            className="reminder-dismiss-btn"
            onClick={() => handleDismiss(order._id)}
            title="Dismiss"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReminderNotification;
