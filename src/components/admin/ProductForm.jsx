import React, { useState, useEffect } from "react";
import api from "../../api";

const ProductForm = ({ product, onClose, onSuccess, setMessage }) => {
    const isEditMode = !!product;
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        category: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                price: product.price || "",
                category: product.category || "",
            });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (image) {
            data.append("image", image);
        }

        try {
            let res;
            if (isEditMode) {
                res = await api.patch(`products/update/${product.id}/`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                res = await api.post("products/create/", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            if (res.data.success) {
                setMessage({ type: "success", text: res.data.message || (isEditMode ? "Product updated successfully" : "Product created successfully") });
                onSuccess();
            } else {
                setMessage({ type: "danger", text: res.data.message || "Operation failed" });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "danger", text: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content shadow">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{isEditMode ? "Edit Product" : "Add New Product"}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body overflow-auto" style={{ maxHeight: "450px" }}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Slug</label>
                                <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleInputChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="3" required></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Price</label>
                                    <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Category</label>
                                    <select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                                        <option value="">Select a category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Groceries">Groceries</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Product Image</label>
                                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required={!isEditMode} />
                                {isEditMode && <small className="text-muted">Leave empty to keep current image</small>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Saving..." : (isEditMode ? "Update Product" : "Create Product")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
