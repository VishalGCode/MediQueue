import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [queueUpdates, setQueueUpdates] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    newSocket.on('queue:updated', (data) => {
      setQueueUpdates(prev => ({
        ...prev,
        [data.departmentId]: data.currentQueue,
      }));
    });

    newSocket.on('token:called', (data) => {
      if (currentToken && data.tokenNumber === currentToken.tokenNumber) {
        setCurrentToken(data);
      }
    });

    newSocket.on('token:status', (data) => {
      if (currentToken && data.tokenNumber === currentToken.tokenNumber) {
        setCurrentToken(data);
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <TokenContext.Provider
      value={{
        socket,
        currentToken,
        setCurrentToken,
        departments,
        setDepartments,
        queueUpdates,
        isMobile,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenContext() {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useTokenContext must be used within TokenProvider');
  return context;
}

export default TokenContext;
