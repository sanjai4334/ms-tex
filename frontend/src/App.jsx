import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import Cart from './pages/Cart/Cart';

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
        </Routes>
      </Navbar>
    </BrowserRouter>
  );
}

export default App;
