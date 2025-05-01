import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import Cart from './pages/Cart/Cart';
import ProductDetails from './pages/ProductDetails/ProductDetails';

function App() {
  const isLoggedIn = true;

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn}>
        <Routes>
          <Route path="/" element={<Navigate to="/shop" replace />} />
          <Route path="/shop" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Navbar>
    </BrowserRouter>
  );
}

export default App;
