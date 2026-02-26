import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../redux/actions/productActions';
import { listAllOrders, updateOrderStatusAdmin } from '../redux/actions/orderActions';
import '../styles/AdminScreen.css';

// ─── Status badge helper ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const classMap = {
        Pending: 'badge badge-pending',
        Processing: 'badge badge-processing',
        Shipped: 'badge badge-shipped',
        Delivered: 'badge badge-delivered',
        Cancelled: 'badge badge-cancelled',
    };
    return <span className={classMap[status] || 'badge badge-pending'}>{status}</span>;
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusChange, updating }) => {
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    if (!order) return null;

    const handleUpdate = () => {
        if (selectedStatus !== order.status) {
            onStatusChange(order._id, selectedStatus);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Order Details</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-section">
                    <div className="modal-meta-grid">
                        <div className="modal-meta-item">
                            <span className="meta-label">Order ID</span>
                            <span className="meta-value mono">{order._id}</span>
                        </div>
                        <div className="modal-meta-item">
                            <span className="meta-label">Customer</span>
                            <span className="meta-value">{order.user?.name || 'N/A'}</span>
                        </div>
                        <div className="modal-meta-item">
                            <span className="meta-label">Email</span>
                            <span className="meta-value">{order.user?.email || 'N/A'}</span>
                        </div>
                        <div className="modal-meta-item">
                            <span className="meta-label">Date</span>
                            <span className="meta-value">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="modal-meta-item">
                            <span className="meta-label">Payment</span>
                            <span className="meta-value">{order.paymentMethod}</span>
                        </div>
                        <div className="modal-meta-item">
                            <span className="meta-label">Paid</span>
                            <span className="meta-value">
                                {order.isPaid
                                    ? `✅ ${new Date(order.paidAt).toLocaleDateString()}`
                                    : '❌ Not Paid'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-section">
                    <h4 className="modal-section-title">Shipping Address</h4>
                    <p className="shipping-addr">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                        {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                </div>

                <div className="modal-section">
                    <h4 className="modal-section-title">Ordered Items</h4>
                    <div className="modal-items-list">
                        {order.orderItems?.map((item, i) => (
                            <div className="modal-item-row" key={i}>
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.name} className="modal-item-img" />
                                )}
                                <span className="modal-item-name">{item.name}</span>
                                <span className="modal-item-qty">× {item.qty}</span>
                                <span className="modal-item-price">₹{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="modal-price-summary">
                        <div className="price-row"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
                        <div className="price-row"><span>Shipping</span><span>₹{order.shippingPrice?.toFixed(2)}</span></div>
                        <div className="price-row price-total"><span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="modal-section modal-status-section">
                    <h4 className="modal-section-title">Update Status</h4>
                    <div className="status-update-row">
                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="status-select"
                        >
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            className="btn-primary btn-sm"
                            onClick={handleUpdate}
                            disabled={updating || selectedStatus === order.status}
                        >
                            {updating ? 'Updating…' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main AdminScreen ─────────────────────────────────────────────────────────
function AdminScreen() {
    const dispatch = useDispatch();

    // ── Auth state – need to know if current user is admin
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // ── Products state
    const getProductsState = useSelector((state) => state.getProducts);
    const { products, loading } = getProductsState;

    const createProductState = useSelector((state) => state.createProduct);
    const { success: createSuccess, error: createError } = createProductState;

    const updateProductState = useSelector((state) => state.updateProduct);
    const { success: updateSuccess, error: updateError } = updateProductState;

    const deleteProductState = useSelector((state) => state.deleteProduct);
    const { success: deleteSuccess, error: deleteError } = deleteProductState;

    const uploadImageState = useSelector((state) => state.uploadImage);
    const { imageUrl, loading: uploadLoading } = uploadImageState;

    // ── Orders state
    const orderListAllState = useSelector((state) => state.orderListAll);
    const { orders: allOrders, loading: ordersLoading, error: ordersError } = orderListAllState;

    const orderStatusUpdateState = useSelector((state) => state.orderStatusUpdate);
    const { success: statusUpdateSuccess, loading: statusUpdating } = orderStatusUpdateState;

    // ── Active tab
    const [activeTab, setActiveTab] = useState('products');

    // ── Product form state
    const [formData, setFormData] = useState({
        unique_id: '', title: '', imgsrc: '', price: '',
        category: '', indication: '', dosage: '', sideEffects: '', countInStock: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // ── Orders UI state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState('All');
    const [orderSearch, setOrderSearch] = useState('');

    // ─── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch, createSuccess, updateSuccess, deleteSuccess]);

    useEffect(() => {
        // Only fetch orders when on the orders tab AND logged in as admin
        if (activeTab === 'orders' && userInfo?.isAdmin) {
            dispatch(listAllOrders());
        }
    }, [dispatch, activeTab, statusUpdateSuccess, userInfo]);

    useEffect(() => {
        if (imageUrl) {
            setFormData(prev => ({ ...prev, imgsrc: imageUrl }));
        }
    }, [imageUrl]);

    // Close modal after successful status update
    useEffect(() => {
        if (statusUpdateSuccess && selectedOrder) {
            setSelectedOrder(null);
        }
    }, [statusUpdateSuccess]);  // eslint-disable-line

    // ─── Product handlers ──────────────────────────────────────────────────────
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleImageUpload = () => {
        if (selectedFile) {
            const data = new FormData();
            data.append('image', selectedFile);
            dispatch(uploadImage(data));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            dispatch(updateProduct(editProductId, formData));
            setEditMode(false);
            setEditProductId(null);
        } else {
            dispatch(createProduct(formData));
        }
        setFormData({ unique_id: '', title: '', imgsrc: '', price: '', category: '', indication: '', dosage: '', sideEffects: '', countInStock: '' });
        setSelectedFile(null);
        setShowForm(false);
    };

    const handleEdit = (product) => {
        setFormData({
            unique_id: product.unique_id, title: product.title, imgsrc: product.imgsrc,
            price: product.price, category: product.category, indication: product.indication || '',
            dosage: product.dosage || '', sideEffects: product.sideEffects || '', countInStock: product.countInStock || 0
        });
        setEditMode(true);
        setEditProductId(product._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) dispatch(deleteProduct(id));
    };

    const handleCancel = () => {
        setFormData({ unique_id: '', title: '', imgsrc: '', price: '', category: '', indication: '', dosage: '', sideEffects: '', countInStock: '' });
        setEditMode(false); setEditProductId(null); setSelectedFile(null); setShowForm(false);
    };

    // ─── Order handlers ────────────────────────────────────────────────────────
    const handleStatusChange = (orderId, status) => dispatch(updateOrderStatusAdmin(orderId, status));

    const filteredOrders = (allOrders || []).filter(order => {
        const matchesFilter = orderFilter === 'All' || order.status === orderFilter;
        const searchLower = orderSearch.toLowerCase();
        const matchesSearch = !orderSearch ||
            order._id.toLowerCase().includes(searchLower) ||
            (order.user?.name || '').toLowerCase().includes(searchLower) ||
            (order.user?.email || '').toLowerCase().includes(searchLower);
        return matchesFilter && matchesSearch;
    });

    // ─── Summary stats ─────────────────────────────────────────────────────────
    const totalRevenue = (allOrders || []).reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingCount = (allOrders || []).filter(o => o.status === 'Pending').length;
    const deliveredCount = (allOrders || []).filter(o => o.status === 'Delivered').length;

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="admin-screen">

            {/* Header */}
            <div className="admin-header">
                <h1>⚕️ Admin Dashboard</h1>
                {activeTab === 'products' && !showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add New Product</button>
                )}
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    📦 Product Management
                </button>
                <button
                    className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    🛒 Purchase Orders
                </button>
            </div>

            {/* ── PRODUCTS TAB ──────────────────────────────────────────── */}
            {activeTab === 'products' && (
                <>
                    {(createError || updateError || deleteError) && (
                        <div className="error-message">{createError || updateError || deleteError}</div>
                    )}
                    {(createSuccess || updateSuccess || deleteSuccess) && (
                        <div className="success-message">
                            {createSuccess && 'Product created successfully!'}
                            {updateSuccess && 'Product updated successfully!'}
                            {deleteSuccess && 'Product deleted successfully!'}
                        </div>
                    )}

                    {showForm && (
                        <div className="admin-form-container">
                            <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Unique ID *</label>
                                        <input type="text" name="unique_id" value={formData.unique_id}
                                            onChange={handleChange} required disabled={editMode} />
                                    </div>
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="">Select Category</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Diabetes">Diabetes</option>
                                            <option value="Depression">Depression</option>
                                            <option value="Dental">Dental</option>
                                            <option value="Fracture">Fracture</option>
                                            <option value="Women's Care">Women's Care</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Stock Count</label>
                                        <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Image Upload</label>
                                        <div className="file-upload-container">
                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                            <button type="button" onClick={handleImageUpload}
                                                disabled={!selectedFile || uploadLoading} className="btn-upload">
                                                {uploadLoading ? 'Uploading...' : 'Upload Image'}
                                            </button>
                                        </div>
                                        {formData.imgsrc && (
                                            <div className="image-preview"><img src={formData.imgsrc} alt="Preview" /></div>
                                        )}
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Image URL (or use upload above)</label>
                                        <input type="text" name="imgsrc" value={formData.imgsrc} onChange={handleChange}
                                            placeholder="https://example.com/image.jpg" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Indication</label>
                                        <textarea name="indication" value={formData.indication} onChange={handleChange} rows="3" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Dosage</label>
                                        <textarea name="dosage" value={formData.dosage} onChange={handleChange} rows="2" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Side Effects</label>
                                        <textarea name="sideEffects" value={formData.sideEffects} onChange={handleChange} rows="3" />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">{editMode ? 'Update Product' : 'Create Product'}</button>
                                    <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="products-table-container">
                        <h2>All Products ({products?.length || 0})</h2>
                        {loading ? (
                            <div className="loading-spinner-wrap"><div className="spinner" /></div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th><th>Image</th><th>Name</th>
                                            <th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products && products.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product.unique_id}</td>
                                                <td><img src={product.imgsrc} alt={product.title} className="table-image" /></td>
                                                <td>{product.title}</td>
                                                <td>{product.category}</td>
                                                <td>₹{product.price}</td>
                                                <td>
                                                    <span className={`stock-badge ${product.countInStock > 0 ? 'in-stock' : 'out-stock'}`}>
                                                        {product.countInStock > 0 ? product.countInStock : 'Out'}
                                                    </span>
                                                </td>
                                                <td className="actions-cell">
                                                    <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                                                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ── ORDERS TAB ────────────────────────────────────────────── */}
            {activeTab === 'orders' && (
                <>
                    {/* ── Admin guard: show access denied if user isn't an admin ── */}
                    {!userInfo?.isAdmin ? (
                        <div className="admin-access-denied">
                            <div className="access-denied-icon">🔒</div>
                            <h2>Admin Access Required</h2>
                            <p>You must be logged in as an <strong>admin</strong> to view purchase orders.</p>
                            <div className="access-denied-hint">
                                <p>💡 <strong>Seeded admin credentials (after running the seeder):</strong></p>
                                <code>Email: admin@pharmacy.com &nbsp;|&nbsp; Password: admin123</code>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="orders-stats-row">
                                <div className="stat-card">
                                    <div className="stat-icon">🛒</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{(allOrders || []).length}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">₹{totalRevenue.toFixed(2)}</span>
                                        <span className="stat-label">Total Revenue</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{pendingCount}</span>
                                        <span className="stat-label">Pending</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{deliveredCount}</span>
                                        <span className="stat-label">Delivered</span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters + Table */}
                            <div className="orders-table-container">
                                <div className="orders-controls">
                                    <h2>All Purchase Orders ({filteredOrders.length})</h2>
                                    <div className="orders-filter-row">
                                        <input
                                            type="text"
                                            className="order-search"
                                            placeholder="Search by Order ID, name or email…"
                                            value={orderSearch}
                                            onChange={e => setOrderSearch(e.target.value)}
                                        />
                                        <div className="filter-pills">
                                            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
                                                <button
                                                    key={f}
                                                    className={`filter-pill ${orderFilter === f ? 'active' : ''}`}
                                                    onClick={() => setOrderFilter(f)}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {ordersLoading ? (
                                    <div className="loading-spinner-wrap"><div className="spinner" /></div>
                                ) : ordersError ? (
                                    <div className="error-message">
                                        ⚠️ {ordersError}
                                        {ordersError.includes('admin') || ordersError.includes('authorized') ? (
                                            <span> — Make sure you are logged in as an admin user.</span>
                                        ) : null}
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="empty-orders">
                                        <span className="empty-icon">📭</span>
                                        <p>No orders found. Run the seeder to populate sample orders.</p>
                                    </div>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="products-table orders-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Items</th>
                                                    <th>Tax</th>
                                                    <th>Shipping</th>
                                                    <th>Total</th>
                                                    <th>Payment</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="mono order-id-cell">{order._id.slice(-8).toUpperCase()}</td>
                                                        <td>
                                                            <div className="customer-cell">
                                                                <span className="customer-name">{order.user?.name || 'Deleted User'}</span>
                                                                <span className="customer-email">{order.user?.email || ''}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="items-preview">
                                                                {order.orderItems?.slice(0, 2).map((item, i) => (
                                                                    <span key={i} className="item-chip">{item.name} ×{item.qty}</span>
                                                                ))}
                                                                {order.orderItems?.length > 2 && (
                                                                    <span className="item-chip item-more">+{order.orderItems.length - 2} more</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>₹{order.taxPrice?.toFixed(2)}</td>
                                                        <td>₹{order.shippingPrice?.toFixed(2)}</td>
                                                        <td className="total-cell">₹{order.totalPrice?.toFixed(2)}</td>
                                                        <td>
                                                            <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                                                {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                                            </span>
                                                        </td>
                                                        <td><StatusBadge status={order.status} /></td>
                                                        <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                className="btn-view"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >Details</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                    updating={statusUpdating}
                />
            )}
        </div>
    );
}

export default AdminScreen;
