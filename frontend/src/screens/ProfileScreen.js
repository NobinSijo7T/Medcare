import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../redux/actions/userActions";
import { listMyOrders, setOrderReminder } from "../redux/actions/orderActions";
import "../styles/ProfileScreen.css";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Reminder state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderMessage, setReminderMessage] = useState("Time to reorder your medication");

  const dispatch = useDispatch();
  const history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      setMessage("Profile updated successfully!");
      setEditMode(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#4caf50";
      case "shipped":
      case "processing":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      case "cancelled":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const handleSetReminder = (order) => {
    setSelectedOrder(order);
    
    // Set default reminder date if one exists, otherwise suggest 7 days from now
    if (order.reminder && order.reminder.isSet) {
      const existingDate = new Date(order.reminder.reminderDate);
      setReminderDate(existingDate.toISOString().split('T')[0]);
      setReminderTime(order.reminder.reminderTime || "09:00");
      setReminderMessage(order.reminder.reminderMessage || "Time to reorder your medication");
    } else {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setReminderDate(defaultDate.toISOString().split('T')[0]);
      setReminderTime("09:00");
      setReminderMessage("Time to reorder your medication");
    }
    
    setShowReminderModal(true);
  };

  const handleSaveReminder = (e) => {
    e.preventDefault();
    if (selectedOrder && reminderDate && reminderTime) {
      dispatch(setOrderReminder(selectedOrder._id, reminderDate, reminderTime, reminderMessage));
      setShowReminderModal(false);
      setMessage("Reminder set successfully!");
      setTimeout(() => setMessage(null), 3000);
      // Refresh orders to show updated reminder
      dispatch(listMyOrders());
    }
  };

  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
    setSelectedOrder(null);
    setReminderDate("");
    setReminderTime("09:00");
    setReminderMessage("Time to reorder your medication");
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{orders ? orders.length : 0}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {orders
                    ? orders.filter((order) => order.status === "Delivered").length
                    : 0}
                </span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className={`action-btn ${!editMode ? "active" : ""}`}
              onClick={() => setEditMode(false)}
            >
              <i className="fas fa-shopping-bag"></i> My Orders
            </button>
            <button
              className={`action-btn ${editMode ? "active" : ""}`}
              onClick={() => setEditMode(true)}
            >
              <i className="fas fa-user-edit"></i> Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-main">
          {!editMode ? (
            <div className="orders-section">
              <h2 className="section-title">Order History</h2>
              {loadingOrders ? (
                <div className="loading-spinner">Loading orders...</div>
              ) : errorOrders ? (
                <div className="error-message">{errorOrders}</div>
              ) : orders && orders.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-shopping-cart"></i>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here!</p>
                  <button
                    className="shop-now-btn"
                    onClick={() => history.push("/allProducts")}
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders &&
                    orders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3 className="order-id">Order #{order._id.substring(0, 8)}</h3>
                            <p className="order-date">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div
                            className="order-status"
                            style={{ background: getStatusColor(order.status) }}
                          >
                            {order.status || "Pending"}
                          </div>
                        </div>
                        <div className="order-items">
                          {order.orderItems &&
                            order.orderItems.map((item, idx) => (
                              <div key={idx} className="order-item">
                                <img
                                  src={item.imageUrl || "/placeholder.png"}
                                  alt={item.name}
                                  className="item-image"
                                />
                                <div className="item-details">
                                  <h4>{item.name}</h4>
                                  <p>Qty: {item.qty}</p>
                                </div>
                                <div className="item-price">${item.price}</div>
                              </div>
                            ))}
                        </div>
                        <div className="order-footer">
                          <div className="order-total">
                            Total: $
                            {order.totalPrice ||
                              order.orderItems?.reduce(
                                (acc, item) => acc + item.price * item.qty,
                                0
                              )}
                          </div>
                          <div className="order-actions">
                            <button
                              className="set-reminder-btn"
                              onClick={() => handleSetReminder(order)}
                              title={order.reminder?.isSet ? "Update Reminder" : "Set Reminder"}
                            >
                              <i className="fas fa-bell"></i>
                              {order.reminder?.isSet ? (
                                <>
                                  <span className="reminder-indicator">●</span>
                                  Reminder Set
                                </>
                              ) : (
                                "Set Reminder"
                              )}
                            </button>
                            <button
                              className="view-details-btn"
                              onClick={() => history.push(`/order/${order._id}`)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="edit-profile-section">
              <h2 className="section-title">Edit Profile</h2>
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-spinner">Loading...</div>}
              <form onSubmit={submitHandler} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter new password (optional)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    <i className="fas fa-save"></i> Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      setPassword("");
                      setConfirmPassword("");
                      setMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="reminder-modal-overlay" onClick={handleCloseReminderModal}>
          <div className="reminder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reminder-modal-header">
              <h2>
                <i className="fas fa-bell"></i> Set Medication Reminder
              </h2>
              <button className="modal-close-btn" onClick={handleCloseReminderModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="reminder-modal-body">
              {selectedOrder && (
                <div className="reminder-order-info">
                  <p className="reminder-order-label">Order Details:</p>
                  <p className="reminder-order-id">#{selectedOrder._id.substring(0, 8)}</p>
                  <div className="reminder-order-items">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <span key={idx}>
                        {item.name} ({item.qty}x)
                        {idx < selectedOrder.orderItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <form onSubmit={handleSaveReminder} className="reminder-form">
                <div className="form-group">
                  <label htmlFor="reminderDate">
                    <i className="fas fa-calendar"></i> Reminder Date
                  </label>
                  <input
                    type="date"
                    id="reminderDate"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <small className="form-hint">
                    Select when you want to be reminded to reorder
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="reminderTime">
                    <i className="fas fa-clock"></i> Reminder Time
                  </label>
                  <input
                    type="time"
                    id="reminderTime"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                  />
                  <small className="form-hint">
                    What time should we remind you?
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="reminderMessage">
                    <i className="fas fa-comment"></i> Reminder Message
                  </label>
                  <textarea
                    id="reminderMessage"
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    rows="3"
                    placeholder="Enter a custom reminder message..."
                  />
                </div>
                <div className="reminder-modal-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseReminderModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-reminder-btn">
                    <i className="fas fa-check"></i> Save Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
