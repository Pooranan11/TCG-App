import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import TournamentsPage from './pages/TournamentsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
