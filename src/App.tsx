import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { SessionContext } from './store/sessionStore';
import { VoiceProvider } from './store/voiceStore';
import Start from './pages/Start';
import Home from './pages/Home';
import Cart from './pages/Cart';
import PaymentComplete from './pages/PaymentComplete';
import PaymentWaiting from './pages/PaymentWaiting';

const DESIGN_WIDTH = 430;

function KioskScaler({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const [designHeight, setDesignHeight] = useState(window.innerHeight);

  useEffect(() => {
    const update = () => {
      const containerWidth = Math.min(window.innerWidth, window.innerHeight * 0.5625);
      const s = containerWidth / DESIGN_WIDTH;
      setScale(s);
      setDesignHeight(window.innerHeight / s);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{
        width: `${DESIGN_WIDTH}px`,
        height: `${designHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const resetSession = useCallback(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId, resetSession }}>
      <BrowserRouter>
        <VoiceProvider>
          <KioskScaler>
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment-complete" element={<PaymentComplete />} />
              <Route path="/payment-waiting" element={<PaymentWaiting />} />
            </Routes>
          </KioskScaler>
        </VoiceProvider>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

export default App;
