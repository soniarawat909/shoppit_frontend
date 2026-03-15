import React, { useState, useEffect } from "react";
import api, { BACKEND_BASE } from "../../api";
import ProductForm from "./ProductForm";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showForm, setShowForm] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("products");
            // Standardized response: { success: true/false, message: "...", data: [] }
            // If the backend is refactored to use ApiResponse, data might be in res.data.data
            // However, the existing HomePage logic uses res.data directly.
            // Let's check both or follow the backend message.
            if (res.data.success) {
                setProducts(res.data.data);
            } else if (Array.isArray(res.data)) {
                setProducts(res.data);
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "danger", text: "Failed to fetch products" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await api.delete(`products/delete/${id}/`);
            if (res.data.success) {
                setMessage({ type: "success", text: res.data.message || "Product deleted successfully" });
                fetchProducts();
            } else {
                setMessage({ type: "danger", text: res.data.message || "Failed to delete product" });
            }
        } catch (err) {
            setMessage({ type: "danger", text: "Error deleting product" });
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setShowForm(true);
    };

    const handleAdd = () => {
        setCurrentProduct(null);
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        fetchProducts();
    };

    if (loading) return <div className="container py-5">Loading...</div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard - Manage Products</h2>
                <button className="btn btn-primary" onClick={handleAdd}>Add New Product</button>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={`${BACKEND_BASE}${product.image}`}
                                        alt={product.name}
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category_name || product.category}</td>
                                <td>${product.price}</td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ProductForm
                    product={currentProduct}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSubmit}
                    setMessage={setMessage}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
