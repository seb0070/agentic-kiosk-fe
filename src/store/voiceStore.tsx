import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useVoice } from '../hooks/useVoice';
import { useSession } from './sessionStore';
import type { ScreenItem } from '../types';

interface VoiceContextValue {
  isListening: boolean;
  voiceMessage: string;
  screenItems: ScreenItem[];
  stopListening: () => void;
  clearScreenItems: () => void;
  setExtraActionHandler: (handler: ((action: string) => void) | null) => void;
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sessionId } = useSession();
  const extraHandlerRef = useRef<((action: string) => void) | null>(null);

  const location = useLocation();
  const { isListening, voiceMessage, screenItems, startListening, toggleListening, stopListening, clearScreenItems } =
    useVoice(sessionId, {
      onCartChange: () => queryClient.invalidateQueries({ queryKey: ['cart', sessionId] }),
      onTimeout: () => {
        queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
        navigate('/');
      },
      onAction: (action) => {
        if (action === 'PAGE:cart') navigate('/cart');
        else if (action === 'PAGE:welcome') navigate('/');
        else if (action === 'PAGE:menu') navigate('/home');
        else if (action === 'PAGE:complete') navigate('/payment-complete');
        else extraHandlerRef.current?.(action);
      },
    });

  const setExtraActionHandler = useCallback(
    (handler: ((action: string) => void) | null) => {
      extraHandlerRef.current = handler;
    },
    []
  );

  useEffect(() => {
    if (location.pathname !== '/') {
      startListening();
    }
  }, [location.pathname]);

  return (
    <VoiceContext.Provider
      value={{ isListening, voiceMessage, screenItems, stopListening, clearScreenItems, setExtraActionHandler }}
    >
      {children}
      <button
        onClick={toggleListening}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: '#e63312',
          fontSize: '22px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: isListening
            ? '0 0 0 8px rgba(230,51,18,0.2), 0 4px 16px rgba(230,51,18,0.5)'
            : '0 4px 16px rgba(230,51,18,0.4)',
          transition: 'all 0.2s ease',
        }}
      >
        🎤
      </button>
    </VoiceContext.Provider>
  );
}

export const useVoiceContext = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoiceContext must be used within VoiceProvider');
  return ctx;
};
