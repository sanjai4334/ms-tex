import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import Cart from './pages/Cart/Cart';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Profile from './pages/Profile/Profile';
import Admin from './pages/admin/admin';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar isLoggedIn={isLoggedIn}>
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/shop" replace />} />
                    <Route path="/shop" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                  </Routes>
                </main>
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
