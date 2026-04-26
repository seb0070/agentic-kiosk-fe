import { createContext, useContext } from 'react';

interface SessionContextType {
  sessionId: string;
}

export const SessionContext = createContext<SessionContextType>({ sessionId: '' });

export const useSession = () => useContext(SessionContext);