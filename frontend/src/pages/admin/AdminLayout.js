import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { path: '/admin', label: 'DASHBOARD', icon: '◈' },
  { path: '/admin/products', label: 'PRODUCTS', icon: '✦' },
  { path: '/admin/orders', label: 'ORDERS', icon: '◉' },
  { path: '/admin/users', label: 'CUSTOMERS', icon: '◎' },
  { path: '/admin/coupons', label: 'COUPONS', icon: '⬡' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
          .admin-main { padding: 20px 16px !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-topbar { display: none !important; }
          .admin-mobile-overlay { display: none !important; }
          .admin-sidebar-mobile { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar-desktop" style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandOrnament}>✦</div>
          <div style={s.brandName}>ITAR</div>
          <div style={s.brandSub}>ADMIN</div>
        </div>
        <nav style={s.nav}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ ...s.navItem, color: active ? 'var(--gold)' : 'var(--text3)', background: active ? 'rgba(201,168,76,0.07)' : 'transparent', borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}` }}>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={s.footer}>
          <div style={s.adminName}>{user?.name}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/" style={s.footerBtn} title="View store">↗</Link>
            <button onClick={() => { logout(); navigate('/login'); }} style={s.footerBtn} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="admin-mobile-topbar" style={s.mobileTopbar}>
        <button onClick={() => setSidebarOpen(true)} style={s.menuBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '6px', color: 'var(--cream)' }}>ITAR <span style={{ color: 'var(--text3)', fontSize: '10px', letterSpacing: '4px' }}>ADMIN</span></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/" style={s.footerBtn}>↗</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={s.footerBtn}>⏻</button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="admin-mobile-overlay" style={s.overlay} onClick={() => setSidebarOpen(false)}>
          <aside style={s.mobileSidebar} onClick={e => e.stopPropagation()}>
            <div style={{ ...s.brand, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={s.brandName}>ITAR</div>
                <div style={s.brandSub}>ADMIN</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <nav style={s.nav}>
              {NAV.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} style={{ ...s.navItem, color: active ? 'var(--gold)' : 'var(--text3)', background: active ? 'rgba(201,168,76,0.07)' : 'transparent', borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}` }}>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="admin-main" style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  sidebar: { width: '220px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  brand: { padding: '28px 24px 20px', borderBottom: '1px solid var(--border)', textAlign: 'center' },
  brandOrnament: { color: 'var(--gold)', fontSize: '12px', letterSpacing: '6px', marginBottom: '6px', opacity: 0.6 },
  brandName: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '8px', color: 'var(--cream)', lineHeight: 1 },
  brandSub: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '5px', color: 'var(--text3)', marginTop: '4px' },
  nav: { flex: 1, padding: '12px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '3px', transition: 'all 0.2s', textDecoration: 'none' },
  footer: { padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  adminName: { fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)', fontStyle: 'italic' },
  footerBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '13px', color: 'var(--text2)', textDecoration: 'none' },
  main: { flex: 1, padding: '32px', overflow: 'auto', paddingTop: '32px' },
  // Mobile
  mobileTopbar: { display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', zIndex: 200, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' },
  menuBtn: { background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex' },
  mobileSidebar: { width: '260px', background: 'var(--surface)', height: '100%', borderRight: '1px solid var(--border)', overflow: 'auto' },
};