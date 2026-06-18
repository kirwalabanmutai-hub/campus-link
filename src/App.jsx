import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home      from './pages/Home'
import Services  from './pages/Services'
import Gigs      from './pages/Gigs'
import AICareer  from './pages/AICareer'
import Wallet    from './pages/Wallet'
import Dashboard from './pages/Dashboard'
import Login     from './pages/Login'
import Register  from './pages/Register'
import NotFound  from './pages/NotFound'

const AUTH_ROUTES = ['/login', '/register']

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isAuth = AUTH_ROUTES.includes(pathname)

  return (
    <div className="app-shell">
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/gigs"      element={<Gigs />} />
        <Route path="/career"    element={<AICareer />} />
        <Route path="/wallet"    element={<Wallet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
      {!isAuth && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Layout />
    </BrowserRouter>
  )
}
