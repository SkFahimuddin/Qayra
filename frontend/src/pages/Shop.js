import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SORTS = [['newest', 'Newest'], ['price_asc', 'Price: Low→High'], ['price_desc', 'Price: High→Low'], ['rating', 'Top Rated']];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    axios.get('/api/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category !== 'all') p.set('category', category);
    p.set('page', page); p.set('limit', 12); p.set('sort', sort);
    axios.get(`/api/products?${p}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [search, category, page, sort]);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, val); p.delete('page');
    setSearchParams(p);
    setShowFilters(false);
  };

  return (
    <div className="page">
      <style>{`
        @media (max-width: 768px) {
          .shop-layout { flex-direction: column !important; }
          .shop-sidebar { width: 100% !important; position: static !important; }
          .shop-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px; }
          .shop-header-sort { width: 100% !important; }
          .mobile-filter-btn { display: flex !important; }
          .sidebar-desktop { display: none; }
        }
        @media (min-width: 769px) {
          .mobile-filter-btn { display: none !important; }
          .sidebar-desktop { display: block; }
          .sidebar-mobile-drawer { display: none !important; }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="shop-header" style={s.header}>
          <div>
            <span className="section-label">THE COLLECTION</span>
            <h1 className="section-title" style={{ marginBottom: 0, fontSize: '28px' }}>
              {search ? `"${search.toUpperCase()}"` : category !== 'all' ? category.toUpperCase() : 'ALL FRAGRANCES'}
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '6px', fontStyle: 'italic' }}>{total} fragrances</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
            {/* Mobile filter toggle */}
            <button
              className="mobile-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', display: 'none', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              ☰ FILTER {category !== 'all' ? `(${category})` : ''}
            </button>
            <select value={sort} onChange={e => set('sort', e.target.value)} className="input shop-header-sort" style={{ flex: 1 }}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '12px' }}>COLLECTIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => set('category', cat)}
                  style={{
                    padding: '8px 16px',
                    background: category === cat ? 'var(--gold)' : 'var(--surface2)',
                    color: category === cat ? 'var(--black)' : 'var(--text3)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontSize: '10px',
                    letterSpacing: '2px',
                  }}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="shop-layout" style={s.layout}>
          {/* Desktop Sidebar */}
          <aside className="sidebar-desktop" style={s.sidebar}>
            <div style={s.filterBlock}>
              <div style={s.filterTitle}>COLLECTIONS</div>
              {['all', ...categories].map(cat => (
                <button key={cat} onClick={() => set('category', cat)} style={{ ...s.filterBtn, color: category === cat ? 'var(--gold)' : 'var(--text3)', background: category === cat ? 'rgba(201,168,76,0.07)' : 'transparent', borderLeft: `2px solid ${category === cat ? 'var(--gold)' : 'transparent'}` }}>
                  {cat === 'all' ? 'All Fragrances' : cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '48px', color: 'var(--border2)', marginBottom: '16px' }}>✦</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '4px', color: 'var(--text3)' }}>NO FRAGRANCES FOUND</h3>
                <p style={{ color: 'var(--text3)', marginTop: '8px', fontStyle: 'italic' }}>Try a different search or category</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div style={s.pagination}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => set('page', p)} style={{ ...s.pageBtn, background: page === p ? 'var(--gold)' : 'transparent', color: page === p ? 'var(--black)' : 'var(--text3)', borderColor: page === p ? 'var(--gold)' : 'var(--border)' }}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  sidebar: { width: '200px', flexShrink: 0, position: 'sticky', top: '130px' },
  filterBlock: { borderTop: '1px solid var(--border)' },
  filterTitle: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', padding: '16px 0 12px', marginBottom: '4px' },
  filterBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-body)', fontStyle: 'italic', transition: 'all 0.2s', marginBottom: '2px' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' },
  pageBtn: { width: '38px', height: '38px', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px', transition: 'all 0.2s' },
};