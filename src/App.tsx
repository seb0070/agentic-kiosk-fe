import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { SessionContext } from './store/sessionStore';
import Start from './pages/Start';
import Home from './pages/Home';
import Cart from './pages/Cart';
import PaymentComplete from './pages/PaymentComplete';

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <SessionContext.Provider value={{ sessionId }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-complete" element={<PaymentComplete />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

export default App;
