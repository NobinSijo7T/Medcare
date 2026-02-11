import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../redux/actions/productActions';
import '../styles/AdminScreen.css';

function AdminScreen() {
    const dispatch = useDispatch();

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

    const [formData, setFormData] = useState({
        unique_id: '',
        title: '',
        imgsrc: '',
        price: '',
        category: '',
        indication: '',
        dosage: '',
        sideEffects: '',
        countInStock: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch, createSuccess, updateSuccess, deleteSuccess]);

    useEffect(() => {
        if (imageUrl) {
            setFormData({ ...formData, imgsrc: imageUrl });
        }
    }, [imageUrl]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageUpload = async () => {
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

        setFormData({
            unique_id: '',
            title: '',
            imgsrc: '',
            price: '',
            category: '',
            indication: '',
            dosage: '',
            sideEffects: '',
            countInStock: ''
        });
        setSelectedFile(null);
        setShowForm(false);
    };

    const handleEdit = (product) => {
        setFormData({
            unique_id: product.unique_id,
            title: product.title,
            imgsrc: product.imgsrc,
            price: product.price,
            category: product.category,
            indication: product.indication || '',
            dosage: product.dosage || '',
            sideEffects: product.sideEffects || '',
            countInStock: product.countInStock || 0
        });
        setEditMode(true);
        setEditProductId(product._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleCancel = () => {
        setFormData({
            unique_id: '',
            title: '',
            imgsrc: '',
            price: '',
            category: '',
            indication: '',
            dosage: '',
            sideEffects: '',
            countInStock: ''
        });
        setEditMode(false);
        setEditProductId(null);
        setSelectedFile(null);
        setShowForm(false);
    };

    return (
        <div className="admin-screen">
            <div className="admin-header">
                <h1>Admin Dashboard - Product Management</h1>
                {!showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        Add New Product
                    </button>
                )}
            </div>

            {(createError || updateError || deleteError) && (
                <div className="error-message">
                    {createError || updateError || deleteError}
                </div>
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
                                <input
                                    type="text"
                                    name="unique_id"
                                    value={formData.unique_id}
                                    onChange={handleChange}
                                    required
                                    disabled={editMode}
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
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
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Image Upload</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        disabled={!selectedFile || uploadLoading}
                                        className="btn-upload"
                                    >
                                        {uploadLoading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </div>
                                {formData.imgsrc && (
                                    <div className="image-preview">
                                        <img src={formData.imgsrc} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group full-width">
                                <label>Image URL (or use upload above)</label>
                                <input
                                    type="text"
                                    name="imgsrc"
                                    value={formData.imgsrc}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Indication</label>
                                <textarea
                                    name="indication"
                                    value={formData.indication}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Dosage</label>
                                <textarea
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleChange}
                                    rows="2"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Side Effects</label>
                                <textarea
                                    name="sideEffects"
                                    value={formData.sideEffects}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editMode ? 'Update Product' : 'Create Product'}
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="products-table-container">
                <h2>All Products ({products?.length || 0})</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.unique_id}</td>
                                        <td>
                                            <img src={product.imgsrc} alt={product.title} className="table-image" />
                                        </td>
                                        <td>{product.title}</td>
                                        <td>{product.category}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.countInStock}</td>
                                        <td className="actions-cell">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

    )
}

export default AdminScreen

