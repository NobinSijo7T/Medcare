import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/actions/cartActions";
import axios from "axios";
import "../styles/PrescriptionScreen.css";

// Force dark theme on this page
const useDarkPage = () => {
    useEffect(() => {
        const body = document.body;
        const app = document.querySelector('.app');
        const footer = document.querySelector('.modern-footer');

        // Save originals
        const origBodyBg = body.style.background;
        const origAppBg = app?.style.background;
        const origAppPt = app?.style.paddingTop;
        const origFooterMt = footer?.style.marginTop;
        const origFooterBg = footer?.style.backgroundColor;

        // Apply dark overrides
        body.style.background = '#0a0a0a';
        if (app) {
            app.style.background = '#0a0a0a';
            app.style.paddingTop = '0';
        }
        if (footer) {
            footer.style.marginTop = '0';
            footer.style.backgroundColor = '#0a0a0a';
        }

        return () => {
            body.style.background = origBodyBg;
            if (app) {
                app.style.background = origAppBg;
                app.style.paddingTop = origAppPt;
            }
            if (footer) {
                footer.style.marginTop = origFooterMt;
                footer.style.backgroundColor = origFooterBg;
            }
        };
    }, []);
};

const PrescriptionScreen = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    useDarkPage();

    // State
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState({});
    const [quantities, setQuantities] = useState({});
    const [isDragOver, setIsDragOver] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [analyzeStep, setAnalyzeStep] = useState(0);

    // Drag and Drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFileSelect(file);
        }
    }, []);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
        setAddedProducts({});
        setQuantities({});
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setAnalysisResult(null);
        setError(null);
        setAddedProducts({});
        setQuantities({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Animated analysis steps
    useEffect(() => {
        if (isAnalyzing) {
            const steps = [0, 1, 2, 3];
            let currentIdx = 0;
            setAnalyzeStep(0);
            const interval = setInterval(() => {
                currentIdx++;
                if (currentIdx < steps.length) {
                    setAnalyzeStep(currentIdx);
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isAnalyzing]);

    // Analyze prescription
    const analyzePrescription = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);
        setAddedProducts({});

        try {
            const formData = new FormData();
            formData.append("prescription", selectedFile);

            const { data } = await axios.post("/api/prescription/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000, // 60 second timeout for AI processing
            });

            setAnalysisResult(data);

            // Initialize quantities for matched products
            const initQty = {};
            data.matchedProducts.forEach((p) => {
                initQty[p._id] = 1;
            });
            setQuantities(initQty);
        } catch (err) {
            console.error("Prescription analysis failed:", err);
            setError(
                err.response?.data?.message ||
                "Failed to analyze prescription. Please try again."
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Add single product to cart
    const handleAddToCart = (product) => {
        const qty = quantities[product._id] || 1;
        dispatch(addToCart(product._id, qty));
        setAddedProducts((prev) => ({ ...prev, [product._id]: true }));
        showToast(`${product.title} added to cart!`);
    };

    // Add all matched products to cart
    const handleAddAllToCart = () => {
        if (!analysisResult?.matchedProducts) return;
        analysisResult.matchedProducts.forEach((product) => {
            const qty = quantities[product._id] || 1;
            dispatch(addToCart(product._id, qty));
            setAddedProducts((prev) => ({ ...prev, [product._id]: true }));
        });
        showToast(
            `All ${analysisResult.matchedProducts.length} medicines added to cart!`
        );
    };

    const updateQuantity = (productId, delta) => {
        setQuantities((prev) => {
            const current = prev[productId] || 1;
            const newQty = Math.max(1, Math.min(10, current + delta));
            return { ...prev, [productId]: newQty };
        });
    };

    // Toast notification
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    };

    const allAdded =
        analysisResult?.matchedProducts?.length > 0 &&
        analysisResult.matchedProducts.every((p) => addedProducts[p._id]);

    return (
        <div className="prescription-screen">
            {/* Header */}
            <div className="prescription-header">
                <h1>AI Prescription Order</h1>
                <p>
                    Upload your prescription and our AI will instantly identify medicines
                    and add them to your cart — powered by Meta's Llama 4 Scout.
                </p>
            </div>

            <div className="prescription-content">
                {/* How It Works */}
                {!analysisResult && (
                    <div className="how-it-works">
                        <div className="how-step">
                            <div className="how-step-number">1</div>
                            <span className="how-step-icon">📸</span>
                            <h3>Upload Prescription</h3>
                            <p>Take a photo or upload an image of your doctor's prescription</p>
                        </div>
                        <div className="how-step">
                            <div className="how-step-number">2</div>
                            <span className="how-step-icon">🧠</span>
                            <h3>AI Analysis</h3>
                            <p>
                                Our AI reads and identifies all medicines using Llama 4 Scout
                                vision
                            </p>
                        </div>
                        <div className="how-step">
                            <div className="how-step-number">3</div>
                            <span className="how-step-icon">🛒</span>
                            <h3>Auto-Add to Cart</h3>
                            <p>Matched products are automatically available to add to your cart</p>
                        </div>
                    </div>
                )}

                {/* Upload Card */}
                <div className="prescription-upload-card">
                    <div
                        className={`prescription-dropzone ${isDragOver ? "drag-over" : ""} ${previewUrl ? "has-image" : ""
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !previewUrl && fileInputRef.current?.click()}
                    >
                        {!previewUrl ? (
                            <>
                                <span className="dropzone-icon">📋</span>
                                <div className="dropzone-title">
                                    Drop your prescription here or{" "}
                                    <span className="dropzone-browse">browse files</span>
                                </div>
                                <div className="dropzone-subtitle">
                                    Supports JPEG, PNG, WebP — Max 10MB
                                </div>
                                <div className="dropzone-formats">
                                    <span className="format-tag">JPG</span>
                                    <span className="format-tag">PNG</span>
                                    <span className="format-tag">WebP</span>
                                    <span className="format-tag">BMP</span>
                                </div>
                            </>
                        ) : (
                            <div className="prescription-preview">
                                <div className="preview-container">
                                    <img
                                        src={previewUrl}
                                        alt="Prescription preview"
                                        className="preview-image"
                                    />
                                    <div className="preview-overlay">
                                        <div className="preview-info">
                                            <div className="preview-info-icon">✓</div>
                                            <div className="preview-info-text">
                                                <h4>{selectedFile?.name}</h4>
                                                <p>{formatFileSize(selectedFile?.size || 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="preview-remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile();
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="prescription-file-input"
                        onChange={handleFileInputChange}
                    />

                    <div className="analyze-btn-container">
                        <button
                            className="analyze-btn"
                            onClick={analyzePrescription}
                            disabled={!selectedFile || isAnalyzing}
                        >
                            <span className="analyze-btn-icon">🔬</span>
                            {isAnalyzing
                                ? "Analyzing..."
                                : analysisResult
                                    ? "Re-Analyze"
                                    : "Analyze Prescription"}
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="prescription-error">
                        <span className="prescription-error-icon">⚠️</span>
                        <h3>Analysis Failed</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={analyzePrescription}>
                            🔄 Try Again
                        </button>
                    </div>
                )}

                {/* Results */}
                {analysisResult && (
                    <div className="prescription-results">
                        {/* Summary Cards */}
                        <div className="results-summary">
                            <div className="summary-card">
                                <span className="summary-card-icon">💊</span>
                                <span className="summary-card-value">
                                    {analysisResult.extractedMedicines?.length || 0}
                                </span>
                                <span className="summary-card-label">Medicines Detected</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-card-icon">✅</span>
                                <span className="summary-card-value">
                                    {analysisResult.matchedProducts?.length || 0}
                                </span>
                                <span className="summary-card-label">Products Matched</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-card-icon">⚡</span>
                                <span className="summary-card-value">
                                    {analysisResult.unmatchedMedicines?.length || 0}
                                </span>
                                <span className="summary-card-label">Not In Store</span>
                            </div>
                        </div>

                        {/* Extracted Medicines Tags */}
                        {analysisResult.extractedMedicines?.length > 0 && (
                            <div className="extracted-medicines">
                                <div className="section-title">
                                    <div className="section-title-icon purple">🧬</div>
                                    Detected Medicines from Prescription
                                </div>
                                <div className="medicine-tags">
                                    {analysisResult.extractedMedicines.map((med, idx) => {
                                        const isMatched = !analysisResult.unmatchedMedicines?.includes(
                                            med
                                        );
                                        return (
                                            <span
                                                key={idx}
                                                className={`medicine-tag ${isMatched ? "matched" : "unmatched"
                                                    }`}
                                            >
                                                <span className="medicine-tag-dot"></span>
                                                {med}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Matched Products */}
                        {analysisResult.matchedProducts?.length > 0 && (
                            <div className="matched-products-section">
                                <div className="section-title">
                                    <div className="section-title-icon green">🛒</div>
                                    Available Products — Ready to Add
                                </div>

                                <div className="products-grid">
                                    {analysisResult.matchedProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className={`product-match-card ${addedProducts[product._id] ? "added" : ""
                                                }`}
                                        >
                                            <div className="product-card-header">
                                                <img
                                                    src={product.imgsrc}
                                                    alt={product.title}
                                                    className="product-card-img"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/200x160?text=Medicine";
                                                    }}
                                                />
                                                <span className="product-card-category">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <div className="product-card-body">
                                                <div className="product-card-title">{product.title}</div>
                                                <div className="product-card-indication">
                                                    {product.indication || "Medical product"}
                                                </div>

                                                <div className="qty-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(product._id, -1)}
                                                        disabled={addedProducts[product._id]}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="qty-value">
                                                        {quantities[product._id] || 1}
                                                    </span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(product._id, 1)}
                                                        disabled={addedProducts[product._id]}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div
                                                    className="product-card-footer"
                                                    style={{ marginTop: "0.75rem" }}
                                                >
                                                    <div className="product-card-price">
                                                        ₹{product.price}
                                                        <span> /unit</span>
                                                    </div>
                                                    <button
                                                        className={`add-to-cart-btn ${addedProducts[product._id] ? "added" : ""
                                                            }`}
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={addedProducts[product._id]}
                                                    >
                                                        {addedProducts[product._id] ? (
                                                            <>✓ Added</>
                                                        ) : (
                                                            <>🛒 Add</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="add-all-container">
                                    <button
                                        className="add-all-btn"
                                        onClick={handleAddAllToCart}
                                        disabled={allAdded}
                                    >
                                        {allAdded ? (
                                            <>✅ All Added to Cart</>
                                        ) : (
                                            <>🛒 Add All {analysisResult.matchedProducts.length} to Cart</>
                                        )}
                                    </button>
                                    {Object.keys(addedProducts).length > 0 && (
                                        <Link to="/cart" className="go-to-cart-btn">
                                            🛍️ Go to Cart
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Unmatched Medicines */}
                        {analysisResult.unmatchedMedicines?.length > 0 && (
                            <div className="unmatched-section">
                                <div className="section-title">
                                    <div className="section-title-icon amber">⚡</div>
                                    Not Available in Store
                                </div>
                                <p
                                    style={{
                                        color: "rgba(255,255,255,0.4)",
                                        fontSize: "0.85rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    These medicines were identified but are not currently in our
                                    inventory. Please consult a nearby pharmacy.
                                </p>
                                <div className="unmatched-list">
                                    {analysisResult.unmatchedMedicines.map((med, idx) => (
                                        <span key={idx} className="unmatched-item">
                                            {med}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Analyzing Overlay */}
            {isAnalyzing && (
                <div className="analyzing-overlay">
                    <div className="analyzing-animation">
                        <div className="analyzing-ring"></div>
                        <div className="analyzing-ring"></div>
                        <div className="analyzing-ring"></div>
                        <span className="analyzing-center-icon">🧠</span>
                    </div>
                    <div className="analyzing-text">
                        <h3>AI is Reading Your Prescription</h3>
                        <p>Powered by Meta Llama 4 Scout Vision</p>
                    </div>
                    <div className="analyzing-steps">
                        <div
                            className={`analyzing-step ${analyzeStep >= 0 ? (analyzeStep > 0 ? "done" : "active") : ""
                                }`}
                        >
                            <span className="step-icon">
                                {analyzeStep > 0 ? "✅" : "🔄"}
                            </span>
                            <span className="step-text">Uploading prescription image...</span>
                        </div>
                        <div
                            className={`analyzing-step ${analyzeStep >= 1 ? (analyzeStep > 1 ? "done" : "active") : ""
                                }`}
                        >
                            <span className="step-icon">
                                {analyzeStep > 1 ? "✅" : analyzeStep === 1 ? "🔄" : "⏳"}
                            </span>
                            <span className="step-text">
                                AI analyzing prescription with vision model...
                            </span>
                        </div>
                        <div
                            className={`analyzing-step ${analyzeStep >= 2 ? (analyzeStep > 2 ? "done" : "active") : ""
                                }`}
                        >
                            <span className="step-icon">
                                {analyzeStep > 2 ? "✅" : analyzeStep === 2 ? "🔄" : "⏳"}
                            </span>
                            <span className="step-text">
                                Extracting medicine names...
                            </span>
                        </div>
                        <div
                            className={`analyzing-step ${analyzeStep >= 3 ? "active" : ""
                                }`}
                        >
                            <span className="step-icon">
                                {analyzeStep >= 3 ? "🔄" : "⏳"}
                            </span>
                            <span className="step-text">
                                Matching with store products...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toastMessage && (
                <div className="success-toast">
                    <span className="toast-icon">✅</span>
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default PrescriptionScreen;
