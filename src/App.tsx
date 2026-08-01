import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from '@/hooks/useI18n'
import { CartProvider, useCartContext } from '@/context/CartContext'
import Navbar from '@/components/layout/Navbar'
import Landing from '@/pages/Landing'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import OrderTracking from '@/pages/OrderTracking'
import Account from '@/pages/Account'
import AdminDashboard from '@/pages/admin/Dashboard'
import ShrimpAdmin from '@/pages/admin/ShrimpAdmin'
import OrdersAdmin from '@/pages/admin/OrdersAdmin'
import OrderDetail from '@/pages/admin/OrderDetail'
import DesignSystem from '@/pages/DesignSystem'

function AppRoutes() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useI18n()
  const cart = useCartContext()
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin')
  const isDesignSystem = location.pathname === '/design-system'
  const hideNav = isAdmin || isDesignSystem

  return (
    <>
      {!hideNav && (
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          cartItems={cart.items}
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing t={t} />} />
          <Route path="/shop" element={<Shop t={t} />} />
          <Route path="/products/:slug" element={<ProductDetail t={t} />} />
          <Route path="/cart" element={<Cart t={t} />} />
          <Route path="/orders/:id" element={<OrderTracking t={t} />} />
          <Route path="/account" element={<Account t={t} />} />
          <Route path="/admin" element={<AdminDashboard t={t} />} />
          <Route path="/admin/shrimp" element={<ShrimpAdmin t={t} />} />
          <Route path="/admin/orders" element={<OrdersAdmin t={t} />} />
          <Route path="/admin/orders/:id" element={<OrderDetail t={t} />} />
          <Route
            path="/design-system"
            element={
              <DesignSystem
                t={t}
                theme={theme}
                setTheme={setTheme}
                lang={lang}
                setLang={setLang}
              />
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen pt-14 flex items-center justify-center bg-background">
                <div className="text-center">
                  <p className="font-mono-label text-xs tracking-widest uppercase text-muted-foreground mb-3">404</p>
                  <h1 className="font-display italic text-4xl text-foreground mb-6">Page not found</h1>
                  <a href="/" className="text-xs font-mono-label uppercase tracking-widest text-accent hover:text-accent/80">
                    ← Return home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}
