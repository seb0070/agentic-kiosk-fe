import { createContext, useContext } from 'react';

interface SessionContextType {
  sessionId: string;
  resetSession: () => void;
}

export const SessionContext = createContext<SessionContextType>({
  sessionId: '',
  resetSession: () => {},
});

export const useSession = () => useContext(SessionContext);