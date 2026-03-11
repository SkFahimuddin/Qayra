import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [myReview, setMyReview] = useState({ rating: 5, title: '', body: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([axios.get(`/api/products/${id}`), axios.get(`/api/reviews/product/${id}`)])
      .then(([p, r]) => { setProduct(p.data); setReviews(r.data); })
      .catch(() => toast.error('Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    await addToCart(product._id, qty);
    toast.success('Added to cart ✦');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    const added = await toggle(product._id);
    toast(added ? '✦ Added to wishlist' : 'Removed from wishlist');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); return; }
    try {
      const { data } = await axios.post(`/api/reviews/product/${id}`, myReview);
      setReviews(data);
      const p = await axios.get(`/api/products/${id}`);
      setProduct(p.data);
      setShowReviewForm(false);
      toast.success('Review submitted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner" /></div>;
  if (!product) return null;

  const stars = Math.round(product.avgRating || 0);

  return (
    <div className="page">
      <style>{`
        @media (max-width: 768px) {
          .product-detail-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
          .product-image-section { position: static !important; }
          .product-name { font-size: 30px !important; }
          .product-price { font-size: 28px !important; }
          .product-add-row { flex-wrap: wrap; }
          .review-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px; }
        }
      `}</style>

      <div className="container">
        {/* Breadcrumb */}
        <div style={s.breadcrumb}>
          <Link to="/" style={s.breadLink}>Home</Link>
          <span style={{ color: 'var(--border2)' }}> / </span>
          <Link to="/shop" style={s.breadLink}>Shop</Link>
          <span style={{ color: 'var(--border2)' }}> / </span>
          <span style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{product.name}</span>
        </div>

        {/* Main */}
        <div className="product-detail-layout" style={s.layout}>
          {/* Image */}
          <div className="product-image-section" style={s.imageSection}>
            <div style={s.imageWrap}>
              {product.images?.[0]
                ? <img src={`${API_BASE}${product.images[0]}`} alt={product.name} style={s.image} />
                : <div style={s.imagePlaceholder}><span style={{ fontSize: '80px', color: 'var(--border2)', opacity: 0.3 }}>✦</span></div>
              }
            </div>
          </div>

          {/* Info */}
          <div style={s.info}>
            <div style={s.category}>{product.category}</div>
            <h1 className="product-name" style={s.name}>{product.name}</h1>

            {(product.volume || product.concentration) && (
              <div style={s.specs}>{product.volume} · {product.concentration}</div>
            )}

            <div style={s.ratingRow}>
              <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= stars ? 'filled' : ''}`} style={{ fontSize: '18px' }}>★</span>)}</div>
              <span style={{ fontSize: '14px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</span>
            </div>

            <div style={s.priceRow}>
              <span className="product-price" style={s.price}>${product.price}</span>
              {product.originalPrice > product.price && (
                <span style={s.oldPrice}>${product.originalPrice}</span>
              )}
            </div>

            <p style={s.desc}>{product.description}</p>

            <div style={{ marginBottom: '20px' }}>
              <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                {product.stock > 0 ? `IN STOCK (${product.stock} left)` : 'SOLD OUT'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="product-add-row" style={s.addRow}>
                <div style={s.qtyWrap}>
                  <button onClick={() => setQty(Math.max(1, qty-1))} style={s.qtyBtn}>−</button>
                  <span style={s.qtyVal}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty+1))} style={s.qtyBtn}>+</button>
                </div>
                <button onClick={handleCart} className="btn btn-gold" style={{ flex: 1, letterSpacing: '3px', minWidth: '160px' }}>ADD TO CART</button>
                <button onClick={handleWishlist} style={s.wishBtn}>
                  <svg width="18" height="18" fill={isWishlisted(product._id) ? 'var(--gold)' : 'none'} stroke={isWishlisted(product._id) ? 'var(--gold)' : 'var(--text2)'} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
              </div>
            )}

            <div style={s.detailsBox}>
              {[['Category', product.category], ['Volume', product.volume], ['Concentration', product.concentration], ['Stock', product.stock]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={s.detailRow}>
                  <span style={s.detailKey}>{k}</span>
                  <span style={s.detailVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={s.reviewsSection}>
          <div className="review-header" style={s.reviewsHeader}>
            <h2 style={s.reviewsTitle}>REVIEWS <span style={{ color: 'var(--text3)', fontSize: '16px' }}>({reviews.length})</span></h2>
            {user && <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn btn-outline btn-sm">WRITE A REVIEW</button>}
          </div>

          {showReviewForm && (
            <form onSubmit={submitReview} style={s.reviewForm}>
              <div style={{ marginBottom: '16px' }}>
                <label style={s.reviewLabel}>RATING</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} onClick={() => setMyReview(r => ({ ...r, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px', color: n <= myReview.rating ? 'var(--gold)' : 'var(--border2)' }}>★</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={s.reviewLabel}>TITLE</label>
                <input value={myReview.title} onChange={e => setMyReview(r => ({ ...r, title: e.target.value }))} className="input" placeholder="Summarize your experience" style={{ marginTop: '6px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={s.reviewLabel}>REVIEW</label>
                <textarea value={myReview.body} onChange={e => setMyReview(r => ({ ...r, body: e.target.value }))} className="input" rows="4" placeholder="Share your thoughts..." style={{ marginTop: '6px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-gold btn-sm">SUBMIT</button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-dark btn-sm">CANCEL</button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontStyle: 'italic', padding: '32px 0' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={s.reviewsList}>
              {reviews.map(r => (
                <div key={r._id} style={s.reviewCard}>
                  <div style={s.reviewTop}>
                    <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= r.rating ? 'filled' : ''}`}>★</span>)}</div>
                    <span style={s.reviewAuthor}>{r.user?.name}</span>
                    <span style={s.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.title && <div style={s.reviewTitle}>{r.title}</div>}
                  {r.body && <p style={s.reviewBody}>{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  breadcrumb: { fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text3)', marginBottom: '32px', letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  breadLink: { color: 'var(--text3)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'flex-start', marginBottom: '64px' },
  imageSection: { position: 'sticky', top: '130px' },
  imageWrap: { border: '1px solid var(--border)', paddingBottom: '100%', position: 'relative', overflow: 'hidden', background: 'var(--surface)' },
  image: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: {},
  category: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '10px' },
  name: { fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '3px', color: 'var(--cream)', marginBottom: '8px', fontWeight: 400, lineHeight: 1.1 },
  specs: { fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text3)', marginBottom: '14px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  price: { fontFamily: 'var(--font-display)', fontSize: '34px', color: 'var(--gold)', letterSpacing: '2px' },
  oldPrice: { fontFamily: 'var(--font-ui)', fontSize: '18px', color: 'var(--text3)', textDecoration: 'line-through' },
  desc: { fontSize: '16px', color: 'var(--text2)', lineHeight: 1.9, fontStyle: 'italic', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' },
  addRow: { display: 'flex', gap: '12px', alignItems: 'stretch', marginBottom: '28px' },
  qtyWrap: { display: 'flex', alignItems: 'center', border: '1px solid var(--border)', background: 'var(--surface)' },
  qtyBtn: { width: '40px', height: '48px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '20px', cursor: 'pointer' },
  qtyVal: { width: '44px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text)', letterSpacing: '2px' },
  wishBtn: { width: '48px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  detailsBox: { border: '1px solid var(--border)' },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '14px' },
  detailKey: { color: 'var(--text3)', fontFamily: 'var(--font-ui)' },
  detailVal: { color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  reviewsSection: { borderTop: '1px solid var(--border)', paddingTop: '40px' },
  reviewsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  reviewsTitle: { fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '4px' },
  reviewForm: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px', marginBottom: '28px' },
  reviewLabel: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' },
  reviewCard: { background: 'var(--black)', padding: '20px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' },
  reviewAuthor: { fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '2px', color: 'var(--cream)' },
  reviewDate: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)', marginLeft: 'auto' },
  reviewTitle: { fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '1px', color: 'var(--text)', marginBottom: '6px' },
  reviewBody: { fontSize: '15px', color: 'var(--text2)', fontStyle: 'italic', lineHeight: 1.8 },
};