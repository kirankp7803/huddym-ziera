import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#b91c1c', '#1d4ed8', '#15803d', '#92400e', '#1c1c1c'];

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [pincode, setPincode] = useState('');
    const [pincodeMsg, setPincodeMsg] = useState('');
    const [mainImg, setMainImg] = useState('');
    const [detailsOpen, setDetailsOpen] = useState(true);
    const [washOpen, setWashOpen] = useState(false);
    const [complimentaryProducts, setComplimentaryProducts] = useState([]);
    const [selectedComplements, setSelectedComplements] = useState(new Set());
    const [is360Mode, setIs360Mode] = useState(false);
    const [dragStartX, setDragStartX] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                const found = response.data.find(p => String(p.id) === String(id));
                setProduct(found);
                if (found) setMainImg(found.image);

                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                if (found && wishlist.some(item => item.id === found.id)) setIsWishlisted(true);

                if (found) {
                    // Category-aware complementary product pairing
                    const PAIRINGS = {
                        'Saree': ['Jewelry', 'Footwear', 'Accessories'],
                        'Lehenga': ['Jewelry', 'Footwear', 'Accessories'],
                        'Kurti': ['Jewelry', 'Pants', 'Footwear'],
                        'Churidar': ['Jewelry', 'Footwear', 'Accessories'],
                        'T-Shirt': ['Pants', 'Footwear', 'Accessories'],
                        'Pants': ['T-Shirt', 'Footwear'],
                        'Jewelry': ['Saree', 'Lehenga', 'Kurti'],
                        'Footwear': ['Saree', 'Pants', 'T-Shirt'],
                        'Accessories': ['Saree', 'T-Shirt', 'Kurti'],
                    };
                    const preferredCats = PAIRINGS[found.category] || ['Jewelry', 'Footwear', 'Accessories'];

                    // Get one item from each preferred category
                    const picked = [];
                    for (const cat of preferredCats) {
                        const match = response.data.find(p => p.category === cat && p.id !== found.id);
                        if (match && !picked.find(x => x.id === match.id)) picked.push(match);
                        if (picked.length >= 3) break;
                    }
                    setComplimentaryProducts(picked);
                    // All complements selected by default
                    setSelectedComplements(new Set(picked.map(p => p.id)));

                    // Similar products row at the bottom
                    const similar = response.data
                        .filter(p => p.category === found.category && String(p.id) !== String(found.id))
                        .slice(0, 6);
                    setSimilarProducts(similar);
                }
            } catch (err) {
                setError('Could not load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = (item, silent = false) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(item || product);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        if (!silent) alert('Added to cart!');
    };

    const buyNow = () => { addToCart(product, true); navigate('/cart'); };

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let updated;
        if (isWishlisted) { updated = wishlist.filter(i => i.id !== product.id); setIsWishlisted(false); }
        else { updated = [...wishlist, product]; setIsWishlisted(true); }
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    const checkPincode = () => {
        if (pincode.length === 6) setPincodeMsg('✓ Delivery available in 3-5 days');
        else setPincodeMsg('Enter a valid 6-digit pincode');
    };

    // Simulate discount
    const getDiscount = (price) => {
        const orig = Math.round(parseInt(price) * 1.4);
        const disc = Math.round(((orig - parseInt(price)) / orig) * 100);
        return { orig, disc };
    };

    if (loading) return <div className="pd-loading">Loading...</div>;
    if (error) return <div className="pd-error">{error}</div>;
    if (!product) return <div className="pd-error">Product not found</div>;

    const { orig, disc } = getDiscount(product.price);

    // Use product.images from backend if available, otherwise fallback to 5 copies of the main image
    const thumbnails = product.images && product.images.length > 0
        ? product.images
        : [product.image, product.image, product.image, product.image, product.image];

    // --- 360 Spin Drag Logic ---
    const handlePointerDown = (e) => {
        if (!is360Mode) return;
        setDragStartX(e.clientX || (e.touches && e.touches[0].clientX));
    };

    const handlePointerMove = (e) => {
        if (!is360Mode || dragStartX === null) return;

        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        if (!currentX) return;

        const delta = currentX - dragStartX;

        // Change frame every 25px dragged
        if (Math.abs(delta) > 25) {
            const currentIndex = thumbnails.indexOf(mainImg);
            const step = delta > 0 ? -1 : 1; // Drag right = rotate left

            let nextIndex = currentIndex + step;
            if (nextIndex < 0) nextIndex = thumbnails.length - 1;
            if (nextIndex >= thumbnails.length) nextIndex = 0;

            setMainImg(thumbnails[nextIndex]);
            setDragStartX(currentX); // Reset start anchor
        }
    };

    const handlePointerUp = () => setDragStartX(null);

    // --- Video helper ---
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };
    const isVideoDirect = product?.videoUrl?.match(/\.(mp4|webm|ogg)$/i);
    const hasMediaSpin = product?.videoUrl || thumbnails.length > 1;

    return (
        <div className="pd-page">
            <button onClick={() => window.history.back()} className="pd-back-btn">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="pd-layout">
                {/* ── LEFT: Image Gallery ── */}
                <div className="pd-gallery">
                    {/* Thumbnails */}
                    <div className="pd-thumbs">
                        {thumbnails.map((img, i) => (
                            <div
                                key={i}
                                className={`pd-thumb ${mainImg === img && i === 0 ? 'active' : ''}`}
                                onClick={() => setMainImg(img)}
                            >
                                <img src={img} alt={`thumb-${i}`} />
                                {i === 0 && <span className="pd-sale-badge">Sale</span>}
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div
                        className="pd-main-img-wrap"
                        style={{
                            background: '#f0ebe5',
                            cursor: (is360Mode && !product.videoUrl) ? (dragStartX ? 'grabbing' : 'grab') : 'default',
                            touchAction: (is360Mode && !product.videoUrl) ? 'none' : 'auto'
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        {is360Mode && product.videoUrl ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                                {isVideoDirect ? (
                                    <video src={product.videoUrl} autoPlay loop controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <iframe
                                        src={getEmbedUrl(product.videoUrl)}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Product Video"
                                    />
                                )}
                            </div>
                        ) : (
                            <>
                                <img src={mainImg} alt={product.name} className="pd-main-img" style={{ pointerEvents: (is360Mode && !product.videoUrl) ? 'none' : 'auto' }} />

                                {/* 360 Mode Drag Overlay (Only if no video and in spin mode) */}
                                {is360Mode && !product.videoUrl && (
                                    <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
                                        <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            ← DRAG TO SPIN →
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pd-img-actions">
                            <button className="pd-img-action-btn" onClick={toggleWishlist} title="Wishlist">
                                <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#444'} />
                            </button>
                            <button className="pd-img-action-btn" title="Share">
                                <Share2 size={17} color="#444" />
                            </button>

                            {hasMediaSpin && (
                                <button
                                    className="pd-img-action-btn"
                                    title={product.videoUrl ? "Product Video" : "360° Spin"}
                                    onClick={() => setIs360Mode(!is360Mode)}
                                    style={{ background: is360Mode ? '#e63946' : 'rgba(255,255,255,0.9)', color: is360Mode ? '#fff' : '#1c1c1c' }}
                                >
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>
                                        {product.videoUrl ? 'VIDEO' : '360°'}
                                    </span>
                                </button>
                            )}
                        </div>
                        <span className="pd-sale-badge main">Sale</span>
                    </div>
                </div>

                {/* ── RIGHT: Product Info ── */}
                <div className="pd-info">
                    <h1 className="pd-title">{product.name.toUpperCase()}</h1>

                    {/* Price */}
                    <div className="pd-price-row">
                        <span className="pd-price">₹{parseInt(product.price).toLocaleString('en-IN')}</span>
                        <span className="pd-mrp">MRP ₹{orig.toLocaleString('en-IN')}</span>
                        <span className="pd-disc">{disc}% OFF</span>
                    </div>
                    <p className="pd-tax-note">Inclusive of all taxes</p>

                    {/* Color Selection */}
                    <div className="pd-section">
                        <h4 className="pd-section-label">SELECT COLOR</h4>
                        <div className="pd-color-row">
                            {COLORS.map((c, idx) => (
                                <button
                                    key={c}
                                    className={`pd-color-btn ${selectedColor === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => {
                                        setSelectedColor(c);
                                        // map the color index to one of the 5 product images
                                        if (thumbnails && thumbnails.length > 0) {
                                            setMainImg(thumbnails[idx % thumbnails.length]);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="pd-section">
                        <div className="pd-section-header">
                            <h4 className="pd-section-label">SELECT SIZE</h4>
                            <span className="pd-size-guide">📐 Size Guide</span>
                        </div>
                        <div className="pd-size-row">
                            {SIZES.map(s => (
                                <button
                                    key={s}
                                    className={`pd-size-btn ${selectedSize === s ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        {selectedSize && <p className="pd-size-note">Size {selectedSize} selected</p>}
                    </div>

                    {/* CTA Buttons */}
                    <div className="pd-cta-row">
                        <button className="pd-btn-bag" onClick={() => addToCart(product)}>
                            ADD TO BAG
                        </button>
                        <button className="pd-btn-buy" onClick={buyNow}>
                            BUY NOW
                        </button>
                    </div>

                    {/* Delivery */}
                    <div className="pd-delivery-section">
                        <h4 className="pd-section-label">DELIVERY</h4>
                        <div className="pd-pincode-row">
                            <input
                                className="pd-pincode-input"
                                type="text"
                                maxLength={6}
                                placeholder="Enter pincode"
                                value={pincode}
                                onChange={e => setPincode(e.target.value.replace(/\D/, ''))}
                            />
                            <button className="pd-check-btn" onClick={checkPincode}>CHECK</button>
                        </div>
                        {pincodeMsg && <p className={`pd-pincode-msg ${pincodeMsg.startsWith('✓') ? 'ok' : 'err'}`}>{pincodeMsg}</p>}
                    </div>

                    {/* Trust Badges */}
                    <div className="pd-trust-grid">
                        {[
                            { icon: '🚚', label: 'Free Shipping' },
                            { icon: '↩️', label: 'Non-Returnable' },
                            { icon: '✅', label: 'Assured Quality' },
                            { icon: '💵', label: 'COD Available' },
                        ].map(b => (
                            <div key={b.label} className="pd-trust-item">
                                <span className="pd-trust-icon">{b.icon}</span>
                                <span className="pd-trust-label">{b.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Product Details Accordion */}
                    <div className="pd-accordion">
                        <button className="pd-accordion-hdr" onClick={() => setDetailsOpen(!detailsOpen)}>
                            <span>PRODUCT DETAILS</span>
                            {detailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {detailsOpen && (
                            <div className="pd-accordion-body">
                                <p className="pd-desc-text">{product.description}</p>
                                <div className="pd-specs-grid">
                                    <div><span className="spec-key">Category</span><span className="spec-val">{product.category}</span></div>
                                    <div><span className="spec-key">Fabric</span><span className="spec-val">Premium</span></div>
                                    <div><span className="spec-key">Pattern</span><span className="spec-val">Printed</span></div>
                                    <div><span className="spec-key">Fit</span><span className="spec-val">Regular</span></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Wash & Care Accordion */}
                    <div className="pd-accordion">
                        <button className="pd-accordion-hdr" onClick={() => setWashOpen(!washOpen)}>
                            <span>WASH & CARE</span>
                            {washOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {washOpen && (
                            <div className="pd-accordion-body">
                                <p className="pd-desc-text">Machine wash cold. Do not bleach. Tumble dry low. Iron on low heat if needed.</p>
                            </div>
                        )}
                    </div>

                    {/* Complete the Look */}
                    {complimentaryProducts.length > 0 && (() => {
                        const toggleComplement = (itemId) => {
                            setSelectedComplements(prev => {
                                const next = new Set(prev);
                                next.has(itemId) ? next.delete(itemId) : next.add(itemId);
                                return next;
                            });
                        };

                        const selectedItems = complimentaryProducts.filter(p => selectedComplements.has(p.id));
                        const lookTotal = selectedItems.reduce((sum, p) => sum + parseInt(p.price), parseInt(product.price));
                        const lookMRP = Math.round(lookTotal * 1.35);
                        const lookSave = lookMRP - lookTotal;

                        return (
                            <div className="pd-complete-look">
                                <h4 className="pd-section-label" style={{ marginBottom: '0.5rem' }}>COMPLETE THE LOOK</h4>
                                <p className="pd-look-subtitle">Select items to pair with this {product.category}</p>

                                <div className="pd-look-bundle">
                                    {/* Main product — always included */}
                                    <div className="pd-look-item main-item">
                                        <div className="pd-look-img-wrap">
                                            <img src={product.image} alt={product.name} />
                                            <span className="pd-look-this-badge">THIS</span>
                                        </div>
                                        <p className="pd-look-item-name">{product.name}</p>
                                        <p className="pd-look-item-price">₹{parseInt(product.price).toLocaleString('en-IN')}</p>
                                    </div>

                                    {complimentaryProducts.map((item, i) => {
                                        const isSelected = selectedComplements.has(item.id);
                                        return (
                                            <>
                                                <span key={`plus-${i}`} className="pd-look-plus">{isSelected ? '+' : '–'}</span>
                                                <div
                                                    key={item.id}
                                                    className={`pd-look-item selectable ${isSelected ? 'selected' : 'deselected'}`}
                                                >
                                                    {/* Select toggle button */}
                                                    <button
                                                        className={`pd-look-select-btn ${isSelected ? 'on' : 'off'}`}
                                                        onClick={() => toggleComplement(item.id)}
                                                        title={isSelected ? 'Remove from look' : 'Add to look'}
                                                    >
                                                        {isSelected ? '✓' : '+'}
                                                    </button>

                                                    <div
                                                        className="pd-look-img-wrap"
                                                        onClick={() => navigate(`/product/${item.id}`)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1515562141122-7a429b8208cb?w=400&q=80'; }}
                                                            style={{ opacity: isSelected ? 1 : 0.4 }}
                                                        />
                                                    </div>
                                                    <p className="pd-look-item-name">{item.name}</p>
                                                    <p className="pd-look-item-price" style={{ color: isSelected ? '#e63946' : '#aaa' }}>
                                                        ₹{parseInt(item.price).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Total + CTA */}
                                <div className="pd-look-total-row">
                                    <div className="pd-look-total-info">
                                        <span className="pd-look-total-label">
                                            Total ({selectedItems.length + 1} item{selectedItems.length !== 0 ? 's' : ''})
                                        </span>
                                        <div className="pd-look-price-block">
                                            <span className="pd-look-total-price">₹{lookTotal.toLocaleString('en-IN')}</span>
                                            <span className="pd-look-mrp">MRP ₹{lookMRP.toLocaleString('en-IN')}</span>
                                            <span className="pd-look-save">Save ₹{lookSave.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="pd-look-add-all-btn"
                                        disabled={selectedItems.length === 0}
                                        onClick={() => {
                                            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                                            cart.push(product);
                                            selectedItems.forEach(p => cart.push(p));
                                            localStorage.setItem('cart', JSON.stringify(cart));
                                            window.dispatchEvent(new Event('cartUpdated'));
                                            alert(`${selectedItems.length + 1} items added to your bag!`);
                                        }}
                                    >
                                        ADD {selectedItems.length + 1} ITEMS TO BAG
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Reviews */}
                    <div className="pd-reviews">
                        <div className="pd-reviews-hdr">
                            <h4 className="pd-section-label">RATINGS & REVIEWS</h4>
                            <button className="pd-write-review-btn" onClick={() => navigate('/write-review', { state: { productName: product.name } })}>
                                Write a Review
                            </button>
                        </div>
                        {[
                            { name: 'Priya Sharma', rating: 5, text: 'Absolutely beautiful! Quality is amazing.' },
                            { name: 'Anjali Gupta', rating: 4, text: 'Fast delivery and excellent packaging.' },
                            { name: 'Sneha Patel', rating: 5, text: 'Got so many compliments at the wedding!' },
                        ].map((r, i) => (
                            <div key={i} className="pd-review-item">
                                <div className="pd-review-top">
                                    <span className="pd-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    <span className="pd-review-name">{r.name}</span>
                                </div>
                                <p className="pd-review-text">{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM: Similar Products ── */}
            {similarProducts.length > 0 && (
                <div className="pd-similar-section">
                    <div className="pd-similar-hdr">
                        <h3 className="pd-similar-title">SIMILAR PRODUCTS</h3>
                        <p className="pd-similar-sub">Explore more from this category</p>
                    </div>
                    <div className="pd-similar-grid">
                        {similarProducts.map(item => (
                            <div key={item.id} className="pd-similar-card" onClick={() => {
                                navigate(`/product/${item.id}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                                <div className="pd-similar-img-wrap">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="pd-similar-info">
                                    <h5 className="pd-similar-name">{item.name}</h5>
                                    <div className="pd-similar-price-row">
                                        <span className="pd-similar-price">₹{parseInt(item.price).toLocaleString('en-IN')}</span>
                                        <span className="pd-similar-mrp">₹{Math.round(parseInt(item.price) * 1.4).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
